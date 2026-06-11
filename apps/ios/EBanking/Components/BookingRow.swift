import SwiftUI

struct BookingRow: View {
    let booking: Booking

    var body: some View {
        HStack {
            HStack(spacing: Space._3) {
                Image(booking.icon)
                    .renderingMode(.template)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 24, height: 24)
                    .foregroundColor(AppColor.foreground)

                Text(booking.name)
                    .textSmall()
                    .foregroundColor(AppColor.foreground)
            }

            Spacer()

            HStack(spacing: 6) {
                Text(booking.currency)
                    .captionStyle()
                    .foregroundColor(AppColor.foregroundSecondary)

                Text(booking.formattedAmount)
                    .textSmall()
                    .fontWeight(.medium)
                    .foregroundColor(AppColor.foreground)
            }
        }
        .padding(.horizontal, Space._3)
        .padding(.vertical, Space._1)
    }
}

struct BookingGroupSection: View {
    let group: BookingGroup
    var onSelect: ((Booking) -> Void)?

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack {
                Text(group.title)
                    .captionStyle()
                    .foregroundColor(AppColor.foregroundSecondary)

                Spacer()

                HStack(spacing: 6) {
                    Text(group.currency)
                        .captionStyle()
                        .foregroundColor(AppColor.foregroundSecondary)
                    Text(group.formattedBalance)
                        .captionStyle()
                        .fontWeight(.medium)
                        .foregroundColor(AppColor.foreground)
                }
            }
            .padding(.horizontal, Space._3)
            .padding(.vertical, Space._1)

            ForEach(group.bookings) { booking in
                if let onSelect {
                    Button { onSelect(booking) } label: {
                        BookingRow(booking: booking).contentShape(Rectangle())
                    }
                    .buttonStyle(.plain)
                } else {
                    BookingRow(booking: booking)
                }

                if booking.id != group.bookings.last?.id {
                    Divider()
                        .padding(.horizontal, Space._3)
                }
            }
        }
    }
}

struct PendingPaymentRow: View {
    let payment: PendingPayment

    var body: some View {
        HStack {
            HStack(spacing: Space._3) {
                Image(payment.icon)
                    .renderingMode(.template)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 24, height: 24)
                    .foregroundColor(AppColor.foreground)

                Text(payment.name)
                    .textSmall()
                    .foregroundColor(AppColor.foreground)
            }

            Spacer()

            HStack(spacing: 6) {
                Text(payment.currency)
                    .captionStyle()
                    .foregroundColor(AppColor.foregroundSecondary)

                Text(payment.formattedAmount)
                    .textSmall()
                    .fontWeight(.medium)
                    .foregroundColor(AppColor.foreground)
            }
        }
        .padding(.horizontal, Space._3)
        .padding(.vertical, Space._1)
    }
}
