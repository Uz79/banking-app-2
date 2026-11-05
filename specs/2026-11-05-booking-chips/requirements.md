Branch: `feature/booking-chips` (from `feature/bookings-edit`, so it merges after 31)

# Booking rows: real status, counterparty icons and a status chip (43): requirements

Roadmap item 43 (`specs/roadmap.md`). On All bookings every built-in row opens as "Executed" with no Edit, the Pending and Recurring ones too: `buildAllBookingsRowData` in `js/payment-details.js` ignores the row's `data-status`. Reading the code for this spec found that the row icons carry meaning they shouldn't: `isInternalTransferRow` treats any row with the `#i-repeat` icon as a transfer, so Rent (Recurring tab) opens as an internal transfer. (Pizza on Account details also has the icon, but it is a transfer in the data: from Savings, with "Pizza" as its message.) The direction for this item was settled before the interview (Klaudiusz, 2026-11-05): a row's icon names the counterparty, a small tonal chip names the status or the frequency, and the data, not the icon, says what a booking is.

## Scope

**In:**

1. Built-in rows open with their real status and their Execute on date, on All bookings and Account details (D1, D2)
2. Edit stays off on built-in rows until 42 (D3)
3. The leading icon names the counterparty, never the status (D4)
4. The booking type comes from row data, not the icon (D5)
5. One tonal chip after the name: "Pending", or the frequency, or none (D6, D7, D8)
6. Recurring bookings made in the app store a frequency, Monthly for now (D9)
7. A tonal variant of the Chip component (D10, D11)
8. All bookings and Account details, built-in rows and rows drawn from the payment state (D12)

**Out (not in this branch):**

- Edit on built-in rows, and remembering an edited built-in row across a reload: 42, which turns Edit on when it lands (D3)
- A "Standing order: <frequency>" line in an executed instance's sheet, linking to the order: new roadmap item 44
- A frequency choice in Pay and the transfer: new roadmap item 45 (D9)
- What happens when a pending booking's date arrives (built-in pending rows dated 30.10.2026 and 03.11.2026 stay pending): 37
- Brand logos as counterparty icons (D4 keeps the slot for them)
- Trade bookings' icons (`i-plus` / `i-minus`): trades do appear in these lists (a buy debits its account), but keep their buy and sell icons; their rows get `data-type="trade"` and no chip (D4). Whether a trade's counterparty icon should be the custody account is left for review
- A pending transfer's status in its sheet (32), keyboard access to rows (33)
- A transfer made in the app opens as a payment on All bookings, from 31's setup (found in the build): new roadmap item 46

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **Built-in rows carry their status and the sheet reads it.** All bookings' rows already have `data-status`; `buildAllBookingsRowData` uses it instead of `'executed'`. Account details' seven built-in rows get `data-status` too, taken from `BOOKING_MAP_HOUSEHOLD` in `payment-details.js` (Apple is `pending` there today, the rest `executed`), and the sheet takes the row's status over the map's | Settled direction. One source per row: its markup |
| D2 | **Built-in rows carry their date as `data-execute-on`** (`dd.mm.yyyy`, as stored bookings keep `executeOn`): the pending rows' "Execute on" group date, the standing orders' "Next on" date. It goes into the sheet's data, as a stored booking's `executeOn` does, for Edit once 42 turns it on. The sheet has no date line, for stored bookings either; adding one is not part of this item | Settled direction. The group label is display text, not data |
| D3 | **Edit stays off on built-in rows until 42** (interview). The sheet shows a built-in row's real status, but its Edit buttons only for a booking from the payment state. Account details' Apple, which shows Edit today, loses it until 42 | Interview. An edit of a built-in row hides it only until a reload (42); keeping Edit off avoids showing that. 42 turns Edit on |
| D4 | **The leading icon names the counterparty.** A payment out: `#i-corner-up-right`; money in: `#i-download` (a brand logo later, in the same slot). A transfer between own accounts: the other account's icon (Household `#i-home`, Savings `#i-anchor`, Custody `#i-life-buoy`, the icons in `ACCOUNTS` in `js/all-bookings.js`); to a mandate, the payment-out icon. `#i-repeat` no longer appears on booking rows. Rows from the payment state get their icon at render time from `kind`, `direction`, `fromKey` and `toKey`, so bookings stored before this branch follow too; the stored `icon` field stays as it is | Settled direction. Deriving at render needs no stored-data migration |
| D5 | **The booking type is row data: `data-type="payment"` or `data-type="transfer"`** on every row, built-in and rendered from the state (`kind: 'iat'` gives `transfer`). `isInternalTransferRow` reads it and no longer looks at the icon (nor at a "Transfer to" name). Fixes Rent opening as a transfer; Pizza stays a transfer, as its data says | Settled direction. Icons no longer carry meaning |
| D6 | **At most one chip per row, after the name, always shown** (also in the Pending and Recurring tabs). In order: "Pending" for a booking not executed yet, any future booking included; else the frequency ("Monthly", "Weekly", "Quarterly", "Yearly"), never the word "Recurring", for a standing order in the Recurring tab and for each executed instance of one; else no chip, for an executed one-off | Settled direction |
| D7 | **Which executed built-in rows are standing-order instances is row data: `data-frequency`** (`monthly`, `weekly`, `quarterly`, `yearly`) on the standing orders and on their executed instances: Rent and Internet & Phone on All bookings, Rent on Account details. Salary and the other incoming rows are not ours, so no chip | Settled direction ("Built-in data needs to say which executed bookings are instances of a standing order") |
| D8 | **Labels:** `monthly` "Monthly", `weekly` "Weekly", `quarterly` "Quarterly", `yearly` "Yearly". One small map in a shared place both renderers use | No em dashes, short and plain |
| D9 | **Recurring bookings made in the app store `frequency: 'monthly'`** (interview): `commitPayment` and `commitInternalTransfer` set it when the status is `recurring`, `updatePayment` keeps it, `getState` passes it on. A recurring booking stored without it reads as Monthly | Interview. Pay and the transfer have no frequency choice (45) |
| D10 | **A tonal variant of the Chip component: `.chip--tonal`**, using `--color-btn-tonal-bg`, `--color-btn-tonal-fg` and `--color-btn-tonal-border`, in `css/styles.css` next to `.chip`. The rows use it at the small size (`.chip--sm`, 24px). No new Tag component. The theme engine already emits the tonal tokens for Multi-color themes | Settled direction. The tokens exist in Light, Dark and every theme |
| D11 | **The chip's documentation:** `designs/components/chip/chip.md` lists the tonal variant and where the app uses it. No SVG export is added to `variants/` (that comes from the design file) | The doc is the component's written spec |
| D12 | **All bookings and Account details adopt the rule now** (interview): their built-in markup, the rows `js/all-bookings.js` renders from the state (around 513), and the rows `js/data-render.js` injects on Account details (around 104). Overview and Payments list no booking rows | Interview. The rule holds wherever a booking appears |
| D13 | **The row keeps its layout:** the name shrinks with an ellipsis before the chip does; the chip never wraps. At 390px a long name is cut, the chip and the amount stay whole. The chip is plain text in the row, read after the name; no `aria-label` change | Smallest change to `.booking-row`. A screen reader hears "Rent, Monthly, minus 1'800" |
| D14 | **Search is unchanged:** it matches the name and the amount (`bindSearch` in `js/all-bookings.js`), not the chip | Searching "Monthly" isn't asked for |
| D15 | **No motion change.** The chip doesn't animate; the rows' existing motion is untouched | Nothing new to animate |
| D16 | **The merge gate:** `npm run build`; this branch's `validation.md` in a real browser (Light and Dark, a Multi-color theme, desktop and 390, keyboard, reduced motion, the first visit with nothing in `localStorage`); the baseline smoke test. 31 merges before this branch | Standard gate |

