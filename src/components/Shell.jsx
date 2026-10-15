import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CalendarDays,
  Wallet,
  ChartNoAxesCombined,
  GraduationCap,
  Presentation,
  ClipboardCheck,
  FileText,
  Library,
  LogOut,
  PanelLeftClose,
  Menu,
  Bell,
  Search,
  ArrowUpRight,
  ChevronRight,
  CheckCheck,
  Maximize2,
  Minimize2,
  CircleHelp,
  X,
} from "lucide-react";
import { useApp } from "../context";
import { Avatar, IconButton, LanguageSwitch, Button } from "./ui";
const menus = {
  admin: [
    ["overview", LayoutDashboard, "İcmal", "Overview"],
    ["students", Users, "Tələbələr", "Students"],
    ["groups", BookOpen, "Proqram və qruplar", "Courses & groups"],
    ["schedule", CalendarDays, "Dərs cədvəli", "Schedule"],
    ["team", Presentation, "Komanda", "Team"],
    ["finance", Wallet, "Maliyyə", "Finance"],
    ["reports", ChartNoAxesCombined, "Hesabatlar", "Reports"],
  ],
  student: [
    ["overview", LayoutDashboard, "Mənim panelim", "My dashboard"],
    ["materials", Library, "Dərs materialları", "Learning library"],
    ["assignments", FileText, "Tapşırıqlarım", "My assignments"],
    ["schedule", CalendarDays, "Dərs cədvəlim", "My schedule"],
    ["results", ChartNoAxesCombined, "Nəticələrim", "My progress"],
  ],
  teacher: [
    ["overview", LayoutDashboard, "Müəllim paneli", "Teaching overview"],
    ["groups", Users, "Qruplarım", "My groups"],
    ["students", GraduationCap, "Tələbələrim", "My students"],
    ["attendance", ClipboardCheck, "Davamiyyət", "Attendance"],
    ["assignments", FileText, "Tapşırıq və rəylər", "Assignments & feedback"],
    ["materials", Library, "Materiallar", "Learning resources"],
  ],
};
const profiles = {
  admin: "Nigar Əhmədova",
  student: "Aylin Məmmədova",
  teacher: "Nigar Əliyeva",
};
export default function Shell({ role, page, children }) {
  const { t, navigate, logout, submissions, lang } = useApp();
  const [collapsed, setCollapsed] = useState(false),
    [mobile, setMobile] = useState(false),
    [notifications, setNotifications] = useState(false),
    [read, setRead] = useState(false),
    [search, setSearch] = useState(""),
    [present, setPresent] = useState(false);
  const searchRef = useRef(null);
  const menu = menus[role];
  const names = {
    admin: t("Admin paneli", "Admin workspace"),
    student: t("Tələbə paneli", "Student workspace"),
    teacher: t("Müəllim paneli", "Teacher workspace"),
  };
  useEffect(() => {
    document.title = `${names[role]} · Glodemia OS`;
    setSearch("");
    setMobile(false);
    setNotifications(false);
  }, [role, page, lang]);
  useEffect(() => {
    const key = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") {
        setSearch("");
        setNotifications(false);
        setMobile(false);
      }
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, []);
  const go = (id) => {
    navigate(`/${role}/${id}`);
    setSearch("");
  };
  const matches = menu.filter(([, , az, en]) =>
    `${az} ${en}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
  );
  return (
    <div
      className={`app-shell ${collapsed ? "is-collapsed" : ""} ${present ? "presentation-mode" : ""}`}
    >
      {mobile && (
        <button
          className="mobile-scrim"
          aria-label={t("Menyudan kənara toxun", "Dismiss menu backdrop")}
          onClick={() => setMobile(false)}
        />
      )}
      <aside className={`sidebar ${mobile ? "mobile-open" : ""}`}>
        <div className="sidebar-close">
          <IconButton
            icon={X}
            label={t("Menyunu bağla", "Close menu")}
            onClick={() => setMobile(false)}
          />
        </div>
        <button
          className="brand"
          onClick={() => go("overview")}
          aria-label="Glodemia"
        >
          <img src="/assets/logo-dark.png" alt="Glodemia Global Academy" />
        </button>
        <div className="workspace-switch">
          <span>
            {role === "student" ? (
              <GraduationCap size={21} />
            ) : role === "teacher" ? (
              <Presentation size={21} />
            ) : (
              <LayoutDashboard size={21} />
            )}
          </span>
          <div>
            <strong>Glodemia OS</strong>
            <small>{names[role]}</small>
          </div>
          <span className="workspace-dot" />
        </div>
        <span className="nav-label">{t("İŞ MƏKANI", "WORKSPACE")}</span>
        <nav>
          {menu.map(([id, Icon, az, en]) => (
            <button
              key={id}
              className={`nav-item ${page === id ? "active" : ""}`}
              title={t(az, en)}
              aria-label={t(az, en)}
              onClick={() => go(id)}
              aria-current={page === id ? "page" : undefined}
            >
              <Icon size={19} />
              <span>{t(az, en)}</span>
              {id === "assignments" && role === "teacher" && (
                <small>
                  {submissions.filter((s) => s.status === "submitted").length}
                </small>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <span className="note-icon">
              <CircleHelp size={19} />
            </span>
            <strong>
              {t("Hər addımda yanınızdayıq.", "Here for every step.")}
            </strong>
            <p>
              {t(
                "Sualınız var? Akademiya komandası kömək etməyə hazırdır.",
                "Have a question? Your academy team is here to help.",
              )}
            </p>
            <a href="https://glodemia.az/" target="_blank" rel="noreferrer">
              {t("Glodemia ilə tanış ol", "Meet Glodemia")}
              <ArrowUpRight size={13} />
            </a>
          </div>
          <div className="sidebar-profile">
            <Avatar name={profiles[role]} />
            <div>
              <strong>{profiles[role]}</strong>
              <small>{names[role]}</small>
            </div>
            <IconButton
              icon={LogOut}
              label={t("Çıxış", "Sign out")}
              onClick={logout}
            />
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="desktop-toggle">
            <IconButton
              icon={PanelLeftClose}
              label={t("Menyunu yığ", "Collapse menu")}
              onClick={() => setCollapsed((v) => !v)}
            />
          </div>
          <div className="mobile-toggle">
            <IconButton
              icon={Menu}
              label={t("Menyunu aç", "Open menu")}
              onClick={() => setMobile(true)}
            />
          </div>
          <div className="breadcrumbs">
            <span>{names[role]}</span>
            <ChevronRight size={13} />
            <b>{menu.find((m) => m[0] === page)?.[lang === "az" ? 2 : 3]}</b>
          </div>
          <div className="global-search">
            <Search size={17} />
            <input
              ref={searchRef}
              aria-label={t("Paneldə axtar", "Search workspace")}
              placeholder={t("Paneldə axtar…", "Search workspace…")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <kbd>⌘ K</kbd>
            {search && (
              <div className="search-popover">
                <small>{t("BÖLMƏLƏR", "PAGES")}</small>
                {matches.length ? (
                  matches.map(([id, Icon, az, en]) => (
                    <button key={id} onClick={() => go(id)}>
                      <Icon size={17} />
                      {t(az, en)}
                      <ChevronRight size={14} />
                    </button>
                  ))
                ) : (
                  <p>{t("Bölmə tapılmadı.", "No pages found.")}</p>
                )}
              </div>
            )}
          </div>
          <span className="demo-label">
            <span />
            {t("Demo mühit", "Demo environment")}
          </span>
          <LanguageSwitch />
          <div className="notifications">
            <IconButton
              icon={Bell}
              label={t("Bildirişlər", "Notifications")}
              onClick={() => setNotifications((v) => !v)}
            />
            {!read && <i />}
            {notifications && (
              <div className="notification-popover">
                <h3>{t("Bildirişlər", "Notifications")}</h3>
                <p>
                  <b>{t("Yeni dərs materialı", "New learning resource")}</b>
                  <span>
                    {t(
                      "Writing Task 2 materialı artıq əlçatandır.",
                      "Writing Task 2 material is now available.",
                    )}
                  </span>
                </p>
                <p>
                  <b>{t("Növbəti dərs", "Next class")}</b>
                  <span>IELTS B2 · 18:00 · {t("Otaq", "Room")} 01</span>
                </p>
                <button
                  className="action-link"
                  onClick={() => {
                    setRead(true);
                    setNotifications(false);
                  }}
                >
                  <CheckCheck size={15} />
                  {t("Hamısını oxunmuş say", "Mark all as read")}
                </button>
              </div>
            )}
          </div>
          <IconButton
            icon={present ? Minimize2 : Maximize2}
            label={t("Təqdimat rejimi", "Presentation mode")}
            onClick={() => setPresent((v) => !v)}
          />
          <Avatar name={profiles[role]} />
        </header>
        <main className="page-content">
          <div className="page-inner">
            {children}
            <footer className="app-footer">
              <span>© 2026 Glodemia OS</span>
              <span>
                {t(
                  "Bütün şəxslər və qeydlər nümunədir.",
                  "All people and records are fictional.",
                )}
                <span className="operational">
                  <i />
                  {t("Demo aktivdir", "Demo is live")}
                </span>
              </span>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
