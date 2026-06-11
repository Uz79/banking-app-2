import SwiftUI

enum BookingFilter: String, CaseIterable, Identifiable {
    case executed = "Executed"
    case pending = "Pending"
    case recurring = "Recurring"
    var id: String { rawValue }
}

struct AllBookingsView: View {
    var account: Account = .savings
    @Environment(\.dismiss) private var dismiss
    @State private var filter: BookingFilter = .executed
    @State private var month = "May"
    @State private var selectedDetail: PaymentDetail?

    private let months = ["Feb", "Mar", "Apr", "May", "Jun"]

    private let groups: [BookingGroup] = [
        BookingGroup(title: "Today", currency: "CHF", runningBalance: 25_320.00, bookings: [
            Booking(name: "Salary", currency: "CHF", amount: 5_000.00, icon: "icon24-corner-up-right", isPending: false)
        ]),
        BookingGroup(title: "Yesterday", currency: "CHF", runningBalance: 20_320.00, bookings: [
            Booking(name: "Rent", currency: "CHF", amount: -1_800.00, icon: "icon24-corner-up-right", isPending: false),
            Booking(name: "Transfer to Household", currency: "CHF", amount: -320.00, icon: "icon24-repeat", isPending: false)
        ]),
        BookingGroup(title: "28.05", currency: "CHF", runningBalance: 22_440.00, bookings: [
            Booking(name: "Migros", currency: "CHF", amount: -100.00, icon: "icon24-corner-up-right", isPending: false)
        ]),
        BookingGroup(title: "25.05", currency: "CHF", runningBalance: 22_540.00, bookings: [
            Booking(name: "Coop", currency: "CHF", amount: -10.00, icon: "icon24-corner-up-right", isPending: false),
            Booking(name: "Pharmacy Zürich", currency: "CHF", amount: -45.00, icon: "icon24-corner-up-right", isPending: false)
        ])
    ]

    var body: some View {
        VStack(spacing: 0) {
            CustomNavBar(title: "All bookings & payments", showBack: true, onBack: { dismiss() })

            monthTabs

            EdgeShadowScroll {
                VStack(spacing: Space._4) {
                    summaryCard
                    SegmentedControl(options: BookingFilter.allCases, selection: $filter, label: { $0.rawValue })

                    switch filter {
                    case .executed:  executedList
                    case .pending:   pendingList
                    case .recurring: recurringList
                    }
                }
                .padding(.horizontal, Space._3)
                .padding(.top, Space._2)
                .padding(.bottom, Space._6)
            }
        }
        .background(AppColor.backgroundSecondary)
        #if os(iOS)
        .navigationBarHidden(true)
        #endif
        .sheet(item: $selectedDetail) { PaymentDetailView(detail: $0) }
    }

    private var monthTabs: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: Space._2) {
                ForEach(months, id: \.self) { m in
                    let selected = m == month
                    Button { month = m } label: {
                        Text(m)
                            .textSmall().fontWeight(.medium)
                            .foregroundColor(selected ? AppColor.foreground : AppColor.foregroundSecondary)
                            .padding(.horizontal, Space._3)
                            .padding(.vertical, Space._1)
                            .background(selected ? AppColor.showAllBg : Color.clear)
                            .clipShape(Capsule())
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(.horizontal, Space._3)
            .padding(.vertical, Space._2)
        }
    }

    private var summaryCard: some View {
        HStack(spacing: Space._3) {
            Image(account.icon)
                .renderingMode(.template).resizable().scaledToFit()
                .frame(width: 24, height: 24).foregroundColor(AppColor.foreground)
            VStack(alignment: .leading, spacing: 4) {
                Text(account.name).textSmall().fontWeight(.medium).foregroundColor(AppColor.foreground)
                Text(account.formattedIBAN).captionStyle().foregroundColor(AppColor.foregroundSecondary)
            }
            Spacer()
            HStack(spacing: 6) {
                Text(account.currency).captionStyle().foregroundColor(AppColor.foregroundSecondary)
                Text(account.formattedBalance).textSmall().fontWeight(.bold).foregroundColor(AppColor.foreground)
            }
        }
        .padding(Space._3)
        .background(AppColor.background)
        .clipShape(RoundedRectangle(cornerRadius: Radius.regular))
    }

    private var executedList: some View {
        VStack(spacing: 0) {
            ForEach(groups) { group in
                BookingGroupSection(group: group, onSelect: openDetail)
                if group.id != groups.last?.id {
                    Divider().padding(.horizontal, Space._3)
                }
            }
        }
        .padding(.vertical, Space._2)
        .background(AppColor.background)
        .clipShape(RoundedRectangle(cornerRadius: Radius.regular))
    }

    private var pendingList: some View {
        VStack(spacing: 0) {
            ForEach(PendingPayment.samples) { payment in
                Button {
                    selectedDetail = PaymentDetail(
                        amount: -payment.amount, currency: payment.currency,
                        counterparty: payment.name, debit: account,
                        isPending: true, message: "Scheduled for \(payment.date)"
                    )
                } label: {
                    PendingPaymentRow(payment: payment).contentShape(Rectangle())
                }
                .buttonStyle(.plain)
                if payment.id != PendingPayment.samples.last?.id {
                    Divider().padding(.horizontal, Space._3)
                }
            }
        }
        .padding(.vertical, Space._2)
        .background(AppColor.background)
        .clipShape(RoundedRectangle(cornerRadius: Radius.regular))
    }

    private var recurringList: some View {
        VStack(spacing: 0) {
            ForEach(RecurringPayment.samples) { payment in
                ListItemRow(icon: payment.icon, title: payment.name)
                if payment.id != RecurringPayment.samples.last?.id {
                    Divider().padding(.horizontal, Space._3)
                }
            }
        }
        .padding(.vertical, Space._2)
        .background(AppColor.background)
        .clipShape(RoundedRectangle(cornerRadius: Radius.regular))
    }

    private func openDetail(_ booking: Booking) {
        selectedDetail = PaymentDetail(
            amount: booking.amount, currency: booking.currency,
            counterparty: booking.name, debit: account,
            isPending: booking.isPending, message: "—"
        )
    }
}

#Preview {
    NavigationStack { AllBookingsView() }
}
