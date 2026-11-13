"use client";

import type { ReactNode } from "react";
import type { PieceFilter, SceneId, ToyState } from "@/lib/chapters";
import { billions, circulation, poolShare, reserveCoverage, reservePool, reserves } from "@/lib/facts";

type LayerId =
  | "coin"
  | "ledger"
  | "contract"
  | "chains"
  | "mint"
  | "reserves"
  | "yield"
  | "peg"
  | "freeze"
  | "terms";

type Xform = {
  opacity: number;
  x: number;
  y: number;
  scale: number;
};

const LAYER_IDS: LayerId[] = [
  "coin",
  "ledger",
  "contract",
  "chains",
  "mint",
  "reserves",
  "yield",
  "peg",
  "freeze",
  "terms",
];

const LAYER_SIDE: Record<LayerId, "record" | "circle" | "both"> = {
  coin: "both",
  ledger: "record",
  contract: "record",
  chains: "record",
  mint: "both",
  reserves: "circle",
  yield: "circle",
  peg: "both",
  freeze: "record",
  terms: "circle",
};

const INK = "var(--ink)";
const BLUE = "var(--accent)";
const PAPER = "var(--paper)";
const MUTED = "var(--muted)";
const LINE = "var(--line)";
const CARD = "var(--card)";
const WASH = "var(--wash)";
const SHADE = "var(--shade)";
const HIGHLIGHT = "var(--highlight)";
const BURN = "var(--burn)";
const BURN_FILL = "var(--burn-fill)";
const CARD_BLUE = "var(--card-blue)";
const TICK = "var(--tick)";
const DASH = "var(--dash)";
const SLICE_MID = "var(--slice-mid)";
const SHEEN = "var(--sheen)";
const SHADE_DEEP = "var(--shade-deep)";

type CoinProps = {
  scene: SceneId;
  previous: SceneId;
  progress: number;
  filter: PieceFilter;
  toy: ToyState;
  reduced: boolean;
};

function at(x: number, y: number, scale: number, opacity = 1): Xform {
  return { opacity, x, y, scale };
}

function hidden(near: Xform): Xform {
  return { ...near, opacity: 0, scale: near.scale * 0.92 };
}

function layout(scene: SceneId): Record<LayerId, Xform> {
  const coin = at(320, 330, 1.05);
  const ledger = at(320, 455, 1);
  const contract = at(430, 340, 1);
  const chains = at(320, 430, 1);
  const mint = at(330, 400, 1);
  const reserveCard = at(320, 360, 1);
  const yieldMark = at(430, 340, 1);
  const peg = at(320, 380, 1);
  const freeze = at(320, 390, 1);
  const terms = at(330, 370, 1);

  const blank: Record<LayerId, Xform> = {
    coin: hidden(coin),
    ledger: hidden(ledger),
    contract: hidden(contract),
    chains: hidden(chains),
    mint: hidden(mint),
    reserves: hidden(reserveCard),
    yield: hidden(yieldMark),
    peg: hidden(peg),
    freeze: hidden(freeze),
    terms: hidden(terms),
  };

  if (scene === "intro") {
    return { ...blank, coin };
  }

  if (scene === "ledger") {
    return { ...blank, coin: at(340, 185, 0.7), ledger: at(340, 470, 0.92) };
  }

  if (scene === "contract") {
    return {
      ...blank,
      coin: at(210, 230, 0.58, 0.45),
      contract,
    };
  }

  if (scene === "chains") {
    return { ...blank, coin: at(320, 195, 0.62), chains };
  }

  if (scene === "mint") {
    return { ...blank, coin: at(320, 175, 0.48, 0.4), mint };
  }

  if (scene === "reserves") {
    return { ...blank, reserves: at(320, 340, 0.92) };
  }

  if (scene === "yield") {
    return { ...blank, yield: at(320, 340, 1) };
  }

  if (scene === "peg") {
    return { ...blank, coin: at(320, 155, 0.4, 0.55), peg };
  }

  if (scene === "freeze") {
    return { ...blank, coin: at(320, 155, 0.38, 0.35), freeze };
  }

  if (scene === "terms") {
    return { ...blank, coin: at(320, 160, 0.36, 0.3), terms };
  }

  return {
    coin: at(160, 145, 0.34),
    ledger: at(470, 150, 0.52),
    contract: at(165, 325, 0.64),
    chains: at(470, 320, 0.58),
    mint: hidden(mint),
    reserves: at(175, 500, 0.32),
    yield: hidden(yieldMark),
    peg: hidden(peg),
    freeze: hidden(freeze),
    terms: at(470, 510, 0.52),
  };
}

