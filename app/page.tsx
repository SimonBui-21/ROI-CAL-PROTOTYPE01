// /app/page.tsx
"use client"

import { useState } from "react"
import { CalcResult } from "../lib/calculator"

export default function Home() {
  //input
  const [batterySize, setBatterySize] = useState(200)
  const [priceInDaytime, setPriceInDaytime] = useState(0.4)
  const [priceAtNighttime, setPriceAtNighttime] = useState(0.1)
  const [chargingDaysPerYear, setChargingDaysPerYear] = useState(150)

  //result
  const [result, setResult] = useState<CalcResult | null>(null)

  //zip
  const [zip, setZip] = useState("75001")
  //call EIA
  const [eia, setEia] = useState<{
    state: string
    averagePrice: number | null
    period: string | null
    source: string
  } | null>(null)

  // call backend
  async function calculate() {
    const res = await fetch("/api-calc", {  //back-end route
      method: "POST",  //sending POST request
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        zip,
        batterySize,
        priceInDaytime,
        priceAtNighttime,
        chargingDaysPerYear,
      }),
    })

    const data = await res.json()
    setResult(data)

    // Fetch EIA state average price (from cached DB route)
    try {
      const eiaRes = await fetch("/api-eia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zip }),
      })

      // If route doesn't exist or errors, avoid breaking the UI
      if (!eiaRes.ok) {
        setEia(null)
        return
      }

      const eiaData = await eiaRes.json()
      setEia(eiaData)
    } catch {
      setEia(null)
    }
  }

  return (
  <main className="min-h-screen bg-green-700 p-5">
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Energy Storage ROI Calculator
      </h1>

      {/* ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 text-black text-sm">
        {/* LEFT INPUT */}
        <div className="space-y-4">
          
          {/* INPUT LABEL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-black text-sm">
            {/* ZIP CODE */}
            <div className="space-y-1">
              <label className="font-bold">ZIP Code</label>
              <input
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="75001"
              />
            </div>
            {/* BATTERY SIZE */}
            <div className="space-y-1">
              <label className="font-bold">Battery Size (kWh)</label>
              <input
                type="number"
                value={batterySize}
                onChange={(e) => setBatterySize(Number(e.target.value))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="200"
              />
            </div>
            {/* PEAK PRICE */}
            <div className="space-y-1">
              <label className="font-bold">Peak Price ($/kWh)</label>
              <input
                type="number"
                value={priceInDaytime}
                onChange={(e) => setPriceInDaytime(Number(e.target.value))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="0.40"
                step="0.0001"
              />
            </div>
            {/* OFF-PEAK PRICE */}
            <div className="space-y-1">
              <label className="font-bold">Off-Peak Price ($/kWh)</label>
              <input
                type="number"
                value={priceAtNighttime}
                onChange={(e) => setPriceAtNighttime(Number(e.target.value))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="0.10"
                step="0.0001"
              />
            </div>
            {/* CHARGING DAYS */}
            <div className="space-y-1 sm:col-span-2">
              <label className="font-bold">Charging Days / Year</label>
              <input
                type="number"
                value={chargingDaysPerYear}
                onChange={(e) => setChargingDaysPerYear(Number(e.target.value))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="150"
              />
            </div>
          </div>

          {/* ===== BUTTON ===== */}
          <button
            onClick={calculate}
            className="w-full mt-10 rounded-md bg-black text-white py-2 font-medium hover:opacity-90"
          >
            Calculate
          </button>
        </div>

        {/* RIGHT OUTPUT */}
        <div>
          {(result || eia) && (
          <div className="rounded-xl border border-black bg-lime-200 p-10 space-y-3 text-black">
            <h2 className="font-bold">Results</h2>
            
            {eia && (
            <div className="pt-3 border-t border-gray-200 text-sm space-y-1">
              <p className="font-medium">EIA Reference Data</p>
              <p>Avg Price:{" "}
                {eia.averagePrice === null ? "N/A" : `$${eia.averagePrice.toFixed(4)} / kWh`}
              </p>
              <p>Period: {eia.period ?? "N/A"}</p>
              <p>Source: {eia.source ?? "EIA"}</p>
            </div>
            )}
            
            {result && (
            <div className="rounded-xl border border-black bg-emerald-400 p-4 space-y-3">
                <p>Your State: {result.state || "unknown"}</p>
                <p>System Cost: ${result.systemCost}</p>
                <p>Incentives: ${result.incentives}</p>
                <p>Annual Opex: ${result.annualOpex}</p>
                <p>Net Annual Cashflow: ${result.netAnnualCashflow.toFixed(2)}</p>
                <p>Payback:{" "}
                  {typeof result.paybackYears === "number"
                    ? `${result.paybackYears.toFixed(1)} years`
                    : result.paybackYears}
                </p>
            </div>
            )}
          </div>
          )}
        </div>
      </div>
    </div> 
  </main>
  )
}