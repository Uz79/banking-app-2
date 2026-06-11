import SwiftUI

struct RecipientStepView: View {
    @Binding var draft: PaymentDraft
    let onConfirm: () -> Void

    @State private var iban: String = ""
    @State private var bankName: String = ""
    @State private var recipientName: String = ""
    @State private var street: String = ""
    @State private var city: String = ""
    @State private var country: String = "Switzerland"
    @State private var showCountryPicker = false

    enum Field: Hashable { case name, street, city }
    @FocusState private var focus: Field?

    private let countries = ["Switzerland", "Germany", "Austria", "France", "Italy", "Liechtenstein"]

    var body: some View {
        VStack(spacing: 0) {
            ScrollView {
                VStack(alignment: .leading, spacing: Space._4) {
                    readOnlyField(label: "IBAN", value: iban, icon: "icon24-edit-2")
                    readOnlyField(label: "Bank Name", value: bankName)

                    borderedField(label: "Recipient name", text: $recipientName, field: .name)
                    borderedField(label: "Street and number", text: $street, field: .street)
                    borderedField(label: "City and postal code", text: $city, field: .city)

                    VStack(alignment: .leading, spacing: Space._1) {
                        Text("Country")
                            .textSmall()
                            .foregroundColor(AppColor.foregroundSecondary)

                        Button { showCountryPicker = true } label: {
                            HStack {
                                Text(country)
                                    .font(AppFont.font(size: AppFont.Size.textMd, weight: .regular))
                                    .foregroundColor(AppColor.foreground)

                                Spacer()

                                Image("icon24-chevron-down")
                                    .renderingMode(.template)
                                    .resizable()
                                    .scaledToFit()
                                    .frame(width: 20, height: 20)
                                    .foregroundColor(AppColor.foreground)
                            }
                            .padding(.horizontal, Space._2)
                            .padding(.vertical, Space._2)
                            .fieldBorder(focused: false)
                        }
                        .buttonStyle(.plain)
                    }
                }
                .padding(.horizontal, Space._3)
                .padding(.top, Space._2)
            }

            confirmButton
        }
        .background(AppColor.background)
        .onAppear { prefill() }
        .sheet(isPresented: $showCountryPicker) {
            OptionPickerSheet(
                title: "Country",
                options: countries,
                selected: country,
                onSelect: { country = $0 }
            )
        }
    }

    private func prefill() {
        guard let r = draft.recipient else {
            iban = ""
            bankName = ""
            recipientName = ""
            street = ""
            city = ""
            country = "Switzerland"
            return
        }
        iban = r.iban
        bankName = r.bankName
        recipientName = r.name
        street = r.street
        city = r.city
        country = r.country
    }

    private func readOnlyField(label: String, value: String, icon: String? = nil) -> some View {
        VStack(alignment: .leading, spacing: Space._1) {
            Text(label)
                .textSmall()
                .foregroundColor(AppColor.foregroundSecondary)

            HStack {
                Text(value.isEmpty ? " " : value)
                    .font(AppFont.font(size: AppFont.Size.textMd, weight: .regular))
                    .foregroundColor(AppColor.foreground)

                Spacer()

                if let icon {
                    Image(icon)
                        .renderingMode(.template)
                        .resizable()
                        .scaledToFit()
                        .frame(width: 20, height: 20)
                        .foregroundColor(AppColor.foregroundSecondary)
                }
            }
            .padding(.bottom, Space._1)
            .overlay(
                Rectangle()
                    .frame(height: 1)
                    .foregroundColor(AppColor.separator),
                alignment: .bottom
            )
        }
    }

    private func borderedField(label: String, text: Binding<String>, field: Field) -> some View {
        VStack(alignment: .leading, spacing: Space._1) {
            Text(label)
                .textSmall()
                .foregroundColor(AppColor.foregroundSecondary)

            TextField("", text: text)
                .font(AppFont.font(size: AppFont.Size.textMd, weight: .regular))
                .foregroundColor(AppColor.foreground)
                .focused($focus, equals: field)
                .padding(.horizontal, Space._2)
                .padding(.vertical, Space._2)
                .fieldBorder(focused: focus == field)
        }
    }

    private var confirmButton: some View {
        Button(action: {
            if draft.recipient == nil {
                draft.recipient = Recipient(
                    id: UUID().uuidString, name: recipientName,
                    iban: iban, bankName: bankName,
                    street: street, city: city, country: country,
                    subtitle: "", icon: "person"
                )
            }
            onConfirm()
        }) {
            Text("Confirm")
                .font(AppFont.font(size: AppFont.Size.textMd, weight: .medium))
                .foregroundColor(AppColor.Button.primaryFg)
                .frame(maxWidth: .infinity)
                .padding(.vertical, Space._3)
                .background(AppColor.Button.primaryBg)
                .clipShape(RoundedRectangle(cornerRadius: Radius.regular))
        }
        .padding(.horizontal, Space._3)
        .padding(.bottom, Space._4)
    }
}

#Preview {
    RecipientStepView(
        draft: .constant(PaymentDraft(recipient: .hansMeyer)),
        onConfirm: {}
    )
}
