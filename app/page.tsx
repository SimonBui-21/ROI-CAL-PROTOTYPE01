// /app/page.tsx
<<<<<<< HEAD
import ElectricityGrid from "./components/ElectricityGrid"
import ROICalculator from "./components/ROICalculator"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-3">Prototype-01 0702026</h1>
          <p className="text-xl text-blue-100">
            ROI Calculator & Real-time Electricity Price Data
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="py-12">
        <ROICalculator />
        <div className="my-16"></div>
        <ElectricityGrid />
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <p>© 2026 Energy Analytics Platform. Powered by EIA API.</p>
        </div>
      </footer>
=======
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
  }

  return (
    <main className="p-10 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">
        Energy Storage ROI Calculator
      </h1>

      {/* ===== INPUTS ===== */}
      <div>
        <label>Your Zip Code</label>
        <input
          type="text"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

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
          <p>Your State: {result.state || "unknow"}</p>
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
>>>>>>> friend/main
    </main>
  )
}
