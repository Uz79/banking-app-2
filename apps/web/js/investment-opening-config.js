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
  { id: 'strategy', title: 'Choose your strategy', text: 'We recommend one strategy. You can also choose a more careful one.' },
  { id: 'esg', title: 'Sustainability', text: 'Sustainable investing also looks at the environment, society and how companies are run (ESG).' },
  { id: 'tax', title: 'Tax status' },
  { id: 'documents', title: 'Documents', text: 'Take your time to read them before you continue.' },
  { id: 'summary', title: 'Your asset management', next: 'Open product' },
  { id: 'complete', title: 'Your asset management is open', counted: false, next: 'Done' },
  {
    id: 'ineligible', title: 'We cannot open this online', counted: false,
    text: 'Asset management can be opened online only if you are tax resident only in Switzerland and not a US person. An advisor can open it with you.',
  },
  /* Last in the list, so a saved draft's step numbers do not shift (9g D3). Reached only from the summary. */
  {
    id: 'personalise', title: 'Personalise your strategy', counted: false,
  },
];

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
  exampleAmount: 10000, /* the assistant's {amount} until there is one (was RISK_CHART, roadmap 82 D16) */
  suggestion: 'The fridge suggests {amount}.',
  above: 'This is more than the fridge suggests. Investing more would use money set aside for daily needs or reserves.',
  hint: 'Minimum {min}.',
  missing: 'Enter an amount.',
  belowMin: 'The minimum is {min}.',
};

/* ── Risk (D10) ── three questions, each option with its score (D12). 9e D6 to D9: the same ids and scores, worded in
   the customer's francs. `{amount}` is the amount, `{p90}` 90% of it and so on; `part` is what the chart highlights
   while the question is open. */
export const RISK = {
  questions: [
    {
      id: 'loss', part: 'bad', label: 'Say your investment falls. At what point would you switch to a more careful strategy?',
      options: [
        { id: 'l10', label: 'At {p90} (a loss of 10%)', score: 0 },
        { id: 'l20', label: 'At {p80} (a loss of 20%)', score: 1 },
        { id: 'l25', label: 'At {p75} (a loss of 25%)', score: 2 },
        { id: 'stay', label: 'I would stay and might buy more', score: 3 },
      ],
    },
    {
      id: 'lottery', part: 'band', label: 'You could keep a 50:50 chance of {amount}, or take a sure amount instead. What do you do?',
      options: [
        { id: 's25', label: 'Take {p25} for sure', score: 0 },
        { id: 's40', label: 'Take {p40} for sure', score: 2 },
        { id: 'keep', label: 'Keep the chance', score: 3 },
      ],
    },
    {
      id: 'feel', part: 'expected', label: 'Which sentence fits you best when prices fall?',
      options: [
        { id: 'anxious', label: 'Losses make me anxious', score: 0 },
        { id: 'nervous', label: 'Losses make me nervous, but I think long term', score: 1 },
        { id: 'calm', label: 'I stay calm and might buy more', score: 3 },
      ],
    },
  ],
  missing: 'Answer all three questions.',
};

/* ── The calculator in Overview's "Cash loses value" tile (roadmap 82 D5, D6, D12) ──
   Flagged: placeholders for the bank's numbers, an example and not a forecast. A curve is amount × exp(r × t + k × z × s × √t):
   k 0 for expected, +1 for good, -1 for unfavourable, so 19 in 20 outcomes fall between good and unfavourable. `r` and `s`
   rise with the strategy; balanced is the old risk chart's mix. */
export const CALCULATOR = {
  z: 1.96,
  inflation: 0.02,
  years: { min: 1, max: 30, start: 10 },
  amount: { max: 500000, step: 5000 },
  strategy: { start: 'balanced' },
  mix: {
    income: { r: 0.015, s: 0.03 },
    conservative: { r: 0.027, s: 0.055 },
    balanced: { r: 0.04, s: 0.08 },
    growth: { r: 0.052, s: 0.11 },
    dynamic: { r: 0.062, s: 0.14 },
  },
  copy: {
    title: 'Investment calculator',
    intro: 'Try what inflation or investing could do to your money.',
    years: 'Investment duration in years',
    amount: 'Amount in CHF',
    strategy: 'Strategy',
    safe: 'safe',
    risky: 'risky',
    lines: { cash: 'Cash after inflation', good: 'Good', expected: 'Expected', bad: 'Unfavourable' },
    disclaimer: 'Possible outcomes for this strategy, based on example figures. 19 in 20 outcomes end between Good and Unfavourable. Real returns vary and you can lose money.',
    beforeInflation: 'Investment values are before inflation.',
    note: 'An example, not a forecast.',
  },
};

