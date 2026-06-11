import SwiftUI

struct SummaryStepView: View {
    @Binding var draft: PaymentDraft
    let onExecute: () -> Void

    var body: some View {
        VStack(spacing: 0) {
            ScrollView {
                VStack(alignment: .leading, spacing: Space._5) {
                    summaryField(label: "Amount",
                                 value: "\(draft.currency)  \(draft.formattedAmount)",
                                 showEdit: true)

                    summaryField(label: "Execute on",
                                 value: draft.formattedDate,
                                 showEdit: true)

                    summaryField(label: "Recipient",
                                 value: draft.recipient?.name ?? "",
                                 showEdit: true)

                    debitAccountDisplay
                }
                .padding(.horizontal, Space._3)
                .padding(.top, Space._2)
            }

            executeButton
        }
        .background(AppColor.background)
    }

    private func summaryField(label: String, value: String, showEdit: Bool = false) -> some View {
        VStack(alignment: .leading, spacing: Space._1) {
            Text(label)
                .textSmall()
                .foregroundColor(AppColor.foregroundSecondary)

            HStack {
                Text(value)
                    .font(AppFont.font(size: AppFont.Size.textMd, weight: .regular))
                    .foregroundColor(AppColor.foreground)

                Spacer()

                if showEdit {
                    Image("icon24-edit-2")
                        .renderingMode(.template)
                        .resizable()
                        .scaledToFit()
                        .frame(width: 20, height: 20)
                        .foregroundColor(AppColor.foregroundSecondary)
                }
            }
            .padding(.bottom, Space._1)
            .overlay(
                Rectangle()
                    .frame(height: 1)
                    .foregroundColor(AppColor.separator),
                alignment: .bottom
            )
        }
    }

    private var debitAccountDisplay: some View {
        VStack(alignment: .leading, spacing: Space._1) {
            Text("Debit account")
                .textSmall()
                .foregroundColor(AppColor.foregroundSecondary)

            HStack(spacing: Space._2) {
                Image(draft.debitAccount.icon)
                    .renderingMode(.template)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 24, height: 24)
                    .foregroundColor(AppColor.foreground)

                VStack(alignment: .leading, spacing: 4) {
                    Text(draft.debitAccount.name)
                        .textSmall()
                        .fontWeight(.medium)
                        .foregroundColor(AppColor.foreground)
                    Text(draft.debitAccount.formattedIBAN)
                        .captionStyle()
                        .foregroundColor(AppColor.foregroundSecondary)
                }

                Spacer()

                HStack(spacing: 6) {
                    Text(draft.debitAccount.currency)
                        .captionStyle()
                        .foregroundColor(AppColor.foregroundSecondary)
                    Text(draft.debitAccount.formattedBalance)
                        .textSmall()
                        .fontWeight(.bold)
                        .foregroundColor(AppColor.foreground)
                }

                Image("icon24-chevron-down")
                    .renderingMode(.template)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 20, height: 20)
                    .foregroundColor(AppColor.foreground)
            }
            .padding(Space._2)
            .overlay(
                RoundedRectangle(cornerRadius: Radius.regular)
                    .stroke(AppColor.foreground, lineWidth: 1)
            )
        }
    }

    private var executeButton: some View {
        Button(action: onExecute) {
            Text("Execute")
                .font(AppFont.font(size: AppFont.Size.textMd, weight: .medium))
                .foregroundColor(AppColor.Button.primaryFg)
                .frame(maxWidth: .infinity)
                .padding(.vertical, Space._3)
                .background(AppColor.Button.primaryBg)
                .clipShape(RoundedRectangle(cornerRadius: Radius.regular))
        }
        .padding(.horizontal, Space._3)
        .padding(.bottom, Space._4)
    }
}

#Preview {
    SummaryStepView(
        draft: .constant(PaymentDraft(
            recipient: .hansMeyer,
            amount: 500
        )),
        onExecute: {}
    )
}
