"use client";

import { useState, type Ref } from "react";
import { sideLabel, type Chapter, type PieceFilter } from "@/lib/chapters";

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
  ref?: Ref<HTMLElement>;
};

export function ChapterCopy({ chapter, index, isLast, filter, onFilter, ref }: ChapterCopyProps) {
  return (
    <section
      ref={ref}
      id={chapter.id}
      className="flex min-h-[78vh] scroll-mt-[calc(36vh+var(--header-offset))] flex-col justify-center px-5 py-16 sm:px-10 lg:min-h-[110vh] lg:scroll-mt-[var(--header-offset)] lg:px-14"
    >
      {chapter.side ? (
        <p className="mb-4 w-fit rounded-full border border-[var(--line)] px-2.5 py-1 text-xs font-medium text-[var(--accent)]">
          {sideLabel[chapter.side]}
        </p>
      ) : null}
      {index === 0 ? (
        <h1 className="max-w-md font-[family-name:var(--font-hand)] text-5xl leading-none text-[var(--accent)] sm:text-6xl">
          {chapter.title}
        </h1>
      ) : (
        <h2 className="max-w-md font-[family-name:var(--font-hand)] text-5xl leading-none text-[var(--accent)] sm:text-6xl">
          {chapter.title}
        </h2>
      )}
      <div className="mt-6 max-w-md space-y-4 text-lg leading-8 text-[var(--ink)]">
        {chapter.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {index === 0 ? (
        <p className="mt-8 font-[family-name:var(--font-hand)] text-3xl text-[var(--accent)]">↓ Keep scrolling</p>
      ) : null}
      {chapter.glossary.length > 0 ? (
        <div className="mt-8 max-w-md space-y-3">
          {chapter.glossary.map((entry) => (
            <Glossary key={entry.term} term={entry.term} body={entry.body} />
          ))}
        </div>
      ) : null}
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

function Glossary({ term, body }: { term: string; body: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-[var(--line)] pt-3">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 text-left text-[var(--accent)]"
      >
        <span className="grid size-5 place-items-center rounded-full border border-current text-xs">i</span>
        <span className="font-medium">{term}</span>
      </button>
      {open ? <p className="mt-2 pl-7 text-base leading-7 text-[var(--muted)]">{body}</p> : null}
    </div>
  );
}
