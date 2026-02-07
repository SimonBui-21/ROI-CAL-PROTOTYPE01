// /lib/zipToState.ts
import a from "zipcodes"

export function getStateFromZip(zip: string): string | null {
    const info = a.lookup(zip)
    if (!info) return null
    return info.state
}