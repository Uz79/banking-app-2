import SwiftUI

struct ConfirmationView: View {
    let draft: PaymentDraft
    let onDone: () -> Void

    var body: some View {
        VStack(spacing: 0) {
            VStack(spacing: Space._2) {
                Image(systemName: "checkmark.circle")
                    .font(.system(size: 44))
                    .foregroundColor(AppColor.foreground)
                    .padding(.top, Space._3)
                    .padding(.bottom, Space._2)

                Text("Your payment of")
                    .textMain()
                    .foregroundColor(AppColor.foreground)

                HStack(spacing: Space._4) {
                    Text(draft.currency)
                        .textMain()
                        .foregroundColor(AppColor.foreground)
                    Text(draft.formattedAmount)
                        .font(AppFont.font(size: AppFont.Size.textLg, weight: .bold))
                        .foregroundColor(AppColor.foreground)
                }

                HStack(spacing: Space._4) {
                    Text("to")
                        .textMain()
                        .foregroundColor(AppColor.foreground)
                    Text(draft.recipient?.name ?? "")
                        .textMain()
                        .foregroundColor(AppColor.foreground)
                }

                VStack(spacing: Space._2) {
                    Text("will be executed with sufficient credit on")
                        .textMain()
                        .foregroundColor(AppColor.foreground)
                        .multilineTextAlignment(.center)
                    Text(draft.formattedDate)
                        .font(AppFont.font(size: AppFont.Size.textMd, weight: .bold))
                        .foregroundColor(AppColor.foreground)
                }
            }
            .padding(.vertical, Space._3)

            Button(action: onDone) {
                Text("Done")
                    .font(AppFont.font(size: AppFont.Size.textMd, weight: .regular))
                    .foregroundColor(AppColor.Button.primaryFg)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, Space._2)
                    .background(AppColor.Button.primaryBg)
                    .clipShape(RoundedRectangle(cornerRadius: Radius.small))
            }
            .padding(.horizontal, Space._3)
            .padding(.top, Space._3)
            .padding(.bottom, Space._1)
        }
        .padding(.vertical, Space._3)
        .background(AppColor.background)
        .clipShape(RoundedRectangle(cornerRadius: Radius.regular))
        .overlay(
            RoundedRectangle(cornerRadius: Radius.regular)
                .stroke(AppColor.separator, lineWidth: 1)
        )
    }
}

#Preview {
    ZStack {
        Color.black.opacity(0.4).ignoresSafeArea()
        ConfirmationView(
            draft: PaymentDraft(
                recipient: .hansMeyer,
                amount: 500
            ),
            onDone: {}
        )
        .padding(.horizontal, Space._3)
    }
}
