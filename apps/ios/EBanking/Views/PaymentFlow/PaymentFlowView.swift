import SwiftUI

enum PaymentStep: Int, CaseIterable {
    case recipientSearch
    case recipient
    case amount
    case schedule
    case summary
    case confirmation

    var title: String {
        switch self {
        case .recipientSearch: return "New payment"
        case .recipient: return "Recipient"
        case .amount: return "Amount"
        case .schedule: return "Time schedule"
        case .summary, .confirmation: return "Summary"
        }
    }
}

struct PaymentFlowView: View {
    @Binding var isPresented: Bool
    let prefilledRecipient: Recipient?

    @State private var currentStep: PaymentStep
    @State private var draft: PaymentDraft
    @State private var isForward = true
    @State private var showConfirmation = false

    /// Where the flow begins: directly at the recipient form when a recipient
    /// was pre-picked (e.g. from "recent recipients"), otherwise the search.
    private let startStep: PaymentStep

    init(isPresented: Binding<Bool>, prefilledRecipient: Recipient?) {
        self._isPresented = isPresented
        self.prefilledRecipient = prefilledRecipient

        var initialDraft = PaymentDraft()
        if let r = prefilledRecipient { initialDraft.recipient = r }
        let start: PaymentStep = prefilledRecipient == nil ? .recipientSearch : .recipient

        self._draft = State(initialValue: initialDraft)
        self._currentStep = State(initialValue: start)
        self.startStep = start
    }

    var body: some View {
        VStack(spacing: 0) {
            CustomNavBar(
                title: currentStep.title,
                showBack: currentStep.rawValue > startStep.rawValue,
                showClose: true,
                onBack: goBack,
                onClose: { isPresented = false }
            )

            Group {
                switch currentStep {
                case .recipientSearch:
                    RecipientSearchStepView { recipient in
                        draft.recipient = recipient
                        advance(to: .recipient)
                    }
                case .recipient:
                    RecipientStepView(draft: $draft) {
                        advance(to: .amount)
                    }
                case .amount:
                    AmountStepView(draft: $draft) {
                        advance(to: .schedule)
                    }
                case .schedule:
                    ScheduleStepView(draft: $draft) {
                        advance(to: .summary)
                    }
                case .summary:
                    SummaryStepView(draft: $draft) {
                        showConfirmation = true
                    }
                default:
                    EmptyView()
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
                    .onTapGesture {} // block taps on overlay

                ConfirmationView(draft: draft) {
                    withAnimation(.easeInOut(duration: 0.3)) {
                        showConfirmation = false
                    }
                    isPresented = false
                }
                .padding(.horizontal, Space._3)
                .transition(.move(edge: .bottom).combined(with: .opacity))
            }
        }
        .animation(.easeInOut(duration: 0.3), value: showConfirmation)
    }

    private func advance(to step: PaymentStep) {
        isForward = true
        withAnimation(.easeInOut(duration: 0.3)) {
            currentStep = step
        }
    }

    private func goBack() {
        guard let idx = PaymentStep.allCases.firstIndex(of: currentStep),
              idx > 0,
              PaymentStep.allCases[idx - 1].rawValue >= startStep.rawValue else { return }
        isForward = false
        withAnimation(.easeInOut(duration: 0.3)) {
            currentStep = PaymentStep.allCases[idx - 1]
        }
    }
}

#Preview {
    PaymentFlowView(
        isPresented: .constant(true),
        prefilledRecipient: nil
    )
}
