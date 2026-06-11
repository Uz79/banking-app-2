import SwiftUI

/// Native port of the web Profile "Colour theme" contrast checker.
/// Pick a background + foreground; the whole app re-skins live, with WCAG
/// contrast feedback. Switching Appearance (light/dark) swaps the inputs.
/// Save pairs as tiles and switch between them.
struct ColorThemeEditor: View {
    @EnvironmentObject private var settings: AppSettings
    @Environment(\.colorScheme) private var systemScheme

    @State private var bg: String = "#00157E"
    @State private var fg: String = "#FFFFFF"

    enum HexField: Hashable { case bg, fg }
    @FocusState private var hexFocus: HexField?

    private let wcag: (aaLarge: Double, aaaLarge: Double, aaNormal: Double, aaaNormal: Double)
        = (3, 4.5, 4.5, 7)

    private var ratio: Double { ColorMath.contrastRatio(bg, fg) }

    var body: some View {
        VStack(alignment: .leading, spacing: Space._3) {
            resultRow
            wcagBadges
            colorEditor(title: "Background colour", hex: $bg, field: .bg)
            colorEditor(title: "Foreground colour", hex: $fg, field: .fg)
            savedThemesSection
            resetButton
        }
        .padding(Space._3)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(AppColor.background)
        .clipShape(RoundedRectangle(cornerRadius: Radius.regular))
        .onAppear(perform: syncFromActive)
        .onChange(of: settings.themeMode) { syncFromActive() }
        .onChange(of: systemScheme) { syncFromActive() }
        .onChange(of: settings.colorOverride) { syncFromActive() }
    }

    // MARK: - Result + badges

    private var resultRow: some View {
        HStack(spacing: Space._3) {
            ZStack {
                RoundedRectangle(cornerRadius: Radius.regular).fill(Color(hex: bg))
                RoundedRectangle(cornerRadius: Radius.regular).stroke(AppColor.separator, lineWidth: 1)
                Text("Aa")
                    .font(AppFont.font(size: AppFont.Size.h4, weight: .bold))
                    .foregroundColor(Color(hex: fg))
            }
            .frame(width: 92, height: 92)

            VStack(alignment: .leading, spacing: 2) {
                Text(String(format: "%.2f", ratio))
                    .font(AppFont.font(size: AppFont.Size.h3, weight: .bold))
                    .foregroundColor(AppColor.foreground)
                Text("contrast ratio")
                    .captionStyle()
                    .foregroundColor(AppColor.foregroundSecondary)
            }
            Spacer()
        }
    }

    private var wcagBadges: some View {
        VStack(spacing: Space._2) {
            HStack(spacing: Space._2) {
                wcagBadge("AA Large", pass: ratio >= wcag.aaLarge)
                wcagBadge("AAA Large", pass: ratio >= wcag.aaaLarge)
            }
            HStack(spacing: Space._2) {
                wcagBadge("AA Normal", pass: ratio >= wcag.aaNormal)
                wcagBadge("AAA Normal", pass: ratio >= wcag.aaaNormal)
            }
        }
    }

    private func wcagBadge(_ label: String, pass: Bool) -> some View {
        HStack(spacing: Space._1) {
            Image(pass ? "icon24-check" : "icon24-x")
                .renderingMode(.template).resizable().scaledToFit()
                .frame(width: 16, height: 16)
                .foregroundColor(pass ? AppColor.foreground : AppColor.foregroundDisabled)
            Text(label).captionStyle()
                .foregroundColor(pass ? AppColor.foreground : AppColor.foregroundDisabled)
            Spacer(minLength: 0)
            Text(pass ? "Pass" : "Fail").captionStyle().fontWeight(.medium)
                .foregroundColor(pass ? AppColor.foreground : AppColor.foregroundDisabled)
        }
        .padding(.horizontal, Space._2)
        .padding(.vertical, Space._1)
        .frame(maxWidth: .infinity)
        .background(AppColor.showAllBg)
        .clipShape(RoundedRectangle(cornerRadius: Radius.small))
    }

