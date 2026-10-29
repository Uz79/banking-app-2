# Investment opening: intervention map (draft)

Status: draft of 2026-10-28, input for roadmap item 9 (9a to 9g). Every step of the opening, how it is presented, what gets in people's way, and how the assistant helps. Answers in the chips are first drafts: tone and wording are settled in the 9b interview, and every answer must pass the rules below before it ships.

## Sources

- **Observed** (Klaudiusz's usability tests and interviews of the bank's existing flow): the flow is too long and people tire; giving the financial situation is uncomfortable; people fear they lack the knowledge to answer; people wish for a person.
- **Assumed** (to check in a test of this prototype): marked "assumed" in the table.
- Reference frames of the old flow: `~/Documents/Projects/AI Portfolio Projects/Banking App/_resources/261028_product-opening/scenario`.

## Rules for the assistant

1. The customer's answers are their own. The assistant explains terms, gives neutral examples and says what an answer leads to. It never says which option to pick.
2. No personal investment advice. When a question asks for one ("which strategy should I take?"), it explains how the recommendation is made and offers a person.
3. Every answer is written in advance and reviewable. No generated text.
4. It is always one tap away and never in the way: no pop-ups, at most one proactive nudge per step, a dismissal is remembered.
5. A person is always the last option: "Talk to an advisor" is in every chip set from the documents step on, and wherever a chip cannot help.
6. The helper speaks for the bank; the persona avatar is the customer and does not advise.

## Help level by User Type

The average of the three Profile sliders (`uzBankWebPersonaProfile`) sets how the helper behaves. Starting values, tuned in 9f.

| User Type | Nudge after (share of the step's reading time) | Answer length | Proactive nudges |
|---|---|---|---|
| Newbie | 1.5x | full answer plus an example | yes |
| All-rounder | 2.5x | short answer, "more" on request | yes, only on the steps marked high below |
| Power user | never | one or two sentences | no, help only when asked |

## Modes

- **Form:** plain, quick, prefilled where possible. The assistant is available but rarely needed.
- **Module:** a playful presentation of a step people find uncomfortable (the fridge, the risk experience, the vehicles). Same data, same scoring as the form it replaces.
- **Assist:** a knowledge-heavy step where the assistant is expected to help; marked high.

## Steps

The order of 9a. "Old" names the reference frames.

| # | Step | Old | Mode | Pain point | Prefill | Assist need | Hesitation signals (9f) |
|---|---|---|---|---|---|---|---|
| 0 | Intro: what happens, how long, progress | interest | Form | Too long, no sense of progress (observed) | | low | |
| 1 | Investment knowledge | Kenntnisse | Assist | Fear of lacking knowledge (observed); unsure what "basic" means (assumed) | Financial knowledge slider, confirmed | high | switching between options |
| 2 | Purpose | Anlagebedürfnis | Form | Real estate caps the horizon, a surprise (assumed) | | low | |
| 3 | Horizon | Anlagedauer | Form | | Real estate: capped | low | |
| 4 | Amount and the amount check | Wieviel, Validierung | Module (the fridge, 8a) | Uncomfortable to give the situation (observed); "why is my amount too high?" (assumed) | Investable amount from the fridge; balances | high on the check | time on the check, editing the amount back and forth |
| 5 | Risk | Risiko I to III | Form, then Module (9e) | Questions feel abstract and like a test (observed: fear of lacking knowledge) | | high | switching between options, time |
| 6 | Strategy | Strategie, Übersicht | Form, then Module (9d) | Five similar descriptions; "is the recommendation binding?" (assumed) | Recommended from risk | medium | swiping through all cards, going back |
| 7 | ESG preference | ESG Präferenz | Form | "Does important cost me return?" (assumed) | | low | |
| 8 | Tax status: Switzerland | Steuerstatus | Form | | Domicile from the profile | low | |
| 9 | Tax status: US | Schweiz USA | Assist | Legal terms: US territories, substantial presence test (observed: fear of lacking knowledge) | | high | info icons, time |
| 10 | Contract documents | Dokumentation | Assist | 13 documents, unclear which matter (observed) | | high | time, opening several documents |
| 11 | Summary and confirm | Zusammenfassung, Abschluss | Form | Last doubts before committing (assumed) | everything | medium | going back to edit |
| 12 | Completion | Eröffnung abgeschlossen | Form | "How do I transfer the money?" (assumed) | | low | |
| (9g) | Personalisation | Personalisierung | Form | Optional; adds length (observed: too long) | | low | |

## Chips per step (first drafts)

Each step shows three or four chips; tapping one shows its answer and may offer follow-up chips. "Talk to an advisor" is the fallback everywhere.

**1 Investment knowledge**
- *Why do you ask this?* The law asks us to check that a product fits what you know about investing. It is not a test, and there is no wrong answer.
- *What counts as basic knowledge?* For example: you know that share prices go up and down, and that a fund holds many investments. Choose what feels true; you do not need to study first.
- *What happens if I choose "none"?* You can still open this product: the bank takes the investment decisions. We explain the risks a little more fully.

**4 Amount check**
- *Why is my amount above the recommendation?* The recommendation is what the fridge left over after your reserves. Investing more would use money you set aside for daily needs or reserves.
- *Can I invest more anyway?* The choice is yours. If you go above the recommendation, keep in mind you may need to sell at a bad moment to cover an expense.
- *Can I add money later?* Yes, any time after opening.

**5 Risk**
- *What does a loss of 20% mean in francs?* Shown with their own amount: "CHF 20'000 would be CHF 16'000 for a while."
- *Is there a right answer?* No. The questions find out how you feel about ups and downs, so your strategy fits you.
- *Can I change this later?* Yes, you can change your strategy after opening; we ask these questions again.

**6 Strategy**
- *Why is this one recommended?* It follows from your answers on risk, horizon and knowledge. It is a match to your answers, not a forecast.
- *What is the difference between the strategies?* The share of shares (equities): more shares mean higher expected return and bigger swings.
- *Do I have to take the recommendation?* No, you can choose a more careful one. Whether a riskier one than recommended is allowed in an asset management mandate (suitability under FinSA) is to be confirmed before this answer ships.

**7 ESG**
- *What does sustainable mean here?* Investments chosen with environmental, social and governance criteria.
- *Does it cost me return?* Not necessarily; it changes what you invest in, not the fee.

**9 Tax status: US**
- *What are US territories?* Places such as Puerto Rico, Guam or the US Virgin Islands.
- *What is the substantial presence test?* A count of days you spent in the US in the last three years. If you have not lived or stayed long in the US, it most likely does not apply. If unsure, check with an advisor.
- *Why does a Swiss bank ask this?* An agreement between Switzerland and the US (FATCA) requires us to know whether you pay tax in the US.
- *Talk to an advisor*

**10 Contract documents**
- *Which documents matter most?* The asset management mandate and the custody contract are the contracts; the rest are information sheets.
- *What does "special risks in securities trading" say?* A short plain-language summary of the brochure (to write).
- *Do I have to read everything now?* You confirm you have read them. You can download them and come back; your answers are kept until you finish (to confirm in 9a).
- *Talk to an advisor*

**11 Summary**
- *Can I still change something?* Yes, every line has an edit button.
- *What happens when I confirm?* The mandate is opened; you transfer the amount and it is invested within about three working days.

**12 Completion**
- *How do I transfer the money?* From your account in this app, to the new custody account (link to the transfer flow).

## Open

- The helper's name, tone and look (9b).
- Which old screens merge in 9a (for example purpose and horizon on one screen).
- Whether answers survive closing the flow (9a); it decides the documents chip.
- The plain-language summaries of the documents (10).
