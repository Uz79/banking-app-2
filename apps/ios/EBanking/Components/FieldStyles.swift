import SwiftUI

/// Bordered field outline that reflects focus: a 2px foreground ring when
/// focused, a 1px subtle stroke otherwise (mirrors web --color-input-stroke /
/// --color-input-stroke-focus).
struct FieldBorder: ViewModifier {
    let focused: Bool
    var radius: CGFloat = Radius.small

    func body(content: Content) -> some View {
        content.overlay(
            RoundedRectangle(cornerRadius: radius)
                .stroke(focused ? AppColor.foreground : AppColor.foregroundLabel,
                        lineWidth: focused ? 2 : 1)
        )
        .animation(.easeInOut(duration: 0.15), value: focused)
    }
}

extension View {
    func fieldBorder(focused: Bool, radius: CGFloat = Radius.small) -> some View {
        modifier(FieldBorder(focused: focused, radius: radius))
    }
}
