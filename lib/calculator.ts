import { getStateFromZip } from "./zipToState"


export type CalcInput = {
  zip: string
  batterySize: number
  priceInDaytime: number
  priceAtNighttime: number
  chargingDaysPerYear: number
}

export type CalcResult = {
  state: string | null
  systemCost: number
  incentives: number
  annualOpex: number
  netAnnualCashflow: number
  paybackYears: number | string
}

const DOD = 0.9
const RTE = 0.9
const BATTERY_POWER = 50

const SYSTEM_COST = 90250
const ANNUAL_OPEX = 8000

const INCENTIVES = 46028
const GRID_SERVICES = 5000

export function calculateROI(input: CalcInput): CalcResult {
  const state = getStateFromZip(input.zip) ?? "Unknown"
  const usableEnergy = input.batterySize * DOD * RTE

  const dailySavings =
    usableEnergy * (input.priceInDaytime - input.priceAtNighttime)

  const arbitrage = dailySavings * input.chargingDaysPerYear

  const annualRevenue = arbitrage + GRID_SERVICES

  const netAnnualCashflow = annualRevenue - ANNUAL_OPEX
  
  const paybackYears =
    netAnnualCashflow <= 0
      ? "Never"
      : (SYSTEM_COST - INCENTIVES) / netAnnualCashflow


  return {
    state,
    systemCost: SYSTEM_COST,
    annualOpex: ANNUAL_OPEX,
    incentives: INCENTIVES,
    netAnnualCashflow,
    paybackYears,
  }
}