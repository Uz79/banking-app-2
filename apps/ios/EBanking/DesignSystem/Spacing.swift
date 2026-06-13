import SwiftUI

// MARK: - Spacing (from tokens.json alias.space mapped to brand.size)

enum Space {
    static let _1: CGFloat  = 8    // space.1  → size.0-5
    static let _2: CGFloat  = 12   // space.2  → size.0-75
    static let _3: CGFloat  = 16   // space.3  → size.1
    static let _4: CGFloat  = 24   // space.4  → size.1-5
    static let _5: CGFloat  = 32   // space.5  → size.2
    static let _6: CGFloat  = 48   // space.6  → size.3
    static let _7: CGFloat  = 64   // space.7  → size.4
    static let _8: CGFloat  = 80   // space.8  → size.5
    static let _9: CGFloat  = 96   // space.9  → size.6
}

// MARK: - Radius (from tokens.json alias.radius)

enum Radius {
    static let small: CGFloat   = 4    // size.0-25
    static let regular: CGFloat = 8    // size.0-5
    static let pill: CGFloat    = 256  // size.16
}

// MARK: - Section Padding

enum SectionPadding {
    static let small: CGFloat = 24   // space.4
    static let main: CGFloat  = 80   // space.8
    static let large: CGFloat = 96   // space.9
}

// MARK: - Component Padding

enum ComponentPadding {
    static let small: CGFloat   = 8    // space.1
    static let regular: CGFloat = 12   // space.2
    static let large: CGFloat   = 24   // space.4
}

// MARK: - Section card (web --section-card-header-gap-to-body)

enum SectionCardMetrics {
    static let headerToBody: CGFloat = 4  // 0.25rem — Figma space/1 in section-card context
}
