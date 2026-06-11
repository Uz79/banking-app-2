import SwiftUI

struct AccountCarousel: View {
    let accounts: [Account]
    @Binding var currentPage: Int

    @GestureState private var dragOffset: CGFloat = 0

    private var currentAccount: Account {
        accounts[currentPage]
    }

    private var totalBalance: Double {
        accounts.reduce(0) { $0 + $1.balance }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: Space._1) {
            SectionHeader(
                "All accounts",
                currency: "CHF",
                amount: formatAmount(totalBalance)
            )
            .padding(.horizontal, Space._3)

            GeometryReader { geo in
                let gap = Space._3
                HStack(spacing: gap) {
                    ForEach(0..<accounts.count, id: \.self) { idx in
                        accountCard(for: accounts[idx])
                            .frame(width: geo.size.width)
                    }
                }
                .offset(x: -CGFloat(currentPage) * (geo.size.width + gap) + dragOffset)
                .animation(.easeInOut(duration: 0.3), value: currentPage)
                .animation(.easeInOut(duration: 0.3), value: dragOffset)
                .gesture(
                    DragGesture()
                        .updating($dragOffset) { value, state, _ in
                            state = value.translation.width
                        }
                        .onEnded { value in
                            let threshold = geo.size.width * 0.25
                            if value.translation.width < -threshold, currentPage < accounts.count - 1 {
                                currentPage += 1
                            } else if value.translation.width > threshold, currentPage > 0 {
                                currentPage -= 1
                            }
                        }
                )
            }
            .frame(height: 72)
            .clipped()

            paginationControls
        }
    }

    private func accountCard(for account: Account) -> some View {
        HStack(spacing: Space._3) {
            Image(account.icon)
                .renderingMode(.template)
                .resizable()
                .scaledToFit()
                .frame(width: 24, height: 24)
                .foregroundColor(AppColor.foreground)

            VStack(alignment: .leading, spacing: 4) {
                Text(account.name)
                    .font(AppFont.font(size: AppFont.Size.textSm, weight: .medium))
                    .foregroundColor(AppColor.foreground)
                Text(account.formattedIBAN)
                    .captionStyle()
                    .foregroundColor(AppColor.foregroundSecondary)
            }

            Spacer()

            HStack(spacing: 6) {
                Text(account.currency)
                    .captionStyle()
                    .foregroundColor(AppColor.foregroundSecondary)
                Text(account.formattedBalance)
                    .font(AppFont.font(size: AppFont.Size.textSm, weight: .bold))
                    .foregroundColor(AppColor.foreground)
            }
        }
        .padding(.horizontal, Space._3)
        .padding(.vertical, Space._3)
        .background(AppColor.background)
        .clipShape(RoundedRectangle(cornerRadius: Radius.regular))
    }

    private var paginationControls: some View {
        HStack(spacing: Space._3) {
            Button(action: {
                withAnimation { if currentPage > 0 { currentPage -= 1 } }
            }) {
                Image("icon24-chevron-left")
                    .renderingMode(.template)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 20, height: 20)
                    .foregroundColor(currentPage > 0 ? AppColor.foreground : AppColor.foregroundDisabled)
            }

            HStack(spacing: 8) {
                ForEach(0..<accounts.count, id: \.self) { idx in
                    Circle()
                        .fill(idx == currentPage ? AppColor.foreground : AppColor.separator)
                        .frame(width: 6, height: 6)
                }
            }

            Button(action: {
                withAnimation { if currentPage < accounts.count - 1 { currentPage += 1 } }
            }) {
                Image("icon24-chevron-right")
                    .renderingMode(.template)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 20, height: 20)
                    .foregroundColor(currentPage < accounts.count - 1 ? AppColor.foreground : AppColor.foregroundDisabled)
            }
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, Space._2)
    }
}
