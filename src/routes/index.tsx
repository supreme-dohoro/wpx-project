import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Plus, ChevronDown, ChevronLeft, ChevronRight, Maximize2, Minimize2, Keyboard } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { ProjectTable, type ProjectView } from "@/components/ProjectTable";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Projects — ALD Expert" },
      { name: "description", content: "Ongoing, completed and archived projects with budgets, recycling and tags." },
      { property: "og:title", content: "Projects — ALD Expert" },
      { property: "og:description", content: "Ongoing, completed and archived projects with budgets, recycling and tags." },
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
  const [page, setPage] = useState(1);
  return (
    <div className="flex min-h-screen font-sans">
      <Sidebar />
      <main className="min-w-0 flex-1 px-7 pt-6 pb-10">
        <div className="flex items-center justify-between">
          <h1 className="text-[28px] font-semibold">Project</h1>
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-[14px] hover:text-primary"><Search className="h-4 w-4" /> Search</button>
            <button className="flex h-10 items-center gap-2 rounded bg-primary px-5 text-[15px] text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              <Plus className="h-4 w-4" /> Add New Project
            </button>
            <Keyboard className="h-6 w-6" strokeWidth={1.6} />
          </div>
        </div>

        <div className="mt-4 mb-7 flex flex-wrap items-center justify-between gap-3">
          <div className="flex rounded-md border p-[3px]">
            {(["Ongoing", "Completed", "Archived"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`rounded px-[17px] py-2 text-[15px] transition-colors ${tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{t}</button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Select label="Select Customer" />
            <Select label="Project Tags" />
            <button
              aria-label={expanded ? "Collapse rows" : "Expand rows"}
              aria-pressed={expanded}
              onClick={() => setExpanded((e) => !e)}
              className={`ml-3 flex h-9 w-9 items-center justify-center rounded border transition-colors hover:bg-secondary ${expanded ? "bg-accent text-primary" : ""}`}
            >
              {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <ProjectTable expanded={expanded} view={tab} />

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 px-3 text-[13px] text-muted-foreground">
          <span>Showing 1 -10 of 500</span>
          <div className="flex items-center gap-16">
            <div className="flex items-center gap-3">
              Rows per Page
              <button className="flex h-9 items-center gap-5 rounded border px-3 text-foreground">10 <ChevronDown className="h-4 w-4" /></button>
            </div>
            <div className="flex items-center gap-3 text-foreground">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="flex h-9 items-center gap-2 rounded border px-3 hover:bg-secondary"><ChevronLeft className="h-4 w-4" /> Prev</button>
              {[1, 2, 3].map((n) => (
                <button key={n} onClick={() => setPage(n)} className={`h-9 w-9 rounded ${page === n ? "border" : "hover:bg-secondary"}`}>{n}</button>
              ))}
              <span className="px-1">...</span>
              <button onClick={() => setPage((p) => Math.min(3, p + 1))} className="flex h-9 items-center gap-2 rounded border px-3 hover:bg-secondary">Next <ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
