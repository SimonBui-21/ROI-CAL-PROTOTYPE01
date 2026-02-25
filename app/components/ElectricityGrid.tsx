"use client"

import { useState, useEffect } from "react"

export default function ElectricityGrid() {
  const [gridData, setGridData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch electricity grid data
  async function fetchGridData() {
    setLoading(true)
    setError(null)
    try {
      const apiBase = process.env.NEXT_PUBLIC_ELECTRICITY_PRICE_API
      const apiPath = process.env.NEXT_PUBLIC_ELECTRICITY_PRICE_API_PATH
      const apiKey = process.env.NEXT_PUBLIC_ELECTRICITY_PRICE_API_KEY

      if (!apiBase || !apiPath || !apiKey) {
        throw new Error("API configuration is missing")
      }

      const url = `${apiBase}${apiPath}?api_key=${apiKey}`

      // Get most recent year data
      const currentYear = new Date().getFullYear()
      const lastYear = currentYear - 1
      const startDate = `${lastYear}-01`
      const endDate = `${lastYear}-12`

      const params = {
        frequency: "monthly",
        data: ["price"],
        facets: {
          stateid: [
            "AK",
            "AL",
            "AR",
            "AZ",
            "CA",
            "CO",
            "CT",
            "DC",
            "DE",
            "FL",
            "GA",
            "HI",
            "IA",
            "ID",
            "IL",
            "IN",
            "KS",
            "KY",
            "LA",
            "MA",
            "MD",
            "ME",
            "MI",
            "MN",
            "MO",
            "MS",
            "MT",
            "NC",
            "ND",
            "NE",
            "NEW",
            "NH",
            "NJ",
            "NM",
            "NV",
            "NY",
            "OH",
            "OK",
            "OR",
            "PA",
            "RI",
            "SC",
            "SD",
            "TN",
            "TX",
            "US",
            "UT",
            "VA",
            "VT",
            "WA",
            "WI",
            "WNC",
            "WSC",
            "WV",
            "WY",
          ],
        },
        start: startDate,
        end: endDate,
        sort: [
          {
            column: "period",
            direction: "desc",
          },
        ],
        offset: 0,
        length: 5000,
      }

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Params": JSON.stringify(params),
        },
      })

      if (!res.ok) {
        throw new Error(`Failed to fetch electricity grid data: ${res.status}`)
      }

      const data = await res.json()
      setGridData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setGridData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGridData()
  }, [])

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <h2 className="text-4xl font-bold mb-2 text-foreground">Electricity Price Data</h2>
        <p className="text-foreground opacity-70">Most recent year monthly electricity prices by state</p>
      </div>

      <button
        onClick={fetchGridData}
        disabled={loading}
        className="mb-6 px-6 py-3 bg-primary text-foreground font-bold rounded-lg hover:opacity-90 disabled:opacity-50 shadow-md transition-all duration-200">
        {loading ? "Loading..." : "Refresh Data"}
      </button>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {gridData ? (
        <div>
          {/* Summary */}
          {gridData.response && (
            <div className="mb-6 p-6 bg-secondary border-l-4 border-primary rounded-lg shadow-sm">
              <h3 className="font-bold text-lg text-foreground mb-2">Data Summary</h3>
              <p className="text-foreground opacity-80">
                <span className="font-semibold text-2xl text-primary">{gridData.response.total || 0}</span> total records
              </p>
            </div>
          )}

          {/* Data Table */}
          {gridData.response?.data && gridData.response.data.length > 0 ? (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-secondary">
              <table className="min-w-full">
                <thead className="bg-foreground">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      State
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      State Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Sector
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Sector Name
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">
                      Price (¢/kWh)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-secondary">
                  {gridData.response.data.map((item: any, index: number) => (
                    <tr
                      key={index}
                      className="hover:bg-secondary transition-colors duration-150">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        {item.period || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-primary">
                        {item.stateid || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground opacity-90">
                        {item.stateName || item["state-name"] || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground opacity-70">
                        {item.sectorid || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground opacity-80">
                        {item.sectorName || item["sector-name"] || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-right">
                        <span className="inline-block px-3 py-1 bg-secondary text-foreground font-bold rounded-full">
                          {item.price != null
                            ? Number(item.price).toFixed(2)
                            : "N/A"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-yellow-800">
                ⚠️ No data records found in response
              </p>
            </div>
          )}

          {/* Raw JSON (collapsible) */}
          <details className="mt-8">
            <summary className="cursor-pointer font-semibold text-foreground hover:text-primary bg-secondary px-4 py-3 rounded-lg">
              🔍 View Raw JSON Data
            </summary>
            <div className="mt-3 bg-foreground p-6 rounded-lg overflow-auto shadow-inner">
              <pre className="text-xs text-primary font-mono">{JSON.stringify(gridData, null, 2)}</pre>
            </div>
          </details>
        </div>
      ) : (
        !loading && <p className="text-foreground opacity-50">No data available</p>
      )}
    </div>
  )
}
