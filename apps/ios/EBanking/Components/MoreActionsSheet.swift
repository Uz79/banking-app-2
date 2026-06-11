import SwiftUI

struct MoreAction: Identifiable {
    let id = UUID()
    let icon: String
    let label: String
    let action: () -> Void
    var enabled: Bool = true
}

/// Bottom-sheet contextual menu opened by the "More" quick action.
struct MoreActionsSheet: View {
    let actions: [MoreAction]
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        sheetScaffold(title: "More actions") {
            ForEach(actions) { item in
                Button {
                    dismiss()
                    // Let the sheet finish dismissing before triggering a flow
                    // so a follow-on full-screen cover presents cleanly.
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
                        item.action()
                    }
                } label: {
                    HStack(spacing: Space._3) {
                        Image(item.icon)
                            .renderingMode(.template).resizable().scaledToFit()
                            .frame(width: 24, height: 24)
                            .foregroundColor(item.enabled ? AppColor.foreground : AppColor.foregroundDisabled)
                        Text(item.label)
                            .textSmall().fontWeight(.medium)
                            .foregroundColor(item.enabled ? AppColor.foreground : AppColor.foregroundDisabled)
                        Spacer()
                        Image("icon24-chevron-right")
                            .renderingMode(.template).resizable().scaledToFit()
                            .frame(width: 20, height: 20)
                            .foregroundColor(AppColor.foregroundSecondary)
                    }
                    .padding(.horizontal, Space._3)
                    .padding(.vertical, Space._3)
                    .contentShape(Rectangle())
                }
                .buttonStyle(.plain)
                .disabled(!item.enabled)

                if item.id != actions.last?.id {
                    Divider().padding(.leading, Space._3 + 24 + Space._3)
                }
            }
        }
    }
}
