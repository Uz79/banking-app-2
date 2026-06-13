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
    var onClose: () -> Void

    @Environment(\.scrimSheetDismiss) private var dismissAnimated

    var body: some View {
        sheetScaffold(title: "More actions", onClose: close, fitted: true) {
            ForEach(actions) { item in
                Button {
                    close()
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.22) {
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
                        Spacer(minLength: 0)
                    }
                    .padding(.horizontal, Space._3)
                    .padding(.vertical, Space._2)
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

    private func close() {
        if let dismissAnimated {
            dismissAnimated()
        } else {
            onClose()
        }
    }
}
