import Foundation

/// Draft for the Internal Account Transfer flow (own account → own account).
/// Mirrors the web `#iat/*` overlay defaults (CHF 500, Savings → Household).
struct InternalTransferDraft: Equatable {
    var amount: Double = 500
    var currency: String = "CHF"
    var fromAccount: Account = .savings
    var toAccount: Account = .household
    var executionType: ExecutionType = .single
    var immediately: Bool = true
    var executeOn: Date = Calendar.current.date(
        from: DateComponents(year: 2026, month: 5, day: 31)
    ) ?? Date()

    var formattedAmount: String { formatAmount(amount) }

    var formattedDate: String {
        let f = DateFormatter()
        f.dateFormat = "dd.MM.yyyy"
        return f.string(from: executeOn)
    }
}
