import SwiftUI

struct InvestmentProductDetailsView: View {
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject private var tabBar: TabBarCoordinator
    @State private var range = "3m"
    @State private var topShadow = false

    var body: some View {
        VStack(spacing: 0) {
            CustomNavBar(
                title: InvestmentProduct.depositName,
                subtitle: InvestmentProduct.depositNumber,
                showBack: true,
                onBack: { dismiss() }
            )
                .topChromeShadow(topShadow)

            EdgeShadowScroll(topShadow: $topShadow) {
                VStack(alignment: .leading, spacing: Space._4) {
                    actionButtons
                    performanceCard
                    positionsCard
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
    }

    private var actionButtons: some View {
        HStack(spacing: Space._2) {
            SecondaryButton(title: "Trade", size: .regular, action: {})
            SecondaryButton(title: "Details", size: .regular, action: {})
        }
    }

    private var performanceCard: some View {
        VStack(alignment: .leading, spacing: Space._3) {
            HStack(alignment: .firstTextBaseline, spacing: Space._2) {
                Text(formatAmount(InvestmentProduct.balance))
                    .font(AppFont.font(size: AppFont.Size.h5, weight: .bold))
                    .foregroundColor(AppColor.foreground)
                Text(InvestmentProduct.currency)
                    .textSmall()
                    .foregroundColor(AppColor.foregroundSecondary)
            }
            PerformanceCardMetaRow(
                changeAbsolute: "+ \(formatAmount(InvestmentProduct.changeAbs)) \(InvestmentProduct.currency)",
                changePercent: String(format: "+ %.2f %%", InvestmentProduct.changePct),
                date: InvestmentProduct.asOf
            )

            PerformanceChart(
                values: InvestmentProduct.series,
                yLabels: InvestmentProduct.yLabels,
                xLabels: InvestmentProduct.xLabels,
                ranges: InvestmentProduct.ranges,
                selectedRange: $range
            )

            Divider()

            HStack(spacing: 0) {
                summaryItem("Invested", InvestmentProduct.invested)
                Divider().frame(height: 36)
                summaryItem("Cash", InvestmentProduct.cash)
            }
        }
        .padding(Space._3)
        .background(AppColor.background)
        .clipShape(RoundedRectangle(cornerRadius: Radius.regular))
    }

    private func summaryItem(_ label: String, _ amount: Double) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(label).captionStyle().foregroundColor(AppColor.foregroundSecondary)
            HStack(spacing: 6) {
                Text(InvestmentProduct.currency).captionStyle()
                    .foregroundColor(AppColor.foregroundSecondary)
                Text(formatAmount(amount)).textSmall().fontWeight(.bold)
                    .foregroundColor(AppColor.foreground)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.horizontal, Space._2)
    }

    private var positionsCard: some View {
        VStack(alignment: .leading, spacing: SectionCardMetrics.headerToBody) {
            Text("Positions").textSmall().foregroundColor(AppColor.foregroundSecondary)
                .padding(.horizontal, Space._3)

            VStack(spacing: 0) {
                ForEach(InvestmentPosition.samples) { position in
                    Button {
                        tabBar.overviewPath.append(OverviewRoute.position(position.id))
                    } label: {
                        positionRow(position)
                    }
                    .buttonStyle(.plain)
                    if position.id != InvestmentPosition.samples.last?.id {
                        Divider().padding(.horizontal, Space._3)
                    }
                }
                Divider().padding(.horizontal, Space._3)
                ShowAllButton("Show all")
            }
            .background(AppColor.background)
            .clipShape(RoundedRectangle(cornerRadius: Radius.regular))
        }
    }

    private func positionRow(_ p: InvestmentPosition) -> some View {
        HStack(spacing: Space._3) {
            VStack(alignment: .leading, spacing: Space._1) {
                Text(p.name).textSmall().fontWeight(.medium)
                    .foregroundColor(AppColor.foreground)
                Text("\(p.formattedChange) • \(p.formattedChangePct)")
                    .captionStyle()
                    .foregroundColor(AppColor.foregroundSecondary)
            }
            Spacer()
            HStack(spacing: 6) {
                Text(p.currency).captionStyle().foregroundColor(AppColor.foregroundSecondary)
                Text(p.formattedValue).textSmall().fontWeight(.bold)
                    .foregroundColor(AppColor.foreground)
            }
            Image("icon24-chevron-right")
                .renderingMode(.template).resizable().scaledToFit()
                .frame(width: 20, height: 20)
                .foregroundColor(AppColor.foreground)
        }
        .padding(.horizontal, Space._3)
        .padding(.vertical, Space._2)
        .contentShape(Rectangle())
    }
}

#Preview {
    NavigationStack { InvestmentProductDetailsView() }
        .environmentObject(TabBarCoordinator())
        .environmentObject(ScrollEdgeModel())
}
