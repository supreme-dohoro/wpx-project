import { useMemo, useRef, useState, useEffect, useLayoutEffect, type ReactNode } from "react";
import { ChevronsUpDown, ChevronUp, ChevronDown, Eye, Link2, MoreHorizontal } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import thumb from "@/assets/thumb.jpg";
import avatar from "@/assets/avatar.jpg";

export type Row = {
  id: string;
  project: string;
  customer: string;
  initials: string;
  used: number;
  budget: number;
  recycle: number;
  templates: string[];
  tags: string[];
  team: string[];
  link: string;
  images: number;
  file: string;
  notes: string;
  status: "Active" | "On Hold" | "At Risk";
  lastActivity: string;
};

export const rows: Row[] = [
  { id: "1", project: "Dohoro 220826 570 Annadale Lane Hollywood, FL 33024", customer: "Dohoro Management Pvt Ltd", initials: "DM", used: 400, budget: 400, recycle: 93, templates: ["Master Template", "Testing Template", "Incident Report Template", "Waste Template"], tags: ["Greenstar", "WELL Building Standard", "LEED", "BREEAM", "NABERS"], team: ["CN", "CN", "img", "a", "b", "c", "d", "e"], link: "External_Link", images: 6, file: "1751343152378.pdf", notes: "Final inspection booked; awaiting council sign-off on drainage plan.", status: "Active", lastActivity: "2026-09-08" },
  { id: "2", project: "Solara 230914 1123 Maplewood Drive Coral Springs, FL 33065", customer: "Solara Communications", initials: "SC", used: 302, budget: 400, recycle: 57, templates: ["Master Template"], tags: [], team: ["CN", "img"], link: "Site_Drive", images: 3, file: "site-survey-0914.pdf", notes: "Skip bin swap scheduled for Monday morning.", status: "On Hold", lastActivity: "2026-09-05" },
  { id: "3", project: "Aurelia 231105 4567 Pinecrest Avenue Boca Raton, FL 33431", customer: "Aurelia Tech Solutions", initials: "AT", used: 0, budget: 400, recycle: 80, templates: ["Incident Report Template", "Testing Template"], tags: ["Greenstar"], team: ["CN", "CN", "img", "a"], link: "External_Link", images: 2, file: "aurelia-scope.pdf", notes: "Kick-off pending client deposit.", status: "At Risk", lastActivity: "2026-08-27" },
  { id: "4", project: "Celestia 231210 7890 Oakridge Blvd Fort Lauderdale, FL 33308", customer: "Celestia InfoTech Pvt Ltd", initials: "CI", used: 0, budget: 400, recycle: 80, templates: ["Master Template", "Testing Template", "Incident Report Template", "Waste Template"], tags: ["LEED"], team: ["CN", "img"], link: "Client_Portal", images: 4, file: "celestia-plan-v2.pdf", notes: "Revised layout drawings uploaded for review.", status: "Active", lastActivity: "2026-07-19" },
  { id: "5", project: "Luminex 240101 2345 Cedar Lane Miami, FL 33133", customer: "Luminex Digital Services", initials: "LD", used: 0, budget: 400, recycle: 80, templates: ["New Master Template"], tags: ["LEED", "WELL Building Standard"], team: ["CN", "CN", "img", "a", "b"], link: "External_Link", images: 1, file: "luminex-brief.pdf", notes: "Awaiting site access induction details.", status: "Active", lastActivity: "2026-03-03" },
];

type ColType = "checkbox" | "text" | "customer" | "number" | "recycle" | "badges" | "tags" | "avatars" | "link" | "image" | "file" | "notes" | "status" | "date" | "actions";
type Col = { key: string; label: string; type: ColType; width: number; min: number; sortable?: boolean; sortValue?: (r: Row) => string | number };

