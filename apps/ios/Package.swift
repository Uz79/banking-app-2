// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "EBanking",
    platforms: [.iOS(.v17), .macOS(.v14)],
    targets: [
        .executableTarget(
            name: "EBanking",
            path: "EBanking"
        )
    ]
)
