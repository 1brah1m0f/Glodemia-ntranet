import { useEffect, useRef } from "react";
import { X, ArrowUpRight, Search, ChevronRight, Check } from "lucide-react";
import { useApp } from "../context";
export function Button({
  children,
  icon: Icon,
  variant = "",
  className = "",
  ...props
}) {
  return (
    <button className={`button ${variant} ${className}`} {...props}>
      {Icon && <Icon size={16} />} {children}
    </button>
  );
}
export function IconButton({ icon: Icon, label, ...props }) {
  return (
    <button className="icon-button" aria-label={label} title={label} {...props}>
      <Icon size={19} />
    </button>
  );
}
export function Card({ children, className = "", ...props }) {
  return (
    <section className={`card ${className}`} {...props}>
      {children}
    </section>
  );
}
export function Badge({ children, tone = "" }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}
export function Avatar({ name, size = "" }) {
  return (
    <span className={`avatar ${size}`}>
      {name
        .split(" ")
        .map((x) => x[0])
        .slice(0, 2)
        .join("")}
    </span>
  );
}
export function PageHeading({ eyebrow, title, subtitle, children }) {
  return (
    <div className="page-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children && <div className="heading-actions">{children}</div>}
    </div>
  );
}
export function SectionHeading({ title, subtitle, children }) {
  return (
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
export function Stat({ label, value, change, icon: Icon, note }) {
  return (
    <Card className="stat">
      <div className="stat-top">
        <span>{label}</span>
        <span className="stat-icon">
          <Icon size={19} />
        </span>
      </div>
      <strong>{value}</strong>
      <div className="stat-note">
        {change && (
          <span>
            <ArrowUpRight size={13} />
            {change}
          </span>
        )}
        {note}
      </div>
      <svg className="stat-spark" viewBox="0 0 80 25" aria-hidden="true">
        <path d="M1 22L12 18L23 20L34 11L44 15L56 6L66 9L79 2" />
      </svg>
    </Card>
  );
}
export function Empty({ title, description, children }) {
  return (
    <div className="empty">
      <Search size={27} />
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </div>
  );
}
export function SearchField({ value, onChange, placeholder, label }) {
  return (
    <label className="search-field">
      <Search size={17} />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label || placeholder}
      />
    </label>
  );
}
export function Progress({ value, label }) {
  return (
    <div className="progress-wrap">
      {label && (
        <div>
          <span>{label}</span>
          <b>{value}%</b>
        </div>
      )}
      <progress max="100" value={value} aria-label={label || "Progress"} />
    </div>
  );
}
export function Tabs({ items, value, onChange, label }) {
  return (
    <div className="tabs" role="group" aria-label={label}>
      {items.map((i) => (
        <button
          key={i.id}
          onClick={() => onChange(i.id)}
          className={value === i.id ? "active" : ""}
          aria-pressed={value === i.id}
        >
          {i.label}
          {i.count !== undefined && <span>{i.count}</span>}
        </button>
      ))}
    </div>
  );
}
export function Modal({ title, subtitle, children, onClose, wide = false }) {
  const ref = useRef(null);
  const { t } = useApp();
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className={`modal ${wide ? "wide" : ""}`}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-heading">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <IconButton icon={X} label={t("Bağla", "Close")} onClick={onClose} />
      </div>
      {children}
    </dialog>
  );
}
export function LanguageSwitch() {
  const { lang, setLang } = useApp();
  return (
    <div className="language-switch" aria-label="Language / Dil">
      {["az", "en"].map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={lang === l ? "active" : ""}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
export function ActionLink({ children, onClick }) {
  return (
    <button className="action-link" onClick={onClick}>
      {children}
      <ChevronRight size={14} />
    </button>
  );
}
export function downloadFile(name, content, type = "text/plain;charset=utf-8") {
  const url = URL.createObjectURL(new Blob(["\ufeff" + content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function csvCell(value) {
  let text = String(value);
  if (/^[=+@\-]/.test(text)) text = "'" + text;
  return '"' + text.replaceAll('"', '""') + '"';
}
export function CheckList({ items }) {
  return (
    <ul className="check-list">
      {items.map((item) => (
        <li key={item}>
          <Check size={15} />
          {item}
        </li>
      ))}
    </ul>
  );
}
