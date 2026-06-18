import Foundation

struct Account: Identifiable, Hashable {
    let id: String
    let name: String
    let iban: String
    let currency: String
    let balance: Double
    let icon: String

    var formattedBalance: String {
        formatAmount(balance)
    }

    var formattedIBAN: String {
        iban
    }
}

struct AccountGroup: Identifiable {
    let id = UUID()
    let title: String
    let currency: String
    let totalBalance: Double
    let accounts: [Account]

    var formattedTotal: String {
        formatAmount(totalBalance)
    }
}

func formatAmount(_ amount: Double) -> String {
    let formatter = NumberFormatter()
    formatter.numberStyle = .decimal
    formatter.minimumFractionDigits = 2
    formatter.maximumFractionDigits = 2
    formatter.groupingSeparator = "'"
    formatter.decimalSeparator = "."
    return formatter.string(from: NSNumber(value: amount)) ?? "0.00"
}

// MARK: - Sample Data

extension Account {
    static let household = Account(
        id: "1", name: "Household",
        iban: "CH35 0900 0000 2470 2920 1",
        currency: "CHF", balance: 10_000.00, icon: "icon24-home"
    )
    static let savings = Account(
        id: "2", name: "Savings account",
        iban: "CH35 0900 0000 2470 2920 2",
        currency: "CHF", balance: 25_000.00, icon: "icon24-shield"
    )
    static let deposit = Account(
        id: "3", name: "Custody account",
        iban: "123.456.78",
        currency: "CHF", balance: 20_000.00, icon: "icon24-gitlab"
    )
    static let retirement = Account(
        id: "4", name: "Retirement savings 3a",
        iban: "7740205-08",
        currency: "CHF", balance: 10_000.00, icon: "icon24-anchor"
    )

    static let allAccounts = [household, savings, deposit, retirement]
}

extension AccountGroup {
    static let investments = AccountGroup(
        title: "Accounts & Investment",
        currency: "CHF",
        totalBalance: 65_000.00,
        accounts: Account.allAccounts
    )
}

struct OtherProduct: Identifiable {
    let id = UUID()
    let name: String
    let subtitle: String
    let limitCurrency: String
    let limit: Double
    let icon: String

    static let visaGold = OtherProduct(
        name: "VISA Gold", subtitle: "available USD 4'700.00",
        limitCurrency: "CHF", limit: 5_000.00, icon: "icon24-credit-card"
    )
}