function mix(from: Xform, to: Xform, t: number): Xform {
  return {
    opacity: from.opacity + (to.opacity - from.opacity) * t,
    x: from.x + (to.x - from.x) * t,
    y: from.y + (to.y - from.y) * t,
    scale: from.scale + (to.scale - from.scale) * t,
  };
}

function blendScenes(scene: SceneId, previous: SceneId, progress: number): Record<LayerId, Xform> {
  const next = layout(scene);
  if (scene === previous) return next;
  const prior = layout(previous);
  const raw = Math.min(1, Math.max(0, progress));
  const t = raw >= 0.8 ? 1 : raw / 0.8;
  return Object.fromEntries(LAYER_IDS.map((id) => [id, mix(prior[id], next[id], t)])) as Record<LayerId, Xform>;
}

function applyFilter(pose: Record<LayerId, Xform>, filter: PieceFilter) {
  if (filter === "all") return pose;
  return Object.fromEntries(
    LAYER_IDS.map((id) => {
      const side = LAYER_SIDE[id];
      const dim = side !== "both" && side !== filter;
      const current = pose[id];
      return [id, dim ? { ...current, opacity: current.opacity * 0.14 } : current];
    }),
  ) as Record<LayerId, Xform>;
}

function Reed({ radius }: { radius: number }) {
  return (
    <g stroke={INK} strokeWidth="1.6" strokeLinecap="round">
      {Array.from({ length: 80 }, (_, index) => {
        const angle = (index / 80) * Math.PI * 2;
        const inner = radius - 8;
        const round = (value: number) => Math.round(value * 100) / 100;
        return (
          <line
            key={index}
            x1={round(Math.cos(angle) * inner)}
            y1={round(Math.sin(angle) * inner)}
            x2={round(Math.cos(angle) * radius)}
            y2={round(Math.sin(angle) * radius)}
          />
        );
      })}
    </g>
  );
}

function CoinFace() {
  return (
    <g>
      <circle r="138" fill={PAPER} stroke={INK} strokeWidth="3" />
      <Reed radius={132} />
      <circle r="116" fill={WASH} stroke={INK} strokeWidth="2.5" />
      <circle r="116" fill="url(#hatch)" />
      <path
        d="M34 -20 C36 -40 18 -56 0 -56 C-22 -56 -40 -44 -40 -28 C-40 -12 -22 -2 0 0 C22 2 40 12 40 28 C40 44 22 56 0 56 C-18 56 -36 40 -34 20"
        fill="none"
        stroke={INK}
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M0 -72 V72"
        fill="none"
        stroke={INK}
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path id="coin-ring" d="M0,-98 A98,98 0 1,1 -0.1,-98" fill="none" />
      <text
        fill={INK}
        fontSize="10"
        fontFamily="var(--font-geist-sans), sans-serif"
        textLength="608"
        lengthAdjust="spacing"
      >
        <textPath href="#coin-ring">USDC · ONE DOLLAR · ONE TOKEN · USDC · ONE DOLLAR · ONE TOKEN ·</textPath>
      </text>
    </g>
  );
}

function LedgerSheet({ mode }: { mode: "balance" | "mint" | "frozen" }) {
  const rows = [
    ["0x91…c4", "18,204.11"],
    ["0x4a…90", "1,258.00"],
    ["0x7c…1e", "1.000000"],
    ["0x3d…aa", "64.80"],
    ["0xb2…17", "900.00"],
  ];

  return (
    <g>
      <ellipse rx="168" ry="78" fill={SHADE} stroke={INK} strokeWidth="2.5" />
      <ellipse rx="168" ry="78" fill="url(#ledger-shade)" />
      <text x="-146" y="-52" fill={BLUE} fontFamily="var(--font-hand), cursive" fontSize="22">
        balances
      </text>
      {rows.map(([address, amount], index) => {
        const y = -28 + index * 18;
        const highlighted =
          (mode === "balance" && index === 2) || (mode === "mint" && index === 2) || (mode === "frozen" && index === 2);
        const burned = mode === "mint" && index === 4;
        return (
          <g key={address}>
            {highlighted ? <rect x="-150" y={y - 13} width="300" height="18" rx="4" fill={HIGHLIGHT} /> : null}
            {burned ? <rect x="-150" y={y - 13} width="300" height="18" rx="4" fill={BURN_FILL} /> : null}
            <text x="-142" y={y} fill={INK} fontSize="13" fontFamily="ui-monospace, monospace">
              {address}
            </text>
            <text
              x="142"
              y={y}
              fill={burned ? BURN : INK}
              fontSize="13"
              fontFamily="ui-monospace, monospace"
              textAnchor="end"
            >
              {amount}
            </text>
            {burned ? <line x1="-150" y1={y - 4} x2="150" y2={y - 4} stroke={BURN} strokeWidth="1.6" /> : null}
            {mode === "frozen" && highlighted ? (
              <text x="86" y={y} fontSize="12">
                🔒
              </text>
            ) : null}
          </g>
        );
      })}
      {mode === "balance" ? (
        <text x="120" y="78" fill={BLUE} fontFamily="var(--font-hand), cursive" fontSize="26" textAnchor="middle">
          your balance
        </text>
      ) : null}
      {mode === "mint" ? (
        <g fontFamily="var(--font-hand), cursive" fontSize="24">
          <text x="-120" y="92" fill={BLUE}>
            new USDC
          </text>
          <text x="70" y="92" fill={BURN}>
            pulled back
          </text>
        </g>
      ) : null}
      {mode === "frozen" ? (
        <text x="0" y="96" fill={BURN} fontFamily="var(--font-hand), cursive" fontSize="26" textAnchor="middle">
          can’t move
        </text>
      ) : null}
    </g>
  );
}

