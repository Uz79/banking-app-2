import SwiftUI
#if canImport(UIKit)
import UIKit
import CoreImage.CIFilterBuiltins
#endif

/// Share information sheet (web designs/screens/share-information):
/// a QR code of the account payment info + the fields it encodes.
struct ShareInformationView: View {
    let account: Account
    @Environment(\.dismiss) private var dismiss

    private var owner: String { AppSettings.shared.persona.name }
    private var ownerAddress: String { "\(owner)\nHauptstrasse 1\n8001 Zürich" }
    private let bankAddress = "MIGROS Bank\nIndustriestrasse 117\nCH-8304 Zürich (Wallisellen)"

    private var shareText: String {
        "\(owner)\nIBAN \(account.iban)\nMIGROS Bank"
    }

    var body: some View {
        VStack(spacing: 0) {
            CustomNavBar(title: "Share information", showClose: true, onClose: { dismiss() })

            ScrollView {
                VStack(spacing: Space._4) {
                    qrCard
                    intro
                    fieldsCard
                }
                .padding(.horizontal, Space._3)
                .padding(.top, Space._3)
                .padding(.bottom, Space._6)
            }
        }
        .background(AppColor.backgroundSecondary)
        #if os(iOS)
        .presentationDetents([.large])
        .presentationDragIndicator(.visible)
        #endif
    }

    private var qrCard: some View {
        VStack(spacing: Space._3) {
            qrImageView
                .frame(width: 180, height: 180)
                .padding(Space._3)
                .background(Color.white)
                .clipShape(RoundedRectangle(cornerRadius: Radius.regular))

            #if os(iOS)
            ShareLink(item: shareText) {
                HStack(spacing: Space._2) {
                    Image(systemName: "square.and.arrow.up")
                    Text("Share").textSmall().fontWeight(.medium)
                }
                .foregroundColor(AppColor.Button.primaryFg)
                .padding(.horizontal, Space._4)
                .padding(.vertical, Space._2)
                .background(AppColor.Button.primaryBg)
                .clipShape(Capsule())
            }
            #endif
        }
        .frame(maxWidth: .infinity)
        .padding(Space._4)
        .background(AppColor.background)
        .clipShape(RoundedRectangle(cornerRadius: Radius.regular))
    }

    @ViewBuilder
    private var qrImageView: some View {
        #if canImport(UIKit)
        if let img = Self.qr(from: shareText) {
            Image(uiImage: img)
                .interpolation(.none)
                .resizable()
                .scaledToFit()
        } else {
            Image(systemName: "qrcode").resizable().scaledToFit().foregroundColor(.black)
        }
        #else
        Image(systemName: "qrcode").resizable().scaledToFit().foregroundColor(.black)
        #endif
    }

    private var intro: some View {
        Text("The QR code contains the following information:")
            .textSmall()
            .foregroundColor(AppColor.foregroundSecondary)
            .frame(maxWidth: .infinity, alignment: .leading)
    }

    private var fieldsCard: some View {
        VStack(spacing: 0) {
            field("Owner address", value: ownerAddress)
            Divider().padding(.horizontal, Space._3)
            field("IBAN", value: account.iban)
            Divider().padding(.horizontal, Space._3)
            field("Bank address", value: bankAddress)
        }
        .background(AppColor.background)
        .clipShape(RoundedRectangle(cornerRadius: Radius.regular))
    }

    private func field(_ label: String, value: String) -> some View {
        VStack(alignment: .leading, spacing: Space._1) {
            Text(label).captionStyle().foregroundColor(AppColor.foregroundSecondary)
            HStack(alignment: .top) {
                Text(value).textSmall().foregroundColor(AppColor.foreground)
                Spacer()
                Button {
                    #if canImport(UIKit)
                    UIPasteboard.general.string = value
                    #endif
                } label: {
                    Image("icon24-copy")
                        .renderingMode(.template).resizable().scaledToFit()
                        .frame(width: 18, height: 18)
                        .foregroundColor(AppColor.foregroundSecondary)
                }
                .buttonStyle(.plain)
            }
        }
        .padding(.horizontal, Space._3)
        .padding(.vertical, Space._2)
    }

    #if canImport(UIKit)
    private static func qr(from string: String) -> UIImage? {
        let context = CIContext()
        let filter = CIFilter.qrCodeGenerator()
        filter.message = Data(string.utf8)
        filter.correctionLevel = "M"
        guard let output = filter.outputImage?
                .transformed(by: CGAffineTransform(scaleX: 10, y: 10)),
              let cg = context.createCGImage(output, from: output.extent)
        else { return nil }
        return UIImage(cgImage: cg)
    }
    #endif
}

#Preview {
    ShareInformationView(account: .household)
}
