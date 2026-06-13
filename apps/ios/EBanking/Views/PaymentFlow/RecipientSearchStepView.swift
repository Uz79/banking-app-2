import SwiftUI

// MARK: - Nav search field (web: `.recipient-search__field-wrap` in `.modal__nav-search`)

struct RecipientSearchField: View {
    @Binding var query: String
    @FocusState.Binding var focused: Bool

    var body: some View {
        HStack(spacing: Space._2) {
            Image("icon24-search")
                .renderingMode(.template)
                .resizable().scaledToFit()
                .frame(width: 24, height: 24)
                .foregroundColor(AppColor.foreground)

            TextField("Enter IBAN, name or account number", text: $query)
                .font(AppFont.font(size: AppFont.Size.textMd))
                .foregroundColor(AppColor.foreground)
                .focused($focused)
                .autocorrectionDisabled()
                #if os(iOS)
                .textInputAutocapitalization(.never)
                #endif

            if !query.isEmpty {
                Button { query = "" } label: {
                    Image("icon24-x-circle")
                        .renderingMode(.template)
                        .resizable().scaledToFit()
                        .frame(width: 24, height: 24)
                        .foregroundColor(AppColor.foreground)
                }
                .buttonStyle(.plain)
            }
        }
        .padding(.horizontal, Space._2)
        .padding(.vertical, Space._1)
        .background(AppColor.background)
        .clipShape(RoundedRectangle(cornerRadius: Radius.small))
        .fieldBorder(focused: focused, radius: Radius.small)
    }
}

// MARK: - Nav bar (web: `.modal--recipient-search-active` — search + close, no title/back)

struct RecipientSearchNavBar: View {
    @Binding var query: String
    @FocusState.Binding var searchFocused: Bool
    let onClose: () -> Void

    var body: some View {
        HStack(spacing: Space._2) {
            RecipientSearchField(query: $query, focused: $searchFocused)

            Button(action: onClose) {
                Image(systemName: "xmark")
                    .font(.system(size: 16, weight: .medium))
                    .foregroundColor(AppColor.foreground)
                    .frame(width: 44, height: 44)
            }
        }
        .padding(.leading, Space._3)
        .padding(.trailing, Space._2)
        .frame(height: 48)
    }
}

// MARK: - Step body (web: `data-step="recipient-search"`)

/// Type-ahead recipient search — the first step of the payment flow.
/// Mirrors the web `#pay/recipient-search` step: search in nav, recommended list below.
struct RecipientSearchStepView: View {
    let query: String
    let onSelect: (Recipient) -> Void

    private var trimmedQuery: String {
        query.trimmingCharacters(in: .whitespaces)
    }

    private var results: [Recipient] {
        let q = trimmedQuery.lowercased()
        guard !q.isEmpty else { return Recipient.directory }
        let compact = q.replacingOccurrences(of: " ", with: "")
        return Recipient.directory.filter { r in
            r.name.lowercased().contains(q) ||
            r.iban.lowercased().replacingOccurrences(of: " ", with: "").contains(compact)
        }
    }

    var body: some View {
        VStack(spacing: Space._3) {
            Text("Recommended recipients")
                .font(AppFont.font(size: AppFont.Size.textXs, weight: .medium))
                .foregroundColor(AppColor.foregroundSecondary)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal, Space._3)

            if results.isEmpty {
                emptyState
            } else {
                ScrollView {
                    VStack(spacing: 0) {
                        ForEach(results) { recipient in
                            Button { onSelect(recipient) } label: {
                                recipientRow(recipient)
                            }
                            .buttonStyle(.plain)

                            if recipient.id != results.last?.id {
                                Divider()
                                    .overlay(AppColor.separator)
                            }
                        }
                    }
                }
            }
        }
        .padding(.vertical, Space._3)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
        .background(AppColor.background)
    }

    private func recipientRow(_ recipient: Recipient) -> some View {
        HStack(spacing: Space._3) {
            Image(recipient.icon)
                .renderingMode(.template)
                .resizable().scaledToFit()
                .frame(width: 24, height: 24)
                .foregroundColor(AppColor.foreground)

            VStack(alignment: .leading, spacing: 0) {
                Text(recipient.name)
                    .textSmall().fontWeight(.medium)
                    .foregroundColor(AppColor.foreground)
                Text(recipient.iban)
                    .font(AppFont.font(size: AppFont.Size.textXs))
                    .foregroundColor(AppColor.foregroundSecondary)
            }

            Spacer(minLength: 0)

            Image("icon24-chevron-right")
                .renderingMode(.template)
                .resizable().scaledToFit()
                .frame(width: 24, height: 24)
                .foregroundColor(AppColor.foregroundSecondary)
        }
        .padding(.horizontal, Space._3)
        .padding(.vertical, Space._2)
        .contentShape(Rectangle())
    }

    private var emptyState: some View {
        Text("No recipients match your search.")
            .font(AppFont.font(size: AppFont.Size.textSm))
            .foregroundColor(AppColor.foregroundSecondary)
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
            .padding(.horizontal, Space._3)
    }
}

#Preview {
    @Previewable @State var query = ""
    @Previewable @FocusState var focused: Bool

    VStack(spacing: 0) {
        RecipientSearchNavBar(query: $query, searchFocused: $focused, onClose: {})
        RecipientSearchStepView(query: query, onSelect: { _ in })
    }
}
