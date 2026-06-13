import SwiftUI
#if canImport(UIKit)
import UIKit
#endif

// MARK: - Theme mode (mirrors the web Light / Dark theme toggle, plus System)

enum ThemeMode: String, CaseIterable, Identifiable {
    case system
    case light
    case dark

    var id: String { rawValue }

    var label: String {
        switch self {
        case .system: return "System"
        case .light:  return "Light"
        case .dark:   return "Dark"
        }
    }

    var icon: String {
        switch self {
        case .system: return "icon24-settings"
        case .light:  return "icon24-sun"
        case .dark:   return "icon24-moon"
        }
    }

    var colorScheme: ColorScheme? {
        switch self {
        case .system: return nil
        case .light:  return .light
        case .dark:   return .dark
        }
    }
}

// MARK: - Legibility (mirrors the web "Legibility" panel: Small / Regular / Large)

enum LegibilityPreset: String, CaseIterable, Identifiable {
    case small
    case regular
    case large

    var id: String { rawValue }

    var eyebrow: String {
        switch self {
        case .small:   return "Small"
        case .regular: return "Regular"
        case .large:   return "Large"
        }
    }

    var title: String {
        switch self {
        case .small:   return "Compact"
        case .regular: return "Default"
        case .large:   return "Comfortable"
        }
    }

    var meta: String {
        switch self {
        case .small:   return "More content on screen"
        case .regular: return "Balanced readability"
        case .large:   return "Larger touch and reading space"
        }
    }

    var fontScale: CGFloat {
        switch self {
        case .small:   return 0.9
        case .regular: return 1.0
        case .large:   return 1.15
        }
    }

    var spaceScale: CGFloat {
        switch self {
        case .small:   return 0.9
        case .regular: return 1.0
        case .large:   return 1.12
        }
    }
}

// MARK: - Persona (mirrors the web "Persona" panel)

enum Persona: String, CaseIterable, Identifiable {
    case beatrice
    case max

    var id: String { rawValue }

    var eyebrow: String {
        switch self {
        case .beatrice: return "Persona A"
        case .max:      return "Persona B"
        }
    }

    var name: String {
        switch self {
        case .beatrice: return "Beatrice Müller"
        case .max:      return "Max Maximus"
        }
    }

    var initials: String {
        switch self {
        case .beatrice: return "BM"
        case .max:      return "MM"
        }
    }

    var descriptionLines: [String] {
        switch self {
        case .beatrice:
            return [
                "Inexperienced / little knowledge",
                "Few banking products",
                "Clear = simple"
            ]
        case .max:
            return [
                "Experienced / strong knowledge",
                "Many banking products",
                "Clear = comfortable with high information density"
            ]
        }
    }
}

// MARK: - App settings (persisted, drives theme + legibility + persona)

final class AppSettings: ObservableObject {
    static let shared = AppSettings()

    @Published var themeMode: ThemeMode {
        didSet { UserDefaults.standard.set(themeMode.rawValue, forKey: Keys.theme) }
    }
    @Published var legibility: LegibilityPreset {
        didSet { UserDefaults.standard.set(legibility.rawValue, forKey: Keys.legibility) }
    }
    @Published var persona: Persona {
        didSet { UserDefaults.standard.set(persona.rawValue, forKey: Keys.persona) }
    }

    /// Custom (background, foreground) override. When set, it re-skins the whole
    /// app on top of the light/dark tokens (mirrors the web colour-theme panel).
    @Published var colorOverride: ColorOverride? {
        didSet {
            palette = colorOverride.map(derivePalette)
            if let o = colorOverride, let data = try? JSONEncoder().encode(o) {
                UserDefaults.standard.set(data, forKey: Keys.colorOverride)
            } else {
                UserDefaults.standard.removeObject(forKey: Keys.colorOverride)
            }
        }
    }

    /// Cached derived palette (nil when no override is active).
    private(set) var palette: DerivedPalette?

    /// User-saved colour pairs (the "Saved themes" grid).
    @Published var savedThemes: [SavedColorTheme] = [] {
        didSet {
            if let data = try? JSONEncoder().encode(savedThemes) {
                UserDefaults.standard.set(data, forKey: Keys.savedThemes)
            }
        }
    }

