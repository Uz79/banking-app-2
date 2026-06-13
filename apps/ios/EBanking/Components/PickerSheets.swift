import SwiftUI

// MARK: - Currency (web form-field-sheet.js CURRENCIES)

enum CurrencyOption: String, CaseIterable, Identifiable {
    case chf = "CHF"
    case eur = "EUR"
    case usd = "USD"

    var id: String { rawValue }

    var label: String {
        switch self {
        case .chf: return "Swiss franc (CHF)"
        case .eur: return "Euro (EUR)"
        case .usd: return "US dollar (USD)"
        }
    }

    static func label(for code: String) -> String {
        CurrencyOption(rawValue: code)?.label ?? code
    }
}

/// Bottom-sheet currency picker for amount fields.
struct CurrencyPickerSheet: View {
    let selectedCode: String
    let onSelect: (String) -> Void
    var onClose: () -> Void

    @Environment(\.scrimSheetDismiss) private var dismissAnimated

    var body: some View {
        sheetScaffold(title: "Currency", onClose: close, fitted: true) {
            ForEach(CurrencyOption.allCases) { currency in
                Button {
                    onSelect(currency.rawValue)
                    close()
                } label: {
                    HStack {
                        Text(currency.label)
                            .textSmall().fontWeight(.medium)
                            .foregroundColor(AppColor.foreground)
                        Spacer()
                        if currency.rawValue == selectedCode {
                            Image("icon24-check")
                                .renderingMode(.template).resizable().scaledToFit()
                                .frame(width: 20, height: 20)
                                .foregroundColor(AppColor.foreground)
                        }
                    }
                    .padding(.horizontal, Space._3)
                    .padding(.vertical, Space._3)
                    .contentShape(Rectangle())
                }
                .buttonStyle(.plain)

                if currency != CurrencyOption.allCases.last {
                    Divider().padding(.horizontal, Space._3)
                }
            }
        }
    }

    private func close() {
        if let dismissAnimated {
            dismissAnimated()
        } else {
            onClose()
        }
    }
}

/// Bottom-sheet account picker (contextual menu replacement).
struct AccountPickerSheet: View {
    let title: String
    let accounts: [Account]
    let selectedID: String
    let onSelect: (Account) -> Void
    var onClose: () -> Void

    @Environment(\.scrimSheetDismiss) private var dismissAnimated

    var body: some View {
        sheetScaffold(title: title, onClose: close, fitted: true) {
            ForEach(accounts) { account in
                Button {
                    onSelect(account)
                    close()
                } label: {
                    HStack(spacing: Space._3) {
                        Image(account.icon)
                            .renderingMode(.template).resizable().scaledToFit()
                            .frame(width: 24, height: 24)
                            .foregroundColor(AppColor.foreground)
                        VStack(alignment: .leading, spacing: 4) {
                            Text(account.name)
                                .textSmall().fontWeight(.medium)
                                .foregroundColor(AppColor.foreground)
                            Text(account.formattedIBAN)
                                .captionStyle()
                                .foregroundColor(AppColor.foregroundSecondary)
                        }
                        Spacer()
                        HStack(spacing: 6) {
                            Text(account.currency).captionStyle()
                                .foregroundColor(AppColor.foregroundSecondary)
                            Text(account.formattedBalance)
                                .textSmall().fontWeight(.bold)
                                .foregroundColor(AppColor.foreground)
                        }
                        if account.id == selectedID {
                            Image("icon24-check")
                                .renderingMode(.template).resizable().scaledToFit()
                                .frame(width: 20, height: 20)
                                .foregroundColor(AppColor.foreground)
                        }
                    }
                    .padding(.horizontal, Space._3)
                    .padding(.vertical, Space._3)
                    .contentShape(Rectangle())
                }
                .buttonStyle(.plain)

                if account.id != accounts.last?.id {
                    Divider().padding(.horizontal, Space._3)
                }
            }
        }
    }

    private func close() {
        if let dismissAnimated {
            dismissAnimated()
        } else {
            onClose()
        }
    }
}

/// Bottom-sheet picker for a simple list of string options.
struct OptionPickerSheet: View {
    let title: String
    let options: [String]
    let selected: String
    let onSelect: (String) -> Void
    var onClose: () -> Void

    @Environment(\.scrimSheetDismiss) private var dismissAnimated

    var body: some View {
        sheetScaffold(title: title, onClose: close, fitted: true) {
            ForEach(options, id: \.self) { option in
                Button {
                    onSelect(option)
                    close()
                } label: {
                    HStack {
                        Text(option)
                            .textSmall().fontWeight(.medium)
                            .foregroundColor(AppColor.foreground)
                        Spacer()
                        if option == selected {
                            Image("icon24-check")
                                .renderingMode(.template).resizable().scaledToFit()
                                .frame(width: 20, height: 20)
                                .foregroundColor(AppColor.foreground)
                        }
                    }
                    .padding(.horizontal, Space._3)
                    .padding(.vertical, Space._3)
                    .contentShape(Rectangle())
                }
                .buttonStyle(.plain)

                if option != options.last {
                    Divider().padding(.horizontal, Space._3)
                }
            }
        }
    }

    private func close() {
        if let dismissAnimated {
            dismissAnimated()
        } else {
            onClose()
        }
    }
}

/// Shared sheet chrome: grabber, title + close (web `form-sheet__nav-close`), scrollable body.
@ViewBuilder
func sheetScaffold<Content: View>(
    title: String,
    onClose: @escaping () -> Void,
    fitted: Bool = false,
    @ViewBuilder content: () -> Content
) -> some View {
    VStack(spacing: 0) {
        Capsule()
            .fill(AppColor.foregroundSecondary.opacity(0.35))
            .frame(width: 36, height: 5)
            .padding(.top, Space._2)
            .padding(.bottom, Space._1)

        ZStack {
            Text(title)
                .font(AppFont.font(size: AppFont.Size.textLg, weight: .medium))
                .foregroundColor(AppColor.foreground)
                .frame(maxWidth: .infinity)

            HStack {
                Spacer()
                Button(action: onClose) {
                    Image(systemName: "xmark")
                        .font(.system(size: 16, weight: .medium))
                        .foregroundColor(AppColor.foreground)
                        .frame(width: 44, height: 44)
                }
                .buttonStyle(.plain)
                .accessibilityLabel("Close")
            }
        }
        .padding(.horizontal, Space._1)
        .padding(.bottom, Space._2)

        if fitted {
            VStack(spacing: 0) { content() }
                .padding(.bottom, Space._4)
        } else {
            ScrollView {
                VStack(spacing: 0) { content() }
                    .padding(.bottom, Space._4)
            }
        }
    }
    .background {
        AppColor.background
            .ignoresSafeArea(edges: .bottom)
    }
    .clipShape(UnevenRoundedRectangle(topLeadingRadius: Radius.regular, topTrailingRadius: Radius.regular))
}
