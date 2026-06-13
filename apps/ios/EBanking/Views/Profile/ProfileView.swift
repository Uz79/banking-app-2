import SwiftUI

enum ProfileTopic: String, CaseIterable, Identifiable {
    case theme = "Theme"
    case legibility = "Legibility"
    case persona = "Persona"
    var id: String { rawValue }
}

struct ProfileView: View {
    @EnvironmentObject private var settings: AppSettings
    @State private var topic: ProfileTopic = .theme
    @State private var topShadow = false

    var body: some View {
        VStack(spacing: 0) {
            VStack(spacing: 0) {
                CustomNavBar(title: "Profile")

                // Topic tabs (mirrors web .profile-topic-tabs)
                SegmentedControl(
                    options: ProfileTopic.allCases,
                    selection: $topic,
                    label: { $0.rawValue }
                )
                .padding(.horizontal, Space._3)
                .padding(.bottom, Space._3)
            }
            .topChromeShadow(topShadow)

            EdgeShadowScroll(topShadow: $topShadow) {
                VStack(alignment: .leading, spacing: Space._4) {
                    switch topic {
                    case .theme:      themePanel
                    case .legibility: legibilityPanel
                    case .persona:    personaPanel
                    }

                    logoutButton
                }
                .padding(.horizontal, Space._3)
                .padding(.top, Space._1)
                .padding(.bottom, Space._6)
                .frame(maxWidth: .infinity, alignment: .leading)
            }
        }
        .background(AppColor.backgroundSecondary)
        #if os(iOS)
        .navigationBarHidden(true)
        #endif
    }

    // MARK: - Theme

    private var themePanel: some View {
        VStack(alignment: .leading, spacing: Space._4) {
            // Base appearance (used when no custom colours are set)
            VStack(alignment: .leading, spacing: Space._2) {
                panelHeader(
                    title: "Appearance",
                    subtitle: settings.colorOverride == nil
                        ? "Follow the system setting, or pick light / dark."
                        : "Custom colours are active. Reset below to use these again."
                )
                SegmentedControl(
                    options: ThemeMode.allCases,
                    selection: Binding(
                        get: { settings.themeMode },
                        set: { settings.themeMode = $0 }
                    ),
                    label: { $0.label }
                )
            }

            // Custom colour theme (contrast checker)
            VStack(alignment: .leading, spacing: Space._2) {
                panelHeader(
                    title: "Colour theme",
                    subtitle: "Pick a background and foreground. The whole app updates live, with WCAG contrast feedback."
                )
                ColorThemeEditor()
            }
        }
    }

    // MARK: - Legibility

    private var legibilityPanel: some View {
        VStack(alignment: .leading, spacing: Space._3) {
            panelHeader(
                title: "Legibility",
                subtitle: "Control type size and interface density. Fonts, padding and gaps update across the app."
            )

            VStack(spacing: Space._2) {
                ForEach(LegibilityPreset.allCases) { preset in
                    Button {
                        withAnimation(.easeInOut(duration: 0.2)) { settings.legibility = preset }
                    } label: {
                        legibilityCard(preset)
                    }
                    .buttonStyle(.plain)
                }
            }

            // Live preview that responds to the chosen scale
            VStack(alignment: .leading, spacing: Space._1) {
                Text("PREVIEW")
                    .captionStyle()
                    .foregroundColor(AppColor.foregroundSecondary)
                Text("Monthly spending")
                    .font(AppFont.font(size: AppFont.Size.h6, weight: .medium))
                    .foregroundColor(AppColor.foreground)
                Text("Text, spacing and component rhythm respond together so the interface stays coherent.")
                    .textSmall()
                    .foregroundColor(AppColor.foregroundSecondary)
            }
            .padding(Space._3)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(AppColor.background)
            .clipShape(RoundedRectangle(cornerRadius: Radius.regular))
        }
    }

