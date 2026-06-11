import Foundation

struct Recipient: Identifiable, Hashable {
    let id: String
    let name: String
    let iban: String
    let bankName: String
    let street: String
    let city: String
    let country: String
    let subtitle: String
    let icon: String

    static let hansMeyer = Recipient(
        id: "1", name: "Hans Meyer",
        iban: "CH35 0900 0000 2560 0696 0",
        bankName: "UBS",
        street: "Main Street 23",
        city: "8001 Zürich",
        country: "Switzerland",
        subtitle: "Rent",
        icon: "icon24-user"
    )

    static let annaMueller = Recipient(
        id: "2", name: "Anna Müller",
        iban: "CH12 3456 7890 1234 5678 9",
        bankName: "Credit Suisse",
        street: "Bahnhofstrasse 1",
        city: "8000 Zürich",
        country: "Switzerland",
        subtitle: "",
        icon: "icon24-user"
    )

    static let sunrise = Recipient(
        id: "3", name: "Sunrise",
        iban: "CH98 7654 3210 9876 5432 1",
        bankName: "PostFinance",
        street: "Thurgauerstrasse 101",
        city: "8152 Glattpark",
        country: "Switzerland",
        subtitle: "",
        icon: "icon24-sunrise-logo"
    )

    static let allRecipients: [Recipient] = [annaMueller, sunrise, hansMeyer]

    // MARK: - Full directory (mirrors the 8 records in js/payment-state.js)

    static let lenaFischer = Recipient(
        id: "lena-fischer", name: "Lena Fischer",
        iban: "CH47 0023 0230 1234 5678 9", bankName: "Credit Suisse",
        street: "Bahnhofstrasse 12", city: "8050 Zürich",
        country: "Switzerland", subtitle: "", icon: "icon24-user"
    )
    static let paulSchneider = Recipient(
        id: "paul-schneider", name: "Paul Schneider",
        iban: "CH18 0079 1234 0008 8765 4", bankName: "ZKB",
        street: "Seefeldstrasse 41", city: "8008 Zürich",
        country: "Switzerland", subtitle: "", icon: "icon24-user"
    )
    static let annaRicci = Recipient(
        id: "anna-ricci", name: "Anna Ricci",
        iban: "IT60 X054 2811 1010 0000 0123 456", bankName: "Intesa Sanpaolo",
        street: "Via Garibaldi 8", city: "20121 Milano",
        country: "Italy", subtitle: "", icon: "icon24-user"
    )
    static let klausVogel = Recipient(
        id: "klaus-vogel", name: "Klaus Vogel",
        iban: "DE89 3704 0044 0532 0130 00", bankName: "Commerzbank",
        street: "Hauptstrasse 7", city: "50667 Köln",
        country: "Germany", subtitle: "", icon: "icon24-user"
    )
    static let marieDupont = Recipient(
        id: "marie-dupont", name: "Marie Dupont",
        iban: "FR14 2004 1010 0505 0001 3M02 606", bankName: "BNP Paribas",
        street: "Rue Lafayette 18", city: "75009 Paris",
        country: "France", subtitle: "", icon: "icon24-user"
    )
    static let lukasHuber = Recipient(
        id: "lukas-huber", name: "Lukas Huber",
        iban: "AT61 1904 3002 3457 3201", bankName: "Erste Bank",
        street: "Mariahilfer Strasse 3", city: "1060 Wien",
        country: "Austria", subtitle: "", icon: "icon24-user"
    )
    static let sofiaKeller = Recipient(
        id: "sofia-keller", name: "Sofia Keller",
        iban: "CH51 0078 4000 1234 5678 9", bankName: "Raiffeisen",
        street: "Marktgasse 22", city: "3011 Bern",
        country: "Switzerland", subtitle: "", icon: "icon24-user"
    )

    /// Full type-ahead search directory.
    static let directory: [Recipient] = [
        hansMeyer, lenaFischer, paulSchneider, annaRicci,
        klausVogel, marieDupont, lukasHuber, sofiaKeller
    ]
}

struct PaymentDraft: Equatable {
    /// Matches web / Figma sample payment (Hans Meyer, CHF 500, Household debit).
    var recipient: Recipient? = .hansMeyer
    var currency: String = "CHF"
    var amount: Double = 500
    var debitAccount: Account = .household
    var executionType: ExecutionType = .single
    var asSoonAsPossible: Bool = true
    var executeOn: Date = Calendar.current.date(
        from: DateComponents(year: 2026, month: 5, day: 31)
    ) ?? Date()

    var formattedAmount: String {
        formatAmount(amount)
    }

    var formattedDate: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "dd.MM.yyyy"
        return formatter.string(from: executeOn)
    }
}

enum ExecutionType: String, CaseIterable, Identifiable {
    case single = "Single execution"
    case recurring = "Recurring execution"

    var id: String { rawValue }
}
