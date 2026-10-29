/**
 * Investment opening ("Open asset management"): the screens, the questions and the rules, in one place (D5, D23).
 * Copy is English, short and plain, with no em dashes. Screens 1 to 10 are counted by the step indicator;
 * completion and the ineligible exit come after them and are not counted (`counted: false`).
 */

/* The session draft (D18): `{ step, answers, fridgeAmount, from }`, cleared on completion and by the demo data reset. */
export const DRAFT_KEY = 'uzBankWebOpeningDraft';

export const SCREENS = [
  {
    id: 'intro', title: 'Open asset management',
    text: 'It takes about 5 minutes. We ask about four things:',
    topics: ['What you know about investing', 'What you want to achieve', 'Your money', 'Your risk'],
    next: 'Start',
  },
  { id: 'knowledge', title: 'How well do you know investing?' },
  { id: 'purpose', title: 'What is the money for?' },
  { id: 'amount', title: 'How much do you want to invest?' },
  { id: 'risk', title: 'How do you feel about risk?' },
  { id: 'strategy', title: 'Choose your strategy', text: 'Based on your answers, we recommend one strategy. You can also choose a more careful one.' },
  { id: 'esg', title: 'Sustainability' },
  { id: 'tax', title: 'Tax status' },
  { id: 'documents', title: 'Documents' },
  { id: 'summary', title: 'Your asset management', next: 'Open asset management' },
  { id: 'complete', title: 'Your asset management is open', counted: false, next: 'Done' },
  { id: 'ineligible', title: 'We cannot open this online', counted: false },
];

/* Until each screen has its questions, it shows this line. */
export const PLACEHOLDER = 'The questions for this screen come next.';

/* ── Knowledge (D7) ── `profileAt`: the lowest Profile financial knowledge value (0 to 100) that preselects it. */
export const KNOWLEDGE = {
  options: [
    { id: 'none', label: 'None', line: 'I have not invested before.', profileAt: 0 },
    { id: 'basic', label: 'Basic', line: 'I know what funds and shares are.', profileAt: 25 },
    { id: 'good', label: 'Good', line: 'I have invested for some years.', profileAt: 60 },
    { id: 'expert', label: 'Expert', line: 'I follow the markets and invest regularly.', profileAt: 85 },
  ],
  preselectedNote: 'Preselected from your profile, change it if it does not fit.',
  missing: 'Choose how well you know investing.',
};

/* ── Purpose and horizon (D8) ── `maxHorizon`: the last horizon option a purpose allows. */
export const PURPOSE = {
  label: 'Purpose',
  options: [
    { id: 'wealth', label: 'Build wealth' },
    { id: 'retirement', label: 'Save for retirement' },
    { id: 'home', label: 'Buy a home', maxHorizon: 'h3to5', note: 'For a home, the money is usually needed within 5 years.' },
    { id: 'other', label: 'Something else' },
  ],
  missing: 'Choose what the money is for.',
};
export const HORIZON = {
  label: 'When will you need the money?',
  options: [
    { id: 'hlt3', label: 'Under 3 years' },
    { id: 'h3to5', label: '3 to 5 years' },
    { id: 'h6to10', label: '6 to 10 years' },
    { id: 'hgt10', label: 'More than 10 years' },
  ],
  missing: 'Choose when you will need the money.',
};

/* ── Amount and the check (D9) ── */
export const AMOUNT = {
  label: 'Amount',
  min: 5000,
  suggestion: 'The fridge suggests {amount}.',
  above: 'This is more than the fridge suggests. Investing more would use money set aside for daily needs or reserves.',
  missing: 'Enter an amount.',
  belowMin: 'The minimum is {min}.',
};

/* ── Risk (D10) ── three questions, each option with its score (D12). */
export const RISK = {
  questions: [
    {
      id: 'loss', label: 'At what loss would you switch to a more careful strategy?',
      options: [
        { id: 'l10', label: 'At a loss of 10%', score: 0 },
        { id: 'l20', label: 'At a loss of 20%', score: 1 },
        { id: 'l25', label: 'At a loss of 25%', score: 2 },
        { id: 'stay', label: 'I would stay with my strategy and might buy more', score: 3 },
      ],
    },
    {
      id: 'lottery', label: 'You are given a lottery ticket with a 50:50 chance of CHF 100\'000. What do you do?',
      options: [
        { id: 's25', label: 'Sell it for CHF 25\'000', score: 0 },
        { id: 's40', label: 'Sell it for CHF 40\'000', score: 2 },
        { id: 'keep', label: 'Keep it', score: 3 },
      ],
    },
    {
      id: 'feel', label: 'Which sentence fits you best when prices fall?',
      options: [
        { id: 'anxious', label: 'Losses make me anxious', score: 0 },
        { id: 'nervous', label: 'Losses make me nervous, but I think long term', score: 1 },
        { id: 'calm', label: 'I stay calm and might buy more', score: 3 },
      ],
    },
  ],
  missing: 'Answer all three questions.',
};

/* ── Strategies (D11), from the most careful to the riskiest. `risk` and `ret` are out of five. ── */
export const STRATEGIES = [
  { id: 'income', name: 'Income', line: 'Mostly bonds. Small ups and downs, a modest return.', risk: 1, ret: 1 },
  { id: 'conservative', name: 'Conservative', line: 'Mainly bonds, some shares. Steady, with a little more return.', risk: 2, ret: 2 },
  { id: 'balanced', name: 'Balanced', line: 'Bonds and shares in about equal parts.', risk: 3, ret: 3 },
  { id: 'growth', name: 'Growth', line: 'Mainly shares. Bigger ups and downs, more return over time.', risk: 4, ret: 4 },
  { id: 'dynamic', name: 'Dynamic', line: 'Almost only shares. The biggest ups and downs, the most return over time.', risk: 5, ret: 5 },
];
export const STRATEGY = {
  recommended: 'Recommended',
  unavailable: 'Above your risk profile',
  riskLabel: 'Risk',
  returnLabel: 'Expected return',
  fellBack: 'Your answers changed, so we now recommend {name}.',
  missing: 'Choose a strategy.',
};

/* ── The recommendation (D12, flagged: a placeholder for the bank's rules) ──
   The three risk scores are added up (0 to 9); `bands` maps the sum to a strategy (the first band whose `upTo` it does
   not exceed). Then the caps: a strategy no riskier than `max` for a short horizon or no knowledge. */
export const SCORING = {
  bands: [
    { upTo: 1, strategy: 'income' },
    { upTo: 3, strategy: 'conservative' },
    { upTo: 5, strategy: 'balanced' },
    { upTo: 7, strategy: 'growth' },
    { upTo: 9, strategy: 'dynamic' },
  ],
  caps: [
    { answer: 'horizon', is: 'hlt3', max: 'conservative' },
    { answer: 'horizon', is: 'h3to5', max: 'balanced' },
    { answer: 'knowledge', is: 'none', max: 'balanced' },
  ],
};