const initialCols: Col[] = [
  { key: "select", label: "", type: "checkbox", width: 48, min: 40 },
  { key: "project", label: "Project", type: "text", width: 228, min: 100, sortable: true, sortValue: (r) => r.project },
  { key: "customer", label: "Customer", type: "customer", width: 224, min: 120, sortable: true, sortValue: (r) => r.customer },
  { key: "budget", label: "Budget Hrs", type: "number", width: 224, min: 140, sortable: true, sortValue: (r) => r.used / r.budget },
  { key: "recycle", label: "Recycling", type: "recycle", width: 224, min: 120, sortable: true, sortValue: (r) => r.recycle },
  { key: "templates", label: "Templates", type: "badges", width: 224, min: 120 },
  { key: "tags", label: "Project Tags", type: "tags", width: 224, min: 100 },
  { key: "team", label: "Team", type: "avatars", width: 140, min: 80 },
  { key: "link", label: "Link", type: "link", width: 180, min: 100 },
  { key: "images", label: "Images", type: "image", width: 100, min: 72 },
  { key: "file", label: "File", type: "file", width: 200, min: 120 },
  { key: "notes", label: "Notes", type: "notes", width: 240, min: 140 },
  { key: "status", label: "Status", type: "status", width: 120, min: 80, sortable: true, sortValue: (r) => r.status },
  { key: "lastActivity", label: "Last Activity", type: "date", width: 150, min: 100, sortable: true, sortValue: (r) => r.lastActivity },
  { key: "actions", label: "Actions", type: "actions", width: 100, min: 80 },
];

const tagStyle = (t: string) =>
  t === "Greenstar" ? "bg-tag-green-bg text-tag-green"
  : t === "LEED" ? "bg-tag-purple-bg text-tag-purple"
  : t.startsWith("WELL") ? "bg-tag-blue-bg text-tag-blue"
  : "bg-tag-amber-bg text-tag-amber";

const statusStyle: Record<Row["status"], string> = {
  Active: "bg-tag-green-bg text-tag-green",
  "On Hold": "bg-tag-amber-bg text-tag-amber",
  "At Risk": "bg-tag-red-bg text-tag-red",
};

const fmtDate = (d: string) =>
  new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

/** Only shows a tooltip when the content is actually truncated. */
function TruncateTip({ text, className, children }: { text: string; className?: string; children?: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [clipped, setClipped] = useState(false);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setClipped(el.scrollWidth > el.clientWidth + 1);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const span = (
    <span ref={ref} className={className} title={clipped ? undefined : text}>
      {children ?? text}
    </span>
  );
  if (!clipped) return span;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{span}</TooltipTrigger>
      <TooltipContent className="max-w-xs whitespace-normal">{text}</TooltipContent>
    </Tooltip>
  );
}

function Checkbox({ checked, indeterminate, onChange, label }: { checked: boolean; indeterminate?: boolean; onChange: () => void; label: string }) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (ref.current) ref.current.indeterminate = !!indeterminate; }, [indeterminate]);
  return (
    <input
      ref={ref}
      type="checkbox"
      aria-label={label}
      checked={checked}
      onChange={onChange}
      className="h-[15px] w-[15px] cursor-pointer rounded-[3px] border-input accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    />
  );
}

function Chips({ items, expanded, max, className, chipClass }: { items: string[]; expanded: boolean; max: number; className?: string; chipClass: (s: string) => string }) {
  if (!items.length) return <span className="ml-3 inline-block h-px w-4 bg-subtle" />;
  const shown = expanded ? items : items.slice(0, max);
  const rest = items.length - shown.length;
  return (
    <div className={`flex min-w-0 gap-1.5 ${expanded ? "flex-wrap" : "flex-nowrap"} ${className ?? ""}`}>
      {shown.map((t, i) => (
        <span key={i} title={t} className={`min-w-0 ${expanded ? "" : "max-w-[96px]"} shrink truncate rounded px-2 py-[3px] text-[13px] ${chipClass(t)}`}>{t}</span>
      ))}
      {rest > 0 && <span className="shrink-0 rounded border bg-chip px-1.5 py-[3px] text-[13px] text-muted-foreground">+{rest}</span>}
    </div>
  );
}