function NetworkParity() {
  const rows = ["Ethereum", "Solana", "Base", "Other listed networks"];

  return (
    <g>
      <text x="-190" y="-78" fill={INK} fontFamily="var(--font-hand), cursive" fontSize="28">
        one token, any network
      </text>
      <text
        x="190"
        y="-78"
        fill={BLUE}
        fontSize="16"
        textAnchor="end"
        fontFamily="var(--font-geist-sans), sans-serif"
      >
        {billions(circulation.total)}
      </text>
      {rows.map((name, index) => {
        const y = -36 + index * 48;
        return (
          <g key={name}>
            <text x="-190" y={y} fill={INK} fontSize="15" fontFamily="var(--font-geist-sans), sans-serif">
              {name}
            </text>
            <text
              x="190"
              y={y}
              fill={INK}
              fontSize="15"
              textAnchor="end"
              fontFamily="var(--font-geist-sans), sans-serif"
            >
              1 USDC
            </text>
            <rect x="-190" y={y + 8} width="380" height="12" rx="6" fill={BLUE} />
          </g>
        );
      })}
    </g>
  );
}

const SLICE_FILL = [CARD, SLICE_MID, BLUE, WASH] as const;
const SLICE_SHORT = ["Other banks", "Biggest banks", "Overnight repo", "Short Treasuries"] as const;

function donutSlice(outer: number, inner: number, start: number, end: number) {
  const large = end - start > Math.PI ? 1 : 0;
  const round = (value: number) => Math.round(value * 100) / 100;
  const ox1 = round(Math.cos(start) * outer);
  const oy1 = round(Math.sin(start) * outer);
  const ox2 = round(Math.cos(end) * outer);
  const oy2 = round(Math.sin(end) * outer);
  const ix1 = round(Math.cos(end) * inner);
  const iy1 = round(Math.sin(end) * inner);
  const ix2 = round(Math.cos(start) * inner);
  const iy2 = round(Math.sin(start) * inner);
  return `M ${ox1} ${oy1} A ${outer} ${outer} 0 ${large} 1 ${ox2} ${oy2} L ${ix1} ${iy1} A ${inner} ${inner} 0 ${large} 0 ${ix2} ${iy2} Z`;
}

