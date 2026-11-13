"use client";

import { useState, type Ref } from "react";
import { sideLabel, type Chapter, type PieceFilter, type ToyState } from "@/lib/chapters";
import { billions, poolShare, reservePool } from "@/lib/facts";

const filters: { id: PieceFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "record", label: "Blockchain" },
  { id: "circle", label: "Circle’s reports" },
];

type ChapterCopyProps = {
  chapter: Chapter;
  index: number;
  isLast: boolean;
  filter: PieceFilter;
  onFilter: (filter: PieceFilter) => void;
  toy: ToyState;
  onToy: (patch: Partial<ToyState>) => void;
  ref?: Ref<HTMLElement>;
};

export function ChapterCopy({ chapter, index, isLast, filter, onFilter, toy, onToy, ref }: ChapterCopyProps) {
  const isCentered = index === 0 || isLast;

  return (
    <section
      ref={ref}
      id={chapter.id}
      className={`flex min-h-[62vh] scroll-mt-[calc(36vh+var(--header-offset))] flex-col px-5 py-8 sm:px-10 sm:py-12 lg:min-h-[calc(100svh-var(--header-offset))] lg:scroll-mt-[var(--header-offset)] lg:px-14 lg:py-16${isCentered ? " justify-center" : ""}`}
    >
      {chapter.side ? (
        <p className="mb-4 w-fit rounded-full border border-[var(--line)] px-2.5 py-1 text-xs font-medium text-[var(--accent)]">
          {sideLabel[chapter.side]}
        </p>
      ) : null}
      {index === 0 ? (
        <h1 className="max-w-md font-[family-name:var(--font-hand)] text-[2rem] leading-tight text-[var(--accent)] sm:text-5xl sm:leading-none lg:text-6xl">
          {chapter.title}
        </h1>
      ) : (
        <h2 className="max-w-md font-[family-name:var(--font-hand)] text-[2rem] leading-tight text-[var(--accent)] sm:text-5xl sm:leading-none lg:text-6xl">
          {chapter.title}
        </h2>
      )}
      <div className="mt-4 max-w-md space-y-3 text-base leading-7 text-[var(--ink)] sm:mt-6 sm:space-y-4 sm:text-lg sm:leading-8">
        {chapter.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {index === 0 ? (
        <p className="mt-6 font-[family-name:var(--font-hand)] text-xl text-[var(--accent)] sm:mt-8 sm:text-3xl">↓ Keep scrolling</p>
      ) : null}
      {chapter.glossary.length > 0 ? (
        <div className="mt-8 max-w-md space-y-3">
          {chapter.glossary.map((entry) => (
            <Glossary key={entry.term} term={entry.term} body={entry.body} />
          ))}
        </div>
      ) : null}
      {chapter.toy === "reserve-slices" ? <ReserveSlices toy={toy} onToy={onToy} /> : null}
      {chapter.toy === "peg-drag" ? <PegDrag toy={toy} onToy={onToy} /> : null}
      {chapter.showFilter ? (
        <div className="mt-8" role="group" aria-label="Filter the pieces">
          <div className="flex w-fit rounded-full border border-[var(--line)] p-1">
            {filters.map((item) => {
              const selected = filter === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onFilter(item.id)}
                  className={`rounded-full px-4 py-1.5 text-sm ${selected ? "bg-[var(--accent)] text-white" : "text-[var(--ink)]"}`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
      {chapter.actions ? (
        <div className="mt-8 flex max-w-md flex-wrap gap-2">
          {chapter.actions.map((action, actionIndex) => (
            <a
              key={action.href}
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded-full px-4 py-2 text-sm ${actionIndex === 0 ? "bg-[var(--accent)] text-white" : "border border-[var(--line)] text-[var(--ink)] hover:text-[var(--accent)]"}`}
            >
              {action.label}
            </a>
          ))}
        </div>
      ) : null}
      {chapter.sources.length > 0 ? (
        <p className="mt-8 max-w-md text-sm leading-6 text-[var(--muted)]">
          {chapter.sources.map((source, sourceIndex) => (
            <span key={source.href}>
              {sourceIndex === 0 ? "Source: " : ""}
              <a
                href={source.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-[var(--line)] underline-offset-4 hover:text-[var(--accent)]"
              >
                {source.label}
              </a>
              {sourceIndex < chapter.sources.length - 1 ? " · " : ""}
            </span>
          ))}
        </p>
      ) : null}
      {isLast ? (
        <footer className="mt-12 max-w-md space-y-2 border-t border-[var(--line)] pt-8 text-sm leading-6 text-[var(--muted)]">
          <p>
            Not affiliated with Circle. All figures are sourced from Circle’s public pages and may change. 
            This project is for informational and educational purposes only.
          </p>
          <p>
            Built by{" "}
            <a
              href="https://x.com/rafiiwirana"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-[var(--line)] underline-offset-4 hover:text-[var(--accent)]"
            >
              @rafiiwirana
            </a>
            .
          </p>
        </footer>
      ) : null}
    </section>
  );
}

function ReserveSlices({ toy, onToy }: { toy: ToyState; onToy: (patch: Partial<ToyState>) => void }) {
  const slice = reservePool[toy.selectedPoolIndex];

  return (
    <div className="mt-8 max-w-md">
      <p className="mb-3 text-sm text-[var(--muted)]">Tap a slice of the pool</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Reserve pool">
        {reservePool.map((item, index) => {
          const selected = index === toy.selectedPoolIndex;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onToy({ selectedPoolIndex: index })}
              className={`rounded-full px-3 py-1.5 text-sm ${selected ? "bg-[var(--accent)] text-white" : "border border-[var(--line)] text-[var(--ink)]"}`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]" aria-live="polite">
        {slice.label} is {poolShare(slice.amount)} of the pool, {billions(slice.amount)}. A holder does not own a slice.
      </p>
    </div>
  );
}

function PegDrag({ toy, onToy }: { toy: ToyState; onToy: (patch: Partial<ToyState>) => void }) {
  const price = toy.marketPrice;
  const print = `$${price.toFixed(2)}`;
  const caption =
    price < 1
      ? `At ${print} on an exchange, a Circle Mint customer can buy tokens and redeem them at one dollar. Everyone else gets whatever a buyer will pay.`
      : price > 1
        ? `At ${print} on an exchange, a Mint customer can mint at one dollar and sell into that print. Circle does not guarantee that price for anyone else.`
        : `At ${print}, the market print matches Circle’s one-dollar mint and redemption. That cash-out is still only for a Mint account.`;

  return (
    <div className="mt-8 max-w-md">
      <div className="flex items-baseline justify-between gap-3 text-sm text-[var(--muted)]">
        <label htmlFor="market-print">Market print</label>
        <span className="font-medium text-[var(--accent)]">{print}</span>
      </div>
      <input
        id="market-print"
        type="range"
        min={0.94}
        max={1.06}
        step={0.01}
        value={price}
        aria-valuetext={print}
        onChange={(event) => onToy({ marketPrice: Number(event.target.value) })}
        className="mt-3 w-full accent-[var(--accent)]"
      />
      <div className="mt-1 flex justify-between text-xs text-[var(--muted)]">
        <span>$0.94</span>
        <span>$1.00</span>
        <span>$1.06</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]" aria-live="polite">
        {caption}
      </p>
    </div>
  );
}

function Glossary({ term, body }: { term: string; body: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-[var(--line)] pt-3">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 text-left text-sm text-[var(--accent)] sm:text-base"
      >
        <span className="grid size-5 place-items-center rounded-full border border-current text-xs">i</span>
        <span className="font-medium">{term}</span>
      </button>
      {open ? <p className="mt-2 pl-7 text-sm leading-6 text-[var(--muted)] sm:text-base sm:leading-7">{body}</p> : null}
    </div>
  );
}
