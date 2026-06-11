import SwiftUI

struct OverviewView: View {
    @Binding var showPaymentFlow: Bool
    @Binding var showInternalTransfer: Bool
    @Binding var selectedRecipient: Recipient?

    @State private var selectedAccount: Account?
    @State private var showInvestment = false
    let group = AccountGroup.investments

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                CustomNavBar(title: "Overview")

                EdgeShadowScroll {
                    VStack(spacing: Space._4) {
                        ActionButtonsRow(onPay: {
                            selectedRecipient = nil
                            showPaymentFlow = true
                        }, onTransfer: {
                            showInternalTransfer = true
                        })

                        accountsSection
                        otherProductsSection
                        offersSection
                    }
                    .padding(.horizontal, Space._3)
                    .padding(.bottom, Space._6)
                }
            }
            .background(AppColor.backgroundSecondary)
            #if os(iOS)
            .navigationBarHidden(true)
            #endif
            .navigationDestination(item: $selectedAccount) { account in
                AccountDetailView(
                    account: account,
                    showPaymentFlow: $showPaymentFlow,
                    showInternalTransfer: $showInternalTransfer,
                    selectedRecipient: $selectedRecipient
                )
            }
            .navigationDestination(isPresented: $showInvestment) {
                InvestmentProductDetailsView()
            }
        }
    }

    // MARK: - Accounts & Investment

    private var accountsSection: some View {
        SectionCard(
            title: group.title,
            currency: group.currency,
            totalAmount: group.formattedTotal
        ) {
            ForEach(group.accounts) { account in
                ProductListItem(
                    icon: account.icon,
                    title: account.name,
                    subtitle: account.formattedIBAN,
                    currency: account.currency,
                    amount: account.formattedBalance
                ) {
                    if account.id == "3" {   // Deposit → investment product
                        showInvestment = true
                    } else {
                        selectedAccount = account
                    }
                }

                if account.id != group.accounts.last?.id {
                    Divider()
                        .padding(.horizontal, Space._3)
                }
            }
        }
    }

    // MARK: - Other Products

    private var otherProductsSection: some View {
        let product = OtherProduct.visaGold
        return SectionCard(title: "Other products") {
            HStack(spacing: Space._3) {
                Image(product.icon)
                    .renderingMode(.template)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 24, height: 24)
                    .foregroundColor(AppColor.foreground)

                VStack(alignment: .leading, spacing: 4) {
                    Text(product.name)
                        .textSmall()
                        .foregroundColor(AppColor.foreground)
                        .fontWeight(.medium)
                    Text(product.subtitle)
                        .captionStyle()
                        .foregroundColor(AppColor.foregroundSecondary)
                }

                Spacer()

                HStack(spacing: 6) {
                    Text("Limit")
                        .captionStyle()
                        .foregroundColor(AppColor.foregroundSecondary)
                    Text(product.limitCurrency)
                        .captionStyle()
                        .foregroundColor(AppColor.foregroundSecondary)
                    Text(formatAmount(product.limit))
                        .textSmall()
                        .fontWeight(.medium)
                        .foregroundColor(AppColor.foreground)
                }
            }
            .padding(.horizontal, Space._3)
            .padding(.vertical, Space._2)
        }
    }

    // MARK: - Offers

    private var offersSection: some View {
        SectionCard(title: "Offers") {
            VStack(spacing: 0) {
                ListItemRow(icon: "icon24-home", title: "Accounts",
                            subtitle: "Private & saving accounts")
                Divider().padding(.horizontal, Space._3)
                ListItemRow(icon: "icon24-credit-card", title: "Cards",
                            subtitle: "Order NEW cards, monitor")
                Divider().padding(.horizontal, Space._3)
                ListItemRow(icon: "icon24-trending-up", title: "Investment",
                            subtitle: "Fonds, trading, asset management")
            }

            ShowAllButton("Show all")
                .background(AppColor.showAllBg)
                .clipShape(RoundedRectangle(cornerRadius: Radius.small))
                .padding(.horizontal, Space._3)
        }
    }
}

#Preview {
    OverviewView(
        showPaymentFlow: .constant(false),
        showInternalTransfer: .constant(false),
        selectedRecipient: .constant(nil)
    )
}
