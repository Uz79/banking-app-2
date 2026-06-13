import SwiftUI

struct ListItemRow: View {
    let icon: String
    let title: String
    let subtitle: String?
    let showChevron: Bool
    let action: () -> Void

    init(icon: String, title: String, subtitle: String? = nil,
         showChevron: Bool = true, action: @escaping () -> Void = {}) {
        self.icon = icon
        self.title = title
        self.subtitle = subtitle
        self.showChevron = showChevron
        self.action = action
    }

    var body: some View {
        Button(action: action) {
            HStack(spacing: Space._3) {
                Image(icon)
                    .renderingMode(.template)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 24, height: 24)
                    .foregroundColor(AppColor.foreground)

                VStack(alignment: .leading, spacing: Space._1) {
                    Text(title)
                        .textSmall()
                        .foregroundColor(AppColor.foreground)
                        .fontWeight(.medium)

                    if let subtitle, !subtitle.isEmpty {
                        Text(subtitle)
                            .captionStyle()
                            .foregroundColor(AppColor.foregroundSecondary)
                    }
                }

                Spacer()

                if showChevron {
                    Image("icon24-chevron-right")
                        .renderingMode(.template)
                        .resizable()
                        .scaledToFit()
                        .frame(width: 20, height: 20)
                        .foregroundColor(AppColor.foreground)
                }
            }
            .padding(.horizontal, Space._3)
            .padding(.vertical, Space._2)
        }
        .buttonStyle(.plain)
    }
}
