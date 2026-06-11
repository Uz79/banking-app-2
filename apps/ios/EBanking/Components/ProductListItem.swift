import SwiftUI

struct ProductListItem: View {
    let icon: String
    let title: String
    let subtitle: String
    let currency: String
    let amount: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 0) {
                HStack(spacing: Space._3) {
                    Image(icon)
                        .renderingMode(.template)
                        .resizable()
                        .scaledToFit()
                        .frame(width: 24, height: 24)
                        .foregroundColor(AppColor.foreground)

                    VStack(alignment: .leading, spacing: 4) {
                        Text(title)
                            .textSmall()
                            .foregroundColor(AppColor.foreground)
                            .fontWeight(.medium)

                        Text(subtitle)
                            .captionStyle()
                            .foregroundColor(AppColor.foregroundSecondary)
                    }
                }

                Spacer()

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
            .padding(.horizontal, Space._3)
            .padding(.vertical, Space._2)
        }
        .buttonStyle(.plain)
    }
}
