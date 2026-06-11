import SwiftUI

struct CustomNavBar: View {
    let title: String
    var showBack: Bool = false
    var showClose: Bool = false
    var onBack: (() -> Void)?
    var onClose: (() -> Void)?
    /// Optional trailing button (shown when no close button is set), e.g. info.
    var trailingIcon: String?
    var onTrailing: (() -> Void)?

    var body: some View {
        ZStack {
            Text(title)
                .font(AppFont.font(size: AppFont.Size.textLg, weight: .medium))
                .foregroundColor(AppColor.foreground)

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
        .frame(height: 48)
    }
}
