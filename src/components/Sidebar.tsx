import {
  CalendarDays, Briefcase, Calculator, FolderKanban, ClipboardList, User, Trash2, FileText,
  FileBarChart, Clock, Workflow, Warehouse, Calendar, LifeBuoy, MessagesSquare, Monitor,
  Files, Truck, Wrench, ChevronDown, ChevronsLeft, Bell,
} from "lucide-react";
import avatar from "@/assets/avatar.jpg";

const items: { label: string; icon: typeof User; sub?: boolean; active?: boolean }[] = [
  { label: "Roster", icon: CalendarDays },
  { label: "Project Register", icon: Briefcase },
  { label: "Estimates", icon: Calculator },
  { label: "Projects", icon: FolderKanban, active: true },
  { label: "Task & Claims", icon: ClipboardList },
  { label: "Clients", icon: User, sub: true },
  { label: "Waste Manage", icon: Trash2, sub: true },
  { label: "Reports", icon: FileText, sub: true },
  { label: "Custom Reports", icon: FileBarChart, sub: true },
  { label: "Time Tracking", icon: Clock, sub: true },
  { label: "IntelliFlow", icon: Workflow, sub: true },
  { label: "Warehouse", icon: Warehouse },
  { label: "Calendar", icon: Calendar },
  { label: "Support", icon: LifeBuoy },
  { label: "Message", icon: MessagesSquare },
  { label: "Items", icon: Monitor },
  { label: "Templates", icon: Files },
  { label: "Fleet Register", icon: Truck },
  { label: "Tools", icon: Wrench, sub: true },
];

export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-[300px] shrink-0 flex-col border-r bg-background h-screen sticky top-0">
      <div className="flex items-center gap-3 px-6 pt-5 pb-4">
        <div className="flex h-9 w-11 items-center justify-center rounded text-[11px] font-semibold text-primary">ALD</div>
        <div className="flex-1">
          <div className="text-[15px] font-medium">ALD Expert Demo</div>
          <span className="mt-0.5 inline-block rounded-full bg-tag-red-bg px-2 text-[10px] font-medium text-tag-red">XERO</span>
        </div>
        <button aria-label="Collapse sidebar" className="rounded p-1 text-primary hover:bg-accent"><ChevronsLeft className="h-5 w-5" /></button>
      </div>
      <nav className="flex-1 overflow-y-auto px-4">
        {items.map(({ label, icon: Icon, sub, active }) => (
          <button
            key={label}
            className={`flex w-full items-center gap-3 rounded-md px-4 py-[14px] text-left text-[15px] transition-colors hover:bg-hover ${active ? "text-primary" : "text-foreground"}`}
          >
            <Icon className="h-5 w-5" strokeWidth={1.6} />
            <span className="flex-1">{label}</span>
            {sub && <ChevronDown className="h-4 w-4" />}
          </button>
        ))}
      </nav>
      <div className="m-4 flex items-center gap-3 rounded-md border p-2">
        <img src={avatar} alt="Nishan" width={44} height={44} className="h-11 w-11 rounded object-cover" />
        <div className="flex-1">
          <div className="text-[16px]">Nishan</div>
          <div className="text-[13px] text-muted-foreground">Superadmin</div>
        </div>
        <Bell className="mr-2 h-5 w-5" strokeWidth={1.6} />
      </div>
    </aside>
  );
}
