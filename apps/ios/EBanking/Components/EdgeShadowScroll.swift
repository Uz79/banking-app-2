import SwiftUI
#if canImport(UIKit)
import UIKit
#endif

/// Scroll edge state aligned with `apps/web/js/scroll-edge-chrome.js` and
/// `designs/interaction-patterns/scroll-boundary-indication`.
enum ScrollEdgeState {
    static func shadows(
        offsetY: CGFloat,
        contentHeight: CGFloat,
        viewportHeight: CGFloat
    ) -> (top: Bool, bottom: Bool) {
        let maxScroll = max(0, contentHeight - viewportHeight)
        let overflows = maxScroll > 1
        let atTop = offsetY <= 1
        let atBottom = maxScroll <= 1 || offsetY >= maxScroll - 1

        let top = overflows && !atTop
        // Bottom: show whenever content continues below chrome — including at scroll top
        // (designs/interaction-patterns/scroll-boundary-indication — mobile-bottom-indication).
        let bottom = overflows && !atBottom
        return (top, bottom)
    }
}

#if canImport(UIKit)

/// Finds the enclosing `UIScrollView` and reports offset + content metrics.
private struct ScrollOffsetTracker: UIViewRepresentable {
    var onStateChange: (Bool, Bool) -> Void

    func makeCoordinator() -> Coordinator {
        Coordinator(onStateChange: onStateChange)
    }

    func makeUIView(context: Context) -> ScrollOffsetTrackingView {
        let view = ScrollOffsetTrackingView()
        view.isUserInteractionEnabled = false
        view.isAccessibilityElement = false
        view.coordinator = context.coordinator
        return view
    }

    func updateUIView(_ uiView: ScrollOffsetTrackingView, context: Context) {
        context.coordinator.onStateChange = onStateChange
        uiView.coordinator = context.coordinator
        uiView.scheduleAttach()
    }

    final class Coordinator {
        var onStateChange: (Bool, Bool) -> Void
        private weak var scrollView: UIScrollView?
        private var observations: [NSKeyValueObservation] = []
        private var lastTop: Bool?
        private var lastBottom: Bool?
        private var pendingDispatch = false

        init(onStateChange: @escaping (Bool, Bool) -> Void) {
            self.onStateChange = onStateChange
        }

        func bind(to scrollView: UIScrollView) {
            guard scrollView !== self.scrollView else { return }

            observations.removeAll()
            self.scrollView = scrollView
            lastTop = nil
            lastBottom = nil

            observations = [
                scrollView.observe(\.contentOffset, options: [.new]) { [weak self] sv, _ in
                    self?.evaluate(sv)
                },
                scrollView.observe(\.contentSize, options: [.new]) { [weak self] sv, _ in
                    self?.evaluate(sv)
                },
                scrollView.observe(\.bounds, options: [.new]) { [weak self] sv, _ in
                    self?.evaluate(sv)
                }
            ]
            evaluate(scrollView)
        }

        private func evaluate(_ scrollView: UIScrollView) {
            let state = ScrollEdgeState.shadows(
                offsetY: scrollView.contentOffset.y,
                contentHeight: scrollView.contentSize.height,
                viewportHeight: scrollView.bounds.height
            )
            guard lastTop != state.top || lastBottom != state.bottom else { return }
            lastTop = state.top
            lastBottom = state.bottom
            schedulePublish(top: state.top, bottom: state.bottom)
        }

        /// Never publish `@Published` / `@Binding` during layout — defer one frame.
        private func schedulePublish(top: Bool, bottom: Bool) {
            guard !pendingDispatch else { return }
            pendingDispatch = true
            DispatchQueue.main.async { [weak self] in
                guard let self else { return }
                self.pendingDispatch = false
                self.onStateChange(top, bottom)
            }
        }

        deinit {
            observations.removeAll()
        }
    }

    final class ScrollOffsetTrackingView: UIView {
        weak var coordinator: Coordinator?
        private var attachScheduled = false

        override func didMoveToWindow() {
            super.didMoveToWindow()
            scheduleAttach()
        }

        func scheduleAttach() {
            guard !attachScheduled else { return }
            attachScheduled = true
            DispatchQueue.main.async { [weak self] in
                guard let self else { return }
                self.attachScheduled = false
                guard let coordinator, let scrollView = self.enclosingScrollView else { return }
                coordinator.bind(to: scrollView)
            }
        }
    }
}

private extension UIView {
    var enclosingScrollView: UIScrollView? {
        sequence(first: superview, next: { $0?.superview })
            .compactMap { $0 as? UIScrollView }
            .first
    }
}

#endif

/// A `ScrollView` that drives content-indication shadows on fixed chrome.
/// `topShadow` binds to the screen nav bar; bottom state is published on the
/// shared `ScrollEdgeModel` for the tab bar in `MainTabView`.
struct EdgeShadowScroll<Content: View>: View {
    @Binding var topShadow: Bool
    @ViewBuilder var content: Content

    @EnvironmentObject private var scrollEdge: ScrollEdgeModel

    var body: some View {
        ScrollView {
            content
                #if canImport(UIKit)
                .background {
                    ScrollOffsetTracker { top, bottom in
                        if topShadow != top { topShadow = top }
                        if scrollEdge.bottomShadow != bottom { scrollEdge.bottomShadow = bottom }
                    }
                }
                #endif
        }
    }
}
