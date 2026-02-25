"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceDot,
  ReferenceLine,
} from "recharts"
import { CalcResult } from "../../lib/calculator"

interface PaybackChartProps {
  result: CalcResult
}

export default function PaybackChart({ result }: PaybackChartProps) {
  // If no payback, or negative cashflow, we can't show a valid chart intersection
  if (result.netAnnualCashflow <= 0 || result.paybackYears === "Never") {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500 font-medium">
          No payback period available with current parameters.
        </p>
      </div>
    )
  }

  const paybackYears = Number(result.paybackYears)
  const initialInvestment = result.systemCost - result.incentives
  const annualSavings = result.netAnnualCashflow

  // Generate data points
  // We want to show a range that includes the payback year.
  // Maybe show up to 2 * payback years, or minimum 10 years, max 20?
  let maxYear = Math.ceil(Math.max(10, paybackYears * 1.5))
  if (maxYear > 25) maxYear = 25 // Cap at 25 years for display

  const data = []
  for (let year = 0; year <= maxYear; year++) {
    data.push({
      year,
      investment: initialInvestment,
      cumulativeSavings: annualSavings * year,
    })
  }

  // Format currency for tooltip
  const formatCurrency = (value: number) =>
    `$${new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(value)}`

  return (
    <div className="w-full h-[400px] mt-8 bg-white p-4 rounded-lg shadow-sm border border-secondary">
      <h3 className="text-lg font-bold text-foreground mb-4">
        Investment Payback Timeline
      </h3>
      <div className="w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="year"
              label={{
                value: "Years",
                position: "insideBottomRight",
                offset: -10,
              }}
            />
            <YAxis
              tickFormatter={(value) => `$${value / 1000}k`}
              label={{
                value: "Amount ($)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              dataKey="investment"
              name="Net Investment Cost"
              stroke="var(--color-foreground)" // Using CSS variable from globals.css
              strokeWidth={2}
              dot={false}
              strokeDasharray="5 5"
            />
            <Line
              type="monotone"
              dataKey="cumulativeSavings"
              name="Cumulative Savings"
              stroke="var(--color-primary)" // Using CSS variable from globals.css
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 8 }}
            />
            {/* Mark the intersection point */}
            <ReferenceDot
              x={paybackYears}
              y={initialInvestment}
              r={6}
              fill="var(--color-primary)"
              stroke="white"
            />
            <ReferenceLine x={paybackYears} stroke="red" label="Payback" strokeDasharray="3 3"/>
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm text-center text-gray-500 mt-2">
        Payback period: {paybackYears.toFixed(1)} years
      </p>
    </div>
  )
}
