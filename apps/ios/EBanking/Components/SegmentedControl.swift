import SwiftUI

/// Pill segmented control matching the web `.segmented` component.
/// Active option fills with the primary colour; the track uses a tonal surface.
struct SegmentedControl<Option: Hashable & Identifiable>: View {
    let options: [Option]
    @Binding var selection: Option
    let label: (Option) -> String

    var body: some View {
        HStack(spacing: 4) {
            ForEach(options) { option in
                let isSelected = option == selection
                Button {
                    withAnimation(.easeInOut(duration: 0.2)) { selection = option }
                } label: {
                    Text(label(option))
                        .font(AppFont.font(size: AppFont.Size.textSm, weight: .medium))
                        .foregroundColor(isSelected ? AppColor.Button.primaryFg : AppColor.foreground)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, Space._1)
                        .padding(.horizontal, Space._2)
                        .background(isSelected ? AppColor.Button.primaryBg : Color.clear)
                        .clipShape(Capsule())
                }
                .buttonStyle(.plain)
            }
        }
        .padding(4)
        .background(AppColor.segmentedTrack)
        .clipShape(Capsule())
    }
}
