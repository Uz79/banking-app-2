import SwiftUI

/// Routes pushed from the Overview tab's root screen.
enum OverviewRoute: Hashable {
    case account(Account)
    case investment
    case allBookings(Account)
    case position(String)
}

/// Shared tab-bar state — child/detail screens leave every tab visually unselected
/// (mirrors web shell nav on investment-product-details, account-details, etc.).
@MainActor
final class TabBarCoordinator: ObservableObject {
    @Published var overviewPath = NavigationPath()

    var highlightsOverviewTab: Bool {
        overviewPath.isEmpty
    }

    func popOverviewToRoot() {
        guard !overviewPath.isEmpty else { return }
        overviewPath = NavigationPath()
    }

    func position(byID id: String) -> InvestmentPosition? {
        InvestmentPosition.samples.first { $0.id == id }
    }
}