    /// Save the given pair as a new theme with an auto-generated name.
    func saveTheme(bg: String, fg: String) {
        let theme = SavedColorTheme(id: UUID().uuidString,
                                    name: nextThemeName(),
                                    bg: bg, fg: fg)
        savedThemes.insert(theme, at: 0)
    }

    func deleteTheme(id: String) {
        savedThemes.removeAll { $0.id == id }
    }

    private func nextThemeName() -> String {
        let used = Set(savedThemes.map { $0.name })
        for i in 1..<100 {
            let name = String(format: "Custom %02d", i)
            if !used.contains(name) { return name }
        }
        return "Custom"
    }

    /// Read by AppFont so custom-font sizes scale with the Legibility preset.
    static var fontScale: CGFloat { shared.legibility.fontScale }
    var spaceScale: CGFloat { legibility.spaceScale }

    /// Effective color scheme for system chrome (status bar, etc.).
    var effectiveColorScheme: ColorScheme? {
        if let p = palette { return p.isDark ? .dark : .light }
        return themeMode.colorScheme
    }

    // Mirrors the web "uzBankWeb*" convention with an iOS marker, so iOS keys
    // stay distinct from the web's localStorage keys.
    private enum Keys {
        static let theme = "uzBankIOSTheme"
        static let legibility = "uzBankIOSLegibility"
        static let persona = "uzBankIOSPersona"
        static let colorOverride = "uzBankIOSColorOverride"
        static let savedThemes = "uzBankIOSSavedColorThemes"
    }

    private init() {
        let d = UserDefaults.standard
        themeMode = ThemeMode(rawValue: d.string(forKey: Keys.theme) ?? "") ?? .dark
        legibility = LegibilityPreset(rawValue: d.string(forKey: Keys.legibility) ?? "") ?? .regular
        persona = Persona(rawValue: d.string(forKey: Keys.persona) ?? "") ?? .beatrice
        if let data = d.data(forKey: Keys.colorOverride),
           let o = try? JSONDecoder().decode(ColorOverride.self, from: data) {
            colorOverride = o
            palette = derivePalette(o)
        }
        if let data = d.data(forKey: Keys.savedThemes),
           let list = try? JSONDecoder().decode([SavedColorTheme].self, from: data) {
            savedThemes = list
        }
    }

    /// Identity used to force a clean rebuild when the font scale changes
    /// (custom-font point sizes must be recomputed). Colour-override changes do
    /// NOT change this — they re-skin in place via the override-aware AppColor,
    /// preserving editor state while you drag the sliders.
    var renderID: String { "\(legibility.rawValue)" }
}

// MARK: - Dynamic color helpers (resolve per light/dark trait)

extension Color {
    /// A color that resolves to `light` or `dark` based on the active interface style.
    static func themed(
        light: String,
        dark: String,
        alpha: Double = 1,
        lightAlpha: Double? = nil,
        darkAlpha: Double? = nil
    ) -> Color {
        let resolvedLightAlpha = lightAlpha ?? alpha
        let resolvedDarkAlpha = darkAlpha ?? alpha
        #if canImport(UIKit)
        return Color(UIColor { trait in
            let isDark = trait.userInterfaceStyle == .dark
            let hex = isDark ? dark : light
            let a = isDark ? resolvedDarkAlpha : resolvedLightAlpha
            return UIColor(hexString: hex, alpha: a)
        })
        #else
        return Color(hex: light).opacity(resolvedLightAlpha)
        #endif
    }

    /// Semi-transparent overlay scrim — `color-mix(fg, transparent)` matching web `--color-overlay-scrim`.
    static func themedScrimBackdrop(lightAlpha: Double, darkAlpha: Double) -> Color {
        themed(
            light: "#00157E", dark: "#FFFFFF",
            lightAlpha: lightAlpha, darkAlpha: darkAlpha
        )
    }
}

#if canImport(UIKit)
extension UIColor {
    convenience init(hexString: String, alpha: Double = 1) {
        let s = hexString.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: s).scanHexInt64(&int)
        let r, g, b: UInt64
        switch s.count {
        case 6:
            (r, g, b) = (int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8:
            (r, g, b) = (int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (r, g, b) = (0, 0, 0)
        }
        self.init(
            red: CGFloat(r) / 255,
            green: CGFloat(g) / 255,
            blue: CGFloat(b) / 255,
            alpha: CGFloat(alpha)
        )
    }
}
#endif
