import Foundation

/// An investment position (equity) held in the Custody account product.
struct InvestmentPosition: Identifiable {
    let id: String          // symbol
    let name: String
    let symbol: String
    let isin: String
    let exchange: String
    let currency: String
    let price: Double
    let quantity: Int
    let value: Double
    let changeAbs: Double
    let changePct: Double
    let acquisitionPrice: Double
    let high: Double
    let low: Double

    var formattedPrice: String { formatAmount(price) }
    var formattedValue: String { formatAmount(value) }
    var changeSign: String { changeAbs >= 0 ? "+" : "−" }
    var formattedChange: String { "\(changeSign) \(formatAmount(abs(changeAbs))) \(currency)" }
    var formattedChangePct: String {
        let s = changePct >= 0 ? "+" : "−"
        return "\(s) \(String(format: "%.2f", abs(changePct))) %"
    }
    var isPositive: Bool { changePct >= 0 }

    /// Market as-of label for the performance card (web `formatMarketDate`).
    var formattedMarketDate: String {
        formatPerformanceMarketDate(Date())
    }

    static let abb = InvestmentPosition(
        id: "ABBN", name: "ABB Ltd", symbol: "ABBN",
        isin: "CH0012221711", exchange: "SWX", currency: "CHF",
        price: 1_008.50, quantity: 5, value: 5_042.50,
        changeAbs: 8.50, changePct: 0.85,
        acquisitionPrice: 980.00, high: 1_015.00, low: 992.50
    )

    static let samples: [InvestmentPosition] = [
        abb,
        InvestmentPosition(id: "AAPL", name: "Apple Inc.", symbol: "AAPL",
            isin: "US0378331005", exchange: "NASDAQ", currency: "CHF",
            price: 188.20, quantity: 17, value: 3_199.40,
            changeAbs: 24.10, changePct: 0.76,
            acquisitionPrice: 150.00, high: 192.00, low: 181.00),
        InvestmentPosition(id: "MSFT", name: "Microsoft Corp.", symbol: "MSFT",
            isin: "US5949181045", exchange: "NASDAQ", currency: "CHF",
            price: 332.00, quantity: 12, value: 3_984.00,
            changeAbs: -12.30, changePct: -0.30,
            acquisitionPrice: 300.00, high: 340.00, low: 325.00),
        InvestmentPosition(id: "NVDA", name: "NVIDIA Corp.", symbol: "NVDA",
            isin: "US67066G1040", exchange: "NASDAQ", currency: "CHF",
            price: 520.00, quantity: 5, value: 2_600.00,
            changeAbs: 88.00, changePct: 3.50,
            acquisitionPrice: 410.00, high: 535.00, low: 498.00),
        InvestmentPosition(id: "SAP", name: "SAP SE", symbol: "SAP",
            isin: "DE0007164600", exchange: "XETRA", currency: "CHF",
            price: 190.00, quantity: 10, value: 1_900.00,
            changeAbs: 5.20, changePct: 0.27,
            acquisitionPrice: 170.00, high: 193.00, low: 186.00)
    ]
}

/// Custody account / investment product summary shown on the product-details screen.
enum InvestmentProduct {
    static let depositName = "Custody account"
    static let depositNumber = "123.456.78"
    static let currency = "CHF"
    static let balance = 20_000.00
    static let changeAbs = 980.39
    static let changePct = 5.13
    static let asOf = "05.May 2026"
    static let invested = 15_000.00
    static let cash = 5_000.00

    /// Normalized performance series (0…1, higher = higher value) for the chart.
    static let series: [CGFloat] = [
        0.46, 0.52, 0.50, 0.62, 0.55, 0.66, 0.57, 0.71,
        0.63, 0.74, 0.66, 0.70, 0.62, 0.69
    ]
    static let yLabels = ["60", "40", "20", "0"]
    static let xLabels = ["Feb", "Mar", "May", "Aug"]
    static let ranges = ["1w", "1m", "3m", "ytd", "Max"]
}

/// Web `formatMarketDate` — e.g. "2. June 2026".
func formatPerformanceMarketDate(_ date: Date) -> String {
    let calendar = Calendar.current
    let day = calendar.component(.day, from: date)
    let month = calendar.monthSymbols[calendar.component(.month, from: date) - 1]
    let year = calendar.component(.year, from: date)
    return "\(day). \(month) \(year)"
}
