import SwiftUI

struct ScheduleStepView: View {
    @Binding var draft: PaymentDraft
    let onConfirm: () -> Void

    var body: some View {
        VStack(spacing: 0) {
            ScrollView {
                VStack(alignment: .leading, spacing: Space._5) {
                    recipientSummary
                    executionTypeSelector
                    asSoonToggle
                    dateField
                }
                .padding(.horizontal, Space._3)
                .padding(.top, Space._2)
            }

            confirmButton
        }
        .background(AppColor.background)
    }

    private var recipientSummary: some View {
        VStack(alignment: .leading, spacing: Space._1) {
            Text("Recipient")
                .textSmall()
                .foregroundColor(AppColor.foregroundSecondary)

            HStack {
                Text(draft.recipient?.name ?? "")
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

    private var executionTypeSelector: some View {
        HStack(spacing: 0) {
            ForEach(ExecutionType.allCases, id: \.self) { type in
                let isSelected = draft.executionType == type
                Button(action: {
                    withAnimation(.easeInOut(duration: 0.2)) { draft.executionType = type }
                }) {
                    Text(type.rawValue)
                        .font(AppFont.font(size: AppFont.Size.textSm, weight: .medium))
                        .foregroundColor(isSelected ? AppColor.Button.primaryFg : AppColor.foreground)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, Space._1)
                        .padding(.horizontal, Space._2)
                        .background(isSelected ? AppColor.Button.primaryBg : Color.clear)
                        .clipShape(Capsule())
                }
            }
        }
        .padding(4)
        .overlay(
            Capsule()
                .stroke(AppColor.foreground.opacity(0.4), lineWidth: 1)
        )
    }

    private var asSoonToggle: some View {
        HStack {
            Text("As soon as possible")
                .font(AppFont.font(size: AppFont.Size.textMd, weight: .medium))
                .foregroundColor(AppColor.foreground)

            Spacer()

            Button(action: {
                withAnimation(.easeInOut(duration: 0.2)) {
                    draft.asSoonAsPossible.toggle()
                }
            }) {
                ZStack(alignment: draft.asSoonAsPossible ? .trailing : .leading) {
                    Capsule()
                        .fill(draft.asSoonAsPossible ? AppColor.Button.primaryBg : AppColor.separator)
                        .frame(width: 44, height: 26)

                    Circle()
                        .fill(AppColor.background)
                        .frame(width: 20, height: 20)
                        .padding(3)
                }
            }
        }
    }

    private var dateField: some View {
        VStack(alignment: .leading, spacing: Space._1) {
            Text("Execute on")
                .textSmall()
                .foregroundColor(AppColor.foregroundSecondary)

            HStack {
                Text(draft.formattedDate)
                    .font(AppFont.font(size: AppFont.Size.textMd, weight: .regular))
                    .foregroundColor(AppColor.foreground)

                Spacer()

                Image("icon24-calendar")
                    .renderingMode(.template)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 24, height: 24)
                    .foregroundColor(AppColor.foreground)
            }
            .padding(.horizontal, Space._2)
            .padding(.vertical, Space._2)
            .overlay(
                RoundedRectangle(cornerRadius: Radius.small)
                    .stroke(AppColor.foreground, lineWidth: 1)
            )
        }
    }

    private var confirmButton: some View {
        Button(action: onConfirm) {
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
    ScheduleStepView(
        draft: .constant(PaymentDraft(recipient: .hansMeyer)),
        onConfirm: {}
    )
}