function ReserveBoard({ selectedPoolIndex }: { selectedPoolIndex: number }) {
  const selected = reservePool[selectedPoolIndex];
  const outer = 128;
  const inner = 72;
  let angle = -Math.PI / 2;
  const slices = reservePool.map((item) => {
    const sweep = (item.amount / reserves.total) * Math.PI * 2;
    const start = angle;
    const end = angle + sweep;
    const mid = start + sweep / 2;
    angle = end;
    return { start, end, mid };
  });

  return (
    <g fontFamily="var(--font-geist-sans), sans-serif">
      <text x="0" y="-268" fill={INK} textAnchor="middle" fontFamily="var(--font-hand), cursive" fontSize="32">
        {reserves.asOf}
      </text>
      <text x="0" y="-236" fill={MUTED} textAnchor="middle" fontSize="13">
        Circle transparency page
      </text>

      {(
        [
          ["In circulation", billions(circulation.total), INK],
          ["Total reserves", billions(reserves.total), INK],
          ["Above circulation", billions(reserveCoverage), BLUE],
        ] as const
      ).map(([label, value, color], index) => (
        <g key={label} transform={`translate(${-240 + index * 160} -218)`}>
          <rect width="148" height="58" rx="12" fill={CARD} stroke={LINE} />
          <text x="14" y="22" fill={MUTED} fontSize="12">
            {label}
          </text>
          <text x="14" y="44" fill={color} fontSize="15">
            {value}
          </text>
        </g>
      ))}

      <g transform="translate(0 48)">
        {slices.map((slice, index) => {
          const isSelected = index === selectedPoolIndex;
          const explode = isSelected ? 10 : 0;
          const dx = Math.cos(slice.mid) * explode;
          const dy = Math.sin(slice.mid) * explode;
          return (
            <path
              key={reservePool[index].id}
              d={donutSlice(outer, inner, slice.start, slice.end)}
              transform={`translate(${dx} ${dy})`}
              fill={SLICE_FILL[index]}
              stroke={INK}
              strokeWidth={isSelected ? 3 : 1.8}
            />
          );
        })}
        <text x="0" y="-8" fill={INK} textAnchor="middle" fontFamily="var(--font-hand), cursive" fontSize="36">
          {poolShare(selected.amount)}
        </text>
        <text x="0" y="18" fill={MUTED} textAnchor="middle" fontSize="13">
          of the pool
        </text>
      </g>

      {SLICE_SHORT.map((label, index) => (
        <g key={label} transform={`translate(${index % 2 === 0 ? -168 : 16} ${222 + Math.floor(index / 2) * 28})`}>
          <rect x="0" y="-11" width="14" height="14" rx="3" fill={SLICE_FILL[index]} stroke={INK} strokeWidth="1.2" />
          <text x="22" y="1" fill={index === selectedPoolIndex ? BLUE : INK} fontSize="14">
            {label}
          </text>
        </g>
      ))}

      <text x="0" y="292" fill={MUTED} textAnchor="middle" fontSize="14">
        {selected.label} · {billions(selected.amount)}. A holder does not own a slice.
      </text>
    </g>
  );
}

function InterestSplit() {
  return (
    <g fontFamily="var(--font-geist-sans), sans-serif">
      <rect x="-270" y="-150" width="230" height="250" rx="18" fill={CARD} stroke={LINE} />
      <circle cx="-155" cy="-78" r="36" fill={PAPER} stroke={INK} strokeWidth="2.5" />
      <text x="-155" y="-68" fill={INK} textAnchor="middle" fontFamily="var(--font-hand), cursive" fontSize="28">
        $
      </text>
      <text x="-155" y="-18" fill={INK} textAnchor="middle" fontSize="15">
        You hold USDC
      </text>
      <text x="-155" y="28" fill={BLUE} textAnchor="middle" fontFamily="var(--font-hand), cursive" fontSize="40">
        $1
      </text>
      <text x="-155" y="58" fill={MUTED} textAnchor="middle" fontSize="14">
        face value, minus fees
      </text>

      <path d="M -28 -20 H 28" fill="none" stroke={BLUE} strokeWidth="2.5" markerEnd="url(#arrow)" />
      <text x="0" y="-32" fill={BLUE} textAnchor="middle" fontSize="12">
        the return
      </text>

      <rect x="40" y="-150" width="230" height="250" rx="18" fill={CARD_BLUE} stroke={BLUE} />
      <text x="155" y="-78" fill={INK} textAnchor="middle" fontFamily="var(--font-hand), cursive" fontSize="30">
        Circle keeps it
      </text>
      <text x="155" y="-28" fill={MUTED} textAnchor="middle" fontSize="15">
        Interest on the reserves
      </text>
      <text x="155" y="4" fill={MUTED} textAnchor="middle" fontSize="15">
        is not paid to holders.
      </text>
      <text x="0" y="150" fill={MUTED} textAnchor="middle" fontSize="14">
        Holding USDC is not a savings account.
      </text>
    </g>
  );
}

