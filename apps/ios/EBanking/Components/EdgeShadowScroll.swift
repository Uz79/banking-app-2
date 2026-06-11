import SwiftUI

private struct ScrollOffsetKey: PreferenceKey {
    static var defaultValue: CGFloat = 0
    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) { value = nextValue() }
}

/// A ScrollView that shows a subtle shadow under the (sticky) header once the
/// content scrolls beneath it — a "there is more content above" indicator,
/// mirroring the web `data-scroll-edge-nav` chrome.
struct EdgeShadowScroll<Content: View>: View {
    @ViewBuilder var content: Content
    @State private var scrolled = false

    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                GeometryReader { geo in
                    Color.clear.preference(
                        key: ScrollOffsetKey.self,
                        value: geo.frame(in: .named("edgeScroll")).minY
                    )
                }
                .frame(height: 0)

                content
            }
        }
        .coordinateSpace(name: "edgeScroll")
        .onPreferenceChange(ScrollOffsetKey.self) { value in
            let isScrolled = value < -1
            if isScrolled != scrolled { scrolled = isScrolled }
        }
        .overlay(alignment: .top) {
            LinearGradient(
                colors: [AppColor.foreground.opacity(0.12), AppColor.foreground.opacity(0)],
                startPoint: .top, endPoint: .bottom
            )
            .frame(height: 14)
            .opacity(scrolled ? 1 : 0)
            .animation(.easeOut(duration: 0.18), value: scrolled)
            .allowsHitTesting(false)
        }
    }
}
