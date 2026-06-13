import SwiftUI

struct SectionCard<Content: View>: View {
    let title: String
    let currency: String?
    let totalAmount: String?
    let content: Content

    init(title: String,
         currency: String? = nil,
         totalAmount: String? = nil,
         @ViewBuilder content: () -> Content) {
        self.title = title
        self.currency = currency
        self.totalAmount = totalAmount
        self.content = content()
    }

    var body: some View {
        VStack(alignment: .leading, spacing: SectionCardMetrics.headerToBody) {
            HStack {
                Text(title)
                    .textSmall()
                    .foregroundColor(AppColor.foregroundSecondary)

                Spacer()

                if let currency, let totalAmount {
                    HStack(spacing: 6) {
                        Text(currency)
                            .captionStyle()
                            .foregroundColor(AppColor.foregroundSecondary)
                        Text(totalAmount)
                            .textSmall()
                            .fontWeight(.medium)
                            .foregroundColor(AppColor.foreground)
                    }
                }
            }
            .padding(.horizontal, Space._3)

            VStack(alignment: .leading, spacing: 0) {
                content
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(AppColor.background)
            .clipShape(RoundedRectangle(cornerRadius: Radius.regular))
        }
    }
}

struct SectionHeader: View {
    let title: String
    let currency: String?
    let amount: String?

    init(_ title: String, currency: String? = nil, amount: String? = nil) {
        self.title = title
        self.currency = currency
        self.amount = amount
    }

    var body: some View {
        HStack {
            Text(title)
                .textSmall()
                .foregroundColor(AppColor.foregroundSecondary)

            Spacer()

            if let currency, let amount {
                HStack(spacing: 6) {
                    Text(currency)
                        .captionStyle()
                        .foregroundColor(AppColor.foregroundSecondary)
                    Text(amount)
                        .textSmall()
                        .fontWeight(.medium)
                        .foregroundColor(AppColor.foreground)
                }
            }
        }
    }
}

// MARK: - Data card (section-card my-positions / key-figures)

/// Bordered card with title + Details action inside the card body
/// (`.section-card__inline-header` — not the external Overview header pattern).
struct DataCard<Content: View>: View {
    let title: String
    var onDetails: () -> Void = {}
    @ViewBuilder let content: () -> Content

    var body: some View {
        VStack(spacing: 0) {
            HStack(alignment: .center, spacing: Space._2) {
                Text(title)
                    .font(AppFont.font(size: AppFont.Size.textMd, weight: .bold))
                    .foregroundColor(AppColor.foreground)

                Spacer(minLength: Space._2)

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
            .padding(.horizontal, Space._3)
            .padding(.top, Space._3)
            .padding(.bottom, Space._1)

            VStack(spacing: 0) {
                content()
            }
            .padding(.horizontal, Space._3)
            .padding(.bottom, Space._3)
        }
        .background(AppColor.background)
        .clipShape(RoundedRectangle(cornerRadius: Radius.regular))
    }
}

struct DataCardRow: View {
    let label: String
    let value: String

    var body: some View {
        HStack(alignment: .firstTextBaseline, spacing: Space._3) {
            Text(label)
                .textSmall()
                .foregroundColor(AppColor.foregroundSecondary)
            Spacer(minLength: Space._3)
            Text(value)
                .textSmall()
                .foregroundColor(AppColor.foreground)
                .multilineTextAlignment(.trailing)
        }
        .padding(.vertical, Space._2)
    }
}
