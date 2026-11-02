/**
 * Investment opening: the UZ Bank assistant's copy (roadmap 9b D6 to D10), one entry per screen id of
 * `investment-opening-config.js`. Drafted from `designs/conversation/investment-opening/intervention-map.md`.
 *
 * A chip: `q` (the customer's question, also the chip's label), `short` (one or two sentences, every User Type) and
 * `more` (the rest, for Newbie, or behind More for All-rounder; Power user never sees it). `then` lists follow-up
 * chips that appear once it is asked. `{amount}` and `{after20}` are filled from the customer's amount.
 *
 * Rules (the map's rules 1 to 3): explain, never say which option to pick, no personal advice, no promise of
 * something the app does not do. Second person, "we" for the bank, no exclamation marks, no em dashes.
 * `advisor: true` puts "Talk to an advisor" last among the chips (from the documents screen on, and where a chip
 * cannot help); every other screen has it as a quiet text button under the chips.
 */

export const ASSISTANT = {
  title: 'Questions about this step',
  name: 'UZ Bank assistant',
  prompt: 'Choose a question about this step.',
  /* The invitation on desktop (D25), the way back to it (D27) and the phone's Help? (D28): the customer's words,
     not the assistant's (D8). */
  invite: 'Questions about this step?',
  yes: 'Yes, help me',
  self: 'I can do it myself',
  help: 'Help?',
  helpLabel: 'Questions about this step',
  chipsLabel: 'Questions',
  more: 'More',
  advisor: {
    q: 'Talk to an advisor',
    short: 'We will call you to find a time. Your answers are kept.',
  },
};

