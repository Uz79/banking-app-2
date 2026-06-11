import SwiftUI

// MARK: - Semantic colors (generated from designs/tokens → apps/web/css/tokens.css)
//
// Each token resolves dynamically to its light or dark value following the
// active interface style, so the whole app switches with the system / chosen
// theme without threading the color scheme through every view.
//
//   light: <html data-theme="light">   dark: <html data-theme="dark">

enum AppColor {
    /// Active custom palette, if the user set a colour override in Profile.
    private static var p: DerivedPalette? { AppSettings.shared.palette }

    // Surfaces
    static var background: Color          { p?.background ?? Color.themed(light: "#FFFFFF", dark: "#00157E") }
    static var backgroundSecondary: Color { p?.backgroundSecondary ?? Color.themed(light: "#F1F2F8", dark: "#39499B") }

    // Foreground / text
    static var foreground: Color          { p?.foreground ?? Color.themed(light: "#00157E", dark: "#FFFFFF") }
    static var foregroundSecondary: Color { p?.foregroundSecondary ?? Color.themed(light: "#39499B", dark: "#F1F2F8") }
    static var foregroundLabel: Color     { p?.foregroundLabel ?? Color.themed(light: "#00157E", dark: "#FFFFFF", alpha: 0.7) }
    static var foregroundDisabled: Color  { p?.foregroundDisabled ?? Color.themed(light: "#00157E", dark: "#FFFFFF", alpha: 0.4) }
    static var separator: Color           { p?.separator ?? Color.themed(light: "#00157E", dark: "#FFFFFF", alpha: 0.1) }
    static var foregroundOnPrimary: Color { p?.foregroundOnPrimary ?? Color.themed(light: "#FFFFFF", dark: "#00157E") }

    // Surface states (list rows, nav, inputs)
    static var surfaceStateHover: Color   { p?.surfaceStateHover ?? Color.themed(light: "#00157E", dark: "#FFFFFF", alpha: 0.1) }
    static var surfaceStatePressed: Color { p?.surfaceStatePressed ?? Color.themed(light: "#00157E", dark: "#FFFFFF", alpha: 0.2) }

    // "Show all" tonal surface (--color-show-all-bg)
    static var showAllBg: Color           { p?.showAllBg ?? Color.themed(light: "#00157E", dark: "#FFFFFF", alpha: 0.1) }

    // Segmented control track (--color-segmented-track-bg)
    static var segmentedTrack: Color      { p?.segmentedTrack ?? Color.themed(light: "#00157E", dark: "#FFFFFF", alpha: 0.06) }

    // Modal scrim (--color-overlay-scrim). Neutral dark dimming so it stays
    // visible in every theme (a brand-hued scrim disappears against a same-hue
    // page background, e.g. #00157E in dark).
    static var overlayScrim: Color        { p?.overlayScrim ?? Color.black.opacity(0.5) }

    enum Button {
        private static var p: DerivedPalette? { AppSettings.shared.palette }

        // Primary (--color-btn-primary-*)
        static var primaryBg: Color        { p?.primaryBg ?? Color.themed(light: "#00157E", dark: "#FFFFFF") }
        static var primaryFg: Color        { p?.primaryFg ?? Color.themed(light: "#FFFFFF", dark: "#00157E") }
        static var primaryBgHover: Color   { p?.primaryBgHover ?? Color.themed(light: "#39499B", dark: "#F1F2F8") }

        // Secondary (--color-btn-secondary-*)
        static var secondaryBorder: Color  { p?.secondaryBorder ?? Color.themed(light: "#00157E", dark: "#FFFFFF") }
        static var secondaryFg: Color      { p?.secondaryFg ?? Color.themed(light: "#00157E", dark: "#FFFFFF") }
        static var secondaryBgHover: Color { p?.secondaryBgHover ?? Color.themed(light: "#00157E", dark: "#FFFFFF", alpha: 0.1) }

        // Tonal (--color-btn-tonal-*)
        static var tonalBg: Color          { p?.tonalBg ?? Color.themed(light: "#F1F2F8", dark: "#39499B") }
        static var tonalFg: Color          { p?.tonalFg ?? Color.themed(light: "#00157E", dark: "#FFFFFF") }
    }
}

// MARK: - Hex initializer (static colors, e.g. brand swatches)

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 6:
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8:
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}
