import SwiftUI

/// Type-ahead recipient search — the first step of the payment flow.
/// Mirrors the web `#pay/recipient-search` step: search by name or IBAN,
/// pick a row, then continue to the recipient form.
struct RecipientSearchStepView: View {
    let onSelect: (Recipient) -> Void

    @State private var query: String = ""
    @FocusState private var searchFocused: Bool

    private var results: [Recipient] {
        let q = query.trimmingCharacters(in: .whitespaces).lowercased()
        guard !q.isEmpty else { return Recipient.directory }
        let compact = q.replacingOccurrences(of: " ", with: "")
        return Recipient.directory.filter { r in
            r.name.lowercased().contains(q) ||
            r.iban.lowercased().replacingOccurrences(of: " ", with: "").contains(compact)
        }
    }

    var body: some View {
        VStack(spacing: 0) {
            searchField
                .padding(.horizontal, Space._3)
                .padding(.top, Space._2)
                .padding(.bottom, Space._3)

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
                                Divider().padding(.leading, Space._3 + 24 + Space._3)
                            }
                        }
                    }
                    .background(AppColor.background)
                    .clipShape(RoundedRectangle(cornerRadius: Radius.regular))
                    .padding(.horizontal, Space._3)
                    .padding(.bottom, Space._4)
                }
            }
        }
        .background(AppColor.backgroundSecondary)
        .onAppear { searchFocused = true }
    }

    private var searchField: some View {
        HStack(spacing: Space._2) {
            Image("icon24-search")
                .renderingMode(.template)
                .resizable().scaledToFit()
                .frame(width: 20, height: 20)
                .foregroundColor(AppColor.foregroundSecondary)

            TextField("Search by name or IBAN", text: $query)
                .font(AppFont.font(size: AppFont.Size.textMd))
                .foregroundColor(AppColor.foreground)
                .focused($searchFocused)
                .autocorrectionDisabled()
                #if os(iOS)
                .textInputAutocapitalization(.never)
                #endif

            if !query.isEmpty {
                Button { query = "" } label: {
                    Image("icon24-x-circle")
                        .renderingMode(.template)
                        .resizable().scaledToFit()
                        .frame(width: 20, height: 20)
                        .foregroundColor(AppColor.foregroundSecondary)
                }
                .buttonStyle(.plain)
            }
        }
        .padding(.horizontal, Space._3)
        .padding(.vertical, Space._3)
        .background(AppColor.background)
        .clipShape(RoundedRectangle(cornerRadius: Radius.regular))
        .overlay(
            RoundedRectangle(cornerRadius: Radius.regular)
                .stroke(searchFocused ? AppColor.foreground : AppColor.separator,
                        lineWidth: searchFocused ? 2 : 1)
        )
    }

    private func recipientRow(_ recipient: Recipient) -> some View {
        HStack(spacing: Space._3) {
            Image(recipient.icon)
                .renderingMode(.template)
                .resizable().scaledToFit()
                .frame(width: 24, height: 24)
                .foregroundColor(AppColor.foreground)

            VStack(alignment: .leading, spacing: 4) {
                Text(recipient.name)
                    .textSmall().fontWeight(.medium)
                    .foregroundColor(AppColor.foreground)
                Text(recipient.iban)
                    .captionStyle()
                    .foregroundColor(AppColor.foregroundSecondary)
            }

            Spacer()

            Image("icon24-chevron-right")
                .renderingMode(.template)
                .resizable().scaledToFit()
                .frame(width: 20, height: 20)
                .foregroundColor(AppColor.foreground)
        }
        .padding(.horizontal, Space._3)
        .padding(.vertical, Space._3)
        .contentShape(Rectangle())
    }

    private var emptyState: some View {
        VStack(spacing: Space._2) {
            Spacer()
            Image("icon24-search")
                .renderingMode(.template)
                .resizable().scaledToFit()
                .frame(width: 40, height: 40)
                .foregroundColor(AppColor.foregroundDisabled)
            Text("No recipients found")
                .textSmall()
                .foregroundColor(AppColor.foregroundSecondary)
            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

#Preview {
    RecipientSearchStepView(onSelect: { _ in })
}