/* ── Strategies (D11), from the most careful to the riskiest. `risk` and `ret` are out of five. ── */
export const STRATEGIES = [
  { id: 'income', name: 'Income', short: 'Mostly bonds. Small ups and downs.', line: 'Mostly bonds. Small ups and downs, a modest return.', risk: 1, ret: 1 },
  { id: 'conservative', name: 'Conservative', short: 'Mainly bonds, some shares.', line: 'Mainly bonds, some shares. Steady, with a little more return.', risk: 2, ret: 2 },
  { id: 'balanced', name: 'Balanced', short: 'Bonds and shares in about equal parts.', line: 'Bonds and shares in about equal parts.', risk: 3, ret: 3 },
  { id: 'growth', name: 'Growth', short: 'Mainly shares. Bigger ups and downs.', line: 'Mainly shares. Bigger ups and downs, more return over time.', risk: 4, ret: 4 },
  { id: 'dynamic', name: 'Dynamic', short: 'Almost only shares. The biggest swings.', line: 'Almost only shares. The biggest ups and downs, the most return over time.', risk: 5, ret: 5 },
];
export const STRATEGY = {
  recommended: 'Recommended',
  /* The tag on a strategy riskier than the answers suggest (78 D6): information and a warning, not a block. */
  unavailable: 'Above your risk profile',
  /* Choosing one opens a confirmation (78 D6). */
  confirm: {
    title: 'Choose {name}?',
    message: '{name} is riskier than your answers suggest. You can choose it anyway, and change it until you confirm.',
    choose: 'Choose {name}',
    back: 'Go back',
  },
  riskLabel: 'Risk',
  returnLabel: 'Expected return',
  /* The carousel (9d D16 to D18): one card at a time, chosen explicitly. A card's name for screen readers is
     "{name}, {n} of {total}" and its tag in lower case. */
  carousel: 'Strategies',
  position: '{n} of {total}',
  choose: 'Choose this strategy',
  chosen: 'Chosen',
  continueWith: 'Continue with {name}',
  previous: 'Previous strategy',
  next: 'Next strategy',
};

/* ── The vehicles (9d) ── the persona travels with the strategy's vehicle at the top of each card. The caption names
   the card's figure for screen readers (the canvas is hidden from them, D8, D17). */
