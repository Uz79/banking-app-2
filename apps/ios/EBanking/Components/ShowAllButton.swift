import SwiftUI

struct ShowAllButton: View {
    let label: String
    let action: () -> Void

    init(_ label: String, action: @escaping () -> Void = {}) {
        self.label = label
        self.action = action
    }

    var body: some View {
        Button(action: action) {
            HStack(spacing: Space._1) {
                Text(label)
                    .font(AppFont.font(size: AppFont.Size.textSm, weight: .medium))
                Image("icon24-arrow-right")
                    .renderingMode(.template)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 20, height: 20)
            }
            .foregroundColor(AppColor.foreground)
            .frame(maxWidth: .infinity, minHeight: 32)
            .background(AppColor.showAllBg)
            .clipShape(RoundedRectangle(cornerRadius: Radius.small))
        }
        .buttonStyle(.plain)
        .padding(.horizontal, Space._3)
        .padding(.vertical, Space._2)
    }
}
