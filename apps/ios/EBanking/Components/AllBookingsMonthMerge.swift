import SwiftUI
#if canImport(UIKit)
import UIKit
#endif

// MARK: - Merge constants (apps/web/js/all-bookings.js)

enum AllBookingsMonthMerge {
    static let mergeLead: CGFloat = 14
    static let mergeHysteresis: CGFloat = 10
    static let mergeDelay: TimeInterval = 0.1
    static let mergeAnimation: TimeInterval = 0.2
}

// MARK: - Live frame measurement (web: getBoundingClientRect)

struct MergeAnchorFrames: Equatable {
    var monthBarMinY: CGFloat?
    var headerMaxY: CGFloat?

    var gap: CGFloat? {
        guard let monthBarMinY, let headerMaxY else { return nil }
        return monthBarMinY - headerMaxY
    }

    mutating func merge(with other: MergeAnchorFrames) {
        if let value = other.monthBarMinY { monthBarMinY = value }
        if let value = other.headerMaxY { headerMaxY = value }
    }
}

struct MergeAnchorFramesKey: PreferenceKey {
    static var defaultValue = MergeAnchorFrames()

    static func reduce(value: inout MergeAnchorFrames, nextValue: () -> MergeAnchorFrames) {
        value.merge(with: nextValue())
    }
}

struct MergeFrameAnchorModifier: ViewModifier {
    enum Role {
        case monthBar
        case stickyHeader
    }

    let role: Role

    func body(content: Content) -> some View {
        content.background {
            GeometryReader { geo in
                let frame = geo.frame(in: .global)
                Color.clear.preference(
                    key: MergeAnchorFramesKey.self,
                    value: role == .monthBar
                        ? MergeAnchorFrames(monthBarMinY: frame.minY, headerMaxY: nil)
                        : MergeAnchorFrames(monthBarMinY: nil, headerMaxY: frame.maxY)
                )
            }
        }
    }
}

extension View {
    func mergeFrameAnchor(_ role: MergeFrameAnchorModifier.Role) -> some View {
        modifier(MergeFrameAnchorModifier(role: role))
    }
}

// MARK: - Month bar

