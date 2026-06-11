import SwiftUI

struct DetailsOfPositionView: View {
    let position: InvestmentPosition
    @Environment(\.dismiss) private var dismiss
    @State private var range = "1d"

    private var pl: Double { (position.price - position.acquisitionPrice) * Double(position.quantity) }
    private var plSign: String { pl >= 0 ? "+" : "−" }

    private let series: [CGFloat] = [0.30, 0.42, 0.38, 0.55, 0.48, 0.62, 0.58, 0.70, 0.64, 0.72]

    var body: some View {
        VStack(spacing: 0) {
            CustomNavBar(title: position.name, showBack: true, onBack: { dismiss() })

            EdgeShadowScroll {
                VStack(alignment: .leading, spacing: Space._4) {
                    header
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

    private var header: some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(position.name)
                .font(AppFont.font(size: AppFont.Size.h6, weight: .medium))
                .foregroundColor(AppColor.foreground)
            Text("ISIN | \(position.isin) | \(position.exchange)")
                .captionStyle()
                .foregroundColor(AppColor.foregroundSecondary)
        }
    }

    private var actionButtons: some View {
        HStack(spacing: Space._2) {
            Button(action: {}) {
                Text("Buy")
                    .textSmall().fontWeight(.medium)
                    .foregroundColor(AppColor.Button.primaryFg)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, Space._2)
                    .background(AppColor.Button.primaryBg)
                    .clipShape(Capsule())
            }
            Button(action: {}) {
                Text("Sell")
                    .textSmall().fontWeight(.medium)
                    .foregroundColor(AppColor.Button.secondaryFg)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, Space._2)
                    .overlay(Capsule().stroke(AppColor.Button.secondaryBorder, lineWidth: 1))
            }
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
            HStack(spacing: Space._2) {
                Text(position.formattedChange)
                Text("•").foregroundColor(AppColor.foregroundDisabled)
                Text(position.formattedChangePct)
            }
            .textSmall().foregroundColor(AppColor.foreground)

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
        VStack(alignment: .leading, spacing: Space._1) {
            Text("My positions").textSmall().foregroundColor(AppColor.foregroundSecondary)
                .padding(.horizontal, Space._3)
            VStack(spacing: 0) {
                infoRow("Account", "Deposit \(InvestmentProduct.depositNumber)")
                divider
                infoRow("Acquisition price", "\(position.currency) \(formatAmount(position.acquisitionPrice))")
                divider
                infoRow("Value", "\(position.currency) \(position.formattedValue)")
                divider
                infoRow("Quantity", "pcs. \(position.quantity)")
                divider
                infoRow("Unrealized P/L", "\(position.currency) \(plSign) \(formatAmount(abs(pl)))")
                divider
                infoRow("Total P/L", "\(position.currency) \(plSign) \(formatAmount(abs(pl)))")
            }
            .padding(.vertical, Space._2)
            .background(AppColor.background)
            .clipShape(RoundedRectangle(cornerRadius: Radius.regular))
        }
    }

    private var keyFiguresCard: some View {
        VStack(alignment: .leading, spacing: Space._1) {
            Text("Key figures").textSmall().foregroundColor(AppColor.foregroundSecondary)
                .padding(.horizontal, Space._3)
            VStack(spacing: 0) {
                infoRow("High", "\(position.currency) \(formatAmount(position.high))")
                divider
                infoRow("Low", "\(position.currency) \(formatAmount(position.low))")
            }
            .padding(.vertical, Space._2)
            .background(AppColor.background)
            .clipShape(RoundedRectangle(cornerRadius: Radius.regular))
        }
    }

    private var divider: some View { Divider().padding(.horizontal, Space._3) }

    private func infoRow(_ label: String, _ value: String) -> some View {
        HStack {
            Text(label).textSmall().foregroundColor(AppColor.foregroundSecondary)
            Spacer()
            Text(value).textSmall().fontWeight(.medium).foregroundColor(AppColor.foreground)
        }
        .padding(.horizontal, Space._3)
        .padding(.vertical, Space._2)
    }
}

#Preview {
    NavigationStack { DetailsOfPositionView(position: .abb) }
}
