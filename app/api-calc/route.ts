import { NextRequest, NextResponse } from "next/server"
import { calculateROI, CalcInput, CalcResult } from "../../lib/calculator"

export async function POST(req: NextRequest) {
  try {
    // 1. Read JSON from frontend
    const body: CalcInput = await req.json()

    // 2. Call calculator
    const result: CalcResult = calculateROI(body)

    // 3. Return JSON
    return NextResponse.json(result)
  
  
  } catch (error) {
    return NextResponse.json({
      systemCost: 0,
      incentives: 0,
      annualOpex: 0,
      netAnnualCashflow: 0,
      paybackYears: Infinity
    });
  }
}