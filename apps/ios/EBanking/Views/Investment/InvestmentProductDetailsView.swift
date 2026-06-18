import SwiftUI

struct InvestmentProductDetailsView: View {
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject private var tabBar: TabBarCoordinator
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
        DepositPerformanceCard(showsToolbar: false, initialRange: "3m")
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
