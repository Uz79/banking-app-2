/**
 * Investment opening ("Open asset management"): the screens and their copy, in one place (D5, D23).
 * Copy is English, short and plain, with no em dashes. Screens 1 to 10 are counted by the step indicator;
 * completion and the ineligible exit come after them and are not counted (`counted: false`).
 */

/* The session draft (D18): `{ step, answers, fridgeAmount, from }`, cleared on completion and by the demo data reset. */
export const DRAFT_KEY = 'uzBankWebOpeningDraft';

export const SCREENS = [
  {
    id: 'intro', title: 'Open asset management',
    text: 'It takes about 5 minutes. We ask what you know, what you want, about your money and about your risk.',
    next: 'Start',
  },
  { id: 'knowledge', title: 'How well do you know investing?' },
  { id: 'purpose', title: 'What is the money for?' },
  { id: 'amount', title: 'How much do you want to invest?' },
  { id: 'risk', title: 'How do you feel about risk?' },
  { id: 'strategy', title: 'Choose your strategy' },
  { id: 'esg', title: 'Sustainability' },
  { id: 'tax', title: 'Tax status' },
  { id: 'documents', title: 'Documents' },
  { id: 'summary', title: 'Your asset management', next: 'Open asset management' },
  { id: 'complete', title: 'Your asset management is open', counted: false, next: 'Done' },
  { id: 'ineligible', title: 'We cannot open this online', counted: false },
];

/* Until each screen has its questions, it shows this line. */
export const PLACEHOLDER = 'The questions for this screen come next.';