export function ProjectTable({ expanded }: { expanded: boolean }) {
  const [cols, setCols] = useState(initialCols);
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [resizing, setResizing] = useState<string | null>(null);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const c = cols.find((c) => c.key === sort.key);
    if (!c?.sortValue) return rows;
    return [...rows].sort((a, b) => {
      const va = c.sortValue!(a), vb = c.sortValue!(b);
      const r = va < vb ? -1 : va > vb ? 1 : 0;
      return sort.dir === "asc" ? r : -r;
    });
  }, [sort, cols]);

  const total = cols.reduce((s, c) => s + c.width, 0);
  const allSel = selected.size === rows.length;
  const someSel = selected.size > 0 && !allSel;

  const startResize = (e: React.PointerEvent, key: string) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const col = cols.find((c) => c.key === key)!;
    const startW = col.width;
    setResizing(key);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    const move = (ev: PointerEvent) => {
      const w = Math.max(col.min, startW + ev.clientX - startX);
      setCols((cs) => cs.map((c) => (c.key === key ? { ...c, width: w } : c)));
    };
    const up = () => {
      setResizing(null);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const toggleSort = (key: string) =>
    setSort((s) => (s?.key !== key ? { key, dir: "asc" } : s.dir === "asc" ? { key, dir: "desc" } : null));

  const toggleRow = (id: string) =>
    setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const cell = (c: Col, r: Row): ReactNode => {
    const clamp = expanded ? "whitespace-normal break-words" : "truncate";
    switch (c.type) {
      case "checkbox":
        return <Checkbox label={`Select ${r.project}`} checked={selected.has(r.id)} onChange={() => toggleRow(r.id)} />;
      case "text":
        return <span className={`block pl-1 text-[15px] ${clamp}`} title={r.project}>{r.project}</span>;
      case "customer":
        return (
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded bg-avatar-bg text-[15px] text-primary">{r.initials}</span>
            <span className={`min-w-0 text-[15px] ${clamp}`} title={r.customer}>{r.customer}</span>
          </div>
        );
      case "number": {
        const pct = (r.used / r.budget) * 100;
        return (
          <div className="flex min-w-0 items-center gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-1 whitespace-nowrap">
                <span className="text-[13px] text-subtle">C:</span>
                <span className="ml-auto mr-auto truncate text-[13px]"><span className="text-foreground">{r.used} /</span> <span className="text-subtle">{r.budget} hrs</span></span>
                <span className="text-[10px] text-subtle">{pct.toFixed(2)}%</span>
              </div>
              <div className="mt-1 h-[9px] overflow-hidden rounded-full bg-track">
                <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
              </div>
            </div>
            <Eye className="h-3.5 w-3.5 shrink-0 text-subtle" />
          </div>
        );
      }
      case "recycle":
        return (
          <div className="min-w-0">
            <div className="truncate text-[13px]">Recycle: {r.recycle.toFixed(2)}%</div>
            <div className="mt-1.5 h-[9px] overflow-hidden rounded-full bg-track">
              <div className="h-full rounded-full bg-recycle" style={{ width: `${r.used ? r.recycle : 0}%` }} />
            </div>
          </div>
        );
      case "badges":
        return <Chips items={r.templates} expanded={expanded} max={2} className={expanded ? "flex-col items-start" : ""} chipClass={() => "border bg-chip text-foreground"} />;
      case "tags":
        return <Chips items={r.tags} expanded={expanded} max={2} chipClass={tagStyle} />;
      case "avatars": {
        const shown = r.team.slice(0, 3);
        const rest = r.team.length - 3;
        return (
          <div className="flex items-center">
            {shown.map((m, i) => (
              <span key={i} className="-ml-2 first:ml-0 relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-secondary text-[13px] text-primary shadow-sm">
                {m === "img" || (i === 2 && rest > 0) ? (
                  <>
                    <img src={avatar} alt="" className="absolute inset-0 h-full w-full object-cover" />
                    {i === 2 && rest > 0 && <span className="relative text-[13px] font-medium text-primary-foreground">+{rest}</span>}
                  </>
                ) : m.slice(0, 2).toUpperCase()}
              </span>
            ))}
          </div>
        );
      }
      case "link":
        return (
          <a href="#" onClick={(e) => e.preventDefault()} className="flex min-w-0 items-center gap-2 text-[15px] text-primary hover:opacity-80 focus-visible:outline-2 focus-visible:outline-primary rounded">
            <Link2 className="h-4 w-4 shrink-0" />
            <span className="truncate underline underline-offset-2">{r.link}</span>
          </a>
        );
      case "image":
        return (
          <div className="relative h-11 w-11 overflow-hidden rounded border shadow-sm">
            <img src={thumb} alt="Site photo" loading="lazy" className="h-full w-full object-cover" />
            {r.images > 1 && <span className="absolute inset-0 flex items-center justify-center bg-foreground/35 text-[14px] text-primary-foreground">+{r.images - 1}</span>}
          </div>
        );
      case "file":
        return (
          <div className="flex min-w-0 items-center gap-2">
            <span className="relative flex h-8 w-7 shrink-0 items-end justify-center rounded-sm bg-secondary">
              <span className="mb-1 rounded-[2px] bg-destructive px-1 text-[7px] font-semibold text-destructive-foreground">pdf</span>
            </span>
            <span className="truncate text-[14px] text-tag-blue" title={r.file}>{r.file}</span>
          </div>
        );
      case "notes":
        return <span className={`block text-[14px] text-muted-foreground ${expanded ? "whitespace-normal" : "truncate"}`} title={r.notes}>{r.notes}</span>;
      case "status":
        return <span className={`inline-block max-w-full truncate rounded px-2 py-[3px] text-[13px] ${statusStyle[r.status]}`}>{r.status}</span>;
      case "date":
        return <span className="block truncate text-[15px]">{fmtDate(r.lastActivity)}</span>;
      case "actions":
        return (
          <div className="flex items-center gap-1">
            <button className="rounded border border-primary/40 bg-accent px-3 py-0.5 text-[14px] text-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-primary">Edit</button>
            <button aria-label="More" className="rounded p-1 text-subtle hover:bg-secondary"><MoreHorizontal className="h-4 w-4" /></button>
          </div>
        );
    }
  };

  const grid = cols.map((c) => `${c.width}px`).join(" ");

  return (
    <div className="overflow-x-auto rounded-md border">
      <div role="table" style={{ width: total, minWidth: "100%" }}>
        <div role="row" className="grid border-b bg-background" style={{ gridTemplateColumns: grid }}>
          {cols.map((c) => {
            const active = sort?.key === c.key;
            return (
              <div key={c.key} role="columnheader" className="relative flex h-[52px] min-w-0 items-center px-4 text-[15px] text-muted-foreground">
                {c.type === "checkbox" ? (
                  <Checkbox label="Select all" checked={allSel} indeterminate={someSel} onChange={() => setSelected(allSel ? new Set() : new Set(rows.map((r) => r.id)))} />
                ) : c.sortable ? (
                  <button onClick={() => toggleSort(c.key)} className="flex w-full min-w-0 items-center justify-between gap-2 rounded text-left hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary">
                    <span className="truncate">{c.label}</span>
                    {active ? (sort!.dir === "asc" ? <ChevronUp className="h-4 w-4 shrink-0 text-primary" /> : <ChevronDown className="h-4 w-4 shrink-0 text-primary" />) : <ChevronsUpDown className="h-4 w-4 shrink-0" />}
                  </button>
                ) : (
                  <span className="truncate">{c.label}</span>
                )}
                {c.type !== "checkbox" && (
                  <span role="separator" aria-label={`Resize ${c.label}`} data-active={resizing === c.key} className="col-resizer" onPointerDown={(e) => startResize(e, c.key)} />
                )}
              </div>
            );
          })}
        </div>
        {sorted.map((r) => {
          const sel = selected.has(r.id);
          return (
            <div key={r.id} role="row" className={`grid border-b last:border-b-0 transition-colors ${sel ? "bg-selected" : "hover:bg-hover"}`} style={{ gridTemplateColumns: grid }}>
              {cols.map((c) => (
                <div key={c.key} role="cell" className={`flex min-w-0 items-center px-4 ${expanded ? "py-4" : "h-[62px]"}`}>
                  <div className="min-w-0 w-full">{cell(c, r)}</div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
