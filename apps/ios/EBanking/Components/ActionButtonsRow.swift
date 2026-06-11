import SwiftUI

struct CircularActionButton: View {
    let icon: String
    let label: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 12) {
                ZStack {
                    Circle()
                        .fill(AppColor.Button.primaryBg)
                        .frame(width: 48, height: 48)

                    Image(icon)
                        .renderingMode(.template)
                        .resizable()
                        .scaledToFit()
                        .frame(width: 24, height: 24)
                        .foregroundColor(AppColor.Button.primaryFg)
                }

                Text(label)
                    .captionStyle()
                    .foregroundColor(AppColor.foreground)
                    .multilineTextAlignment(.center)
                    .lineLimit(2)
                    .frame(width: 64)
            }
        }
    }
}

struct ActionButtonsRow: View {
    let showMore: Bool
    let onScan: () -> Void
    let onPay: () -> Void
    let onTransfer: () -> Void
    let onMore: (() -> Void)?

    init(showMore: Bool = false,
         onScan: @escaping () -> Void = {},
         onPay: @escaping () -> Void = {},
         onTransfer: @escaping () -> Void = {},
         onMore: (() -> Void)? = nil) {
        self.showMore = showMore
        self.onScan = onScan
        self.onPay = onPay
        self.onTransfer = onTransfer
        self.onMore = onMore
    }

    var body: some View {
        HStack(alignment: .top, spacing: showMore ? 24 : 32) {
            CircularActionButton(icon: "icon24-camera", label: "Scan", action: onScan)
            CircularActionButton(icon: "icon24-plus", label: "Pay", action: onPay)
            CircularActionButton(icon: "icon24-repeat", label: "Internal\nTransfer", action: onTransfer)
            if showMore {
                CircularActionButton(icon: "icon24-more-horizontal", label: "More", action: onMore ?? {})
            }
        }
        .padding(.vertical, Space._2)
    }
}
