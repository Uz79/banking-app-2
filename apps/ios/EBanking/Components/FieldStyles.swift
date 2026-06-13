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

// MARK: - Bordered text field (web: `.form-field__text-wrap` + `.form-field__clear`)

struct BorderedFormField<Field: Hashable>: View {
    let label: String
    @Binding var text: String
    var focus: FocusState<Field?>.Binding
    var field: Field

    var body: some View {
        VStack(alignment: .leading, spacing: Space._1) {
            Text(label)
                .textSmall()
                .foregroundColor(AppColor.foregroundSecondary)

            HStack(spacing: Space._2) {
                TextField("", text: $text)
                    .font(AppFont.font(size: AppFont.Size.textMd, weight: .regular))
                    .foregroundColor(AppColor.foreground)
                    .focused(focus, equals: field)

                Button {
                    text = ""
                } label: {
                    Image("icon24-x-circle")
                        .renderingMode(.template)
                        .resizable()
                        .scaledToFit()
                        .frame(width: 24, height: 24)
                        .foregroundColor(AppColor.foreground)
                }
                .buttonStyle(.plain)
                .frame(width: 32, height: 32)
                .opacity(focus.wrappedValue == field && !text.isEmpty ? 1 : 0)
                .allowsHitTesting(focus.wrappedValue == field && !text.isEmpty)
                .accessibilityLabel("Clear \(label)")
            }
            .padding(.horizontal, Space._2)
            .padding(.vertical, Space._1)
            .fieldBorder(focused: focus.wrappedValue == field)
        }
    }
}
