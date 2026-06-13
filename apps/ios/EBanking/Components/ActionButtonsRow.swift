import SwiftUI

// MARK: - standard-button / secondary (designs/components/button/standard-button)

enum StandardButtonSize {
    case small
    case regular

    /// SVG: small-secondary 32×32dp; regular-secondary 40dp tall.
    var minHeight: CGFloat {
        switch self {
        case .small: 32
        case .regular: 40
        }
    }

    var horizontalPadding: CGFloat {
        switch self {
        case .small: Space._2
        case .regular: Space._3
        }
    }

    var fontSize: CGFloat {
        switch self {
        case .small: AppFont.Size.textSm
        case .regular: AppFont.Size.textMd
        }
    }
}

private struct SecondaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .background {
                RoundedRectangle(cornerRadius: Radius.small, style: .continuous)
                    .fill(configuration.isPressed
                          ? AppColor.Button.secondaryBgPressed
                          : AppColor.Button.secondaryBg)
            }
            .overlay {
                RoundedRectangle(cornerRadius: Radius.small, style: .continuous)
                    .stroke(AppColor.Button.secondaryBorder, lineWidth: 1)
            }
            .animation(.easeInOut(duration: 0.15), value: configuration.isPressed)
    }
}

/// Secondary standard button — mirrors web `.uz-btn.uz-btn--secondary` and
/// `standard-button/*-secondary` SVGs (rounded rect, 1px border, not pill).
struct SecondaryButton: View {
    let title: String
    var size: StandardButtonSize = .small
    var expands: Bool = true
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(AppFont.font(size: size.fontSize, weight: .medium))
                .foregroundColor(AppColor.Button.secondaryFg)
                .frame(maxWidth: expands ? .infinity : nil)
                .frame(minHeight: size.minHeight)
                .padding(.horizontal, size.horizontalPadding)
        }
        .buttonStyle(SecondaryButtonStyle())
    }
}

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
