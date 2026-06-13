import SwiftUI

struct CustomNavBar: View {
    let title: String
    var subtitle: String? = nil
    var showBack: Bool = false
    var showClose: Bool = false
    var onBack: (() -> Void)?
    var onClose: (() -> Void)?
    /// Optional trailing button (shown when no close button is set), e.g. info.
    var trailingIcon: String?
    var onTrailing: (() -> Void)?

    private var navHeight: CGFloat { subtitle == nil ? 48 : 56 }

    var body: some View {
        ZStack {
            VStack(spacing: 2) {
                Text(title)
                    .font(AppFont.font(size: AppFont.Size.textLg, weight: .medium))
                    .foregroundColor(AppColor.foreground)
                    .lineLimit(1)

                if let subtitle {
                    Text(subtitle)
                        .font(AppFont.font(size: AppFont.Size.textXs))
                        .foregroundColor(AppColor.foregroundSecondary)
                        .lineLimit(1)
                }
            }
            .frame(maxWidth: .infinity)
            .padding(.horizontal, 52)

            HStack {
                if showBack, let onBack {
                    Button(action: onBack) {
                        Image(systemName: "arrow.left")
                            .font(.system(size: 18, weight: .medium))
                            .foregroundColor(AppColor.foreground)
                            .frame(width: 44, height: 44)
                    }
                } else {
                    Spacer().frame(width: 44)
                }

                Spacer()

                if showClose, let onClose {
                    Button(action: onClose) {
                        Image(systemName: "xmark")
                            .font(.system(size: 16, weight: .medium))
                            .foregroundColor(AppColor.foreground)
                            .frame(width: 44, height: 44)
                    }
                } else if let trailingIcon, let onTrailing {
                    Button(action: onTrailing) {
                        Image(trailingIcon)
                            .renderingMode(.template)
                            .resizable().scaledToFit()
                            .frame(width: 24, height: 24)
                            .foregroundColor(AppColor.foreground)
                            .frame(width: 44, height: 44)
                    }
                } else {
                    Spacer().frame(width: 44)
                }
            }
        }
        .padding(.horizontal, Space._1)
        .frame(height: navHeight)
    }
}
