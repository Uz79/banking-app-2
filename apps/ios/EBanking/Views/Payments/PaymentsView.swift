import SwiftUI

struct PaymentsView: View {
    @Binding var showPaymentFlow: Bool
    @Binding var showInternalTransfer: Bool
    @Binding var selectedRecipient: Recipient?

    @State private var showMore = false
    @State private var selectedDetail: PaymentDetail?

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                CustomNavBar(title: "Payments")

                EdgeShadowScroll {
                    VStack(spacing: Space._4) {
                        ActionButtonsRow(showMore: true, onPay: {
                            selectedRecipient = nil
                            showPaymentFlow = true
                        }, onTransfer: {
                            showInternalTransfer = true
                        }, onMore: {
                            showMore = true
                        })

                        pendingPaymentsSection
                        recurringPaymentsSection
                        recentRecipientsSection
                    }
                    .padding(.horizontal, Space._3)
                    .padding(.bottom, Space._6)
                }
            }
            .background(AppColor.backgroundSecondary)
            #if os(iOS)
            .navigationBarHidden(true)
            #endif
            .sheet(isPresented: $showMore) {
                MoreActionsSheet(actions: moreActions)
            }
            .sheet(item: $selectedDetail) { detail in
                PaymentDetailView(detail: detail)
            }
        }
    }

    private var moreActions: [MoreAction] {
        [
            MoreAction(icon: "icon24-plus", label: "Pay") {
                selectedRecipient = nil; showPaymentFlow = true
            },
            MoreAction(icon: "icon24-repeat", label: "Internal transfer") {
                showInternalTransfer = true
            },
            MoreAction(icon: "icon24-camera", label: "Scan", action: {}),
            MoreAction(icon: "icon24-rotate-ccw", label: "Standing orders", action: {}),
            MoreAction(icon: "icon24-mail", label: "eBill", action: {}),
            MoreAction(icon: "icon24-file-text", label: "Statements", action: {})
        ]
    }

    // MARK: - Pending Payments

    private var pendingPaymentsSection: some View {
        SectionCard(title: "Pending payments") {
            VStack(spacing: 0) {
                ForEach(PendingPayment.samples) { payment in
                    Button {
                        selectedDetail = PaymentDetail(
                            amount: -payment.amount, currency: payment.currency,
                            counterparty: payment.name, debit: .household,
                            isPending: true, message: "Scheduled for \(payment.date)"
                        )
                    } label: {
                        VStack(alignment: .leading, spacing: 0) {
                            Text(payment.date)
                                .captionStyle()
                                .foregroundColor(AppColor.foregroundSecondary)
                                .padding(.horizontal, Space._3)
                                .padding(.top, Space._1)

                            PendingPaymentRow(payment: payment)
                        }
                        .contentShape(Rectangle())
                    }
                    .buttonStyle(.plain)

                    if payment.id != PendingPayment.samples.last?.id {
                        Divider().padding(.horizontal, Space._3)
                    }
                }

                Divider().padding(.horizontal, Space._3)

                ShowAllButton("Show all pending payments")
                    .padding(.horizontal, Space._3)
                    .padding(.vertical, Space._1)
            }
        }
    }

    // MARK: - Recurring Payments

    private var recurringPaymentsSection: some View {
        SectionCard(title: "Recurring payments") {
            VStack(spacing: 0) {
                ForEach(RecurringPayment.samples) { payment in
                    ListItemRow(
                        icon: payment.icon,
                        title: payment.name
                    )

                    if payment.id != RecurringPayment.samples.last?.id {
                        Divider().padding(.horizontal, Space._3)
                    }
                }
            }
        }
    }

    // MARK: - Recent Recipients

    private var recentRecipientsSection: some View {
        SectionCard(title: "Most recent recipients") {
            VStack(spacing: 0) {
                ForEach(Recipient.allRecipients) { recipient in
                    ListItemRow(
                        icon: recipient.icon,
                        title: recipient.name,
                        subtitle: recipient.subtitle.isEmpty ? nil : recipient.subtitle
                    ) {
                        selectedRecipient = recipient
                        showPaymentFlow = true
                    }

                    if recipient.id != Recipient.allRecipients.last?.id {
                        Divider().padding(.horizontal, Space._3)
                    }
                }
            }
        }
    }
}

#Preview {
    PaymentsView(
        showPaymentFlow: .constant(false),
        showInternalTransfer: .constant(false),
        selectedRecipient: .constant(nil)
    )
}
