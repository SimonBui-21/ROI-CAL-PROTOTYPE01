declare module 'zipcodes' {
  type ZipInfo = {
    zip: string
    latitude: number
    longitude: number
    city: string
    state: string
  }

  function lookup(zip: string): ZipInfo | undefined

  export = { lookup }
}