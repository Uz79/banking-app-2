import Foundation

struct Booking: Identifiable {
    let id = UUID()
    let name: String
    let currency: String
    let amount: Double
    let icon: String
    let isPending: Bool

    var formattedAmount: String {
        let sign = amount >= 0 ? "+" : ""
        return "\(sign)\(formatAmount(amount))"
    }

    var isNegative: Bool { amount < 0 }
}

struct BookingGroup: Identifiable {
    let id = UUID()
    let title: String
    let currency: String
    let runningBalance: Double
    let bookings: [Booking]

    var formattedBalance: String {
        formatAmount(runningBalance)
    }
}

struct PendingPayment: Identifiable {
    let id = UUID()
    let name: String
    let date: String
    let currency: String
    let amount: Double
    let icon: String

    var formattedAmount: String {
        formatAmount(amount)
    }
}

struct RecurringPayment: Identifiable {
    let id = UUID()
    let name: String
    let icon: String
}

// MARK: - Sample Data

extension BookingGroup {
    static let today = BookingGroup(
        title: "Today", currency: "CHF", runningBalance: 9_900.00,
        bookings: [
            Booking(name: "Apple", currency: "CHF", amount: -100.00, icon: "icon24-corner-up-right", isPending: false)
        ]
    )
    static let yesterday = BookingGroup(
        title: "Yesterday", currency: "CHF", runningBalance: 10_430.00,
        bookings: [
            Booking(name: "Cafe", currency: "CHF", amount: -10.00, icon: "icon24-corner-up-right", isPending: false),
            Booking(name: "Pizza", currency: "CHF", amount: -320.00, icon: "icon24-corner-up-right", isPending: false),
            Booking(name: "Railway", currency: "CHF", amount: -100.00, icon: "icon24-corner-up-right", isPending: false)
        ]
    )
}

extension PendingPayment {
    static let samples: [PendingPayment] = [
        PendingPayment(name: "Rent", date: "28.05.2026", currency: "CHF", amount: 2_050.00, icon: "icon24-clock"),
        PendingPayment(name: "Healthcare", date: "29.04.2026", currency: "CHF", amount: 420.00, icon: "icon24-clock")
    ]
}

extension RecurringPayment {
    static let samples: [RecurringPayment] = [
        RecurringPayment(name: "Rent", icon: "icon24-rotate-ccw"),
        RecurringPayment(name: "Fonds investment", icon: "icon24-rotate-ccw"),
        RecurringPayment(name: "Allowance", icon: "icon24-rotate-ccw")
    ]
}
