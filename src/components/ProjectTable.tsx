import { useMemo, useRef, useState, useEffect, useLayoutEffect, type ReactNode } from "react";
import { ChevronsUpDown, ChevronUp, ChevronDown, Eye, Link2, MoreHorizontal, MapPin, Phone, Mail, RefreshCw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import thumb from "@/assets/thumb.jpg";
import avatar from "@/assets/avatar.jpg";

export type ProjectView = "Ongoing" | "Completed" | "Archived";

export type Row = {
  id: string;
  lifecycle: ProjectView;
  endDate?: string | undefined;
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
  { id: "1", lifecycle: "Ongoing", project: "Dohoro 220826 570 Annadale Lane Hollywood, FL 33024", customer: "Dohoro Management Pvt Ltd", initials: "DM", used: 400, budget: 400, recycle: 93, templates: ["Master Template", "Testing Template", "Incident Report Template", "Waste Template"], tags: ["Greenstar", "WELL Building Standard", "LEED", "BREEAM", "NABERS"], team: ["CN", "CN", "img", "a", "b", "c", "d", "e"], link: "External_Link", images: 6, file: "1751343152378.pdf", notes: "Final inspection booked; awaiting council sign-off on drainage plan.", status: "Active", lastActivity: "2026-09-08" },
  { id: "2", lifecycle: "Ongoing", project: "Solara 230914 1123 Maplewood Drive Coral Springs, FL 33065", customer: "Solara Communications", initials: "SC", used: 302, budget: 400, recycle: 57, templates: ["Master Template"], tags: [], team: ["CN", "img"], link: "Site_Drive", images: 3, file: "site-survey-0914.pdf", notes: "Skip bin swap scheduled for Monday morning.", status: "On Hold", lastActivity: "2026-09-05" },
  { id: "3", lifecycle: "Ongoing", project: "Aurelia 231105 4567 Pinecrest Avenue Boca Raton, FL 33431", customer: "Aurelia Tech Solutions", initials: "AT", used: 0, budget: 400, recycle: 80, templates: ["Incident Report Template", "Testing Template"], tags: ["Greenstar"], team: ["CN", "CN", "img", "a"], link: "External_Link", images: 2, file: "aurelia-scope.pdf", notes: "Kick-off pending client deposit.", status: "At Risk", lastActivity: "2026-08-27" },
  { id: "4", lifecycle: "Completed", endDate: "2026-07-19", project: "Celestia 231210 7890 Oakridge Blvd Fort Lauderdale, FL 33308", customer: "Celestia InfoTech Pvt Ltd", initials: "CI", used: 0, budget: 400, recycle: 80, templates: ["Master Template", "Testing Template", "Incident Report Template", "Waste Template"], tags: ["LEED"], team: ["CN", "img"], link: "Client_Portal", images: 4, file: "celestia-plan-v2.pdf", notes: "Revised layout drawings uploaded for review.", status: "Active", lastActivity: "2026-07-19" },
  { id: "5", lifecycle: "Archived", project: "Luminex 240101 2345 Cedar Lane Miami, FL 33133", customer: "Luminex Digital Services", initials: "LD", used: 0, budget: 400, recycle: 80, templates: ["New Master Template"], tags: ["LEED", "WELL Building Standard"], team: ["CN", "CN", "img", "a", "b"], link: "External_Link", images: 1, file: "luminex-brief.pdf", notes: "Awaiting site access induction details.", status: "Active", lastActivity: "2026-03-03" },
  {
    id: "6",
    lifecycle: "Ongoing",
    project: "North American Regional Climate Resilience and Sustainable Infrastructure Modernization Program — Phase 4",
    customer: "International Consortium for Environmental Planning and Sustainable Urban Development",
    initials: "IC",
    used: 275,
    budget: 600,
    recycle: 42,
    templates: ["Master Template", "Testing Template", "Incident Report Template", "Waste Template", "Safety Audit Template", "Environmental Impact Assessment"],
    tags: ["Greenstar", "WELL Building Standard", "LEED", "BREEAM", "NABERS", "Living Building Challenge", "Infrastructure Sustainability"],
    team: ["CN", "img", "a", "b", "c", "d", "e", "f"],
    link: "Regional_Project_Documentation",
    images: 8,
    file: "north-american-regional-climate-resilience-and-infrastructure-modernization-plan.pdf",
    notes: "Multi-region delivery with long project, customer, template, tag, and file names to exercise truncation and overflow layouts.",
    status: "Active",
    lastActivity: "2026-09-21",
  },
  {
    id: "7",
    lifecycle: "Ongoing",
    project: "X",
    customer: "Q",
    initials: "Q",
    used: 0,
    budget: 1,
    recycle: 0,
    templates: [],
    tags: [],
    team: [],
    link: "—",
    images: 0,
    file: "—",
    notes: "—",
    status: "On Hold",
    lastActivity: "2026-09-18",
  },
  {
    id: "8",
    lifecycle: "Ongoing",
    project: "Riverside Community Centre",
    customer: "Community Services",
    initials: "CS",
    used: 550,
    budget: 400,
    recycle: 100,
    templates: ["Master", "Safety", "Waste", "Inspection", "Close-out"],
    tags: ["Greenstar", "LEED", "BREEAM", "NABERS", "WELL Building Standard", "Passive House", "Carbon Neutral"],
    team: ["CN", "CN", "img", "a", "b", "c", "d", "e", "f", "g"],
    link: "Project_Drive",
    images: 12,
    file: "riverside-community-centre.pdf",
    notes: "Contract hours exceed budget; also exercises large tag, template, and team overflow.",
    status: "At Risk",
    lastActivity: "2026-09-16",
  },
  {
    id: "9",
    lifecycle: "Ongoing",
    project: "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    customer: "SupercalifragilisticexpialidociousInternationalHoldings",
    initials: "SI",
    used: 1,
    budget: 400,
    recycle: 1,
    templates: ["T"],
    tags: ["A"],
    team: ["A"],
    link: "X",
    images: 1,
    file: "x.pdf",
    notes: "Single-token values test truncation without whitespace break opportunities.",
    status: "Active",
    lastActivity: "2026-09-12",
  },
];

type ColType = "checkbox" | "text" | "customer" | "number" | "recycle" | "badges" | "tags" | "avatars" | "link" | "image" | "file" | "notes" | "status" | "date" | "endDate" | "actions";
type Col = { key: string; label: string; type: ColType; width: number; min: number; sortable?: boolean; sortValue?: (r: Row) => string | number };

const initialCols: Col[] = [
  { key: "select", label: "", type: "checkbox", width: 48, min: 40 },
  { key: "project", label: "Project", type: "text", width: 300, min: 240, sortable: true, sortValue: (r) => r.project },
  { key: "customer", label: "Customer", type: "customer", width: 280, min: 240, sortable: true, sortValue: (r) => r.customer },
  { key: "budget", label: "Budget Hrs", type: "number", width: 280, min: 240, sortable: true, sortValue: (r) => r.used / r.budget },
  { key: "recycle", label: "Recycling", type: "recycle", width: 224, min: 120, sortable: true, sortValue: (r) => r.recycle },
  { key: "templates", label: "Templates", type: "badges", width: 224, min: 190 },
  { key: "tags", label: "Project Tags", type: "tags", width: 224, min: 190 },
  { key: "team", label: "Team", type: "avatars", width: 160, min: 140 },
  { key: "link", label: "Link", type: "link", width: 180, min: 100 },
  { key: "images", label: "Images", type: "image", width: 100, min: 72 },
  { key: "file", label: "File", type: "file", width: 200, min: 120 },
  { key: "notes", label: "Notes", type: "notes", width: 240, min: 140 },
  { key: "status", label: "Status", type: "status", width: 120, min: 80, sortable: true, sortValue: (r) => r.status },
  { key: "lastActivity", label: "Last Activity", type: "date", width: 150, min: 100, sortable: true, sortValue: (r) => r.lastActivity },
  { key: "actions", label: "Actions", type: "actions", width: 56, min: 48 },
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

const locations = [
  "570 Annadale Lane, Hollywood, FL 33024",
  "1123 Maplewood Drive, Coral Springs, FL 33065",
  "4567 Pinecrest Avenue, Boca Raton, FL 33431",
  "7890 Oakridge Blvd, Fort Lauderdale, FL 33308",
  "2345 Cedar Lane, Miami, FL 33133",
];

function Mark() {
  return <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-accent text-lg font-semibold text-primary">◉</span>;
}

function ProjectPreview({ row }: { row: Row }) {
  const location = locations[Number(row.id) - 1] ?? row.project;
  return (
    <div className="w-[360px] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-xl">
      <div className="p-4">
        <div className="flex items-center gap-3">
          <Mark />
          <p className="line-clamp-2 text-sm font-medium leading-5">{row.customer} — {row.project}</p>
        </div>
        <p className="mt-5 line-clamp-5 text-base font-semibold leading-6">{row.project} — Protection Works &amp; Ground Floor — Level 4</p>
        <div className="mt-5 flex items-start gap-3 text-muted-foreground">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
          <p className="line-clamp-2 text-sm leading-5">{location}</p>
        </div>
      </div>
      <dl className="grid grid-cols-[92px_1fr] gap-x-4 gap-y-4 border-t px-4 py-4 text-sm">
        <dt className="text-muted-foreground">Start Date</dt><dd>15 May 2024</dd>
        <dt className="text-muted-foreground">Proj. No.</dt><dd className="truncate">PRJ-{row.id.padStart(4, "0")} / {(row.project.split(" ")[0] ?? "PROJECT").toUpperCase()}</dd>
        <dt className="text-muted-foreground">Ref. No.</dt><dd className="line-clamp-2">UNITS {939498 + Number(row.id)} JSJ</dd>
      </dl>
    </div>
  );
}

function CustomerPreview({ row }: { row: Row }) {
  const location = locations[Number(row.id) - 1] ?? row.customer;
  return (
    <div className="w-[360px] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-xl">
      <div className="p-4">
        <div className="flex items-center gap-3"><Mark /><p className="text-base font-semibold">{row.customer}</p></div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded border bg-chip px-2.5 py-1 text-sm text-muted-foreground">{row.initials}</span>
          <span className="rounded border bg-chip px-2.5 py-1 text-sm text-muted-foreground">Management</span>
        </div>
      </div>
      <div className="space-y-3 border-t px-4 py-4 text-sm">
        <div className="flex items-center gap-3"><span className="w-6 text-[10px] font-semibold text-muted-foreground">ABN</span><span>12 345 678</span></div>
        <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-muted-foreground" /><span>0412 345 678</span></div>
        <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-muted-foreground" /><span>{row.initials.toLowerCase()}@example.com</span></div>
        <div className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" /><span className="line-clamp-2">{location}</span></div>
      </div>
      <dl className="grid grid-cols-[1fr_auto] gap-y-3 border-t px-4 py-4 text-sm">
        <dt className="text-muted-foreground">No. of Projects</dt><dd>{Number(row.id) + 3}</dd>
        <dt className="text-muted-foreground">Admins Assigned</dt><dd>{Number(row.id) % 3}</dd>
      </dl>
      <div className="flex items-center gap-3 border-t px-4 py-3 text-sm"><RefreshCw className="h-4 w-4 text-tag-green" /><span>ALD Expert Demo</span></div>
    </div>
  );
}

function DetailHover({ row, type, children }: { row: Row; type: "project" | "customer"; children: ReactNode }) {
  return (
    <HoverCard openDelay={250} closeDelay={120}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent side="bottom" align="start" sideOffset={8} className="w-auto border-0 bg-transparent p-0 shadow-none">
        {type === "project" ? <ProjectPreview row={row} /> : <CustomerPreview row={row} />}
      </HoverCardContent>
    </HoverCard>
  );
}

/** Only shows a tooltip when the content is actually truncated. */
function TruncateTip({ text, className, children }: { text: string; className?: string; children?: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [clipped, setClipped] = useState(false);
  const checkClipped = () => {
    const el = ref.current;
    if (el) setClipped(el.scrollWidth > el.clientWidth + 1);
  };
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const frame = requestAnimationFrame(checkClipped);
    void document.fonts?.ready.then(checkClipped);
    const ro = new ResizeObserver(checkClipped);
    ro.observe(el);
    window.addEventListener("resize", checkClipped);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("resize", checkClipped);
    };
  }, [text]);
  const span = (
    <span ref={ref} className={className} onPointerEnter={checkClipped}>
      {children ?? text}
    </span>
  );
  return (
    <Tooltip>
      <TooltipTrigger asChild>{span}</TooltipTrigger>
      {clipped && <TooltipContent className="max-w-xs whitespace-normal">{text}</TooltipContent>}
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

function Chips({ items, expanded, className, chipClass }: { items: string[]; expanded: boolean; className?: string; chipClass: (s: string) => string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measurementRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const [chipWidths, setChipWidths] = useState<number[]>([]);

  useLayoutEffect(() => {
    setChipWidths(measurementRefs.current.map((item) => item?.getBoundingClientRect().width ?? 50));
  }, [items]);

  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new ResizeObserver(() => setContainerWidth(element.clientWidth));
    observer.observe(element);
    setContainerWidth(element.clientWidth);
    return () => observer.disconnect();
  }, []);

  if (!items.length) return <span className="ml-3 inline-block h-px w-4 bg-subtle" />;

  const gap = 6;
  const minChipWidth = 50;
  const overflowWidth = 40;
  let shownCount = items.length;
  if (!expanded && chipWidths.length === items.length && containerWidth > 0) {
    const fitsAllAtMinimum = items.length * minChipWidth + (items.length - 1) * gap <= containerWidth;
    const fitsAllAtNaturalWidth = chipWidths.reduce((total, width) => total + width, 0) + (items.length - 1) * gap <= containerWidth;
    if (!fitsAllAtMinimum && !fitsAllAtNaturalWidth) {
      shownCount = 0;
      for (let count = items.length - 1; count > 0; count -= 1) {
        const required = count * minChipWidth + (count - 1) * gap + gap + overflowWidth;
        if (required <= containerWidth) {
          shownCount = count;
          break;
        }
      }
      shownCount = Math.max(shownCount, Math.min(2, items.length));
    }
  } else if (!expanded) {
    shownCount = Math.min(2, items.length);
  }

  const shown = expanded ? items : items.slice(0, shownCount);
  const hidden = items.slice(shown.length);
  return (
    <div ref={containerRef} className={`flex w-full min-w-0 gap-1.5 ${expanded ? "flex-wrap" : "flex-nowrap"} ${className ?? ""}`}>
      <span className="pointer-events-none absolute -z-10 invisible flex">
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            ref={(element) => { measurementRefs.current[index] = element; }}
            className={`w-max min-w-[50px] max-w-[120px] shrink-0 truncate whitespace-nowrap rounded px-2 py-[3px] text-[13px] ${chipClass(item)}`}
          >
            {item}
          </span>
        ))}
      </span>
      {shown.map((t, i) => (
        <TruncateTip key={i} text={t} className={`w-max min-w-[50px] max-w-[120px] shrink truncate whitespace-nowrap rounded px-2 py-[3px] text-[13px] ${chipClass(t)}`} />
      ))}
      {hidden.length > 0 && (
        <Tooltip delayDuration={150}>
          <TooltipTrigger asChild>
            <span tabIndex={0} className="min-w-[34px] shrink-0 cursor-default rounded border bg-chip px-1.5 py-[3px] text-center text-[13px] text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring">
              +{hidden.length}
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="start" className="min-w-44 p-1.5">
            <div className="flex flex-col" role="list" aria-label="Hidden items">
              {hidden.map((item, index) => (
                <span key={`${item}-${index}`} role="listitem" className="rounded px-2 py-1.5 text-sm text-tooltip-foreground">
                  {item}
                </span>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

export function ProjectTable({ expanded, view }: { expanded: boolean; view: ProjectView }) {
  const [projects, setProjects] = useState(rows);
  const [columnWidths, setColumnWidths] = useState(() => new Map(initialCols.map((col) => [col.key, col.width])));
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [resizing, setResizing] = useState<string | null>(null);

  const cols = useMemo(() => {
    const columns = [...initialCols];
    if (view === "Completed") {
      columns.splice(columns.length - 1, 0, {
        key: "endDate",
        label: "End Date",
        type: "endDate",
        width: 150,
        min: 100,
        sortable: true,
        sortValue: (r) => r.endDate ?? "",
      });
    }
    return columns.map((col) => ({ ...col, width: columnWidths.get(col.key) ?? col.width }));
  }, [columnWidths, view]);
  const visibleRows = useMemo(() => projects.filter((project) => project.lifecycle === view), [projects, view]);

  const sorted = useMemo(() => {
    if (!sort) return visibleRows;
    const c = cols.find((c) => c.key === sort.key);
    if (!c?.sortValue) return visibleRows;
    return [...visibleRows].sort((a, b) => {
      const sortValue = c.sortValue;
      if (!sortValue) return 0;
      const va = sortValue(a), vb = sortValue(b);
      const r = va < vb ? -1 : va > vb ? 1 : 0;
      return sort.dir === "asc" ? r : -r;
    });
  }, [sort, cols, visibleRows]);

  const total = cols.reduce((s, c) => s + c.width, 0);
  const allSel = visibleRows.length > 0 && visibleRows.every((row) => selected.has(row.id));
  const someSel = visibleRows.some((row) => selected.has(row.id)) && !allSel;

  const startResize = (e: React.PointerEvent, key: string) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const col = cols.find((c) => c.key === key);
    if (!col) return;
    const startW = col.width;
    setResizing(key);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    const move = (ev: PointerEvent) => {
      const w = Math.max(col.min, startW + ev.clientX - startX);
      setColumnWidths((widths) => new Map(widths).set(key, w));
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
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const updateLifecycle = (id: string, lifecycle: ProjectView) => {
    setProjects((current) => current.map((project) => {
      if (project.id !== id) return project;
      const updated = { ...project, lifecycle };
      if (lifecycle === "Completed") {
        const now = new Date();
        const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
        return { ...updated, endDate: localDate };
      }
      return { ...updated, endDate: undefined };
    }));
  };

  const cell = (c: Col, r: Row): ReactNode => {
    const clamp = expanded ? "whitespace-normal break-words" : "truncate";
    switch (c.type) {
      case "checkbox":
        return <Checkbox label={`Select ${r.project}`} checked={selected.has(r.id)} onChange={() => toggleRow(r.id)} />;
      case "text":
        return <DetailHover row={r} type="project"><span tabIndex={0} className={`block cursor-default pl-1 text-[15px] outline-none focus-visible:ring-2 focus-visible:ring-ring ${clamp}`}>{r.project}</span></DetailHover>;
      case "customer":
        return (
          <DetailHover row={r} type="customer"><div tabIndex={0} className="flex min-w-0 cursor-default items-center gap-3 rounded outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded bg-avatar-bg text-[15px] text-primary">{r.initials}</span>
            <span className={`min-w-0 text-[15px] ${clamp}`}>{r.customer}</span>
          </div></DetailHover>
        );
      case "number": {
        const contractHours = r.used;
        const budgetHours = r.budget;
        const safeBudget = budgetHours > 0 ? budgetHours : 1;
        const pct = (contractHours / safeBudget) * 100;
        const isOver = contractHours > budgetHours;
        const overHours = Math.max(contractHours - budgetHours, 0);
        const overflowPct = budgetHours > 0 ? (overHours / budgetHours) * 100 : 0;
        const filledPct = Math.min(pct, 100);

        return (
          <div className="flex min-w-0 items-center gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2 whitespace-nowrap">
                <div className="flex min-w-0 items-baseline gap-1">
                  <span className="text-[13px] text-subtle">C:</span>
                  <span className="truncate text-[13px]"><span className="text-foreground">{contractHours} /</span> <span className="text-subtle">{budgetHours} hrs</span></span>
                </div>
                <span className={`text-[10px] ${isOver ? "font-medium text-red-500" : "text-subtle"}`}>
                  {isOver ? `Over by ${overHours} hrs (+${overflowPct.toFixed(0)}%)` : `${pct.toFixed(2)}%`}
                </span>
              </div>

              <div className="relative mt-1 h-[9px] overflow-hidden rounded-full bg-track">
                <div className="h-full rounded-full bg-primary" style={{ width: `${filledPct}%` }} />
                {isOver && (
                  <div
                    className="absolute top-0 h-full rounded-r-full bg-destructive"
                    style={{ left: `${filledPct}%`, width: `${overflowPct}%` }}
                  />
                )}
              </div>

              <div className="mt-1 flex items-baseline gap-1 whitespace-nowrap">
                <span className="text-[13px] text-subtle">D:</span>
                <span className="text-[13px] text-subtle">{budgetHours} hrs</span>
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
        return <Chips items={r.templates} expanded={expanded} chipClass={() => "border bg-chip text-foreground"} />;
      case "tags":
        return <Chips items={r.tags} expanded={expanded} chipClass={tagStyle} />;
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
            <TruncateTip text={r.link} className="truncate underline underline-offset-2" />
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
            <TruncateTip text={r.file} className="truncate text-[14px] text-tag-blue" />
          </div>
        );
      case "notes":
        return <TruncateTip text={r.notes} className={`block text-[14px] text-muted-foreground ${expanded ? "whitespace-normal" : "truncate"}`} />;
      case "status":
        return <span className={`inline-block max-w-full truncate rounded px-2 py-[3px] text-[13px] ${statusStyle[r.status]}`}>{r.status}</span>;
      case "date":
        return <span className="block truncate text-[15px]">{fmtDate(r.lastActivity)}</span>;
      case "endDate":
        return <span className="block truncate text-[15px]">{r.endDate ? fmtDate(r.endDate) : "—"}</span>;
      case "actions":
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button aria-label={`Project actions for ${r.project}`} className="rounded p-1.5 text-subtle hover:bg-secondary focus-visible:outline-2 focus-visible:outline-primary">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit Project</DropdownMenuItem>
              {view === "Ongoing" && (
                <>
                  <DropdownMenuItem onSelect={() => updateLifecycle(r.id, "Completed")}>Mark as Completed</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => updateLifecycle(r.id, "Archived")}>Archive</DropdownMenuItem>
                </>
              )}
              {view === "Completed" && (
                <>
                  <DropdownMenuItem onSelect={() => updateLifecycle(r.id, "Ongoing")}>Move to ongoing</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => updateLifecycle(r.id, "Archived")}>Archive</DropdownMenuItem>
                </>
              )}
              {view === "Archived" && (
                <DropdownMenuItem onSelect={() => updateLifecycle(r.id, "Ongoing")}>Unarchive</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
    }
  };

  const grid = cols.map((c) => `${c.width}px`).join(" ");

  return (
    <TooltipProvider delayDuration={250}>
    <div className="overflow-x-auto rounded-md border">
      <div role="table" style={{ width: total, minWidth: "100%" }}>
        <div role="row" className="grid border-b bg-background" style={{ gridTemplateColumns: grid }}>
          {cols.map((c) => {
            const active = sort?.key === c.key;
            return (
              <div key={c.key} role="columnheader" className="relative flex h-[52px] min-w-0 items-center px-4 text-[15px] text-muted-foreground">
                {c.type === "checkbox" ? (
                  <Checkbox label="Select all" checked={allSel} indeterminate={someSel} onChange={() => setSelected((current) => {
                    const next = new Set(current);
                    visibleRows.forEach((row) => allSel ? next.delete(row.id) : next.add(row.id));
                    return next;
                  })} />
                ) : c.sortable ? (
                  <button onClick={() => toggleSort(c.key)} className="flex w-full min-w-0 items-center justify-between gap-2 rounded text-left hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary">
                    <span className="truncate">{c.label}</span>
                    {active ? (sort?.dir === "asc" ? <ChevronUp className="h-4 w-4 shrink-0 text-primary" /> : <ChevronDown className="h-4 w-4 shrink-0 text-primary" />) : <ChevronsUpDown className="h-4 w-4 shrink-0" />}
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
    </TooltipProvider>
  );
}