export function Coin({ scene, previous, progress, filter, toy, reduced }: CoinProps) {
  const pose = applyFilter(blendScenes(scene, previous, reduced ? 1 : progress), filter);

  return (
    <svg viewBox="0 0 640 680" className="h-full w-full" role="img" aria-label="Illustrated breakdown of a USDC token">
      <defs>
        <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(32)">
          <line x1="0" y1="0" x2="0" y2="7" stroke={TICK} strokeWidth="1.4" />
        </pattern>
        <radialGradient id="ledger-shade" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor={SHEEN} stopOpacity="0.35" />
          <stop offset="100%" stopColor={SHADE_DEEP} stopOpacity="0.35" />
        </radialGradient>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={BLUE} />
        </marker>
      </defs>

      <Layer id="coin" pose={pose.coin}>
        <CoinFace />
      </Layer>

      <Layer id="ledger" pose={pose.ledger}>
        <text x="-300" y="8" fill={INK} fontFamily="var(--font-hand), cursive" fontSize="26">
          no coin here
        </text>
        <LedgerSheet mode="balance" />
      </Layer>

      <Layer id="contract" pose={pose.contract}>
        <g>
          <rect x="-150" y="-110" width="300" height="220" rx="16" fill={PAPER} stroke={INK} strokeWidth="2.5" />
          <text x="-126" y="-74" fill={BLUE} fontSize="14" fontFamily="var(--font-geist-sans), sans-serif">
            ETHEREUM CONTRACT
          </text>
          <text x="-126" y="-36" fill={INK} fontSize="18" fontFamily="ui-monospace, monospace">
            0xA0b8…eB48
          </text>
          <text x="-126" y="4" fill={INK} fontSize="16" fontFamily="var(--font-geist-sans), sans-serif">
            6 decimal places
          </text>
          <text x="-126" y="32" fill={MUTED} fontSize="15" fontFamily="var(--font-geist-sans), sans-serif">
            smallest unit 0.000001
          </text>
          <text x="-126" y="78" fill={INK} fontFamily="var(--font-hand), cursive" fontSize="28">
            anyone can read it
          </text>
        </g>
      </Layer>

      <Layer id="chains" pose={pose.chains}>
        <NetworkParity />
      </Layer>

      <Layer id="mint" pose={pose.mint}>
        <LedgerSheet mode="mint" />
        <g transform="translate(196 -20)">
          <rect x="0" y="0" width="78" height="48" rx="4" fill={PAPER} stroke={INK} strokeWidth="2" />
          <rect x="8" y="-8" width="78" height="48" rx="4" fill={PAPER} stroke={INK} strokeWidth="2" />
          <text x="18" y="22" fill={BLUE} fontFamily="var(--font-hand), cursive" fontSize="22">
            $
          </text>
          <text x="-20" y="78" fill={INK} fontFamily="var(--font-hand), cursive" fontSize="22">
            dollars in
          </text>
        </g>
      </Layer>

      <Layer id="reserves" pose={pose.reserves}>
        <ReserveBoard selectedPoolIndex={toy.selectedPoolIndex} />
      </Layer>

      <Layer id="yield" pose={pose.yield}>
        <InterestSplit />
      </Layer>

      <Layer id="peg" pose={pose.peg}>
        <g>
          <text x="-160" y="-90" fill={INK} fontFamily="var(--font-hand), cursive" fontSize="30">
            one dollar, with Circle
          </text>
          <line x1="-160" y1="0" x2="170" y2="0" stroke={DASH} strokeWidth="2" strokeDasharray="4 6" />
          <text x="178" y="4" fill={BLUE} fontSize="14" fontFamily="var(--font-geist-sans), sans-serif">
            $1
          </text>
          <path
            d="M -160 8 C -110 8, -80 10, -40 36 S 20 18, 80 6 S 140 4, 170 2"
            fill="none"
            stroke={INK}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <text x="-160" y="78" fill={MUTED} fontSize="16" fontFamily="var(--font-geist-sans), sans-serif">
            exchanges trade at whatever buyers pay
          </text>
        </g>
      </Layer>

      <Layer id="freeze" pose={pose.freeze}>
        <LedgerSheet mode="frozen" />
      </Layer>

      <Layer id="terms" pose={pose.terms}>
        <g>
          <rect x="-170" y="-120" width="340" height="250" rx="14" fill={PAPER} stroke={INK} strokeWidth="2.5" />
          <text x="-146" y="-80" fill={INK} fontFamily="var(--font-hand), cursive" fontSize="32">
            read the terms
          </text>
          {["Not legal tender", "No FDIC or SIPC cover", "Mint is for institutions", "Redemption can be stopped"].map(
            (line, index) => (
              <text
                key={line}
                x="-146"
                y={-30 + index * 36}
                fill={INK}
                fontSize="18"
                fontFamily="var(--font-geist-sans), sans-serif"
              >
                {line}
              </text>
            ),
          )}
        </g>
      </Layer>
    </svg>
  );
}

function Layer({ id, pose, children }: { id: LayerId; pose: Xform; children: ReactNode }) {
  return (
    <g data-layer={id} opacity={pose.opacity} transform={`translate(${pose.x} ${pose.y}) scale(${pose.scale})`}>
      {children}
    </g>
  );
}