    // MARK: - Color editor

    private func colorEditor(title: String, hex: Binding<String>, field: HexField) -> some View {
        VStack(alignment: .leading, spacing: Space._2) {
            HStack {
                Text(title).textSmall().fontWeight(.medium)
                    .foregroundColor(AppColor.foreground)
                Spacer()
                Circle().fill(Color(hex: hex.wrappedValue))
                    .frame(width: 20, height: 20)
                    .overlay(Circle().stroke(AppColor.separator, lineWidth: 1))
            }

            TextField("#000000", text: Binding(
                get: { hex.wrappedValue },
                set: { hex.wrappedValue = sanitize($0); apply() }
            ))
            .font(AppFont.font(size: AppFont.Size.textMd))
            .foregroundColor(AppColor.foreground)
            .autocorrectionDisabled()
            .focused($hexFocus, equals: field)
            #if os(iOS)
            .textInputAutocapitalization(.characters)
            #endif
            .padding(.horizontal, Space._2)
            .padding(.vertical, Space._2)
            .fieldBorder(focused: hexFocus == field)

            channelSlider("R", hex: hex, index: 0)
            channelSlider("G", hex: hex, index: 1)
            channelSlider("B", hex: hex, index: 2)
        }
    }

    private func channelSlider(_ label: String, hex: Binding<String>, index: Int) -> some View {
        let comps = ColorMath.rgb(hex.wrappedValue)
        let value = [comps.r, comps.g, comps.b][index]
        return HStack(spacing: Space._2) {
            Text(label).captionStyle().fontWeight(.medium)
                .foregroundColor(AppColor.foregroundSecondary)
                .frame(width: 14, alignment: .leading)
            Slider(value: Binding(
                get: { value },
                set: { hex.wrappedValue = setChannel(hex.wrappedValue, index: index, to: $0); apply() }
            ), in: 0...255)
            .tint(AppColor.foreground)
            Text("\(Int(value))").captionStyle()
                .foregroundColor(AppColor.foregroundSecondary)
                .frame(width: 30, alignment: .trailing)
        }
    }

    // MARK: - Saved themes

    private var savedThemesSection: some View {
        VStack(alignment: .leading, spacing: Space._2) {
            Text("Saved themes").textSmall().fontWeight(.medium)
                .foregroundColor(AppColor.foreground)
            Text("Save multiple colour pairs and switch between them.")
                .captionStyle().foregroundColor(AppColor.foregroundSecondary)

            let columns = [GridItem(.adaptive(minimum: 150), spacing: Space._2)]
            LazyVGrid(columns: columns, alignment: .leading, spacing: Space._2) {
                addThemeTile
                ForEach(settings.savedThemes) { theme in
                    savedThemeTile(theme)
                }
            }
        }
    }

    private var addThemeTile: some View {
        Button {
            settings.saveTheme(bg: normalize(bg), fg: normalize(fg))
        } label: {
            VStack(spacing: Space._1) {
                Image("icon24-plus")
                    .renderingMode(.template).resizable().scaledToFit()
                    .frame(width: 24, height: 24)
                    .foregroundColor(AppColor.foreground)
                Text("Add theme").captionStyle().fontWeight(.medium)
                    .foregroundColor(AppColor.foreground)
            }
            .frame(maxWidth: .infinity)
            .frame(height: 96)
            .background(AppColor.showAllBg)
            .clipShape(RoundedRectangle(cornerRadius: Radius.regular))
        }
        .buttonStyle(.plain)
    }

