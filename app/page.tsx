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

  // call API
  async function calculate() {
    const res = await fetch("/api-calc", {  //call back-end route
      method: "POST",  //sending POST request
      headers: { "Content-Type": "application/json" }, //the request's content is JSON
      body: JSON.stringify({
        batterySize,
        priceInDaytime,
        priceAtNighttime,
        chargingDaysPerYear,
      }),
    })

    const data = await res.json()
    setResult(data)
  }

  return (
    <main className="p-10 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">
        Energy Storage ROI Calculator
      </h1>

      {/* ===== INPUTS ===== */}

      <div>
        <label>Battery Size (kWh)</label>
        <input
          type="number"
          value={batterySize}
          onChange={(e) => setBatterySize(Number(e.target.value))}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label>Peak Price ($/kWh)</label>
        <input
          type="number"
          value={priceInDaytime}
          onChange={(e) => setPriceInDaytime(Number(e.target.value))}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label>Off Peak Price ($/kWh)</label>
        <input
          type="number"
          value={priceAtNighttime}
          onChange={(e) => setPriceAtNighttime(Number(e.target.value))}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label>Charging Days Per Year</label>
        <input
          type="number"
          value={chargingDaysPerYear}
          onChange={(e) => setChargingDaysPerYear(Number(e.target.value))}
          className="border p-2 w-full"
        />
      </div>

      {/* ===== BUTTON ===== */}

      <button
        onClick={calculate}
        className="bg-black text-white p-2 w-full"
      >
        Calculate
      </button>

      {result && (
        <div className="bg-gray-100 p-4 mt-4 rounded">
          <p>System Cost: ${result.systemCost}</p>
          <p>Incentives: ${result.incentives}</p>
          <p>Net Annual Cashflow: ${result.netAnnualCashflow}</p>
          <p>Annual Costs: ${result.annualOpex}</p>
          <p>
            Payback Years: {typeof result.paybackYears === "number"
          ? result.paybackYears.toFixed(1)
          : result.paybackYears}
          </p>
        </div>
      )}
    </main>
  )
}
