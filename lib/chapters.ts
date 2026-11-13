import { billions, circulation, ethereumUsdc, reserveCoverage, reserves } from "@/lib/facts";

export type PieceFilter = "all" | "record" | "circle";

export type ChapterSide = "record" | "circle" | "both";

export type SceneId =
  | "intro"
  | "ledger"
  | "contract"
  | "chains"
  | "mint"
  | "reserves"
  | "yield"
  | "peg"
  | "freeze"
  | "terms"
  | "pieces";

export const sideLabel: Record<ChapterSide, string> = {
  record: "On the public blockchain",
  circle: "In Circle’s reports",
  both: "Blockchain and Circle’s reports",
};

export type SourceLink = {
  label: string;
  href: string;
};

export type GlossaryEntry = {
  term: string;
  body: string;
};

export type Chapter = {
  id: string;
  title: string;
  scene: SceneId;
  side: ChapterSide | null;
  showFilter?: boolean;
  actions?: SourceLink[];
  paragraphs: string[];
  glossary: GlossaryEntry[];
  sources: SourceLink[];
};

const terms: SourceLink = {
  label: "USDC terms",
  href: "https://www.circle.com/legal/usdc-terms",
};

const transparency: SourceLink = {
  label: "Circle transparency",
  href: circulation.href,
};

const contracts: SourceLink = {
  label: "USDC contract addresses",
  href: ethereumUsdc.href,
};

const ethereum: SourceLink = {
  label: "USDC on Ethereum",
  href: "https://www.circle.com/multi-chain-usdc/ethereum",
};

const mint: SourceLink = {
  label: "Circle Mint",
  href: "https://www.circle.com/circle-mint",
};

const minting: SourceLink = {
  label: "How minting works",
  href: "https://developers.circle.com/circle-mint/concepts/how-minting-works",
};

const bridged: SourceLink = {
  label: "Bridged USDC terms",
  href: "https://www.circle.com/legal/bridged-usdc-terms",
};

const licenses: SourceLink = {
  label: "Circle license disclosures",
  href: "https://www.circle.com/legal/licenses",
};

const depositFaq: SourceLink = {
  label: "USDC deposit FAQ",
  href: "https://help.circle.com/support/en/usdc-deposit-faqs?id=kb_article_view&sysparm_article=KB0010748",
};