struct AllBookingsMonthBar: View {
    @Binding var month: String
    let months: [String]
    var centered: Bool = false
    var onSelect: ((String) -> Void)?

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: Space._2) {
                if centered { Spacer(minLength: 0) }
                ForEach(months, id: \.self) { label in
                    monthChip(label)
                }
                if centered { Spacer(minLength: 0) }
            }
            .padding(.horizontal, Space._3)
            .padding(.vertical, Space._2)
        }
    }

    private func monthChip(_ label: String) -> some View {
        let selected = label == month
        return Button {
            month = label
            onSelect?(label)
        } label: {
            Text(label)
                .textSmall()
                .fontWeight(.medium)
                .foregroundColor(selected ? AppColor.Button.primaryFg : AppColor.foreground)
                .padding(.horizontal, 14)
                .padding(.vertical, 6)
                .background(selected ? AppColor.Button.primaryBg : AppColor.segmentedTrack)
                .clipShape(Capsule())
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Sticky header (nav + docked month row)

struct AllBookingsStickyHeader: View {
    let title: String
    var showBack: Bool = false
    var onBack: (() -> Void)?
    @Binding var month: String
    let months: [String]
    var monthMerged: Bool
    var monthMerging: Bool
    var showShadow: Bool
    var onMonthSelect: ((String) -> Void)?

    var body: some View {
        VStack(spacing: 0) {
            CustomNavBar(title: title, showBack: showBack, onBack: onBack)

            ZStack(alignment: .top) {
                AllBookingsMonthBar(
                    month: $month,
                    months: months,
                    centered: true,
                    onSelect: onMonthSelect
                )
                .opacity(monthMerged ? 1 : 0)
                .padding(.bottom, monthMerged ? Space._2 : 0)
            }
            .frame(maxWidth: .infinity)
            .frame(height: monthMerged || monthMerging ? monthBarHeight : 0, alignment: .top)
            .clipped()
            .accessibilityHidden(!(monthMerged || monthMerging))
        }
        .frame(maxWidth: .infinity)
        .background(AppColor.backgroundSecondary.ignoresSafeArea(edges: .top))
        .mergeFrameAnchor(.stickyHeader)
        .topChromeShadow(showShadow)
        .animation(.easeInOut(duration: AllBookingsMonthMerge.mergeAnimation), value: monthMerged)
        .animation(.easeInOut(duration: AllBookingsMonthMerge.mergeAnimation), value: monthMerging)
    }

    private var monthBarHeight: CGFloat { Space._2 * 2 + 28 + Space._2 }
}

#if canImport(UIKit)

struct AllBookingsScrollMetrics {
    var offsetY: CGFloat
    var contentHeight: CGFloat
    var viewportHeight: CGFloat
}

/// Vertical scroll observer (apps/web/js/all-bookings.js scroll listener).
struct AllBookingsScrollReporter: UIViewRepresentable {
    var onUpdate: (AllBookingsScrollMetrics) -> Void

    func makeCoordinator() -> Coordinator { Coordinator(onUpdate: onUpdate) }

    func makeUIView(context: Context) -> TrackingView {
        let view = TrackingView()
        view.coordinator = context.coordinator
        return view
    }

    func updateUIView(_ uiView: TrackingView, context: Context) {
        context.coordinator.onUpdate = onUpdate
        uiView.coordinator = context.coordinator
        uiView.scheduleAttach()
    }

    final class Coordinator {
        var onUpdate: (AllBookingsScrollMetrics) -> Void
        private weak var scrollView: UIScrollView?
        private var observations: [NSKeyValueObservation] = []

        init(onUpdate: @escaping (AllBookingsScrollMetrics) -> Void) {
            self.onUpdate = onUpdate
        }

        func bind(_ scrollView: UIScrollView) {
            guard scrollView !== self.scrollView else { return }
            observations.removeAll()
            self.scrollView = scrollView
            observations = [
                scrollView.observe(\.contentOffset, options: [.new, .initial]) { [weak self] sv, _ in
                    self?.emit(sv)
                },
                scrollView.observe(\.contentSize, options: [.new, .initial]) { [weak self] sv, _ in
                    self?.emit(sv)
                },
                scrollView.observe(\.bounds, options: [.new, .initial]) { [weak self] sv, _ in
                    self?.emit(sv)
                }
            ]
        }

        private func emit(_ scrollView: UIScrollView) {
            let metrics = AllBookingsScrollMetrics(
                offsetY: scrollView.contentOffset.y,
                contentHeight: scrollView.contentSize.height,
                viewportHeight: scrollView.bounds.height
            )
            DispatchQueue.main.async { [weak self] in
                self?.onUpdate(metrics)
            }
        }
    }

    final class TrackingView: UIView {
        weak var coordinator: Coordinator?

        override func didMoveToWindow() {
            super.didMoveToWindow()
            scheduleAttach()
        }

        override func layoutSubviews() {
            super.layoutSubviews()
            scheduleAttach()
        }

        func scheduleAttach() {
            DispatchQueue.main.async { [weak self] in
                guard let self, let coordinator = self.coordinator else { return }
                guard let scrollView = self.enclosingVerticalScrollView else { return }
                coordinator.bind(scrollView)
            }
        }
    }
}

private extension UIView {
    /// Prefer the outer vertical scroll view (ignore nested horizontal month-bar scrollers).
    var enclosingVerticalScrollView: UIScrollView? {
        sequence(first: self, next: { $0.superview })
            .compactMap { $0 as? UIScrollView }
            .max(by: { $0.bounds.height < $1.bounds.height })
    }
}

#endif

// MARK: - Merge state machine

@MainActor
final class AllBookingsMonthMergeModel: ObservableObject {
    @Published private(set) var merged = false
    @Published private(set) var merging = false

    private var mergeTask: Task<Void, Never>?

    func evaluate(scrollOffset: CGFloat, mergeGap: CGFloat?) {
        guard let mergeGap else { return }

        let shouldMerge = scrollOffset > 1 && mergeGap <= AllBookingsMonthMerge.mergeLead
        let shouldUnmerge = mergeGap > AllBookingsMonthMerge.mergeLead + AllBookingsMonthMerge.mergeHysteresis

        if shouldMerge {
            if !merged && !merging { beginMerge() }
        } else if shouldUnmerge && (merged || merging) {
            cancelMerge()
        }
    }

    private func beginMerge() {
        merging = true
        mergeTask?.cancel()
        mergeTask = Task {
            try? await Task.sleep(nanoseconds: UInt64(AllBookingsMonthMerge.mergeDelay * 1_000_000_000))
            guard !Task.isCancelled else { return }
            merging = false
            merged = true
        }
    }

    private func cancelMerge() {
        mergeTask?.cancel()
        mergeTask = nil
        merging = false
        merged = false
    }
}
