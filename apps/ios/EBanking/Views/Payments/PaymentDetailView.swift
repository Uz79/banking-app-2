import SwiftUI
#if canImport(UIKit)
import UIKit
#endif

/// Data shown in the payment-details screen (mirrors web #payment-details and
/// designs/screens/payment-details → domestic-payment-details variant).
struct PaymentDetail: Identifiable {
    let id = UUID()
    let amount: Double          // negative = debit
    let currency: String
    let counterparty: String
    let debit: Account
    let isPending: Bool
    let message: String
    var address: [String] = []  // optional recipient address lines

    var formattedAmount: String {
        let sign = amount < 0 ? "−" : ""
        return "\(sign)\(formatAmount(abs(amount)))"
    }
}

struct PaymentDetailView: View {
    let detail: PaymentDetail
    var onClose: (() -> Void)?
    @Environment(\.dismiss) private var dismiss
    @Environment(\.scrimSheetDismiss) private var dismissScrimSheet
    @State private var expanded = false

    var body: some View {
        VStack(spacing: 0) {
            CustomNavBar(title: "Domestic Payment", showClose: true, onClose: close)

            ScrollView {
                VStack(alignment: .leading, spacing: Space._4) {
                    amountRow
                    recipientBlock
                    Divider()
                    chipsRow
                    statusRow
                    bookingConfirmationRow
                    signedRow
                    furtherOptions
                }
                .padding(.horizontal, Space._3)
                .padding(.top, Space._3)
                .padding(.bottom, Space._5)
            }

            confirmButton
        }
        .background(AppColor.background)
        .clipShape(RoundedRectangle(cornerRadius: Radius.regular, style: .continuous))
    }

    private func close() {
        if let dismissScrimSheet {
            dismissScrimSheet()
        } else if let onClose {
            onClose()
        } else {
            dismiss()
        }
    }

    // MARK: - Amount

    private var amountRow: some View {
        HStack(alignment: .firstTextBaseline, spacing: Space._2) {
            Text(detail.formattedAmount)
                .font(AppFont.font(size: AppFont.Size.h4, weight: .bold))
                .foregroundColor(AppColor.foreground)
            Text(detail.currency)
                .textSmall()
                .foregroundColor(AppColor.foregroundSecondary)
            Spacer()
            Image("icon24-edit-2")
                .renderingMode(.template).resizable().scaledToFit()
                .frame(width: 22, height: 22)
                .foregroundColor(AppColor.foreground)
        }
    }

    private var recipientBlock: some View {
        VStack(alignment: .leading, spacing: 2) {
            Text("to").textSmall().foregroundColor(AppColor.foregroundSecondary)
            Text(detail.counterparty)
                .font(AppFont.font(size: AppFont.Size.textMd))
                .foregroundColor(AppColor.foreground)
            ForEach(detail.address, id: \.self) { line in
                Text(line)
                    .font(AppFont.font(size: AppFont.Size.textMd))
                    .foregroundColor(AppColor.foreground)
            }
        }
    }

    // MARK: - Chips

    private var chipsRow: some View {
        HStack(spacing: Space._2) {
            actionChip("Edit", icon: "icon24-edit-2", action: {})
            actionChip("Delete", icon: "icon24-trash", action: {})
            actionChip("Copy", icon: "icon24-copy") {
                #if canImport(UIKit)
                UIPasteboard.general.string =
                    "\(detail.counterparty) \(detail.currency) \(detail.formattedAmount)"
                #endif
            }
            Spacer(minLength: 0)
        }
    }

