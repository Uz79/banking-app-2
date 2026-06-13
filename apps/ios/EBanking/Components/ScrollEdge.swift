import SwiftUI
#if canImport(UIKit)
import UIKit
#endif

/// Shared bottom-edge state so the tab bar (owned by MainTabView) can show its
/// content-indication shadow based on the active screen's scroll position.
final class ScrollEdgeModel: ObservableObject {
    @Published var bottomShadow = false

    func resetBottomShadow() {
        if bottomShadow { bottomShadow = false }
    }
}

private enum ContentIndicationShadowMetrics {
    /// Web token: `--shadow-content-indication-*` → 0 2px 32px (~0.125rem 2rem).
    static let radius: CGFloat = 32
    static let topOffsetY: CGFloat = 2
    static let bottomOffsetY: CGFloat = -2
}

/// Downward content-indication shadow under top chrome — visible when scrollable
/// content continues above the bar (`is-scroll-edge--after` on web).
struct TopChromeShadow: ViewModifier {
    let active: Bool

    func body(content: Content) -> some View {
        content
            .background(AppColor.backgroundSecondary)
            .compositingGroup()
            .shadow(
                color: active ? AppColor.contentIndicationShadow : .clear,
                radius: ContentIndicationShadowMetrics.radius,
                x: 0,
                y: ContentIndicationShadowMetrics.topOffsetY
            )
            .animation(.easeOut(duration: 0.18), value: active)
            .zIndex(1)
    }
}

/// Upward content-indication shadow above bottom chrome — visible when the user
/// has scrolled and more content sits below (`is-scroll-edge--before` on web).
struct BottomChromeShadow: ViewModifier {
    let active: Bool

    func body(content: Content) -> some View {
        content
            .compositingGroup()
            .shadow(
                color: active ? AppColor.contentIndicationShadow : .clear,
                radius: ContentIndicationShadowMetrics.radius,
                x: 0,
                y: ContentIndicationShadowMetrics.bottomOffsetY
            )
            .animation(.easeOut(duration: 0.18), value: active)
            .zIndex(1)
    }
}

extension View {
    func topChromeShadow(_ active: Bool) -> some View {
        modifier(TopChromeShadow(active: active))
    }

    func bottomChromeShadow(_ active: Bool) -> some View {
        modifier(BottomChromeShadow(active: active))
    }
}
