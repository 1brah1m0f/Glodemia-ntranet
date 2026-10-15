import { Provider, useApp } from "./context";
import Login from "./pages/Login";
import Shell from "./components/Shell";
import Admin from "./pages/Admin";
import Student from "./pages/Student";
import Teacher from "./pages/Teacher";
const pages = {
  admin: [
    "overview",
    "students",
    "groups",
    "schedule",
    "team",
    "finance",
    "reports",
  ],
  student: ["overview", "materials", "assignments", "schedule", "results"],
  teacher: [
    "overview",
    "groups",
    "students",
    "attendance",
    "assignments",
    "materials",
  ],
};
function Router() {
  const { route, session } = useApp();
  const [, role, page = "overview"] = route.split("/");
  if (role === "login") return <Login role={page} />;
  if (!pages[role] || session !== role)
    return <Login role={pages[role] ? role : "admin"} />;
  const current = pages[role].includes(page) ? page : "overview";
  return (
    <Shell role={role} page={current}>
      {role === "admin" ? (
        <Admin page={current} />
      ) : role === "student" ? (
        <Student page={current} />
      ) : (
        <Teacher page={current} />
      )}
    </Shell>
  );
}
export default function App() {
  return (
    <Provider>
      <Router />
    </Provider>
  );
}