## Context

- Built-in rows on All bookings (`all-bookings-and-payments.html`): 24 executed, 3 pending (Swisscom, Helvetia Insurance under "Execute on 30.10.2026"; Tax office Zurich under "Execute on 03.11.2026"), 3 recurring (Rent "Next on 01.11.2026"; Netflix, Internet & Phone "Next on 05.11.2026"). Icons: 23 `#i-corner-up-right`, 3 `#i-download`, 3 `#i-repeat` (Transfer to Household, Transfer to Savings, Rent), 1 `#i-trending-up`.
- Built-in rows on Account details (`account-details.html`): Apple, Cafe, Pizza (`#i-repeat`, a transfer in the map), Railway, Salary, Rent, Transfer to Household (`#i-repeat`), none with `data-status`. Their sheet data comes from `BOOKING_MAP_HOUSEHOLD` by name (`js/payment-details.js` from line 28).
- `isInternalTransferRow`: `js/payment-details.js:208`. `buildAllBookingsRowData`: 213. The sheet's status and Edit: `openOverlay`, around 656 (`pd--pending` shows Edit, `css/styles.css` 7656 and 7691). The fallback for rows from the state: around 851.
- Stored bookings: `commitPayment` (`js/payment-state.js:473`), `commitInternalTransfer` (500, `icon: 'i-repeat'` out, `'i-download'` in, `kind: 'iat'`), `updatePayment` (563), `getState` (363, copies fields one by one).
- `.chip`: `css/styles.css:1372`; `.booking-row`: 2051 (flex, the name `flex: 1`).
- Tonal tokens: `css/tokens.css` 163 (Light) and 212 (Dark); `js/theme-engine.js` sets them for Multi-color themes.

## Open questions

- Apple on Account details: answered in the build. It sits in the Today group, and the sheet treats anything under Yesterday as executed, so its `pending` in the map is on purpose. It keeps `pending` and shows "Pending" in the list.
