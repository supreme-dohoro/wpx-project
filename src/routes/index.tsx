import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Keyboard,
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import {
  ColumnSettings,
  ProjectTable,
  type ColumnPreferences,
  type ProjectView,
} from "@/components/ProjectTable";

const walkthroughStorageKey = "project-table-walkthrough-seen";

function TableWalkthrough({
  step,
  onNext,
  onDismiss,
}: {
  step: number;
  onNext: () => void;
  onDismiss: () => void;
}) {
  const [position, setPosition] = useState<{ left: number; top: number; width: number } | null>(
    null,
  );
  const target =
    step === 0
      ? '[data-walkthrough-target="row-toggle"]'
      : '[data-walkthrough-target="column-resize"]';

  useEffect(() => {
    const updatePosition = () => {
      const element = document.querySelector<HTMLElement>(target);
      if (!element) return;

      element.dataset.guideActive = "true";
      const rect = element.getBoundingClientRect();
      const width = Math.min(320, window.innerWidth - 24);
      const left = Math.min(
        Math.max(12, rect.left + rect.width / 2 - width / 2),
        Math.max(12, window.innerWidth - width - 12),
      );
      const below = rect.bottom + 12;
      const top = below + 170 <= window.innerHeight ? below : Math.max(12, rect.top - 182);
      setPosition({ left, top, width });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      document.querySelector<HTMLElement>(target)?.removeAttribute("data-guide-active");
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [target]);

  if (!position) return null;

  const isLastStep = step === 1;
  return (
    <section
      aria-labelledby="table-walkthrough-title"
      aria-describedby="table-walkthrough-description"
      className="fixed z-[60] rounded-lg border bg-background p-4 shadow-lg"
      style={position}
      role="dialog"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-primary">Quick guide · {step + 1} of 2</p>
          <h2 id="table-walkthrough-title" className="mt-1 font-semibold">
            {step === 0 ? "Expand or collapse rows" : "Resize columns"}
          </h2>
        </div>
        <button
          type="button"
          aria-label="Dismiss walkthrough"
          onClick={onDismiss}
          className="rounded px-1 text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
        >
          ×
        </button>
      </div>
      <p id="table-walkthrough-description" className="mt-2 text-sm text-muted-foreground">
        {step === 0
          ? "Use this control to show more or less detail in every project row."
          : "Drag the divider at the edge of a column heading to adjust its width."}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onDismiss}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Skip
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {isLastStep ? "Got it" : "Next"}
        </button>
      </div>
    </section>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Projects — ALD Expert" },
      {
        name: "description",
        content: "Ongoing, completed and archived projects with budgets, recycling and tags.",
      },
      { property: "og:title", content: "Projects — ALD Expert" },
      {
        property: "og:description",
        content: "Ongoing, completed and archived projects with budgets, recycling and tags.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Select({ label }: { label: string }) {
  return (
    <button className="flex h-10 w-[232px] items-center justify-between rounded border border-dashed px-4 text-[15px] text-subtle hover:border-input focus-visible:outline-2 focus-visible:outline-primary">
      {label} <ChevronDown className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}

function Index() {
  const [tab, setTab] = useState<ProjectView>("Ongoing");
  const [expanded, setExpanded] = useState(false);
  const [columnPreferences, setColumnPreferences] = useState<ColumnPreferences>({
    order: [],
    hidden: [],
    pinned: [],
    showDividers: false,
  });
  const [page, setPage] = useState(1);
  const [walkthroughStep, setWalkthroughStep] = useState<number | null>(null);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(walkthroughStorageKey) !== "true") {
        setWalkthroughStep(0);
      }
    } catch (error) {
      console.error("Could not read the project table walkthrough preference.", error);
      setWalkthroughStep(0);
    }
  }, []);

  const dismissWalkthrough = () => {
    setWalkthroughStep(null);
    try {
      window.localStorage.setItem(walkthroughStorageKey, "true");
    } catch (error) {
      console.error("Could not save the project table walkthrough preference.", error);
    }
  };

  return (
    <div className="flex min-h-screen font-sans">
      <Sidebar />
      <main className="min-w-0 flex-1 px-7 pt-6 pb-10">
        <div className="flex items-center justify-between">
          <h1 className="text-[28px] font-semibold">Project</h1>
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-[14px] hover:text-primary">
              <Search className="h-4 w-4" /> Search
            </button>
            <button className="flex h-10 items-center gap-2 rounded bg-primary px-5 text-[15px] text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              <Plus className="h-4 w-4" /> Add New Project
            </button>
            <Keyboard className="h-6 w-6" strokeWidth={1.6} />
          </div>
        </div>

        <div className="mt-4 mb-7 flex flex-wrap items-center justify-between gap-3">
          <div className="flex rounded-md border p-[3px]">
            {(["Ongoing", "Completed", "Archived"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded px-[17px] py-2 text-[15px] transition-colors ${tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Select label="Select Customer" />
            <Select label="Project Tags" />
            <ColumnSettings
              view={tab}
              preferences={columnPreferences}
              onPreferencesChange={setColumnPreferences}
            />
            <button
              aria-label={expanded ? "Collapse rows" : "Expand rows"}
              data-walkthrough-target="row-toggle"
              aria-pressed={expanded}
              onClick={() => setExpanded((e) => !e)}
              className={`ml-3 flex h-9 w-9 items-center justify-center rounded border transition-colors hover:bg-secondary ${expanded ? "bg-accent text-primary" : ""}`}
            >
              {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <ProjectTable expanded={expanded} view={tab} preferences={columnPreferences} />
        {walkthroughStep !== null && (
          <TableWalkthrough
            step={walkthroughStep}
            onNext={walkthroughStep === 0 ? () => setWalkthroughStep(1) : dismissWalkthrough}
            onDismiss={dismissWalkthrough}
          />
        )}

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 px-3 text-[13px] text-muted-foreground">
          <span>Showing 1 -10 of 500</span>
          <div className="flex items-center gap-16">
            <div className="flex items-center gap-3">
              Rows per Page
              <button className="flex h-9 items-center gap-5 rounded border px-3 text-foreground">
                10 <ChevronDown className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center gap-3 text-foreground">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="flex h-9 items-center gap-2 rounded border px-3 hover:bg-secondary"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </button>
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`h-9 w-9 rounded ${page === n ? "border" : "hover:bg-secondary"}`}
                >
                  {n}
                </button>
              ))}
              <span className="px-1">...</span>
              <button
                onClick={() => setPage((p) => Math.min(3, p + 1))}
                className="flex h-9 items-center gap-2 rounded border px-3 hover:bg-secondary"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
