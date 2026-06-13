import SwiftUI

// MARK: - Custom colour override
//
// Native port of apps/web/js/contrast-checker.js. From a single (background,
// foreground) pair we derive every colour role the app reads, plus WCAG
// contrast scoring — so a custom palette re-skins the whole app, exactly like
// the web Profile "Colour theme" panel.

struct ColorOverride: Equatable, Codable {
    var bg: String   // hex, e.g. "#00157E"
    var fg: String   // hex, e.g. "#FFFFFF"

    static let webLight = ColorOverride(bg: "#FFFFFF", fg: "#00157E")
    static let webDark  = ColorOverride(bg: "#00157E", fg: "#FFFFFF")
}

/// A named, saved colour pair (mirrors the web "Saved themes" feature).
struct SavedColorTheme: Identifiable, Equatable, Codable {
    var id: String
    var name: String
    var bg: String
    var fg: String
}

/// All colour roles, resolved to concrete Colors for a given (bg, fg) pair.
struct DerivedPalette {
    let isDark: Bool

    let background: Color
    let backgroundSecondary: Color
    let foreground: Color
    let foregroundSecondary: Color
    let foregroundLabel: Color
    let foregroundDisabled: Color
    let separator: Color
    let foregroundOnPrimary: Color
    let surfaceStateHover: Color
    let surfaceStatePressed: Color
    let showAllBg: Color
    let segmentedTrack: Color
    let overlayScrim: Color
    let contentIndicationShadow: Color

    let primaryBg: Color
    let primaryFg: Color
    let primaryBgHover: Color
    let secondaryBorder: Color
    let secondaryFg: Color
    let secondaryBgHover: Color
    let tonalBg: Color
    let tonalFg: Color
}

enum ColorMath {
    struct RGB { var r: Double; var g: Double; var b: Double }

    static func rgb(_ hex: String) -> RGB {
        var s = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        if s.count == 3 {
            s = s.map { "\($0)\($0)" }.joined()
        }
        var int: UInt64 = 0
        Scanner(string: s).scanHexInt64(&int)
        return RGB(r: Double((int >> 16) & 0xFF),
                   g: Double((int >> 8) & 0xFF),
                   b: Double(int & 0xFF))
    }

    static func hex(_ c: RGB) -> String {
        let clamp = { (v: Double) -> Int in min(255, max(0, Int(v.rounded()))) }
        return String(format: "#%02X%02X%02X", clamp(c.r), clamp(c.g), clamp(c.b))
    }

    /// Linear interpolation between two hex colours (t in 0...1).
    static func mix(_ a: String, _ b: String, _ t: Double) -> String {
        let x = rgb(a), y = rgb(b)
        return hex(RGB(r: x.r + (y.r - x.r) * t,
                       g: x.g + (y.g - x.g) * t,
                       b: x.b + (y.b - x.b) * t))
    }

    static func relLuminance(_ hex: String) -> Double {
        let c = rgb(hex)
        func lin(_ v: Double) -> Double {
            let s = v / 255
            return s <= 0.03928 ? s / 12.92 : pow((s + 0.055) / 1.055, 2.4)
        }
        return 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b)
    }

    /// WCAG contrast ratio between two hex colours (1...21).
    static func contrastRatio(_ a: String, _ b: String) -> Double {
        let l1 = relLuminance(a), l2 = relLuminance(b)
        return (max(l1, l2) + 0.05) / (min(l1, l2) + 0.05)
    }
}

func derivePalette(_ override: ColorOverride) -> DerivedPalette {
    let bg = override.bg
    let fg = override.fg
    let isDark = ColorMath.relLuminance(bg) < ColorMath.relLuminance(fg)
    let bgElev = isDark ? 0.22 : 0.07
    let fgElev = isDark ? 0.06 : 0.22

    func fgA(_ a: Double) -> Color { Color(hex: fg).opacity(a) }
    func c(_ hex: String) -> Color { Color(hex: hex) }

    return DerivedPalette(
        isDark: isDark,
        background:          c(bg),
        backgroundSecondary: c(ColorMath.mix(bg, fg, bgElev)),
        foreground:          c(fg),
        foregroundSecondary: c(ColorMath.mix(fg, bg, fgElev)),
        foregroundLabel:     fgA(0.7),
        foregroundDisabled:  fgA(0.4),
        separator:           fgA(0.10),
        foregroundOnPrimary: c(bg),
        surfaceStateHover:   fgA(0.10),
        surfaceStatePressed: fgA(0.20),
        showAllBg:           fgA(0.10),
        segmentedTrack:      fgA(0.05),
        overlayScrim:        fgA(isDark ? 0.62 : 0.45),
        contentIndicationShadow: fgA(isDark ? 0.25 : 0.10),
        primaryBg:           c(fg),
        primaryFg:           c(bg),
        primaryBgHover:      c(ColorMath.mix(fg, bg, fgElev)),
        secondaryBorder:     c(fg),
        secondaryFg:         c(fg),
        secondaryBgHover:    fgA(0.1),
        tonalBg:             c(ColorMath.mix(bg, fg, isDark ? 0.28 : 0.08)),
        tonalFg:             c(fg)
    )
}
