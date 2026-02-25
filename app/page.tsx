// /app/page.tsx
import ElectricityGrid from "./components/ElectricityGrid"
import ROICalculator from "./components/ROICalculator"

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-foreground">
      {/* Page Header */}
      <div className="bg-primary text-foreground py-12 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-3">Prototype-01 0702026</h1>
          <p className="text-xl opacity-80">
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
      <footer className="bg-foreground text-white py-8 px-4 mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <p>© 2026 Energy Analytics Platform. Powered by EIA API.</p>
        </div>
      </footer>
    </main>
  )
}
