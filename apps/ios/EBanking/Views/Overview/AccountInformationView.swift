import SwiftUI
#if canImport(UIKit)
import UIKit
#endif

enum AccountInfoTab: String, CaseIterable, Identifiable {
    case information = "Information"
    case conditions = "Conditions"
    var id: String { rawValue }
}

/// Account information screen (web designs/screens/account-information):
/// summary card, Information / Conditions tabs, read-only fields, share.
struct AccountInformationView: View {
    let account: Account
    @Environment(\.dismiss) private var dismiss
    @State private var tab: AccountInfoTab = .information
    @State private var showShare = false

    private var owner: String { AppSettings.shared.persona.name }

    private var fields: [(label: String, value: String, copyable: Bool)] {
        [
            ("IBAN", account.iban, true),
            ("QR IBAN", "CH35 0900 0000 2470 2920 2", true),
            ("Account owner", owner, false),
            ("Product", "Private account", false),
            ("Category", "Payments", false),
            ("Bank clearing number", "8401", false),
            ("BIC (SWIFT)", "MIGRCHZZXXX", true),
            ("Bank", "MIGROS Bank, Industriestrasse 117, CH-8304 Zürich (Wallisellen)", false)
        ]
    }

    var body: some View {
        VStack(spacing: 0) {
            CustomNavBar(title: "Account information", showClose: true, onClose: { dismiss() })

            ScrollView {
                VStack(alignment: .leading, spacing: Space._4) {
                    summaryCard
                    SegmentedControl(options: AccountInfoTab.allCases, selection: $tab, label: { $0.rawValue })
                    shareButton

                    if tab == .information {
                        informationPanel
                    } else {
                        conditionsPanel
                    }
                }
                .padding(.horizontal, Space._3)
                .padding(.top, Space._3)
                .padding(.bottom, Space._6)
            }
        }
        .background(AppColor.backgroundSecondary)
        #if os(iOS)
        .presentationDetents([.large])
        .presentationDragIndicator(.visible)
        #endif
        .sheet(isPresented: $showShare) {
            ShareInformationView(account: account)
        }
    }

    private var summaryCard: some View {
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
        }
        .padding(Space._3)
        .background(AppColor.background)
        .clipShape(RoundedRectangle(cornerRadius: Radius.regular))
    }

    private var shareButton: some View {
        Button(action: { showShare = true }) {
            HStack(spacing: Space._2) {
                Image("icon24-eye")
                    .renderingMode(.template).resizable().scaledToFit()
                    .frame(width: 20, height: 20)
                Text("Share information").textSmall().fontWeight(.medium)
            }
            .foregroundColor(AppColor.Button.tonalFg)
            .padding(.horizontal, Space._3)
            .padding(.vertical, Space._2)
            .background(AppColor.Button.tonalBg)
            .clipShape(Capsule())
        }
    }

    private var informationPanel: some View {
        VStack(spacing: 0) {
            ForEach(Array(fields.enumerated()), id: \.offset) { index, field in
                fieldRow(field)
                if index < fields.count - 1 {
                    Divider().padding(.horizontal, Space._3)
                }
            }
        }
        .background(AppColor.background)
        .clipShape(RoundedRectangle(cornerRadius: Radius.regular))
    }

    private func fieldRow(_ field: (label: String, value: String, copyable: Bool)) -> some View {
        VStack(alignment: .leading, spacing: Space._1) {
            Text(field.label)
                .captionStyle()
                .foregroundColor(AppColor.foregroundSecondary)
            HStack(alignment: .top) {
                Text(field.value)
                    .textSmall()
                    .foregroundColor(AppColor.foreground)
                Spacer()
                if field.copyable {
                    Button {
                        #if canImport(UIKit)
                        UIPasteboard.general.string = field.value
                        #endif
                    } label: {
                        Image("icon24-copy")
                            .renderingMode(.template).resizable().scaledToFit()
                            .frame(width: 18, height: 18)
                            .foregroundColor(AppColor.foregroundSecondary)
                    }
                    .buttonStyle(.plain)
                }
            }
        }
        .padding(.horizontal, Space._3)
        .padding(.vertical, Space._2)
    }

    private var conditionsPanel: some View {
        VStack(alignment: .leading, spacing: Space._2) {
            Text("Terms and conditions for this account type.")
                .textSmall().fontWeight(.medium)
                .foregroundColor(AppColor.foreground)
            Text("Placeholder copy — replace with the legal text or a link to the PDF terms from production content.")
                .textSmall()
                .foregroundColor(AppColor.foregroundSecondary)
        }
        .padding(Space._3)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(AppColor.background)
        .clipShape(RoundedRectangle(cornerRadius: Radius.regular))
    }
}

#Preview {
    AccountInformationView(account: .savings)
}
