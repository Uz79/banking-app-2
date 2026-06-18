import SwiftUI

/// Absolute + relative performance with as-of date on one row
/// (web `.performance-card__meta`).
struct PerformanceCardMetaRow: View {
    let changeAbsolute: String
    let changePercent: String
    let date: String

    var body: some View {
        HStack(alignment: .firstTextBaseline, spacing: Space._3) {
            HStack(spacing: Space._1) {
                Text(changeAbsolute)
                Text("•")
                    .foregroundColor(AppColor.foregroundDisabled)
                Text(changePercent)
            }
            .textSmall()
            .foregroundColor(AppColor.foregroundSecondary)

            Spacer(minLength: Space._3)

            Text(date)
                .textSmall()
                .foregroundColor(AppColor.foregroundSecondary)
        }
    }
}

/// Line + area performance chart drawn natively with `Path`, with right-aligned
/// y-axis labels, x-axis labels, and range-selector pills. Mirrors the web
/// `.performance-card__chart`.
struct PerformanceChart: View {
    let values: [CGFloat]          // normalized 0…1, higher = higher value
    let yLabels: [String]          // top → bottom
    let xLabels: [String]          // left → right
    let ranges: [String]
    @Binding var selectedRange: String

    private let chartHeight: CGFloat = 150
    private let yAxisWidth: CGFloat = 32

    var body: some View {
        VStack(spacing: Space._2) {
            HStack(alignment: .top, spacing: Space._1) {
                chart
                yAxis
            }
            .frame(height: chartHeight)

            xAxis
            rangeTabs
        }
    }

    private var chart: some View {
        GeometryReader { geo in
            let w = geo.size.width
            let h = geo.size.height
            let pts = points(in: CGSize(width: w, height: h))

            ZStack {
                // Area
                areaPath(pts, height: h)
                    .fill(
                        LinearGradient(
                            colors: [AppColor.foreground.opacity(0.20), AppColor.foreground.opacity(0)],
                            startPoint: .top, endPoint: .bottom
                        )
                    )
                // Line
                linePath(pts)
                    .stroke(AppColor.foreground,
                            style: StrokeStyle(lineWidth: 1.5, lineCap: .round, lineJoin: .round))
            }
        }
    }

    private var yAxis: some View {
        VStack(alignment: .trailing) {
            ForEach(Array(yLabels.enumerated()), id: \.offset) { i, label in
                Text(label)
                    .captionStyle()
                    .foregroundColor(AppColor.foregroundDisabled)
                if i < yLabels.count - 1 { Spacer() }
            }
        }
        .frame(width: yAxisWidth, alignment: .trailing)
    }

    private var xAxis: some View {
        HStack {
            ForEach(Array(xLabels.enumerated()), id: \.offset) { i, label in
                Text(label)
                    .captionStyle()
                    .foregroundColor(AppColor.foregroundDisabled)
                if i < xLabels.count - 1 { Spacer() }
            }
        }
        .padding(.trailing, yAxisWidth + Space._1)
    }

    private var rangeTabs: some View {
        HStack(spacing: Space._1) {
            ForEach(ranges, id: \.self) { range in
                let selected = range == selectedRange
                Button { selectedRange = range } label: {
                    Text(range)
                        .captionStyle().fontWeight(.medium)
                        .foregroundColor(selected ? AppColor.Button.primaryFg : AppColor.foreground)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, Space._1)
                        .background(selected ? AppColor.Button.primaryBg : Color.clear)
                        .clipShape(Capsule())
                }
                .buttonStyle(.plain)
            }
        }
        .padding(4)
        .background(AppColor.segmentedTrack)
        .clipShape(Capsule())
    }

    // MARK: - Geometry

    private func points(in size: CGSize) -> [CGPoint] {
        guard values.count > 1 else { return [] }
        let stepX = size.width / CGFloat(values.count - 1)
        return values.enumerated().map { i, v in
            CGPoint(x: CGFloat(i) * stepX, y: (1 - v) * size.height)
        }
    }

    private func linePath(_ pts: [CGPoint]) -> Path {
        Path { p in
            guard let first = pts.first else { return }
            p.move(to: first)
            pts.dropFirst().forEach { p.addLine(to: $0) }
        }
    }

    private func areaPath(_ pts: [CGPoint], height: CGFloat) -> Path {
        Path { p in
            guard let first = pts.first, let last = pts.last else { return }
            p.move(to: CGPoint(x: first.x, y: height))
            p.addLine(to: first)
            pts.dropFirst().forEach { p.addLine(to: $0) }
            p.addLine(to: CGPoint(x: last.x, y: height))
            p.closeSubpath()
        }
    }
}

/// Custody account performance card (web `.performance-card` on Overview and product details).
struct DepositPerformanceCard: View {
    var showsToolbar: Bool = false
    var initialRange: String = "Max"
    var onDetails: (() -> Void)?

    @State private var range: String

    init(
        showsToolbar: Bool = false,
        initialRange: String = "Max",
        onDetails: (() -> Void)? = nil
    ) {
        self.showsToolbar = showsToolbar
        self.initialRange = initialRange
        self.onDetails = onDetails
        _range = State(initialValue: initialRange)
    }

    var body: some View {
        VStack(alignment: .leading, spacing: Space._3) {
            if showsToolbar {
                toolbar
            }

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

    private var toolbar: some View {
        HStack(alignment: .center, spacing: Space._2) {
            Button {
                onDetails?()
            } label: {
                HStack(spacing: Space._3) {
                    Image("icon24-gitlab")
                        .renderingMode(.template)
                        .resizable()
                        .scaledToFit()
                        .frame(width: 24, height: 24)
                        .foregroundColor(AppColor.foreground)
                    Text("\(InvestmentProduct.depositName) - \(InvestmentProduct.depositNumber)")
                        .textSmall()
                        .fontWeight(.medium)
                        .foregroundColor(AppColor.foreground)
                        .lineLimit(1)
                }
            }
            .buttonStyle(.plain)

            Spacer(minLength: Space._2)

            if let onDetails {
                Button(action: onDetails) {
                    HStack(spacing: Space._1) {
                        Text("Details")
                            .font(AppFont.font(size: AppFont.Size.textSm, weight: .medium))
                        Image("icon24-arrow-right")
                            .renderingMode(.template)
                            .resizable()
                            .scaledToFit()
                            .frame(width: 24, height: 24)
                    }
                    .foregroundColor(AppColor.Button.tonalFg)
                    .padding(.horizontal, Space._2)
                    .frame(minHeight: 32)
                    .background(AppColor.Button.tonalBg)
                    .clipShape(RoundedRectangle(cornerRadius: Radius.small))
                }
                .buttonStyle(.plain)
            }
        }
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
}
