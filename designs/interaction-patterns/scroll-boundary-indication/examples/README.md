# Scroll boundary indication — examples

Local Figma exports for the four mobile edge states. Paths are relative to `scroll-boundary-indication/`.

## Pattern states (this folder)

| Variant | State | Assets |
|---------|-------|--------|
| `mobile-top-indication` | Content above top bar — **top shadow on** | `mobile-top-indication/default.svg`, `default.png` |
| `mobile-top-at-boundary` | At top — **no top shadow** | `mobile-top-at-boundary/default.svg`, `default.png` |
| `mobile-bottom-indication` | Content below tab bar — **bottom shadow on** | `mobile-bottom-indication/default.svg`, `default.png` |
| `mobile-bottom-at-boundary` | At bottom — **no bottom shadow** | `mobile-bottom-at-boundary/default.svg`, `default.png` |

Figma source names (normalized on import):

| Loose export | Target |
|--------------|--------|
| `Content Indication Effect - above - mobile` | `mobile-top-indication/` |
| `Content Indication Effect - above - mobile-1` | `mobile-top-at-boundary/` |
| `Content Indication Effect - beneath - mobile` | `mobile-bottom-indication/` |
| `Content Indication Effect - beneath - mobile 02` | `mobile-bottom-at-boundary/` |

## In-context screen references

Full screens that apply this pattern in production layouts:

| Screen | Variant | Path |
|--------|---------|------|
| All bookings | `mobile-content-indication` | [`../../../screens/all-bookings-and-payments/variants/mobile-content-indication/default.svg`](../../../screens/all-bookings-and-payments/variants/mobile-content-indication/default.svg) |
| All bookings | `desktop-content-indication` | [`../../../screens/all-bookings-and-payments/variants/desktop-content-indication/default.svg`](../../../screens/all-bookings-and-payments/variants/desktop-content-indication/default.svg) |
| Account information | `mobile-content-indication` | [`../../../screens/account-information/variants/mobile-content-indication/default.svg`](../../../screens/account-information/variants/mobile-content-indication/default.svg) |
