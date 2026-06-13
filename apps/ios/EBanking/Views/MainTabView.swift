import SwiftUI

struct MainTabView: View {
    // Persisted so the selected tab survives the rebuild triggered when the
    // Legibility (font scale) setting changes.
    @SceneStorage("uzBankIOSSelectedTab") private var selectedTab = 0
    @StateObject private var tabBar = TabBarCoordinator()
    @State private var showPaymentFlow = false
    @State private var showInternalTransfer = false
    @State private var selectedRecipient: Recipient?
    @StateObject private var scrollEdge = ScrollEdgeModel()
    @StateObject private var scrimSheetCenter = ScrimSheetCenter()

    /// Tab index shown as selected in the bar, or nil when a child screen is open.
    private var highlightedTab: Int? {
        if selectedTab == 0 && !tabBar.highlightsOverviewTab { return nil }
        return selectedTab
    }

    var body: some View {
        VStack(spacing: 0) {
            ZStack {
                switch selectedTab {
                case 0:
                    OverviewView(
                        showPaymentFlow: $showPaymentFlow,
                        showInternalTransfer: $showInternalTransfer,
                        selectedRecipient: $selectedRecipient
                    )
                case 1:
                    PaymentsView(
                        showPaymentFlow: $showPaymentFlow,
                        showInternalTransfer: $showInternalTransfer,
                        selectedRecipient: $selectedRecipient
                    )
                default:
                    ProfileView()
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)

            customTabBar
                .bottomChromeShadow(scrollEdge.bottomShadow)
        }
        .overlay { ScrimSheetHost(center: scrimSheetCenter) }
        .environment(\.scrimSheetCenter, scrimSheetCenter)
        .environmentObject(tabBar)
        .environmentObject(scrollEdge)
        .onChange(of: selectedTab) { _, _ in
            scrollEdge.resetBottomShadow()
        }
        .ignoresSafeArea(.container, edges: .bottom)
        #if os(iOS)
        .fullScreenCover(isPresented: $showPaymentFlow) {
            PaymentFlowView(
                isPresented: $showPaymentFlow,
                prefilledRecipient: selectedRecipient
            )
        }
        .fullScreenCover(isPresented: $showInternalTransfer) {
            InternalTransferView(isPresented: $showInternalTransfer)
        }
        #endif
    }

    private var customTabBar: some View {
        HStack(spacing: 0) {
            tabItem(icon: "icon24-home", label: "Overview", index: 0)
            tabItem(icon: "icon24-payments", label: "Payments", index: 1)
            tabItem(icon: "icon24-user", label: "Profile", index: 2)
        }
        .padding(.top, Space._2)
        .padding(.bottom, Space._4)
        .background(AppColor.background)
    }

    private func tabItem(icon: String, label: String, index: Int) -> some View {
        let isSelected = highlightedTab == index
        return Button(action: { selectTab(index) }) {
            VStack(spacing: 6) {
                ZStack {
                    if isSelected {
                        Circle()
                            .fill(AppColor.backgroundSecondary)
                            .frame(width: 44, height: 44)
                    }

                    Image(icon)
                        .renderingMode(.template)
                        .resizable()
                        .scaledToFit()
                        .frame(width: 24, height: 24)
                        .foregroundColor(AppColor.foreground)
                }
                .frame(height: 44)

                Text(label)
                    .font(AppFont.font(size: AppFont.Size.textXs, weight: isSelected ? .medium : .regular))
                    .foregroundColor(AppColor.foreground)
            }
            .frame(maxWidth: .infinity)
        }
    }

    private func selectTab(_ index: Int) {
        if index == 0 {
            tabBar.popOverviewToRoot()
        }
        selectedTab = index
    }
}

