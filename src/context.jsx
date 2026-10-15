import { createContext, useContext, useState, useEffect, useRef } from "react";
import { seedStudents, seedResources, seedSubmissions } from "./data";
const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);
const fallback = () => ({
  students: seedStudents,
  resources: seedResources,
  submissions: seedSubmissions,
  read: [],
  saved: [],
  attendance: {},
  announcements: [],
  lang: "az",
});
function load() {
  try {
    let d = JSON.parse(localStorage.getItem("glodemia-os-v2"));
    if (
      d?.version === 2 &&
      Array.isArray(d.students) &&
      Array.isArray(d.resources) &&
      Array.isArray(d.submissions)
    )
      return { ...fallback(), ...d };
  } catch {}
  return fallback();
}
export function Provider({ children }) {
  const [data, setData] = useState(load),
    [route, setRoute] = useState(
      () => location.hash.slice(1) || "/login/admin",
    ),
    [toast, setToast] = useState("");
  const [session, setSession] = useState(() => {
    try {
      return sessionStorage.getItem("glodemia-role") || "";
    } catch {
      return "";
    }
  });
  const timer = useRef();
  useEffect(() => {
    const sync = () => setRoute(location.hash.slice(1) || "/login/admin");
    addEventListener("hashchange", sync);
    return () => removeEventListener("hashchange", sync);
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(
        "glodemia-os-v2",
        JSON.stringify({ ...data, version: 2 }),
      );
    } catch {}
    document.documentElement.lang = data.lang;
  }, [data]);
  useEffect(() => () => clearTimeout(timer.current), []);
  const t = (az, en) => (data.lang === "az" ? az : en);
  const pick = (value) =>
    typeof value === "object" && value !== null
      ? value[data.lang] || value.en
      : value;
  const notify = (az, en) => {
    setToast(t(az, en));
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 3800);
  };
  const update = (fn) => setData((d) => ({ ...d, ...fn(d) }));
  const navigate = (path) => {
    location.hash = path;
    setRoute(path);
    window.scrollTo({ top: 0 });
  };
  const login = (role) => {
    setSession(role);
    try {
      sessionStorage.setItem("glodemia-role", role);
    } catch {}
    navigate(`/${role}/overview`);
  };
  const logout = () => {
    const role = session;
    setSession("");
    try {
      sessionStorage.removeItem("glodemia-role");
    } catch {}
    navigate(`/login/${role || "admin"}`);
  };
  const date = (value, options = { day: "numeric", month: "short" }) => {
    const parsed = new Date(value + "T12:00:00");
    if (data.lang === "en") return parsed.toLocaleDateString("en-GB", options);
    // Explicit Azerbaijani month names also work in browsers with partial locale data.
    const longMonths = [
      "yanvar",
      "fevral",
      "mart",
      "aprel",
      "may",
      "iyun",
      "iyul",
      "avqust",
      "sentyabr",
      "oktyabr",
      "noyabr",
      "dekabr",
    ];
    const shortMonths = [
      "yan",
      "fev",
      "mar",
      "apr",
      "may",
      "iyn",
      "iyl",
      "avq",
      "sen",
      "okt",
      "noy",
      "dek",
    ];
    const month =
      options.month === "long"
        ? longMonths[parsed.getMonth()]
        : shortMonths[parsed.getMonth()];
    return `${parsed.getDate()} ${month}${options.year ? " " + parsed.getFullYear() : ""}`;
  };
  const money = (n) => {
    const amount = new Intl.NumberFormat("en-GB", {
      maximumFractionDigits: 0,
    }).format(n);
    return data.lang === "az"
      ? `${amount.replaceAll(",", " ")} ₼`
      : `₼${amount}`;
  };
  return (
    <AppContext.Provider
      value={{
        ...data,
        lang: data.lang,
        t,
        pick,
        update,
        notify,
        toast,
        route,
        navigate,
        session,
        login,
        logout,
        date,
        money,
        setLang: (lang) => setData((d) => ({ ...d, lang })),
      }}
    >
      {children}
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </AppContext.Provider>
  );
}
