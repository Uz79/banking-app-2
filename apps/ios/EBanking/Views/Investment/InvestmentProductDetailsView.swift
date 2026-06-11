import SwiftUI

struct InvestmentProductDetailsView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var range = "3m"

    var body: some View {
        VStack(spacing: 0) {
            CustomNavBar(title: "Deposit", showBack: true, onBack: { dismiss() })

            EdgeShadowScroll {
                VStack(alignment: .leading, spacing: Space._4) {
                    header
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

    private var header: some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(InvestmentProduct.depositName)
                .font(AppFont.font(size: AppFont.Size.h6, weight: .medium))
                .foregroundColor(AppColor.foreground)
            Text(InvestmentProduct.depositNumber)
                .textSmall()
                .foregroundColor(AppColor.foregroundSecondary)
        }
    }

    private var actionButtons: some View {
        HStack(spacing: Space._2) {
            Button(action: {}) {
                Text("Trade")
                    .textSmall().fontWeight(.medium)
                    .foregroundColor(AppColor.Button.secondaryFg)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, Space._2)
                    .overlay(Capsule().stroke(AppColor.Button.secondaryBorder, lineWidth: 1))
            }
            Button(action: {}) {
                Text("Details")
                    .textSmall().fontWeight(.medium)
                    .foregroundColor(AppColor.Button.tonalFg)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, Space._2)
                    .background(AppColor.Button.tonalBg)
                    .clipShape(Capsule())
            }
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
            HStack(spacing: Space._2) {
                Text("+ \(formatAmount(InvestmentProduct.changeAbs)) \(InvestmentProduct.currency)")
                Text("•").foregroundColor(AppColor.foregroundDisabled)
                Text(String(format: "+ %.2f %%", InvestmentProduct.changePct))
            }
            .textSmall()
            .foregroundColor(AppColor.foreground)

            Text(InvestmentProduct.asOf)
                .captionStyle()
                .foregroundColor(AppColor.foregroundSecondary)

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
        VStack(alignment: .leading, spacing: Space._1) {
            Text("Positions").textSmall().foregroundColor(AppColor.foregroundSecondary)
                .padding(.horizontal, Space._3)

            VStack(spacing: 0) {
                ForEach(InvestmentPosition.samples) { position in
                    NavigationLink {
                        DetailsOfPositionView(position: position)
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
                    .padding(.horizontal, Space._3)
                    .padding(.vertical, Space._1)
            }
            .padding(.vertical, Space._2)
            .background(AppColor.background)
            .clipShape(RoundedRectangle(cornerRadius: Radius.regular))
        }
    }

    private func positionRow(_ p: InvestmentPosition) -> some View {
        HStack(spacing: Space._3) {
            VStack(alignment: .leading, spacing: 4) {
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
}