    private func legibilityCard(_ preset: LegibilityPreset) -> some View {
        let isSelected = settings.legibility == preset
        return VStack(alignment: .leading, spacing: 2) {
            Text(preset.eyebrow.uppercased())
                .captionStyle()
                .foregroundColor(AppColor.foregroundSecondary)
            Text(preset.title)
                .textSmall().fontWeight(.medium)
                .foregroundColor(AppColor.foreground)
            Text(preset.meta)
                .captionStyle()
                .foregroundColor(AppColor.foregroundSecondary)
        }
        .padding(Space._3)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(isSelected ? AppColor.Button.tonalBg : AppColor.background)
        .clipShape(RoundedRectangle(cornerRadius: Radius.regular))
        .overlay(
            RoundedRectangle(cornerRadius: Radius.regular)
                .stroke(isSelected ? AppColor.foreground : AppColor.separator,
                        lineWidth: isSelected ? 1.5 : 1)
        )
    }

    // MARK: - Persona

    private var personaPanel: some View {
        VStack(alignment: .leading, spacing: Space._3) {
            panelHeader(
                title: "Persona",
                subtitle: "Which user type are you? Read the two descriptions and choose."
            )

            ForEach(Persona.allCases) { persona in
                Button {
                    withAnimation(.easeInOut(duration: 0.2)) { settings.persona = persona }
                } label: {
                    personaCard(persona)
                }
                .buttonStyle(.plain)
            }
        }
    }

    private func personaCard(_ persona: Persona) -> some View {
        let isSelected = settings.persona == persona
        return HStack(alignment: .top, spacing: Space._3) {
            // Radio
            ZStack {
                Circle()
                    .stroke(isSelected ? AppColor.foreground : AppColor.separator, lineWidth: 2)
                    .frame(width: 22, height: 22)
                if isSelected {
                    Circle().fill(AppColor.foreground).frame(width: 12, height: 12)
                }
            }
            .padding(.top, 2)

            VStack(alignment: .leading, spacing: Space._1) {
                Text(persona.eyebrow.uppercased())
                    .captionStyle()
                    .foregroundColor(AppColor.foregroundSecondary)
                Text(persona.name)
                    .textMain().fontWeight(.medium)
                    .foregroundColor(AppColor.foreground)
                VStack(alignment: .leading, spacing: 2) {
                    ForEach(persona.descriptionLines, id: \.self) { line in
                        Text("•  \(line)")
                            .captionStyle()
                            .foregroundColor(AppColor.foregroundSecondary)
                    }
                }
                .padding(.top, 2)
            }

            Spacer(minLength: 0)

            // Avatar
            Text(persona.initials)
                .font(AppFont.font(size: AppFont.Size.textLg, weight: .bold))
                .foregroundColor(AppColor.foreground)
                .frame(width: 56, height: 56)
                .background(AppColor.Button.tonalBg)
                .clipShape(Circle())
        }
        .padding(Space._3)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(isSelected ? AppColor.Button.tonalBg : AppColor.background)
        .clipShape(RoundedRectangle(cornerRadius: Radius.regular))
        .overlay(
            RoundedRectangle(cornerRadius: Radius.regular)
                .stroke(isSelected ? AppColor.foreground : AppColor.separator,
                        lineWidth: isSelected ? 1.5 : 1)
        )
    }

    // MARK: - Shared

    private func panelHeader(title: String, subtitle: String) -> some View {
        VStack(alignment: .leading, spacing: Space._1) {
            Text(title)
                .font(AppFont.font(size: AppFont.Size.h6, weight: .medium))
                .foregroundColor(AppColor.foreground)
            Text(subtitle)
                .textSmall()
                .foregroundColor(AppColor.foregroundSecondary)
        }
    }

    private var logoutButton: some View {
        Button(action: {}) {
            HStack(spacing: Space._2) {
                Image("icon24-log-out")
                    .renderingMode(.template)
                    .resizable().scaledToFit()
                    .frame(width: 20, height: 20)
                Text("Logout")
                    .textSmall().fontWeight(.medium)
            }
            .foregroundColor(AppColor.foreground)
            .frame(maxWidth: .infinity)
            .padding(.vertical, Space._3)
            .background(AppColor.showAllBg)
            .clipShape(RoundedRectangle(cornerRadius: Radius.regular))
        }
        .padding(.top, Space._2)
    }
}

#Preview {
    ProfileView()
        .environmentObject(AppSettings.shared)
        .environmentObject(ScrollEdgeModel())
}