export const chapters: Chapter[] = [
  {
    id: "what",
    title: "What is USDC?",
    scene: "intro",
    side: null,
    paragraphs: [
      "USDC is a digital stand-in for the US dollar, issued by a company called Circle.",
      "Circle says each token is backed by cash and cash-like assets, and that a Circle Mint customer can turn one token back into one dollar. Fees can come off that dollar.",
      "The coin in the drawing is that promise. The rest of this page is what is actually behind it.",
    ],
    glossary: [],
    sources: [terms, transparency],
  },
  {
    id: "why",
    title: "Why people use it",
    scene: "intro",
    side: null,
    paragraphs: [
      "Bitcoin and similar coins change price all the time. A token pegged to the dollar is meant to stay near one dollar, so people can hold a dollar amount inside a crypto app.",
      "Circle calls USDC a digital dollar. It moves on a blockchain the way other crypto does, but it is tied to a familiar currency.",
      "That tie is not the same thing as cash in a bank. Who can turn it back into dollars, and on what terms, comes later.",
    ],
    glossary: [
      {
        term: "Stablecoin",
        body: "A token pegged to a currency such as the US dollar, so the token itself is meant to avoid the price swings of coins like bitcoin. USDC is Circle’s dollar version.",
      },
    ],
    sources: [transparency, terms],
  },
  {
    id: "no-coin",
    title: "There is no coin",
    scene: "ledger",
    side: "record",
    paragraphs: [
      "Nothing metal changes hands, and there is no file with your name on it. USDC is a digital token that moves on a blockchain, the same way other crypto does.",
      "What you hold is a number written next to an address, in a shared list that many computers keep. Sending it means the list changes. You do not pass someone an object.",
    ],
    glossary: [
      {
        term: "Blockchain",
        body: "A shared list of transactions, copied across many computers. USDC does not live in Circle’s app. It lives as entries in that list.",
      },
    ],
    sources: [terms],
  },
  {
    id: "address",
    title: "The address is the account",
    scene: "ledger",
    side: "record",
    paragraphs: [
      "An address is a long string of letters and numbers. It works like an account number. The balance sits next to it.",
      "A private key is the secret that controls that address. Whoever has the key can send the USDC. Circle’s terms say a transfer is not reversible. Send it to the wrong address, or lose the key, and Circle does not reset it the way a bank can reset a password.",
    ],
    glossary: [
      {
        term: "Address",
        body: "The account a balance is assigned to. Circle’s terms also use it for an address the company can block.",
      },
    ],
    sources: [terms],
  },
  {
    id: "contract",
    title: "A program keeps the list",
    scene: "contract",
    side: "record",
    paragraphs: [
      "On Ethereum, the rules and the balances live in a small program Circle publishes. That program is called a smart contract. Anyone can read it and see what it did.",
      `Circle’s contract-address page gives the Ethereum address as ${ethereumUsdc.address}. A token that only uses the name USDC, at a different address, is not this one.`,
      "Circle’s Ethereum page says a bridged copy, made by someone else, is not issued by Circle. Those copies are not supported by Circle Mint.",
    ],
    glossary: [
      {
        term: "Smart contract",
        body: "The program stored on a blockchain that records who owns the tokens and how they move. Circle tells apps which program to trust by publishing its address.",
      },
    ],
    sources: [contracts, ethereum, bridged],
  },
  {
    id: "decimals",
    title: "How small a piece can be",
    scene: "contract",
    side: "record",
    paragraphs: [
      `The Ethereum contract Circle publishes splits each token into ${ethereumUsdc.decimals} decimal places. One USDC is stored as one million units. The smallest amount you can move there is 0.000001 USDC.`,
      "That is a property of this contract, read from the program itself. It is not a fee, and it is not a promise that an app will let you trade dust that small.",
    ],
    glossary: [
      {
        term: "Decimal places",
        body: "How finely the contract divides one token. Six places means the chain can record down to one millionth of a USDC.",
      },
    ],
    sources: [contracts],
  },
  {
    id: "chains",
    title: "The same dollar, many networks",
    scene: "chains",
    side: "record",
    paragraphs: [
      "Circle does not issue USDC on one list only. It publishes a contract address for each network it supports, and it treats one native USDC as one dollar on any of them. You still have to send it on the network the address belongs to.",
      `On ${circulation.asOf}, Circle’s transparency page showed ${billions(circulation.total)} of USDC in circulation. That page gives the total. It does not split the total by network.`,
      "Send Ethereum USDC to a Solana address, or the other way around, and it does not arrive as that network’s USDC. The name matches. The list does not.",
    ],
    glossary: [
      {
        term: "Network",
        body: "The particular blockchain a balance lives on, such as Ethereum, Solana, or Base. Circle’s contract page lists which ones it supports. An address on one network is not an address on another.",
      },
    ],
    sources: [contracts, transparency],
  },
  {
    id: "gas",
    title: "Holding it is not enough to send it",
    scene: "chains",
    side: "both",
    paragraphs: [
      "Each network charges its own fee to write a transfer into the list. Between two ordinary addresses, that fee is paid in the network’s coin, such as ETH on Ethereum or SOL on Solana, not in USDC.",
      "You can hold USDC and still be unable to send it, because you have none of that other coin. Circle says that when USDC leaves a Circle Mint account, Circle covers that network fee in most cases. That does not apply to a transfer you make yourself from a wallet.",
    ],
    glossary: [
      {
        term: "Network fee",
        body: "The charge for recording a transfer, paid in the network’s own coin. People often call it gas. It is separate from any fee on Circle’s redemption schedule.",
      },
    ],
    sources: [minting, terms],
  },
  {
    id: "bridged",
    title: "A copy is not Circle’s token",
    scene: "chains",
    side: "circle",
    paragraphs: [
      "Some tokens use the name USDC but were wrapped or bridged by someone else. Circle’s Ethereum page says those copies are not issued by Circle, and Circle Mint will not redeem them.",
      "Circle publishes the addresses that are its own. A balance at any other address is a different promise, even when the ticker matches.",
    ],
    glossary: [
      {
        term: "Bridged USDC",
        body: "A copy of USDC created so it can move on a network where Circle’s own token is not the one in your wallet. Circle’s bridged-USDC terms are a separate document from the USDC terms.",
      },
    ],
    sources: [ethereum, bridged, contracts],
  },
  {
    id: "two-doors",
    title: "Most people never meet Circle",
    scene: "mint",
    side: "both",
    paragraphs: [
      "There are two doors. One is Circle itself, through an account called Circle Mint. The other is everyone else: an exchange, a shop, or a person who already holds some.",
      "Circle Mint is for institutions that mint and distribute USDC at scale. Circle says it is not offered to individuals, and not for personal use. Circle can refuse the application.",
      "If you bought USDC in an app, you bought it from someone else. The terms call you a User Type B. You hold the token, and you are not a Circle customer. You do not have Circle’s promise to cash that amount back out.",
    ],
    glossary: [
      {
        term: "Circle Mint",
        body: "The account Circle gives to an approved institution. Only that account can mint USDC with Circle, or redeem it for dollars, directly.",
      },
    ],
    sources: [mint, terms],
  },
  {
    id: "created",
    title: "How new USDC appears",
    scene: "mint",
    side: "both",
    paragraphs: [
      "A Circle Mint customer sends dollars to Circle’s bank. Circle mints USDC after those dollars arrive, one token per dollar, and credits the Mint account.",
      "Circle’s deposit FAQ says there is no minimum deposit, and Circle charges no fee for the deposit itself. The sender’s bank can still charge a wire or currency-conversion fee. A wire that would push the account over its weekly limit is sent back.",
    ],
    glossary: [
      {
        term: "Mint",
        body: "Circle’s word for creating new USDC when dollars have arrived. The tokens are issued to the Mint account, not to a random wallet.",
      },
    ],
    sources: [minting, depositFaq, terms],
  },
  {
    id: "removed",
    title: "How USDC is taken back",
    scene: "mint",
    side: "both",
    paragraphs: [
      "A Mint customer can send USDC back and ask for dollars in a bank account. Circle debits the tokens. The terms say the rate is one dollar per USDC, minus fees where Circle’s fee schedule charges them.",
      "Circle’s transparency page reports those redemptions next to new issuance, and it calls the supply change a burn. A broken rule, or an order from a regulator or a court, can stop the cash-out.",
    ],
    glossary: [
      {
        term: "Burn",
        body: "Circle’s word, on its transparency page, for taking tokens out of circulation when they are redeemed. A holder without a Mint account cannot do it.",
      },
    ],
    sources: [transparency, terms, minting],
  },
  {
    id: "reserves",
    title: "What backs the tokens",
    scene: "reserves",
    side: "circle",
    paragraphs: [
      `USDC is not a claim on a dollar bill with your name on it. On ${reserves.asOf}, Circle’s transparency page showed ${billions(reserves.total)} of reserves against ${billions(circulation.total)} in circulation. The difference, ${billions(reserveCoverage)}, is the amount by which reserves sat above the tokens.`,
      "Circle says those reserves are held for holders, apart from Circle’s own operating money. The majority sits in the Circle Reserve Fund, a government money-market fund managed by BlackRock. The rest is cash at banks. A holder does not own a slice of either, and does not choose what goes in.",
    ],
    glossary: [
      {
        term: "Reserves",
        body: "The cash, bank deposits, short-dated US Treasuries, and overnight Treasury repurchase agreements Circle says stand behind USDC. Circle decides the mix. Holders do not.",
      },
      {
        term: "Circle Reserve Fund",
        body: "An SEC-registered government money-market fund, ticker USDXX, managed by BlackRock. Circle says most of the USDC reserve is held there. BlackRock publishes the fund’s holdings daily.",
      },
    ],
    sources: [transparency],
  },
  {
    id: "snapshot",
    title: "The report is one moment",
    scene: "reserves",
    side: "circle",
    paragraphs: [
      "The breakdown on the left is the transparency page for one date, 9 November 2026. Circle updates that page weekly, and it also publishes mint and burn flows. The numbers move. They are not a promise about the minute you are reading this.",
      "Once a month, Circle says a Big Four accounting firm assures that the reserves are worth more than the USDC in circulation. Those reports follow attestation standards from the American Institute of Certified Public Accountants. Deloitte & Touche has been Circle’s independent auditor since fiscal 2022. An attestation of one reserve report is not the same thing as a full audit of the company on the day you look.",
    ],
    glossary: [
      {
        term: "Attestation",
        body: "A check, for a stated date, that the reserve report meets a defined standard. Circle presents the monthly one as assurance that reserves exceed USDC in circulation.",
      },
    ],
    sources: [transparency],
  },
  {
    id: "interest",
    title: "You do not earn the interest",
    scene: "yield",
    side: "circle",
    paragraphs: [
      "The assets in the reserves can earn a return. Treasuries and bank deposits do. That income does not get paid out to people holding USDC.",
      "Circle’s terms say holders are not entitled to any interest or other return earned on the reserves. USDC itself pays nothing. A Mint customer who redeems receives one dollar per token, minus fees where they apply. The return on the assets stays with Circle.",
      "Holding USDC is not a savings account. The price you hope for is still about one dollar, not one dollar plus yield.",
    ],
    glossary: [],
    sources: [terms],
  },
  {
    id: "peg",
    title: "Why the price stays near $1",
    scene: "peg",
    side: "both",
    paragraphs: [
      "Circle says USDC is meant to stay at one dollar. With Circle itself, minting is one dollar per token, and redemption is one dollar per token, less fees where the schedule charges them. That cash-out is only for a Circle Mint account, into a bank.",
      "That is the mechanism. A trader who can redeem at Circle can buy tokens in the market when they trade under a dollar, then redeem them. People who cannot redeem directly get whatever price a buyer will pay.",
      "Circle says it does not control the price an exchange quotes, and it does not guarantee that one USDC equals one dollar on those platforms.",
    ],
    glossary: [
      {
        term: "Peg",
        body: "The one-dollar price Circle states. For a Mint customer, that is the mint price and, after any fee, the redemption price. It is not a guarantee of the price in an app.",
      },
    ],
    sources: [terms, transparency],
  },
  {
    id: "freeze",
    title: "Circle can lock a balance",
    scene: "freeze",
    side: "record",
    paragraphs: [
      "This is not like cash, which a company cannot freeze from a distance. Circle’s terms let it block an address and stop USDC moving to or from that address on the chain.",
      "If you send USDC to a blocked address, or receive it from one, Circle may freeze the tokens. You may lose the right to redeem them. A legal order from a government authority can force a freeze as well. The holder does not get a vote.",
    ],
    glossary: [
      {
        term: "Blocked address",
        body: "An address Circle has decided may be tied to illegal activity or to a broken term. Circle can stop transfers to and from it, and can freeze USDC it holds for that address.",
      },
    ],
    sources: [terms],
  },
  {
    id: "not-a-bank",
    title: "It is not a bank deposit",
    scene: "terms",
    side: "circle",
    paragraphs: [
      "Circle’s terms say USDC held in a Circle Mint account is not covered by deposit insurance. In the United States that means no FDIC cover, and no SIPC cover of the kind that protects some brokerage accounts.",
      "Circle’s license disclosures say a digital asset is not legal tender in the United States. The token is meant to track a dollar. It is not a dollar.",
      "A redemption can be refused when the terms are broken, or when a regulator, law enforcement, or a court restricts it.",
    ],
    glossary: [
      {
        term: "Legal tender",
        body: "Money a government says must be accepted for debts. Circle’s license disclosures say digital assets are not that.",
      },
    ],
    sources: [terms, licenses],
  },
  {
    id: "who",
    title: "Who Circle will deal with",
    scene: "terms",
    side: "circle",
    paragraphs: [
      "Direct minting and redemption go through Circle Mint, and only in jurisdictions Circle supports. The product page says that door is for institutions, not for a person minting USDC to hold it.",
      "The terms also bar a Restricted Person from holding USDC. That includes people on US sanctions lists, and people located in places Circle names: Cuba, Iran, North Korea, and the Ukraine regions of Crimea, Donetsk, Luhansk, Kherson, and Zaporizhzhia. The full definition is in the terms, not in the token’s name.",
    ],
    glossary: [
      {
        term: "Restricted Person",
        body: "Someone Circle’s terms say may not hold USDC: a sanctions target, a resident of a restricted territory, or a person owned or controlled by either.",
      },
    ],
    sources: [terms, mint],
  },
  {
    id: "pieces",
    title: "What you can check",
    scene: "pieces",
    side: null,
    showFilter: true,
    paragraphs: [
      "Some of this you can look up yourself. The balance is a public entry. The contract address is the one Circle publishes. An address Circle has blocked is a fact on that list.",
      "The rest you take from Circle. The reserves, the bank redemption, who keeps the interest, and who is allowed through Circle Mint are promises and rules in its pages, not something the drawing can prove.",
      "The filter splits the picture along that line.",
    ],
    glossary: [],
    sources: [transparency, terms, contracts],
  },
  {
    id: "check",
    title: "Check it yourself",
    scene: "intro",
    side: null,
    paragraphs: [
      "The balance and the contract are public. The reserves, the cash-out, and the freeze rules are on Circle’s pages. Open them.",
    ],
    glossary: [],
    sources: [],
    actions: [
      { label: "Read the terms", href: terms.href },
      { label: "See the reserves", href: transparency.href },
      { label: "Check the contract", href: contracts.href },
    ],
  },
];