export const CHIPS = {
  intro: {
    chips: [
      {
        q: 'What is asset management?',
        short: 'You choose a strategy and the amount. We invest the money and look after it for you.',
        more: 'You decide how much risk you want. We choose the investments within that strategy and adjust them over time.',
      },
      {
        q: 'Why so many questions?',
        short: 'The law asks us to check that asset management fits you before we open it. Your answers also set the strategy we recommend.',
        more: 'Most questions take one tap. You can change any answer before you confirm.',
      },
      {
        q: 'Can I stop and come back?',
        short: 'Yes. Your answers are kept until you close this tab.',
        more: 'Open Investment again in the same tab and you continue where you left off.',
      },
    ],
  },

  knowledge: {
    chips: [
      {
        q: 'Why do you ask this?',
        short: 'The law asks us to check that a product fits what you know about investing. It is not a test, and there is no wrong answer.',
        more: 'Your answer can make the strategy we recommend more careful, so it protects you.',
      },
      {
        q: 'What counts as basic knowledge?',
        short: 'For example, you know that share prices go up and down, and that a fund holds many investments.',
        more: 'Choose what feels true. You do not need to study first.',
      },
      {
        q: 'What happens if I choose "None"?',
        short: 'You can still open asset management. We take the investment decisions for you.',
        more: 'With no experience, the strategies with the biggest ups and downs are not offered online.',
      },
    ],
  },

  purpose: {
    chips: [
      {
        q: 'Why does the purpose matter?',
        short: 'It tells us when you might need the money, and that sets how many ups and downs make sense.',
        more: 'Money you need soon has less time to recover from a fall, so a short horizon leads to a more careful strategy.',
      },
      {
        q: 'Why is the time limited for a home?',
        short: 'For a home, the money is usually needed within 5 years, so longer horizons are not offered for it.',
        more: 'You can change both answers until you confirm.',
      },
      {
        q: 'What if I am not sure when I need it?',
        short: 'The horizon is the earliest time you might need the money. A shorter horizon leads to a more careful strategy.',
        more: '',
      },
    ],
  },

  amount: {
    chips: [
      {
        q: 'What if I invest more than the fridge suggests?',
        short: 'That is your choice. The suggestion is what the fridge left after your daily needs and reserves.',
        more: 'Investing more would use money set aside for them, so you may need to sell at a bad moment to cover an expense.',
      },
      {
        q: 'Why is there a minimum?',
        short: 'Asset management starts at CHF 5\'000, so the money can be spread over many investments.',
        more: '',
      },
      {
        q: 'Is the amount fixed once I open?',
        short: 'You can change it until you confirm. The summary has an Edit button for it.',
        more: '',
      },
    ],
  },

  risk: {
    chips: [
      {
        q: 'What does a loss of 20% mean in francs?',
        short: 'With {amount}, a loss of 20% means {after20} for a while.',
        more: 'Markets have recovered from past falls, but how long it took differed, and the past does not promise the future.',
      },
      {
        q: 'Is there a right answer?',
        short: 'No. The questions find out how you feel about ups and downs, so the strategy fits you.',
        more: 'Answer as you would feel, not as you think you should.',
      },
      {
        q: 'What does the lottery question show?',
        short: 'Whether you prefer a sure amount or a chance of more. Neither is better.',
        more: 'It is one of three questions. Together they set your risk profile.',
      },
      {
        q: 'Can I change these answers?',
        short: 'Yes, until you confirm. The summary has an Edit button for your answers.',
        more: '',
      },
    ],
  },

  strategy: {
    chips: [
      {
        q: 'Why is this one recommended?',
        short: 'It follows from your answers on risk, horizon and knowledge. It matches your answers, it is not a forecast.',
        more: 'A short horizon or no experience can make it more careful than your risk answers alone.',
      },
      {
        q: 'What is the difference between them?',
        short: 'The share of shares. More shares mean more expected return over time and bigger ups and downs.',
        more: 'Income is mostly bonds, Dynamic almost only shares. The others sit in between.',
        then: [
          {
            q: 'What are bonds and shares?',
            short: 'A bond is a loan to a company or a state that pays interest. A share is a small part of a company.',
            more: 'Bonds usually move less than shares. Shares can grow more over time, and fall more.',
          },
        ],
      },
      {
        /* Flagged for review (D7): the suitability line, aligned with 9a D11. */
        q: 'Do I have to take the recommendation?',
        short: 'No. You can choose a more careful one. A riskier one than recommended cannot be chosen online.',
        more: 'If you want to talk about a riskier strategy, an advisor can go through it with you.',
      },
      {
        /* 9d D10: the picture explained, without advice. */
        q: 'What do the vehicles mean?',
        short: 'Each strategy travels differently. The riskier it is, the faster it goes, and the bigger the bumps on the way.',
        more: 'A tent is slow and steady, a jetpack fast with big swings. The vehicles only picture risk and return; they do not change the recommendation.',
      },
    ],
  },

  esg: {
    chips: [
      {
        q: 'What does sustainable mean here?',
        short: 'We also look at how companies treat the environment, people and their shareholders (ESG).',
        more: 'The more important it is to you, the more weight these criteria get when we choose investments.',
      },
      {
        q: 'Does it cost me return?',
        short: 'Not necessarily. It changes what you invest in, not the fee.',
        more: 'Leaving some companies out can make returns differ from the market, up or down.',
      },
      {
        q: 'Does my answer change the strategy?',
        short: 'No. It sets what we invest in, not how much risk your strategy takes.',
        more: '',
      },
    ],
  },

  tax: {
    advisor: true,
    chips: [
      {
        q: 'Who counts as a US person?',
        short: 'A US citizen, a green card holder, or someone tax resident in the US.',
        more: 'Being born in the US usually makes you a US citizen, even if you never lived there.',
        then: [
          {
            q: 'What is the substantial presence test?',
            short: 'A count of the days you spent in the US over the last three years.',
            more: 'If you have not lived or stayed long in the US, it most likely does not apply. If you are unsure, an advisor can help.',
          },
        ],
      },
      {
        q: 'Why does a Swiss bank ask this?',
        short: 'An agreement between Switzerland and the US (FATCA) requires us to know whether you pay tax in the US.',
        more: 'Tax residence in another country also changes what we must report, so online we open asset management only for Switzerland.',
      },
      {
        q: 'What if I am tax resident abroad too?',
        short: 'Then we cannot open asset management online. An advisor can open it with you.',
        more: 'Your answers are kept until you close this tab.',
      },
    ],
  },

  documents: {
    advisor: true,
    chips: [
      {
        q: 'Which documents matter most?',
        short: 'The asset management mandate and the custody account contract are the contracts. The rest are information sheets.',
        more: 'The information sheets explain the risks, the costs and your rights. The price list shows the fees.',
      },
      {
        /* Flagged for review (D7): the brochure summary the map marks "to write". */
        q: 'What does "Special risks in securities trading" say?',
        short: 'It explains the risks of investing in plain terms. Prices can fall, and you can lose money.',
        more: 'It also covers the risks of particular investments, such as bonds, shares and funds, and what happens if a company fails.',
      },
      {
        /* Flagged for review (D7): the map's "to confirm", aligned with 9a D18. */
        q: 'Do I have to read everything now?',
        short: 'You confirm that you have read them. Your answers are kept until you close this tab.',
        more: 'So you can take your time with them before you confirm.',
      },
    ],
  },

  summary: {
    advisor: true,
    chips: [
      {
        q: 'Can I still change something?',
        short: 'Yes. Each section has an Edit button.',
        more: 'If a change moves the recommendation, we tell you here.',
      },
      {
        /* Flagged for review (D7): replaces the map's "invested within about three working days". */
        q: 'What happens when I confirm?',
        short: 'We open your asset management mandate. It shows as pending on Overview until the money arrives.',
        more: 'Once the money is in your custody account, we invest it within about three working days.',
      },
      {
        q: 'Is anything binding yet?',
        short: 'Not until you confirm. Until then you can change your answers or leave.',
        more: '',
      },
    ],
  },

  complete: {
    advisor: true,
    chips: [
      {
        /* Flagged for review (D7): funding the mandate is roadmap 18. */
        q: 'How do I transfer the money?',
        short: 'Moving money into the mandate from your accounts is coming soon. Until then, it shows as pending on Overview.',
        more: '',
      },
      {
        q: 'When is my money invested?',
        short: 'Within about three working days after it arrives in your custody account.',
        more: '',
      },
      {
        q: 'Where do I find my mandate?',
        short: 'On Overview, marked as pending until the money arrives.',
        more: '',
      },
    ],
  },

  ineligible: {
    advisor: true,
    chips: [
      {
        q: 'Why can I not open this online?',
        short: 'Online, we can only check the tax rules for people tax resident only in Switzerland and not US persons.',
        more: 'Other cases need more documents and checks, so an advisor opens it with you.',
      },
      {
        q: 'What happens at the appointment?',
        short: 'An advisor goes through your answers with you and opens asset management if it fits.',
        more: 'Your answers are kept until you close this tab.',
      },
      {
        q: 'Can I change my answers?',
        short: 'Yes. Change my answers takes you back to the tax questions.',
        more: '',
      },
    ],
  },
};
