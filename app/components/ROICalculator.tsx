"use client"

import { useState } from "react"
import { CalcResult } from "../../lib/calculator"

export default function ROICalculator() {
  //input
  const [batterySize, setBatterySize] = useState(200)
  const [priceInDaytime, setPriceInDaytime] = useState(0.4)
  const [priceAtNighttime, setPriceAtNighttime] = useState(0.1)
  const [chargingDaysPerYear, setChargingDaysPerYear] = useState(150)
  const [zip, setZip] = useState("75001")

  //result
  const [result, setResult] = useState<CalcResult | null>(null)

  // call API
  async function calculate() {
    const res = await fetch("/api-calc", {
      //call back-end route
      method: "POST", //sending POST request
      headers: { "Content-Type": "application/json" }, //the request's content is JSON
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-4xl font-bold mb-2 text-gray-900">
          Energy Storage ROI Calculator
        </h2>
        <p className="text-gray-600">
          Calculate return on investment for your battery energy storage system
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Zip Code
            </label>
            <input
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 bg-blue-50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Battery Size (kWh)
            </label>
            <input
              type="number"
              value={batterySize}
              onChange={(e) => setBatterySize(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 bg-blue-50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Charging Days Per Year
            </label>
            <input
              type="number"
              value={chargingDaysPerYear}
              onChange={(e) => setChargingDaysPerYear(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:border-green-500 bg-green-50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Peak Price ($/kWh)
            </label>
            <input
              type="number"
              step="0.01"
              value={priceInDaytime}
              onChange={(e) => setPriceInDaytime(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500 bg-orange-50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Off Peak Price ($/kWh)
            </label>
            <input
              type="number"
              step="0.01"
              value={priceAtNighttime}
              onChange={(e) => setPriceAtNighttime(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 bg-purple-50 transition-all"
            />
          </div>
        </div>

        <button
          onClick={calculate}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl">
          Calculate ROI
        </button>
      </div>

      {result && (
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Results</h2>
          <p className="text-sm text-gray-600 mb-6">
            Your State: {result.state || "unknown"}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500 rounded-lg p-4">
              <p className="text-sm text-blue-600 font-medium mb-1">
                System Cost
              </p>
              <p className="text-2xl font-bold text-blue-900">
                ${result.systemCost.toLocaleString()}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500 rounded-lg p-4">
              <p className="text-sm text-green-600 font-medium mb-1">
                Incentives
              </p>
              <p className="text-2xl font-bold text-green-900">
                ${result.incentives.toLocaleString()}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-500 rounded-lg p-4">
              <p className="text-sm text-purple-600 font-medium mb-1">
                Net Annual Cashflow
              </p>
              <p className="text-2xl font-bold text-purple-900">
                ${result.netAnnualCashflow.toLocaleString()}
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-l-4 border-orange-500 rounded-lg p-4">
              <p className="text-sm text-orange-600 font-medium mb-1">
                Annual Costs
              </p>
              <p className="text-2xl font-bold text-orange-900">
                ${result.annualOpex.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-100 to-indigo-200 border-2 border-indigo-500 rounded-xl p-6 text-center">
            <p className="text-sm text-indigo-700 font-semibold mb-2">
              Payback Period
            </p>
            <p className="text-5xl font-bold text-indigo-900">
              {typeof result.paybackYears === "number"
                ? result.paybackYears.toFixed(1)
                : result.paybackYears}
            </p>
            <p className="text-lg text-indigo-700 font-medium mt-1">years</p>
          </div>
        </div>
      )}
    </div>
  )
}
