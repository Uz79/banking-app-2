import SwiftUI

enum IATStep: Int, CaseIterable {
    case details
    case schedule
    case summary
    case confirmation

    var title: String {
        switch self {
        case .details:  return "Amount & recipient"
        case .schedule: return "Time schedule"
        case .summary, .confirmation: return "Summary"
        }
    }
}

struct InternalTransferView: View {
    @Binding var isPresented: Bool

    @State private var currentStep: IATStep = .details
    @State private var draft = InternalTransferDraft()
    @State private var amountText: String = "500.00"
    @State private var isForward = true
    @State private var showConfirmation = false
    @State private var showExitConfirm = false
    @State private var picking: PickTarget?
    @FocusState private var amountFocused: Bool
    @StateObject private var scrimSheetCenter = ScrimSheetCenter()

    enum PickTarget: Int, Identifiable { case from, to; var id: Int { rawValue } }

    var body: some View {
        VStack(spacing: 0) {
            CustomNavBar(
                title: currentStep.title,
                showBack: currentStep != .details,
                showClose: true,
                onBack: goBack,
                onClose: promptExit
            )

            Group {
                switch currentStep {
                case .details:  detailsStep
                case .schedule: scheduleStep
                case .summary:  summaryStep
                case .confirmation: EmptyView()
                }
            }
            .id(currentStep)
            .transition(.asymmetric(
                insertion: .move(edge: isForward ? .trailing : .leading),
                removal: .move(edge: isForward ? .leading : .trailing)
            ))
            .animation(.easeInOut(duration: 0.3), value: currentStep)
        }
        .clipped()
        .background(AppColor.background)
        .overlay {
            if showConfirmation {
                AppColor.overlayScrim
                    .ignoresSafeArea()
                    .onTapGesture {}

                confirmationCard
                    .padding(.horizontal, Space._3)
                    .transition(.move(edge: .bottom).combined(with: .opacity))
            }
        }
        .animation(.easeInOut(duration: 0.3), value: showConfirmation)
        .overlay { ScrimSheetHost(center: scrimSheetCenter) }
        .environment(\.scrimSheetCenter, scrimSheetCenter)
        .foregroundScrimSheet(item: $picking, size: .fitted) { target in
            AccountPickerSheet(
                title: target == .from ? "From account" : "To account",
                accounts: Account.allAccounts.filter {
                    $0.id != (target == .from ? draft.toAccount.id : draft.fromAccount.id)
                },
                selectedID: target == .from ? draft.fromAccount.id : draft.toAccount.id,
                onSelect: { acc in
                    if target == .from { draft.fromAccount = acc } else { draft.toAccount = acc }
                },
                onClose: { picking = nil }
            )
        }
        .overlay {
            BasicDialogOverlay(isPresented: $showExitConfirm, onScrimTap: dismissExitConfirm) {
                TransferExitConfirmDialog(
                    onContinue: dismissExitConfirm,
                    onDiscard: {
                        showExitConfirm = false
                        isPresented = false
                    }
                )
            }
        }
        .animation(.easeInOut(duration: 0.2), value: showExitConfirm)
    }

    private func promptExit() {
        showExitConfirm = true
    }

    private func dismissExitConfirm() {
        showExitConfirm = false
    }

    // MARK: - Step 1: details

    private var detailsStep: some View {
        VStack(spacing: 0) {
            ScrollView {
                VStack(alignment: .leading, spacing: Space._5) {
                    Text("I want to transfer internally")
                        .textMain()
                        .foregroundColor(AppColor.foreground)

                    amountInput

                    accountField(label: "from", account: draft.fromAccount, target: .from)
                    accountField(label: "to", account: draft.toAccount, target: .to)
                }
                .padding(.horizontal, Space._3)
                .padding(.top, Space._2)
            }
            confirmButton("Confirm") {
                draft.amount = Double(amountText.replacingOccurrences(of: "'", with: "")) ?? draft.amount
                advance(to: .schedule)
            }
        }
        .background(AppColor.background)
    }

