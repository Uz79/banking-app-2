import SwiftUI

@main
struct EBankingApp: App {
    @StateObject private var settings = AppSettings.shared

    var body: some Scene {
        WindowGroup {
            MainTabView()
                .environmentObject(settings)
                .tint(AppColor.foreground)
                .preferredColorScheme(settings.effectiveColorScheme)
                // Rebuild the tree when the legibility scale changes so the
                // custom-font point sizes are recomputed.
                .id(settings.renderID)
        }
    }
}
