import SwiftUI

// MARK: - basic dialog (designs/components/dialog/variants/basic)

/// Centered alert-style dialog on a scrim — mirrors web `.basic-dialog-payment-exit`.
struct BasicDialogSurface<Actions: View>: View {
    let title: String
    let message: String
    @ViewBuilder let actions: () -> Actions

    var body: some View {
        VStack(spacing: 0) {
            Text(title)
                .font(AppFont.font(size: AppFont.Size.textLg, weight: .medium))
                .foregroundColor(AppColor.foreground)
                .multilineTextAlignment(.center)
                .frame(maxWidth: .infinity)
                .padding(.bottom, Space._2)

            Text(message)
                .font(AppFont.font(size: AppFont.Size.textMd, weight: .regular))
                .foregroundColor(AppColor.foregroundSecondary)
                .multilineTextAlignment(.center)
                .lineSpacing(4)
                .frame(maxWidth: .infinity)
                .padding(.bottom, Space._3)

            VStack(spacing: Space._3) {
                actions()
            }
        }
        .padding(.vertical, Space._3)
        .padding(.horizontal, Space._3)
        .background(AppColor.background)
        .clipShape(RoundedRectangle(cornerRadius: Radius.regular, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: Radius.regular, style: .continuous)
                .stroke(AppColor.separator, lineWidth: 1)
        }
        .shadow(color: AppColor.foreground.opacity(0.12), radius: 16, y: 8)
        .frame(maxWidth: 360)
    }
}

/// Primary block button — mirrors web `.uz-btn.uz-btn--primary.uz-btn--block`.
struct PrimaryBlockButton: View {
    let title: String
    var size: StandardButtonSize = .regular
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(AppFont.font(size: size.fontSize, weight: .medium))
                .foregroundColor(AppColor.Button.primaryFg)
                .frame(maxWidth: .infinity)
                .frame(minHeight: size.minHeight)
                .padding(.horizontal, size.horizontalPadding)
                .background(AppColor.Button.primaryBg)
                .clipShape(RoundedRectangle(cornerRadius: Radius.small, style: .continuous))
        }
        .buttonStyle(.plain)
    }
}

/// Payment-flow exit confirmation — mirrors web `payment-exit-confirm.js`.
struct PaymentExitConfirmDialog: View {
    let onContinue: () -> Void
    let onDiscard: () -> Void

    var body: some View {
        BasicDialogSurface(
            title: "Discard payment?",
            message: "You have not finished this payment. If you exit now your entries will not be submitted."
        ) {
            SecondaryButton(title: "Continue payment", size: .regular, action: onContinue)
            PrimaryBlockButton(title: "Discard", action: onDiscard)
        }
    }
}

/// Internal transfer exit confirmation — mirrors web `iat-overlay.js` promptExit.
struct TransferExitConfirmDialog: View {
    let onContinue: () -> Void
    let onDiscard: () -> Void

    var body: some View {
        BasicDialogSurface(
            title: "Discard transfer?",
            message: "You have not finished this transfer. If you exit now your entries will not be submitted."
        ) {
            SecondaryButton(title: "Continue transfer", size: .regular, action: onContinue)
            PrimaryBlockButton(title: "Discard", action: onDiscard)
        }
    }
}

/// Presents a centered basic dialog over a scrim.
struct BasicDialogOverlay<Dialog: View>: View {
    @Binding var isPresented: Bool
    var onScrimTap: (() -> Void)?
    @ViewBuilder let dialog: () -> Dialog

    var body: some View {
        if isPresented {
            ZStack {
                AppColor.overlayScrim
                    .ignoresSafeArea()
                    .onTapGesture {
                        if let onScrimTap {
                            onScrimTap()
                        } else {
                            isPresented = false
                        }
                    }

                dialog()
                    .padding(.horizontal, Space._3)
            }
            .transition(.opacity)
            .zIndex(200)
        }
    }
}
