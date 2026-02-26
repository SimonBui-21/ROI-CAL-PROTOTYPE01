// /app/page.tsx
"use client"

import { useState } from "react"
import { CalcResult } from "../lib/calculator"

export default function Home() {
  const [batterySize, setBatterySize] = useState(200)
  const [priceInDaytime, setPriceInDaytime] = useState(0.22)
  const [priceAtNighttime, setPriceAtNighttime] = useState(0.11)
  const [chargingDaysPerYear, setChargingDaysPerYear] = useState(150)

  const [result, setResult] = useState<CalcResult | null>(null)

  const [zip, setZip] = useState("75001")

  const [eia, setEia] = useState<{
    state: string
    averagePrice: number | null
    period: string | null
    source: string
  } | null>(null)

  async function calculate() {
    const res = await fetch("/api-calc", {
      method: "POST",
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

    try {
      const eiaRes = await fetch("/api-eia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zip }),
      })

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

  const inputClass =
    "w-full rounded-2xl border border-white/15 bg-white/8 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none backdrop-blur-md transition focus:border-emerald-400/60 focus:bg-white/10 focus:ring-2 focus:ring-emerald-400/20"

  const statRowClass =
    "flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#1b281b_10%,#0f150f_40%,#080a08_90%)] text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-large font-medium text-[#5AA300] backdrop-blur-md">
            Coulomb Technology
          </div>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Energy Storage ROI Calculator
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Estimate system cost, incentives, annual cashflow, and compare your
            results with U.S. Energy Information Administration (EIA) reference electricity pricing.
          </p>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left card */}
          <section className="rounded-3xl border border-white/10 bg-white/8 p-6 shadow-2xl backdrop-blur-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[#5AA300]">Input Parameters</h2>
                <p className="mt-1 text-sm text-slate-300">
                  Enter your battery and electricity assumptions:
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-300">
                Unsure of peak/off-peak? Type your ZIP code
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  ZIP Code
                </label>
                <input
                  type="text"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className={inputClass}
                  placeholder="75001"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Battery Size (kWh)
                </label>
                <input
                  type="number"
                  value={batterySize}
                  onChange={(e) => setBatterySize(Number(e.target.value))}
                  className={inputClass}
                  placeholder="200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Peak Price ($/kWh)
                </label>
                <input
                  type="number"
                  value={priceInDaytime}
                  onChange={(e) => setPriceInDaytime(Number(e.target.value))}
                  className={inputClass}
                  placeholder="0.40"
                  step="0.0001"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Off-Peak Price ($/kWh)
                </label>
                <input
                  type="number"
                  value={priceAtNighttime}
                  onChange={(e) => setPriceAtNighttime(Number(e.target.value))}
                  className={inputClass}
                  placeholder="0.10"
                  step="0.0001"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-slate-200">
                  Charging Days / Year
                </label>
                <input
                  type="number"
                  value={chargingDaysPerYear}
                  onChange={(e) => setChargingDaysPerYear(Number(e.target.value))}
                  className={inputClass}
                  placeholder="150"
                />
              </div>
            </div>

            <button
              onClick={calculate}
              className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-[#5AA300] px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01] hover:bg-emerald-300 active:scale-[0.99]"
            >
              Calculate ROI
            </button>
          </section>

          {/* Right card */}
          <section className="rounded-3xl border border-white/10 bg-white/8 p-6 shadow-2xl backdrop-blur-2xl">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#5AA300]">Results</h2>
              <p className="mt-1 text-sm text-slate-300">
                Transparent summary card with EIA comparison:
              </p>
            </div>

            {!result && !eia ? (
              <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-dashed border-white/10 bg-black/10 text-center">
                <div>
                  <p className="text-base font-medium text-slate-200">
                    No results yet
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    Run the calculator to view pricing and ROI metrics.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {eia && (
                  <div className="rounded-2xl border border-white/10 bg-white/6 p-5 backdrop-blur-xl">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm font-semibold text-[#5AA300]">
                        EIA Reference Data
                      </p>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300">
                        {eia.source ?? "EIA"}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className={statRowClass}>
                        <span className="text-sm text-slate-300">Your State</span>
                        <span className="text-sm font-semibold text-white">
                          {eia.state || "Unknown State"}
                        </span>
                      </div>
                      </div>
                      <div className={statRowClass}>
                        <span className="text-sm text-slate-300">Avg Price</span>
                        <span className="text-sm font-semibold text-white">
                          {eia.averagePrice === null
                            ? "N/A"
                            : `$${eia.averagePrice.toFixed(4)} / kWh`}
                        </span>
                      </div>

                      <div className={statRowClass}>
                        <span className="text-sm text-slate-300">Period</span>
                        <span className="text-sm font-semibold text-white">
                          {eia.period ?? "N/A"}
                        </span>
                      </div>
                    </div>
                )}

                {result && (
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5 backdrop-blur-xl">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm font-semibold text-emerald-300">
                        ROI Summary
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className={statRowClass}>
                        <span className="text-sm text-slate-300">System Cost</span>
                        <span className="font-semibold text-white">
                          ${result.systemCost}
                        </span>
                      </div>

                      <div className={statRowClass}>
                        <span className="text-sm text-slate-300">Incentives</span>
                        <span className="font-semibold text-white">
                          ${result.incentives}
                        </span>
                      </div>

                      <div className={statRowClass}>
                        <span className="text-sm text-slate-300">Annual Opex</span>
                        <span className="font-semibold text-white">
                          ${result.annualOpex}
                        </span>
                      </div>

                      <div className={statRowClass}>
                        <span className="text-sm text-slate-300">
                          Net Annual Cashflow
                        </span>
                        <span className="font-semibold text-white">
                          ${result.netAnnualCashflow.toFixed(2)}
                        </span>
                      </div>

                      <div className={statRowClass}>
                        <span className="text-sm text-slate-300">Payback</span>
                        <span className="font-semibold text-white">
                          {typeof result.paybackYears === "number"
                            ? `${result.paybackYears.toFixed(1)} years`
                            : result.paybackYears}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}