import SwiftUI

/// Data shown in the payment-details sheet (mirrors web #payment-details).
struct PaymentDetail: Identifiable {
    let id = UUID()
    let amount: Double          // negative = debit
    let currency: String
    let counterparty: String
    let debit: Account
    let isPending: Bool
    let message: String

    var formattedAmount: String {
        let sign = amount < 0 ? "−" : "+"
        return "\(sign) \(formatAmount(abs(amount)))"
    }
}

struct PaymentDetailView: View {
    let detail: PaymentDetail
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        VStack(spacing: 0) {
            CustomNavBar(title: "Payment details", showClose: true, onClose: { dismiss() })

            ScrollView {
                VStack(alignment: .leading, spacing: Space._5) {
                    amountHeader
                    statusRow
                    field("Recipient", value: detail.counterparty)
                    debitAccountCard
                    field("Message", value: detail.message.isEmpty ? "—" : detail.message)
                }
                .padding(.horizontal, Space._3)
                .padding(.top, Space._3)
                .padding(.bottom, Space._6)
            }
        }
        .background(AppColor.background)
        #if os(iOS)
        .presentationDetents([.medium, .large])
        .presentationDragIndicator(.visible)
        #endif
    }

    private var amountHeader: some View {
        VStack(alignment: .leading, spacing: Space._1) {
            Text("Amount").textSmall().foregroundColor(AppColor.foregroundSecondary)
            HStack(alignment: .firstTextBaseline, spacing: Space._2) {
                Text(detail.currency)
                    .font(AppFont.font(size: AppFont.Size.textMd, weight: .medium))
                    .foregroundColor(AppColor.foregroundSecondary)
                Text(detail.formattedAmount)
                    .font(AppFont.font(size: AppFont.Size.h4, weight: .bold))
                    .foregroundColor(AppColor.foreground)
            }
        }
    }

    private var statusRow: some View {
        HStack(spacing: Space._2) {
            Image(detail.isPending ? "icon24-clock" : "icon24-check")
                .renderingMode(.template).resizable().scaledToFit()
                .frame(width: 18, height: 18)
                .foregroundColor(AppColor.foreground)
            Text(detail.isPending ? "Pending" : "Executed")
                .textSmall().fontWeight(.medium)
                .foregroundColor(AppColor.foreground)
        }
        .padding(.horizontal, Space._3)
        .padding(.vertical, Space._2)
        .background(AppColor.showAllBg)
        .clipShape(Capsule())
    }

    private func field(_ label: String, value: String) -> some View {
        VStack(alignment: .leading, spacing: Space._1) {
            Text(label).textSmall().foregroundColor(AppColor.foregroundSecondary)
            Text(value)
                .font(AppFont.font(size: AppFont.Size.textMd))
                .foregroundColor(AppColor.foreground)
                .padding(.bottom, Space._1)
                .frame(maxWidth: .infinity, alignment: .leading)
                .overlay(
                    Rectangle().frame(height: 1).foregroundColor(AppColor.separator),
                    alignment: .bottom
                )
        }
    }

    private var debitAccountCard: some View {
        VStack(alignment: .leading, spacing: Space._1) {
            Text("Debit account").textSmall().foregroundColor(AppColor.foregroundSecondary)
            HStack(spacing: Space._2) {
                Image(detail.debit.icon)
                    .renderingMode(.template).resizable().scaledToFit()
                    .frame(width: 24, height: 24)
                    .foregroundColor(AppColor.foreground)
                VStack(alignment: .leading, spacing: 4) {
                    Text(detail.debit.name)
                        .textSmall().fontWeight(.medium)
                        .foregroundColor(AppColor.foreground)
                    Text(detail.debit.formattedIBAN)
                        .captionStyle()
                        .foregroundColor(AppColor.foregroundSecondary)
                }
                Spacer()
                HStack(spacing: 6) {
                    Text(detail.debit.currency).captionStyle()
                        .foregroundColor(AppColor.foregroundSecondary)
                    Text(detail.debit.formattedBalance)
                        .textSmall().fontWeight(.bold)
                        .foregroundColor(AppColor.foreground)
                }
            }
            .padding(Space._2)
            .overlay(
                RoundedRectangle(cornerRadius: Radius.regular)
                    .stroke(AppColor.separator, lineWidth: 1)
            )
        }
    }
}

#Preview {
    PaymentDetailView(detail: PaymentDetail(
        amount: -100, currency: "CHF", counterparty: "Apple",
        debit: .household, isPending: false, message: "Card payment"
    ))
}
