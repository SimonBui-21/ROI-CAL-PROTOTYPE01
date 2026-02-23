import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import { getStateFromZip } from "@/lib/zipToState"

async function fetchEiaPrice(state: string) {
  const key = process.env.EIA_API_KEY

  const url =
    `https://api.eia.gov/v2/electricity/retail-sales/data/` +
    `?api_key=${key}` +
    `&data[0]=price` +
    `&facets[stateid][]=${state}` +
    `&facets[sectorid][]=ALL` +
    `&frequency=monthly` +
    `&sort[0][column]=period` +
    `&sort[0][direction]=desc` +
    `&length=1`

  const res = await fetch(url)
  const json = await res.json()

  const item = json.response?.data?.[0]
  if (!item) return null

  const cents = Number(item.price)          // cents/kWh
  const dollars = cents / 100               // $/kWh

  return {
    period: String(item.period),
    price_per_kwh: dollars,
  }
}

export async function POST(req: NextRequest) {
  const { zip } = await req.json()

  const state = getStateFromZip(zip)
  if (!state) return NextResponse.json({ error: "Invalid ZIP" }, { status: 400 })

  const r = await pool.query(
    `select state, sector, period, price_per_kwh
     from state_prices
     where state = $1 and sector = 'ALL'`,
    [state]
  )

  const row = r.rows[0]
  if (row) {
    return NextResponse.json({ state: row.state, 
                              averagePrice: Number(row.price_per_kwh), 
                              period: row.period, 
                              source: "Supabase (cache)" })
  }
  const latest = await fetchEiaPrice(state)
  if (!latest) {
    return NextResponse.json({
      state,
      averagePrice: null,
      period: null,
      source: "EIA unavailable",
    })
  }

  await pool.query(
    `
    insert into state_prices (state, sector, period, price_per_kwh)
    values ($1, 'ALL', $2, $3)
    on conflict (state, sector)
    do update set 
      period = excluded.period, price_per_kwh = excluded.price_per_kwh
    `,
    [state, latest.period, latest.price_per_kwh]
  )

  return NextResponse.json({
    state,
    averagePrice: latest.price_per_kwh,
    period: latest.period,
    source: "Supabase cache (EIA)",
  })
}