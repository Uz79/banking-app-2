import SwiftUI

struct AccountDetailView: View {
    let account: Account
    @Binding var showPaymentFlow: Bool
    @Binding var showInternalTransfer: Bool
    @Binding var selectedRecipient: Recipient?
    @Environment(\.dismiss) private var dismiss

    @State private var currentPage = 0
    @State private var showMore = false
    @State private var showAccountInfo = false
    @State private var showAllBookings = false
    @State private var selectedDetail: PaymentDetail?
    private let accounts = [Account.household, Account.savings]

    var currentAccount: Account {
        accounts[currentPage]
    }

    var body: some View {
        VStack(spacing: 0) {
            CustomNavBar(
                title: "Account details",
                showBack: true,
                onBack: { dismiss() },
                trailingIcon: "icon24-info",
                onTrailing: { showAccountInfo = true }
            )

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

                    AccountCarousel(
                        accounts: accounts,
                        currentPage: $currentPage
                    )

                    bookingsCard
                }
                .padding(.horizontal, Space._3)
                .padding(.bottom, Space._6)
            }
        }
        .background(AppColor.backgroundSecondary)
        #if os(iOS)
        .navigationBarHidden(true)
        #endif
        .onAppear {
            if let idx = accounts.firstIndex(where: { $0.id == account.id }) {
                currentPage = idx
            }
        }
        .sheet(isPresented: $showMore) {
            MoreActionsSheet(actions: moreActions)
        }
        .sheet(isPresented: $showAccountInfo) {
            AccountInformationView(account: currentAccount)
        }
        .sheet(item: $selectedDetail) { detail in
            PaymentDetailView(detail: detail)
        }
        .navigationDestination(isPresented: $showAllBookings) {
            AllBookingsView(account: currentAccount)
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
            MoreAction(icon: "icon24-info", label: "Account information") {
                showAccountInfo = true
            },
            MoreAction(icon: "icon24-camera", label: "Scan", action: {}),
            MoreAction(icon: "icon24-file-text", label: "Statements", action: {})
        ]
    }

    private func openDetail(_ booking: Booking) {
        selectedDetail = PaymentDetail(
            amount: booking.amount, currency: booking.currency,
            counterparty: booking.name, debit: currentAccount,
            isPending: booking.isPending, message: "Card payment"
        )
    }

    // MARK: - Combined Bookings Card

    private var bookingsCard: some View {
        VStack(spacing: 0) {
            pendingHeader
            Divider().padding(.horizontal, Space._3)
            BookingGroupSection(group: .today, onSelect: openDetail)
            Divider().padding(.horizontal, Space._3)
            BookingGroupSection(group: .yesterday, onSelect: openDetail)
            ShowAllButton("Show all bookings", action: { showAllBookings = true })
                .background(AppColor.showAllBg)
                .clipShape(RoundedRectangle(cornerRadius: Radius.small))
                .padding(.horizontal, Space._3)
                .padding(.vertical, Space._1)
        }
        .padding(.vertical, Space._2)
        .background(AppColor.background)
        .clipShape(RoundedRectangle(cornerRadius: Radius.regular))
    }

    private var pendingHeader: some View {
        HStack {
            HStack(spacing: Space._2) {
                Image("icon24-chevron-down")
                    .renderingMode(.template)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 16, height: 16)
                    .foregroundColor(AppColor.foreground)
                    .frame(width: 32, height: 32)
                    .background(AppColor.backgroundSecondary)
                    .clipShape(Circle())

                Text("Pending payments until\n31.05.2026")
                    .font(AppFont.font(size: AppFont.Size.textSm, weight: .regular))
                    .foregroundColor(AppColor.foreground)
                    .lineLimit(2)
            }

            Spacer()

            HStack(spacing: 6) {
                Text(currentAccount.currency)
                    .captionStyle()
                    .foregroundColor(AppColor.foregroundSecondary)
                Text("2'500.00")
                    .font(AppFont.font(size: AppFont.Size.textSm, weight: .medium))
                    .foregroundColor(AppColor.foreground)
            }
        }
        .padding(.horizontal, Space._3)
        .padding(.vertical, Space._2)
    }
}

#Preview {
    NavigationStack {
        AccountDetailView(
            account: .household,
            showPaymentFlow: .constant(false),
            showInternalTransfer: .constant(false),
            selectedRecipient: .constant(nil)
        )
    }
}
