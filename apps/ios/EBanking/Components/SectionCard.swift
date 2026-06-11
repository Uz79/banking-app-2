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
        VStack(alignment: .leading, spacing: Space._1) {
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
            .padding(.vertical, Space._2)
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