    private func actionChip(_ label: String, icon: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack(spacing: Space._1) {
                Image(icon)
                    .renderingMode(.template).resizable().scaledToFit()
                    .frame(width: 18, height: 18)
                Text(label).textSmall().fontWeight(.medium)
            }
            .foregroundColor(AppColor.Button.tonalFg)
            .padding(.horizontal, Space._3)
            .padding(.vertical, Space._2)
            .background(AppColor.Button.tonalBg)
            .clipShape(RoundedRectangle(cornerRadius: Radius.regular))
        }
        .buttonStyle(.plain)
    }

    // MARK: - Detail rows

    private var statusRow: some View {
        HStack {
            Text("Status").textSmall().foregroundColor(AppColor.foregroundSecondary)
            Spacer()
            HStack(spacing: Space._1) {
                Image(detail.isPending ? "icon24-clock" : "icon24-check")
                    .renderingMode(.template).resizable().scaledToFit()
                    .frame(width: 16, height: 16)
                Text(detail.isPending ? "Pending" : "Executed")
                    .captionStyle().fontWeight(.medium)
            }
            .foregroundColor(AppColor.Button.primaryFg)
            .padding(.horizontal, Space._3)
            .padding(.vertical, Space._1)
            .background(AppColor.Button.primaryBg)
            .clipShape(Capsule())
        }
    }

    private var bookingConfirmationRow: some View {
        HStack {
            Text("Booking confirmation").textSmall().foregroundColor(AppColor.foregroundSecondary)
            Spacer()
            Button(action: {}) {
                HStack(spacing: Space._1) {
                    Image("icon24-download")
                        .renderingMode(.template).resizable().scaledToFit()
                        .frame(width: 18, height: 18)
                    Text("Download").textSmall().fontWeight(.medium)
                }
                .foregroundColor(AppColor.foreground)
            }
            .buttonStyle(.plain)
        }
    }

    private var signedRow: some View {
        HStack {
            Text("Signed").textSmall().foregroundColor(AppColor.foregroundSecondary)
            Spacer()
            Text("Yes").textSmall().fontWeight(.bold).foregroundColor(AppColor.foreground)
        }
    }

    // MARK: - Further options (expander)

    private var furtherOptions: some View {
        VStack(alignment: .leading, spacing: Space._3) {
            Button {
                withAnimation(.easeInOut(duration: 0.2)) { expanded.toggle() }
            } label: {
                HStack(spacing: Space._2) {
                    Image("icon24-chevron-down")
                        .renderingMode(.template).resizable().scaledToFit()
                        .frame(width: 18, height: 18)
                        .rotationEffect(.degrees(expanded ? 180 : 0))
                        .foregroundColor(AppColor.foreground)
                        .frame(width: 36, height: 36)
                        .background(AppColor.Button.tonalBg)
                        .clipShape(RoundedRectangle(cornerRadius: Radius.small))
                    Text("Further options").textSmall().fontWeight(.medium)
                        .foregroundColor(AppColor.foreground)
                    Spacer()
                }
            }
            .buttonStyle(.plain)

            if expanded {
                VStack(alignment: .leading, spacing: Space._2) {
                    detailLine("Message", detail.message.isEmpty ? "—" : detail.message)
                    detailLine("Debit account", "\(detail.debit.name) · \(detail.debit.currency) \(detail.debit.formattedBalance)")
                }
                .padding(.leading, Space._3)
            }
        }
    }

    private func detailLine(_ label: String, _ value: String) -> some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(label).captionStyle().foregroundColor(AppColor.foregroundSecondary)
            Text(value).textSmall().foregroundColor(AppColor.foreground)
        }
    }

    private var confirmButton: some View {
        Button(action: close) {
            Text("Confirm")
                .font(AppFont.font(size: AppFont.Size.textMd, weight: .medium))
                .foregroundColor(AppColor.Button.primaryFg)
                .frame(maxWidth: .infinity)
                .padding(.vertical, Space._3)
                .background(AppColor.Button.primaryBg)
                .clipShape(RoundedRectangle(cornerRadius: Radius.regular))
        }
        .padding(.horizontal, Space._3)
        .padding(.bottom, Space._4)
        .padding(.top, Space._2)
    }
}

#Preview {
    PaymentDetailView(detail: PaymentDetail(
        amount: -500, currency: "CHF", counterparty: "Hans Meyer",
        debit: .household, isPending: true, message: "Rent",
        address: ["Main Street 23", "8001 Zürich"]
    ))
}