    private func savedThemeTile(_ theme: SavedColorTheme) -> some View {
        let selected = theme.bg.uppercased() == normalize(bg) && theme.fg.uppercased() == normalize(fg)
        return Button {
            settings.colorOverride = ColorOverride(bg: theme.bg, fg: theme.fg)
        } label: {
            VStack(alignment: .leading, spacing: Space._1) {
                HStack {
                    Text(theme.name).captionStyle().fontWeight(.medium)
                        .foregroundColor(AppColor.foreground)
                        .lineLimit(1)
                    Spacer()
                    Button {
                        settings.deleteTheme(id: theme.id)
                    } label: {
                        Image("icon24-trash")
                            .renderingMode(.template).resizable().scaledToFit()
                            .frame(width: 16, height: 16)
                            .foregroundColor(AppColor.foregroundSecondary)
                    }
                    .buttonStyle(.plain)
                }
                swatchRow(color: theme.fg, label: "Foreground")
                swatchRow(color: theme.bg, label: "Background")
            }
            .padding(Space._2)
            .frame(maxWidth: .infinity, alignment: .leading)
            .frame(height: 96)
            .background(AppColor.background)
            .clipShape(RoundedRectangle(cornerRadius: Radius.regular))
            .overlay(
                RoundedRectangle(cornerRadius: Radius.regular)
                    .stroke(selected ? AppColor.foreground : AppColor.separator,
                            lineWidth: selected ? 2 : 1)
            )
        }
        .buttonStyle(.plain)
    }

    private func swatchRow(color: String, label: String) -> some View {
        HStack(spacing: Space._1) {
            Circle().fill(Color(hex: color))
                .frame(width: 14, height: 14)
                .overlay(Circle().stroke(AppColor.separator, lineWidth: 1))
            Text(label).captionStyle()
                .foregroundColor(AppColor.foregroundSecondary)
        }
    }

    // MARK: - Reset

    private var resetButton: some View {
        Button(action: resetToTheme) {
            Text("Reset to theme")
                .textSmall().fontWeight(.medium)
                .foregroundColor(AppColor.Button.secondaryFg)
                .frame(maxWidth: .infinity)
                .padding(.vertical, Space._3)
                .overlay(
                    RoundedRectangle(cornerRadius: Radius.regular)
                        .stroke(AppColor.Button.secondaryBorder, lineWidth: 1)
                )
        }
        .padding(.top, Space._1)
    }

    // MARK: - Logic

    /// Reflect the currently-applied colours in the editor inputs. When no
    /// override is set, this is the base of the active Appearance (so flipping
    /// light/dark swaps the inputs — white/blue exchange roles).
    private func syncFromActive() {
        if let o = settings.colorOverride {
            if bg != o.bg { bg = o.bg }
            if fg != o.fg { fg = o.fg }
        } else {
            let scheme = settings.themeMode == .system
                ? systemScheme
                : (settings.themeMode == .dark ? .dark : .light)
            let base = scheme == .dark ? ColorOverride.webDark : ColorOverride.webLight
            bg = base.bg; fg = base.fg
        }
    }

    private func apply() {
        guard isValid(bg), isValid(fg) else { return }
        settings.colorOverride = ColorOverride(bg: normalize(bg), fg: normalize(fg))
    }

    private func resetToTheme() {
        settings.colorOverride = nil
        syncFromActive()
    }

    private func setChannel(_ hex: String, index: Int, to value: Double) -> String {
        var c = ColorMath.rgb(hex)
        let v = max(0, min(255, value))
        switch index { case 0: c.r = v; case 1: c.g = v; default: c.b = v }
        return ColorMath.hex(c)
    }

    private func sanitize(_ s: String) -> String {
        "#" + String(s.uppercased().filter { $0.isHexDigit }.prefix(6))
    }

    private func normalize(_ s: String) -> String {
        let h = s.hasPrefix("#") ? String(s.dropFirst()) : s
        return "#" + h.uppercased()
    }

    private func isValid(_ s: String) -> Bool {
        let h = s.hasPrefix("#") ? String(s.dropFirst()) : s
        return h.count == 6 && h.allSatisfy { $0.isHexDigit }
    }
}

#Preview {
    ColorThemeEditor()
        .environmentObject(AppSettings.shared)
        .padding()
}
