import SwiftUI

/// Bottom-sheet account picker (contextual menu replacement).
struct AccountPickerSheet: View {
    let title: String
    let accounts: [Account]
    let selectedID: String
    let onSelect: (Account) -> Void
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        sheetScaffold(title: title) {
            ForEach(accounts) { account in
                Button {
                    onSelect(account)
                    dismiss()
                } label: {
                    HStack(spacing: Space._3) {
                        Image(account.icon)
                            .renderingMode(.template).resizable().scaledToFit()
                            .frame(width: 24, height: 24)
                            .foregroundColor(AppColor.foreground)
                        VStack(alignment: .leading, spacing: 4) {
                            Text(account.name)
                                .textSmall().fontWeight(.medium)
                                .foregroundColor(AppColor.foreground)
                            Text(account.formattedIBAN)
                                .captionStyle()
                                .foregroundColor(AppColor.foregroundSecondary)
                        }
                        Spacer()
                        HStack(spacing: 6) {
                            Text(account.currency).captionStyle()
                                .foregroundColor(AppColor.foregroundSecondary)
                            Text(account.formattedBalance)
                                .textSmall().fontWeight(.bold)
                                .foregroundColor(AppColor.foreground)
                        }
                        if account.id == selectedID {
                            Image("icon24-check")
                                .renderingMode(.template).resizable().scaledToFit()
                                .frame(width: 20, height: 20)
                                .foregroundColor(AppColor.foreground)
                        }
                    }
                    .padding(.horizontal, Space._3)
                    .padding(.vertical, Space._3)
                    .contentShape(Rectangle())
                }
                .buttonStyle(.plain)

                if account.id != accounts.last?.id {
                    Divider().padding(.horizontal, Space._3)
                }
            }
        }
    }
}

/// Bottom-sheet picker for a simple list of string options.
struct OptionPickerSheet: View {
    let title: String
    let options: [String]
    let selected: String
    let onSelect: (String) -> Void
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        sheetScaffold(title: title) {
            ForEach(options, id: \.self) { option in
                Button {
                    onSelect(option)
                    dismiss()
                } label: {
                    HStack {
                        Text(option)
                            .textSmall().fontWeight(.medium)
                            .foregroundColor(AppColor.foreground)
                        Spacer()
                        if option == selected {
                            Image("icon24-check")
                                .renderingMode(.template).resizable().scaledToFit()
                                .frame(width: 20, height: 20)
                                .foregroundColor(AppColor.foreground)
                        }
                    }
                    .padding(.horizontal, Space._3)
                    .padding(.vertical, Space._3)
                    .contentShape(Rectangle())
                }
                .buttonStyle(.plain)

                if option != options.last {
                    Divider().padding(.horizontal, Space._3)
                }
            }
        }
    }
}

/// Shared sheet chrome: grabber + title + scrollable content, themed.
@ViewBuilder
func sheetScaffold<Content: View>(title: String, @ViewBuilder content: () -> Content) -> some View {
    VStack(spacing: 0) {
        Text(title)
            .font(AppFont.font(size: AppFont.Size.textLg, weight: .medium))
            .foregroundColor(AppColor.foreground)
            .frame(maxWidth: .infinity)
            .padding(.top, Space._4)
            .padding(.bottom, Space._3)

        ScrollView {
            VStack(spacing: 0) { content() }
                .padding(.bottom, Space._4)
        }
    }
    .background(AppColor.background)
    .modifier(SheetSizing())
}

/// Apply medium/large detents + drag indicator on iOS.
private struct SheetSizing: ViewModifier {
    func body(content: Content) -> some View {
        #if os(iOS)
        content
            .presentationDetents([.medium, .large])
            .presentationDragIndicator(.visible)
        #else
        content
        #endif
    }
}
