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
    @EnvironmentObject private var scrollEdge: ScrollEdgeModel

    @StateObject private var monthMerge = AllBookingsMonthMergeModel()
    @State private var filter: BookingFilter = .executed
    @State private var month = "May"
    @State private var selectedDetail: PaymentDetail?
    @State private var topShadow = false
    @State private var scrollOffset: CGFloat = 0
    @State private var scrollAnchor: String?
    @State private var mergeFrames = MergeAnchorFrames()
    @State private var scrollMergeThreshold: CGFloat?

    private let months = ["Feb", "Mar", "Apr", "May", "Jun"]
    private let navHeight: CGFloat = 48

    private let monthScrollAnchors: [String: String] = [
        "Feb": "05.02",
        "Mar": "01.03",
        "Apr": "03.04",
        "May": "Today",
        "Jun": "Today"
    ]

    private let groups: [BookingGroup] = [
        Self.group("Today", 25_320.00, [("Salary", 5_000.00)]),
        Self.group("Yesterday", 20_320.00, [("Rent", -1_800.00), ("Transfer to Household", -320.00)]),
        Self.group("28.05", 22_440.00, [("Migros", -100.00)]),
        Self.group("25.05", 22_540.00, [("Coop", -10.00), ("Pharmacy Zürich", -100.00)]),
        Self.group("12.05", 22_650.00, [("Health Insurance", -380.00)]),
        Self.group("07.05", 23_030.00, [("Internet & Phone", -60.00)]),
        Self.group("28.04", 23_090.00, [("Denner", -42.50), ("Shell", -85.00)]),
        Self.group("18.04", 23_217.50, [("SBB Mobile", -35.00)]),
        Self.group("10.04", 23_252.50, [("Salary", 5_000.00)]),
        Self.group("03.04", 18_252.50, [("Electricity Zürich", -120.00), ("Transfer to Savings", -500.00)]),
        Self.group("25.03", 18_872.50, [("IKEA Dietlikon", -249.00)]),
        Self.group("15.03", 19_121.50, [("Rent", -1_800.00), ("Manor", -67.80)]),
        Self.group("08.03", 20_989.30, [("Migros", -78.40), ("Coop", -54.20)]),
        Self.group("01.03", 21_121.90, [("Parking Zürich", -12.00)]),
        Self.group("27.02", 21_133.90, [("Flumserberg Ski Pass", -68.00)]),
        Self.group("14.02", 21_201.90, [("Restaurant Kronenhalle", -185.00)]),
        Self.group("05.02", 21_386.90, [("Salary", 5_000.00), ("Interest credit", 12.50)])
    ]

    private static func group(_ title: String, _ balance: Double,
                              _ items: [(String, Double)]) -> BookingGroup {
        BookingGroup(
            title: title, currency: "CHF", runningBalance: balance,
            bookings: items.map { name, amount in
                let icon: String
                if name.hasPrefix("Transfer") { icon = "icon24-repeat" }
                else if amount >= 0 { icon = "icon24-download" }
                else { icon = "icon24-corner-up-right" }
                return Booking(name: name, currency: "CHF", amount: amount,
                               icon: icon, isPending: false)
            }
        )
    }

    private var showHeaderShadow: Bool {
        if monthMerge.merged { return topShadow }
        return scrollOffset > 1
    }

    var body: some View {
        ZStack(alignment: .top) {
            scrollBody
            stickyHeaderOverlay
                .zIndex(10)
        }
        .background(AppColor.backgroundSecondary)
        #if os(iOS)
        .navigationBarHidden(true)
        #endif
        .foregroundScrimSheet(item: $selectedDetail, size: .large) { detail in
            PaymentDetailView(detail: detail, onClose: { selectedDetail = nil })
        }
        .onPreferenceChange(MergeAnchorFramesKey.self) { frames in
            mergeFrames = frames
            if scrollOffset <= 1, let gap = frames.gap {
                scrollMergeThreshold = gap - AllBookingsMonthMerge.mergeLead
            }
            evaluateMonthMerge()
        }
    }

    private func evaluateMonthMerge() {
        let gap = mergeFrames.gap
            ?? scrollMergeThreshold.map { $0 + AllBookingsMonthMerge.mergeLead - scrollOffset }
        monthMerge.evaluate(scrollOffset: scrollOffset, mergeGap: gap)
    }

    private var stickyHeaderOverlay: some View {
        AllBookingsStickyHeader(
            title: "All bookings & payments",
            showBack: true,
            onBack: { dismiss() },
            month: $month,
            months: months,
            monthMerged: monthMerge.merged,
            monthMerging: monthMerge.merging,
            showShadow: showHeaderShadow,
            onMonthSelect: { scrollAnchor = monthScrollAnchors[$0] }
        )
    }

    private var scrollBody: some View {
        ScrollViewReader { proxy in
            ScrollView {
                VStack(spacing: 0) {
                    Color.clear.frame(height: navHeight)

                    introBlock
                    flowMonthBar
                    bookingsBlock
                }
                #if canImport(UIKit)
                .background {
                    AllBookingsScrollReporter { metrics in
                        scrollOffset = metrics.offsetY
                        let edges = ScrollEdgeState.shadows(
                            offsetY: metrics.offsetY,
                            contentHeight: metrics.contentHeight,
                            viewportHeight: metrics.viewportHeight
                        )
                        if topShadow != edges.top { topShadow = edges.top }
                        if scrollEdge.bottomShadow != edges.bottom {
                            scrollEdge.bottomShadow = edges.bottom
                        }
                        evaluateMonthMerge()
                    }
                }
                #endif
            }
            .onChange(of: scrollAnchor) { _, anchor in
                guard let anchor else { return }
                withAnimation(.easeInOut(duration: 0.35)) {
                    proxy.scrollTo(anchor, anchor: .top)
                }
                scrollAnchor = nil
            }
        }
    }

    private var introBlock: some View {
        VStack(spacing: Space._4) {
            summaryCard
                .padding(.horizontal, Space._3)
            SegmentedControl(
                options: BookingFilter.allCases,
                selection: $filter,
                label: { $0.rawValue }
            )
            .padding(.horizontal, Space._3)
        }
        .padding(.top, Space._2)
    }

    private var flowMonthBar: some View {
        AllBookingsMonthBar(
            month: $month,
            months: months,
            centered: true,
            onSelect: { scrollAnchor = monthScrollAnchors[$0] }
        )
        .padding(.top, Space._4)
        .padding(.bottom, Space._3)
        .opacity(monthMerge.merged || monthMerge.merging ? 0 : 1)
        .animation(.easeInOut(duration: 0.12), value: monthMerge.merging)
        .animation(.easeInOut(duration: 0.12), value: monthMerge.merged)
        .allowsHitTesting(!monthMerge.merged && !monthMerge.merging)
        .accessibilityHidden(monthMerge.merged || monthMerge.merging)
        .mergeFrameAnchor(.monthBar)
    }

    private var bookingsBlock: some View {
        Group {
            switch filter {
            case .executed: executedList
            case .pending:   pendingList
            case .recurring: recurringList
            }
        }
        .padding(.horizontal, Space._3)
        .padding(.bottom, Space._6)
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
                    .id(group.title)
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
        .environmentObject(ScrollEdgeModel())
}
