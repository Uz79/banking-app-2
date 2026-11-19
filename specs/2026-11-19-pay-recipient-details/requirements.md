# Pay: the recipient step's typed details count (39): requirements

Branch: `feature/pay-recipient-details`

Roadmap item 39, found while writing 29's spec (2026-11-04). The recipient step of Pay fills Recipient name, Street and City from the chosen recipient, but nothing reads the inputs back (`js/payment-overlay.js`, the `input` handler only syncs the clear buttons). A name changed there is ignored: the schedule step, the summary, the confirmation and the stored booking keep the name picked from the list.

## Scope

**In:**

1. What is typed in Recipient name, Street and City becomes the flow's recipient for this payment: the schedule and summary steps, the confirmation and the stored booking.
2. An emptied Recipient name blocks Next with a field error.
3. The stored booking keeps the typed street and city, and the booking sheet and Edit/Copy read them.

**Out (one-line pointers, not this branch):**

- The saved recipient list: it is not edited, and no recipient is created from typed details.
- The Country select, IBAN and Bank (read-only values on the step).
- Validating a name's or address's format or length beyond "not empty".
- Frequency in Pay (45) and Edit/Copy of a pending transfer (51).

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **Typed Name, Street and City apply to this payment only.** The flow's `live.recipient` becomes a copy of the chosen recipient with the typed values; the list entry is untouched and nothing new is saved. Picking another recipient in the search replaces the copy with a fresh record. | Klaudiusz's answer. Smallest change, no shared mock data edited, no new storage. |
| D2 | **The values are read as they are typed** (`input` event on the recipient step) and trimmed when read, so Back and forward, the Edit links on the summary, and the schedule and summary steps always show what the step shows. | One source of truth for the flow; no read on Next that Back could skip. |
| D3 | **An emptied (or blank) Recipient name blocks Next** and shows "Enter a name." on the field with the field-error component (`UZBankFieldError`, roadmap 54), focus moved to the field. The error clears as soon as a name is typed. Street and City may be empty. | Klaudiusz's answer, in the amount's error style. Street and City were not asked about and are not needed to book a payment in this prototype. |
| D4 | **The stored booking gains optional `recipientStreet` and `recipientCity`.** `commitPayment` and `updatePayment` (`js/payment-state.js`) write them when the flow has them; a booking without them (older ones, built-in rows) behaves as today. | Klaudiusz's answer. The sheet cannot show a typed address otherwise; optional fields keep old data working. |
| D5 | **The booking sheet's "To" shows the booking's own name, street and city** when it has them, before the catalogue lookup by name (`js/payment-details.js` about line 1145). | Without this the sheet still shows the catalogue's address for a typed name. |
| D6 | **Edit and Copy seed the flow from the booking:** the edit context's recipient is the catalogue record with the booking's name, street and city laid over it (a name not in the catalogue keeps today's `custom` fallback with its street and city). | An edit of a payment must open on what was typed, not on the list's version. |
| D7 | **Copy:** "Enter a name." (error). No em dashes. | Matches "Enter an amount." |
| D8 | **No new storage key, no new page, no dependency.** The bookings live in the existing payment state key. | Nothing to list in `apps/web/README.md` unless it documents the booking shape (checked at wrap-up). |

## Context

- `paintRecipientStep` (`js/payment-overlay.js` about line 203) fills the inputs from `live.recipient`; the `input` listener (about line 641) only calls `syncOneRecipientDetailClear`.
- Name is read in `paintAmountStep`/the schedule and summary paints (about lines 229, 244, 316, 335) and by `commitPayment` (`js/payment-state.js` about line 480), which stores only `recipientName`.
- The recipient is picked in the search step (about line 744) and by `pickRandomRecipient` (about line 353).
- `advanceStep` (about line 1169) is where Next is handled; the error pattern is `checkAmount`/`recheckAmount` (about lines 553 to 575).
- The sheet looks the address up with `findRecipientByName` (`js/payment-details.js` about lines 291, 419, 927, 1145).

## Open questions

- Which Next control the recipient step uses and how it disables: settled in the build by reading `advanceStep`; the error appears on the field, not as a disabled button, unless the step already disables Next.