export const VEHICLE_STAGE = {
  captions: {
    income: 'Income goes hiking: slow and steady.',
    conservative: 'Conservative rides a tricycle: steady, a little quicker.',
    balanced: 'Balanced rides a Vespa: quicker, with some bumps.',
    growth: 'Growth jumps with a parachute: fast, with big swings.',
    dynamic: 'Dynamic flies a jetpack: the fastest, with the biggest swings.',
  },
  /* The credits (D9): the CC BY models with their authors and pages, the tent as a courtesy line. Written as one short
     paragraph grouped by licence and author, so it fits the stage's place on a phone. */
  creditsLink: 'Model credits',
  backLink: 'Back to the vehicles',
  creditsSource: 'All from Poly Pizza.',
  credits: [
    { name: 'Tricycle', by: 'Poly by Google', url: 'https://poly.pizza/m/9UE6AhwMhbc', licence: 'CC BY 3.0', licenceUrl: 'https://creativecommons.org/licenses/by/3.0/' },
    { name: 'Vespa', by: 'Jasmine Roberts', url: 'https://poly.pizza/m/blGLclvvdEM', licence: 'CC BY 3.0', licenceUrl: 'https://creativecommons.org/licenses/by/3.0/' },
    { name: 'Parachute', by: 'Poly by Google', url: 'https://poly.pizza/m/3Z7vJ96JIEB', licence: 'CC BY 3.0', licenceUrl: 'https://creativecommons.org/licenses/by/3.0/' },
    { name: 'Jetpack', by: 'Roman Miller', url: 'https://poly.pizza/m/8VafbXInymc', licence: 'CC BY 3.0', licenceUrl: 'https://creativecommons.org/licenses/by/3.0/' },
    { name: 'Tent', by: 'Quaternius', url: 'https://poly.pizza/m/5Q7qIrfDxA', licence: 'CC0', licenceUrl: 'https://creativecommons.org/publicdomain/zero/1.0/' },
  ],
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

/* ── Sustainability (D13) ── a preference, no effect on the strategy in 9a. */
export const ESG = {
  label: 'How important is sustainability to you?',
  summary: 'Sustainability',
  options: [
    { id: 'not', label: 'Not important' },
    { id: 'somewhat', label: 'Somewhat important' },
    { id: 'important', label: 'Important' },
  ],
  missing: 'Choose how important sustainability is to you.',
};

/* ── Personalise (9g D1 to D7) ── optional preferences, no effect on the strategy. Nothing is preselected except the
   default of `alternatives`, which is not a choice (D7). German for the later translation pass (to confirm):
   Personalisierung (optional), Thematische Schwerpunkte, Alternative Anlagen, Regionaler Fokus. */
export const PERSONALISE = {
  intro: 'These choices are optional. They do not change your strategy.',
  themes: {
    label: 'Themes you care about',
    options: [
      { id: 'climate', label: 'Climate and energy' },
      { id: 'health', label: 'Health care' },
      { id: 'tech', label: 'Technology' },
      { id: 'water', label: 'Water' },
      { id: 'education', label: 'Education' },
    ],
  },
  alternatives: {
    label: 'Alternative investments',
    options: [
      { id: 'no', label: 'Not included' },
      { id: 'yes', label: 'Included' },
    ],
    risk: 'Alternative investments, such as gold or real estate funds, can swing more in price and can be harder to sell quickly than shares and bonds.',
  },
  region: {
    label: 'Regional focus',
    options: [
      { id: 'global', label: 'Global' },
      { id: 'ch', label: 'Switzerland' },
      { id: 'eu', label: 'Europe' },
      { id: 'na', label: 'North America' },
      { id: 'em', label: 'Emerging markets' },
    ],
  },
  clear: 'Clear my choices',
};

/* ── Tax status (D14, D27) ── `eligible`: the answer that allows opening online; any other leads to the exit (D15). */
export const TAX = {
  questions: [
    {
      id: 'taxCH', label: 'Are you tax resident only in Switzerland?', eligible: 'yes',
      options: [{ id: 'yes', label: 'Yes, only in Switzerland' }, { id: 'no', label: 'No, also abroad' }],
    },
    {
      id: 'usPerson', label: 'Are you a US person?', eligible: 'no',
      options: [{ id: 'yes', label: 'Yes' }, { id: 'no', label: 'No' }],
      more: { label: 'What counts?', text: 'A US citizen, a green card holder, or tax resident in the US.' },
    },
  ],
  summary: 'Tax status',
  eligibleSummary: 'Switzerland only, not a US person',
  missing: 'Answer both questions.',
};

/* ── The exit (D15) ── */
export const INELIGIBLE = {
  book: 'Book an appointment',
  change: 'Change my answers',
  kept: 'Your answers are kept until you close this tab.',
  done: 'Done',
};

/* ── Documents (D16, D27) ── the contracts listed, the information sheets behind one row. Names only, no files. */
export const DOCUMENTS = {
  contractsLabel: 'Contracts',
  contracts: ['Asset management mandate', 'Custody account contract'],
  sheetsLabel: 'Information sheets',
  sheetsCount: '{n} documents',
  sheetsBack: 'Back to documents',
  sheets: [
    'Asset management record',
    'Personal investment proposal',
    'FinSA knowledge and experience',
    'Tax status declaration',
    'Custody account regulations',
    'FinSA information sheet',
    'Conflicts of interest',
    'Shareholder rights (SRD II)',
    'Sustainability information sheet',
    'Special risks in securities trading',
    'Price list',
  ],
  note: 'In a real opening you would download these.',
  accept: 'I have read the documents and accept the contracts.',
  missing: 'Confirm that you have read the documents.',
};

/* ── Summary (D17, D27) ── grouped sections, one Edit each. `screens` are the screens an Edit walks through. */
export const SUMMARY = {
  sections: [
    { id: 'strategy', label: 'Strategy', screens: ['strategy'] },
    { id: 'amount', label: 'Amount', screens: ['amount'] },
    { id: 'answers', label: 'Your answers', screens: ['knowledge', 'purpose', 'risk', 'esg', 'tax'] },
    { id: 'personalise', label: 'Personalise your strategy (optional)', screens: ['personalise'] },
  ],
  /* The personalise section (9g D2, D7, D9): empty, a button; filled, one line of the chosen values and the pencil. */
  personalise: { empty: 'Not personalised', open: 'Personalise', alternatives: 'Alternatives included', manyThemes: '{n} themes' },
  rows: { knowledge: 'Knowledge', purpose: 'Purpose', horizon: 'Horizon', risk: 'Risk profile' },
  edit: 'Edit',
  backToSummary: 'Back to summary',
  nextInSection: 'Next question',
  changed: 'Your changes moved the recommendation to {name}.',
};

/* ── Completion (D20) ── */
export const COMPLETE = {
  next: 'Next: transfer {amount} to your asset management. We invest it within about three working days.',
  /* Opens the transfer prefilled to fund the mandate (roadmap 18, D9) */
  transfer: 'Transfer now',
};