    private var amountInput: some View {
        VStack(alignment: .leading, spacing: Space._1) {
            Text("Amount")
                .textSmall()
                .foregroundColor(AppColor.foregroundSecondary)
            HStack {
                Text(draft.currency)
                    .font(AppFont.font(size: AppFont.Size.textMd, weight: .medium))
                    .foregroundColor(AppColor.foreground)
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

    private func accountField(label: String, account: Account, target: PickTarget) -> some View {
        VStack(alignment: .leading, spacing: Space._1) {
            Text(label)
                .textSmall()
                .foregroundColor(AppColor.foregroundSecondary)

            Button { picking = target } label: {
                HStack(spacing: Space._2) {
                    Image(account.icon)
                        .renderingMode(.template)
                        .resizable().scaledToFit()
                        .frame(width: 24, height: 24)
                        .foregroundColor(AppColor.foreground)

                    VStack(alignment: .leading, spacing: 4) {
                        Text(account.name)
                            .font(AppFont.font(size: AppFont.Size.textSm, weight: .medium))
                            .foregroundColor(AppColor.foreground)
                        Text(account.formattedIBAN)
                            .captionStyle()
                            .foregroundColor(AppColor.foregroundSecondary)
                    }
                    Spacer()
                    HStack(spacing: 6) {
                        Text(account.currency)
                            .captionStyle()
                            .foregroundColor(AppColor.foregroundSecondary)
                        Text(account.formattedBalance)
                            .font(AppFont.font(size: AppFont.Size.textSm, weight: .bold))
                            .foregroundColor(AppColor.foreground)
                    }
                    Image("icon24-chevron-down")
                        .renderingMode(.template)
                        .resizable().scaledToFit()
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

    // MARK: - Step 2: schedule

    private var scheduleStep: some View {
        VStack(spacing: 0) {
            ScrollView {
                VStack(alignment: .leading, spacing: Space._5) {
                    SegmentedControl(
                        options: ExecutionType.allCases,
                        selection: $draft.executionType,
                        label: { $0.rawValue }
                    )

                    HStack {
                        Text("Immediately")
                            .font(AppFont.font(size: AppFont.Size.textMd, weight: .medium))
                            .foregroundColor(AppColor.foreground)
                        Spacer()
                        Toggle("", isOn: $draft.immediately)
                            .labelsHidden()
                            .tint(AppColor.Button.primaryBg)
                    }

                    if !draft.immediately {
                        VStack(alignment: .leading, spacing: Space._1) {
                            Text("Execute on")
                                .textSmall()
                                .foregroundColor(AppColor.foregroundSecondary)
                            HStack {
                                Text(draft.formattedDate)
                                    .font(AppFont.font(size: AppFont.Size.textMd))
                                    .foregroundColor(AppColor.foreground)
                                Spacer()
                                Image("icon24-calendar")
                                    .renderingMode(.template)
                                    .resizable().scaledToFit()
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
                }
                .padding(.horizontal, Space._3)
                .padding(.top, Space._2)
            }
            confirmButton("Confirm") { advance(to: .summary) }
        }
        .background(AppColor.background)
    }

    // MARK: - Step 3: summary

    private var summaryStep: some View {
        VStack(spacing: 0) {
            ScrollView {
                VStack(alignment: .leading, spacing: Space._5) {
                    summaryRow("Amount", "\(draft.currency)  \(draft.formattedAmount)")
                    summaryRow("Execute on", draft.immediately ? "Immediately" : draft.formattedDate)
                    summaryRow("From", draft.fromAccount.name)
                    summaryRow("To", draft.toAccount.name)
                }
                .padding(.horizontal, Space._3)
                .padding(.top, Space._2)
            }
            confirmButton("Execute") { showConfirmation = true }
        }
        .background(AppColor.background)
    }

    private func summaryRow(_ label: String, _ value: String) -> some View {
        VStack(alignment: .leading, spacing: Space._1) {
            Text(label)
                .textSmall()
                .foregroundColor(AppColor.foregroundSecondary)
            Text(value)
                .font(AppFont.font(size: AppFont.Size.textMd))
                .foregroundColor(AppColor.foreground)
                .padding(.bottom, Space._1)
                .frame(maxWidth: .infinity, alignment: .leading)
                .overlay(
                    Rectangle()
                        .frame(height: 1)
                        .foregroundColor(AppColor.separator),
                    alignment: .bottom
                )
        }
    }

    // MARK: - Confirmation

    private var confirmationCard: some View {
        VStack(spacing: Space._2) {
            Image(systemName: "checkmark.circle")
                .font(.system(size: 44))
                .foregroundColor(AppColor.foreground)
                .padding(.top, Space._3)

            Text("Your transfer of")
                .textMain()
                .foregroundColor(AppColor.foreground)
            Text("\(draft.currency)  \(draft.formattedAmount)")
                .font(AppFont.font(size: AppFont.Size.textLg, weight: .bold))
                .foregroundColor(AppColor.foreground)
            Text("from \(draft.fromAccount.name) to \(draft.toAccount.name)")
                .textSmall()
                .foregroundColor(AppColor.foregroundSecondary)
                .multilineTextAlignment(.center)
            Text(draft.immediately ? "will be executed immediately." : "will be executed on \(draft.formattedDate).")
                .textMain()
                .foregroundColor(AppColor.foreground)
                .multilineTextAlignment(.center)

            Button {
                withAnimation(.easeInOut(duration: 0.3)) { showConfirmation = false }
                isPresented = false
            } label: {
                Text("Done")
                    .font(AppFont.font(size: AppFont.Size.textMd, weight: .medium))
                    .foregroundColor(AppColor.Button.primaryFg)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, Space._2)
                    .background(AppColor.Button.primaryBg)
                    .clipShape(RoundedRectangle(cornerRadius: Radius.small))
            }
            .padding(.top, Space._3)
        }
        .padding(Space._4)
        .frame(maxWidth: .infinity)
        .background(AppColor.background)
        .clipShape(RoundedRectangle(cornerRadius: Radius.regular))
        .overlay(
            RoundedRectangle(cornerRadius: Radius.regular)
                .stroke(AppColor.separator, lineWidth: 1)
        )
    }

    // MARK: - Shared

    private func confirmButton(_ title: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Text(title)
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

    private func advance(to step: IATStep) {
        isForward = true
        withAnimation(.easeInOut(duration: 0.3)) { currentStep = step }
    }

    private func goBack() {
        guard let idx = IATStep.allCases.firstIndex(of: currentStep), idx > 0 else { return }
        isForward = false
        withAnimation(.easeInOut(duration: 0.3)) { currentStep = IATStep.allCases[idx - 1] }
    }
}

#Preview {
    InternalTransferView(isPresented: .constant(true))
}
