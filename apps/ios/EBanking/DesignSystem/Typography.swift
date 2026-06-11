import SwiftUI
#if canImport(UIKit)
import UIKit
#endif

// MARK: - Mobile Typography (from tokens.json responsive/mobile)
// Font family: "Profile Pro" (brand.font-family.grotesk)
// Weights: Regular, Medium, Bold (brand.font-weight)

enum AppFont {
    static let family = "ProfilePro"

    enum Size {
        static let hero: CGFloat   = 64
        static let h1: CGFloat     = 56
        static let h2: CGFloat     = 48
        static let h3: CGFloat     = 40
        static let h4: CGFloat     = 32
        static let h5: CGFloat     = 28
        static let h6: CGFloat     = 24
        static let textLg: CGFloat = 18
        static let textMd: CGFloat = 16
        static let textSm: CGFloat = 14
        static let textXs: CGFloat = 12
        static let caption: CGFloat = 12
    }

    enum LineHeight {
        static let hero: CGFloat   = 1.0
        static let h1: CGFloat     = 1.0
        static let h2: CGFloat     = 1.0
        static let h3: CGFloat     = 1.1
        static let h4: CGFloat     = 1.15
        static let h5: CGFloat     = 1.2
        static let h6: CGFloat     = 1.25
        static let text: CGFloat   = 1.5
        static let caption: CGFloat = 1.4
    }

    static func font(size: CGFloat, weight: Font.Weight = .regular) -> Font {
        let name: String
        switch weight {
        case .bold, .heavy, .black:
            name = "\(family)-Bold"
        case .medium, .semibold:
            name = "\(family)-Medium"
        default:
            name = "\(family)-Regular"
        }

        // Scale type with the Legibility preset chosen in Profile.
        let scaled = (size * AppSettings.fontScale).rounded()

        #if canImport(UIKit)
        if UIFont(name: name, size: scaled) != nil {
            return .custom(name, size: scaled)
        }
        #endif
        return .system(size: scaled, weight: weight)
    }
}

// MARK: - View modifiers using the token font

extension View {
    func appFont(size: CGFloat, weight: Font.Weight = .regular) -> some View {
        self.font(AppFont.font(size: size, weight: weight))
    }

    func heroStyle() -> some View {
        self.font(AppFont.font(size: AppFont.Size.hero, weight: .bold))
    }

    func h4Style() -> some View {
        self.font(AppFont.font(size: AppFont.Size.h4, weight: .medium))
    }

    func h5Style() -> some View {
        self.font(AppFont.font(size: AppFont.Size.h5, weight: .medium))
    }

    func h6Style() -> some View {
        self.font(AppFont.font(size: AppFont.Size.h6, weight: .medium))
    }

    func textLarge() -> some View {
        self.font(AppFont.font(size: AppFont.Size.textLg))
    }

    func textMain() -> some View {
        self.font(AppFont.font(size: AppFont.Size.textMd))
    }

    func textSmall() -> some View {
        self.font(AppFont.font(size: AppFont.Size.textSm))
    }

    func textXSmall() -> some View {
        self.font(AppFont.font(size: AppFont.Size.textXs))
    }

    func captionStyle() -> some View {
        self.font(AppFont.font(size: AppFont.Size.caption))
    }
}
