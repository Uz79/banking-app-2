import SwiftUI

/// Bottom panel height — mirrors web modal / bottom-sheet proportions.
enum SheetPanelSize {
    /// Height follows content (capped at 92% of screen).
    case fitted
    case medium
    case large

    func maxPanelHeight(in screenHeight: CGFloat) -> CGFloat {
        switch self {
        case .fitted: screenHeight * 0.92
        case .medium: min(screenHeight * 0.55, 520)
        case .large: screenHeight * 0.92
        }
    }

    var fitsContent: Bool { self == .fitted }

    var slideDistance: CGFloat {
        switch self {
        case .fitted: 480
        case .medium: 520
        case .large: 720
        }
    }
}

// MARK: - Animated dismiss (shared by scrim tap + sheet close button)

private struct ScrimSheetDismissKey: EnvironmentKey {
    static let defaultValue: (() -> Void)? = nil
}

extension EnvironmentValues {
    /// Triggers the same slide-out + scrim fade as tapping outside the sheet.
    var scrimSheetDismiss: (() -> Void)? {
        get { self[ScrimSheetDismissKey.self] }
        set { self[ScrimSheetDismissKey.self] = newValue }
    }
}

// MARK: - Global presenter (covers tab bar + full window chrome)

@MainActor
final class ScrimSheetCenter: ObservableObject {
    struct ActiveSheet: Identifiable {
        let id = UUID()
        let size: SheetPanelSize
        let content: AnyView
        let onDismissed: () -> Void
    }

    @Published private(set) var active: ActiveSheet?
    fileprivate var closeHandler: (() -> Void)?

    func present<Content: View>(
        size: SheetPanelSize,
        onDismissed: @escaping () -> Void,
        @ViewBuilder content: () -> Content
    ) {
        active = ActiveSheet(size: size, content: AnyView(content()), onDismissed: onDismissed)
    }

    func dismissAnimated() {
        closeHandler?()
    }

    fileprivate func finishDismissal() {
        let callback = active?.onDismissed
        active = nil
        closeHandler = nil
        callback?()
    }
}

private struct ScrimSheetCenterKey: EnvironmentKey {
    static let defaultValue: ScrimSheetCenter? = nil
}

extension EnvironmentValues {
    var scrimSheetCenter: ScrimSheetCenter? {
        get { self[ScrimSheetCenterKey.self] }
        set { self[ScrimSheetCenterKey.self] = newValue }
    }
}

/// Host overlay — attach once at `MainTabView` (or full-screen flow root).
struct ScrimSheetHost: View {
    @ObservedObject var center: ScrimSheetCenter

    var body: some View {
        if let sheet = center.active {
            ScrimSheetRoot(
                size: sheet.size,
                onDismiss: { center.finishDismissal() },
                registerClose: { center.closeHandler = $0 },
                content: { sheet.content }
            )
            .ignoresSafeArea()
            .zIndex(999)
        }
    }
}

// MARK: - Scrim + sliding panel (web: `dialog.form-sheet` + `::backdrop`)

private struct ScrimSheetRoot<Content: View>: View {
    let size: SheetPanelSize
    let onDismiss: () -> Void
    let registerClose: (@escaping () -> Void) -> Void
    @ViewBuilder var content: () -> Content
    @State private var revealed = false

    var body: some View {
        ZStack {
            AppColor.overlayScrim
                .ignoresSafeArea()
                .opacity(revealed ? 1 : 0)
                .contentShape(Rectangle())
                .onTapGesture { close() }

            GeometryReader { geo in
                VStack(spacing: 0) {
                    Spacer(minLength: 0)
                    panel(in: geo.size.height)
                        .offset(y: revealed ? 0 : size.slideDistance)
                }
            }
            .ignoresSafeArea()
        }
        .environment(\.scrimSheetDismiss, close)
        .onAppear {
            registerClose(close)
            withAnimation(.easeOut(duration: 0.28)) { revealed = true }
        }
    }

    @ViewBuilder
    private func panel(in screenHeight: CGFloat) -> some View {
        if size.fitsContent {
            content()
                .frame(maxWidth: .infinity)
                .fixedSize(horizontal: false, vertical: true)
                .frame(maxHeight: size.maxPanelHeight(in: screenHeight), alignment: .bottom)
        } else {
            content()
                .frame(maxWidth: .infinity)
                .frame(maxHeight: size.maxPanelHeight(in: screenHeight))
        }
    }

    private func close() {
        withAnimation(.easeIn(duration: 0.22)) { revealed = false }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.22) {
            onDismiss()
        }
    }
}

// MARK: - View modifiers

private struct LocalScrimSheetFallback<Sheet: View>: View {
    @Binding var isPresented: Bool
    var size: SheetPanelSize
    @ViewBuilder var sheet: () -> Sheet

    var body: some View {
        if isPresented {
            ScrimSheetRoot(
                size: size,
                onDismiss: { isPresented = false },
                registerClose: { _ in },
                content: sheet
            )
            .ignoresSafeArea()
        }
    }
}

private struct ForegroundScrimSheetModifier<Sheet: View>: ViewModifier {
    @Binding var isPresented: Bool
    var size: SheetPanelSize
    @ViewBuilder var sheet: () -> Sheet
    @Environment(\.scrimSheetCenter) private var center

    func body(content: Content) -> some View {
        content
            .overlay {
                if center == nil {
                    LocalScrimSheetFallback(isPresented: $isPresented, size: size, sheet: sheet)
                }
            }
            .onAppear { syncPresentation() }
            .onChange(of: isPresented) { _, _ in syncPresentation() }
    }

    private func syncPresentation() {
        if isPresented {
            if let center, center.active == nil {
                center.present(size: size, onDismissed: { isPresented = false }, content: sheet)
            }
        } else if let center, center.active != nil {
            center.dismissAnimated()
        }
    }
}

private struct ForegroundScrimSheetItemModifier<Item: Identifiable, Sheet: View>: ViewModifier {
    @Binding var item: Item?
    var size: SheetPanelSize
    @ViewBuilder var sheet: (Item) -> Sheet

    func body(content: Content) -> some View {
        content.modifier(
            ForegroundScrimSheetModifier(
                isPresented: Binding(
                    get: { item != nil },
                    set: { if !$0 { item = nil } }
                ),
                size: size,
                sheet: {
                    if let item { sheet(item) }
                }
            )
        )
    }
}

extension View {
    /// Bottom sheet with foreground scrim. When a `ScrimSheetCenter` is in the
    /// environment (via `ScrimSheetHost` on `MainTabView`), the sheet covers the
    /// entire app including the tab bar.
    func foregroundScrimSheet<Sheet: View>(
        isPresented: Binding<Bool>,
        size: SheetPanelSize = .medium,
        @ViewBuilder content: @escaping () -> Sheet
    ) -> some View {
        modifier(ForegroundScrimSheetModifier(isPresented: isPresented, size: size, sheet: content))
    }

    func foregroundScrimSheet<Item: Identifiable, Sheet: View>(
        item: Binding<Item?>,
        size: SheetPanelSize = .medium,
        @ViewBuilder content: @escaping (Item) -> Sheet
    ) -> some View {
        modifier(ForegroundScrimSheetItemModifier(item: item, size: size, sheet: content))
    }
}
