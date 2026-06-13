import SwiftUI

struct DetailsOfPositionView: View {
    let position: InvestmentPosition
    @Environment(\.dismiss) private var dismiss
    @State private var range = "1d"
    @State private var topShadow = false

    private var pl: Double { (position.price - position.acquisitionPrice) * Double(position.quantity) }
    private var plSign: String { pl >= 0 ? "+" : "−" }

    private let series: [CGFloat] = [0.30, 0.42, 0.38, 0.55, 0.48, 0.62, 0.58, 0.70, 0.64, 0.72]

    var body: some View {
        VStack(spacing: 0) {
            CustomNavBar(
                title: position.name,
                subtitle: "ISIN | \(position.isin) | \(position.exchange)",
                showBack: true,
                onBack: { dismiss() }
            )
                .topChromeShadow(topShadow)

            EdgeShadowScroll(topShadow: $topShadow) {
                VStack(alignment: .leading, spacing: Space._4) {
                    actionButtons
                    priceCard
                    myPositionsCard
                    keyFiguresCard
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
            SecondaryButton(title: "Buy", size: .regular, action: {})
            SecondaryButton(title: "Sell", size: .regular, action: {})
        }
    }

    private var priceCard: some View {
        VStack(alignment: .leading, spacing: Space._3) {
            HStack(alignment: .firstTextBaseline, spacing: Space._2) {
                Text(position.formattedPrice)
                    .font(AppFont.font(size: AppFont.Size.h5, weight: .bold))
                    .foregroundColor(AppColor.foreground)
                Text(position.currency)
                    .textSmall().foregroundColor(AppColor.foregroundSecondary)
            }
            PerformanceCardMetaRow(
                changeAbsolute: position.formattedChange,
                changePercent: position.formattedChangePct,
                date: position.formattedMarketDate
            )

            PerformanceChart(
                values: series,
                yLabels: [
                    formatAmount(position.high),
                    formatAmount((position.high + position.low) / 2),
                    formatAmount(position.low)
                ],
                xLabels: ["15:00", "16:00", "17:00", "18:00"],
                ranges: ["1d", "1w", "1m", "3m", "6m", "1y", "Max"],
                selectedRange: $range
            )
        }
        .padding(Space._3)
        .background(AppColor.background)
        .clipShape(RoundedRectangle(cornerRadius: Radius.regular))
    }

    private var myPositionsCard: some View {
        DataCard(title: "My positions") {
            dataRow("Account", "Deposit \(InvestmentProduct.depositNumber)")
            dataDivider
            dataRow("Acquisition price", "\(position.currency) \(formatAmount(position.acquisitionPrice))")
            dataDivider
            dataRow("Value", "\(position.currency) \(position.formattedValue)")
            dataDivider
            dataRow("Quantity", "pcs. \(position.quantity)")
            dataDivider
            dataRow("Unrealized P/L", "\(position.currency) \(plSign) \(formatAmount(abs(pl)))")
            dataDivider
            dataRow("Total P/L", "\(position.currency) \(plSign) \(formatAmount(abs(pl)))")
        }
    }

    private var keyFiguresCard: some View {
        DataCard(title: "Key figures") {
            dataRow("High", "\(position.currency) \(formatAmount(position.high))")
            dataDivider
            dataRow("Low", "\(position.currency) \(formatAmount(position.low))")
        }
    }

    private var dataDivider: some View {
        Divider()
    }

    private func dataRow(_ label: String, _ value: String) -> some View {
        DataCardRow(label: label, value: value)
    }
}

#Preview {
    NavigationStack { DetailsOfPositionView(position: .abb) }
        .environmentObject(ScrollEdgeModel())
}
