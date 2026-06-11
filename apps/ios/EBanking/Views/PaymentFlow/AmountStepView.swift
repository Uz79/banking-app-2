import SwiftUI

struct AmountStepView: View {
    @Binding var draft: PaymentDraft
    let onConfirm: () -> Void

    @State private var amountText: String = ""
    @State private var showDebitPicker = false
    @FocusState private var amountFocused: Bool

    var body: some View {
        VStack(spacing: 0) {
            ScrollView {
                VStack(alignment: .leading, spacing: Space._5) {
                    recipientSummary
                    amountInput
                    debitAccountSelector
                }
                .padding(.horizontal, Space._3)
                .padding(.top, Space._2)
            }

            confirmButton
        }
        .background(AppColor.background)
        .onAppear {
            if amountText.isEmpty {
                amountText = draft.amount > 0 ? draft.formattedAmount : "500.00"
            }
        }
        .sheet(isPresented: $showDebitPicker) {
            AccountPickerSheet(
                title: "Debit account",
                accounts: Account.allAccounts,
                selectedID: draft.debitAccount.id,
                onSelect: { draft.debitAccount = $0 }
            )
        }
    }

    private var recipientSummary: some View {
        VStack(alignment: .leading, spacing: Space._1) {
            Text("Recipient")
                .textSmall()
                .foregroundColor(AppColor.foregroundSecondary)

            HStack {
                Text(draft.recipient?.name ?? "Select recipient")
                    .font(AppFont.font(size: AppFont.Size.textMd, weight: .regular))
                    .foregroundColor(AppColor.foreground)

                Spacer()

                Image("icon24-edit-2")
                    .renderingMode(.template)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 20, height: 20)
                    .foregroundColor(AppColor.foregroundSecondary)
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

    private var amountInput: some View {
        VStack(alignment: .leading, spacing: Space._1) {
            Text("Amount")
                .textSmall()
                .foregroundColor(AppColor.foregroundSecondary)

            HStack {
                HStack(spacing: 4) {
                    Text(draft.currency)
                        .font(AppFont.font(size: AppFont.Size.textMd, weight: .medium))
                        .foregroundColor(AppColor.foreground)
                    Image("icon24-chevron-down")
                        .renderingMode(.template)
                        .resizable()
                        .scaledToFit()
                        .frame(width: 12, height: 12)
                        .foregroundColor(AppColor.foreground)
                }

                Spacer()

                TextField("0.00", text: $amountText)
                    .font(AppFont.font(size: AppFont.Size.textMd, weight: .medium))
                    .foregroundColor(AppColor.foreground)
                    .multilineTextAlignment(.trailing)
                    .focused($amountFocused)
                    #if os(iOS)
                    .keyboardType(.decimalPad)
                    #endif
            }
            .padding(.horizontal, Space._2)
            .padding(.vertical, Space._2)
            .fieldBorder(focused: amountFocused)
        }
    }

    private var debitAccountSelector: some View {
        VStack(alignment: .leading, spacing: Space._1) {
            Text("Debit account")
                .textSmall()
                .foregroundColor(AppColor.foregroundSecondary)

            Button { showDebitPicker = true } label: {
            HStack(spacing: Space._2) {
                Image(draft.debitAccount.icon)
                    .renderingMode(.template)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 24, height: 24)
                    .foregroundColor(AppColor.foreground)

                VStack(alignment: .leading, spacing: 4) {
                    Text(draft.debitAccount.name)
                        .font(AppFont.font(size: AppFont.Size.textSm, weight: .medium))
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
                        .font(AppFont.font(size: AppFont.Size.textSm, weight: .bold))
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
                    .stroke(AppColor.foregroundLabel, lineWidth: 1)
            )
            }
            .buttonStyle(.plain)
        }
    }

    private var confirmButton: some View {
        Button(action: {
            draft.amount = Double(amountText.replacingOccurrences(of: "'", with: "")) ?? 0
            onConfirm()
        }) {
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
    }
}

#Preview {
    AmountStepView(
        draft: .constant(PaymentDraft(recipient: .hansMeyer)),
        onConfirm: {}
    )
}
