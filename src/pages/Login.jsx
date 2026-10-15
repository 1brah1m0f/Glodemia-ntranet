import {
  ShieldCheck,
  GraduationCap,
  Presentation,
  ArrowRight,
  ArrowUpRight,
  LockKeyhole,
  Sparkles,
  CircleCheck,
} from "lucide-react";
import { useApp } from "../context";
import { LanguageSwitch, Button } from "../components/ui";
const roles = {
  admin: {
    icon: ShieldCheck,
    name: "Nigar Əhmədova",
    email: "admin@demo.glodemia.az",
  },
  student: {
    icon: GraduationCap,
    name: "Aylin Məmmədova",
    email: "aylin@demo.glodemia.az",
  },
  teacher: {
    icon: Presentation,
    name: "Nigar Əliyeva",
    email: "teacher@demo.glodemia.az",
  },
};
export default function Login({ role }) {
  const { t, login, navigate } = useApp();
  const chosen = roles[role] ? role : "admin";
  const profile = roles[chosen];
  const Icon = profile.icon;
  const names = {
    admin: t("Admin paneli", "Admin workspace"),
    student: t("Tələbə paneli", "Student workspace"),
    teacher: t("Müəllim paneli", "Teacher workspace"),
  };
  return (
    <div className="login-page">
      <aside className="login-story">
        <img
          src="/assets/logo-light.png"
          alt="Glodemia Global Academy"
          className="login-logo"
        />
        <div className="login-story-copy">
          <div className="login-kicker">
            <span /> GLODEMIA OS
          </div>
          <h1>
            {t("Bir akademiya.", "One academy.")}
            <br />
            {t("Sonsuz imkanlar.", "Endless possibilities.")}
          </h1>
          <p>
            {t(
              "İdarəetmədən öyrənməyə — hər addımda bir-birinə bağlı təhsil təcrübəsi.",
              "From managing to learning — a connected education experience at every step.",
            )}
          </p>
          <div className="login-proof">
            <div className="mini-avatars">
              <span>AM</span>
              <span>NƏ</span>
              <span>EK</span>
            </div>
            <span>
              {t(
                "Tələbə, müəllim və komanda. Bir yerdə.",
                "Students, teachers, and your team. Together.",
              )}
            </span>
          </div>
        </div>
        <div className="brand-art" aria-hidden="true">
          <div />
          <div />
          <div />
        </div>
        <div className="login-story-footer">
          <span>Scores into Scholarships</span>
          <a href="https://glodemia.az/" target="_blank" rel="noreferrer">
            glodemia.az <ArrowUpRight size={14} />
          </a>
        </div>
      </aside>
      <main className="login-main">
        <header>
          <span className="demo-label">
            <span />
            {t("Demo mühit", "Demo environment")}
          </span>
          <LanguageSwitch />
        </header>
        <div className="login-form">
          <span className="login-symbol">
            <Icon size={25} />
          </span>
          <div className="eyebrow">
            {t("GLODEMIA-YA XOŞ GƏLMİSİNİZ", "WELCOME TO GLODEMIA")}
          </div>
          <h2>
            {t("Sizin üçün ayrılmış məkan.", "A space built around you.")}
          </h2>
          <p>
            {t(
              "Davam etmək üçün panelinizi seçin.",
              "Choose your workspace to continue.",
            )}
          </p>
          <div className="role-options">
            {Object.entries(roles).map(([key, r]) => {
              const RoleIcon = r.icon;
              return (
                <button
                  key={key}
                  className={chosen === key ? "selected" : ""}
                  onClick={() => navigate(`/login/${key}`)}
                  aria-pressed={chosen === key}
                >
                  <RoleIcon size={21} />
                  <span>{names[key]}</span>
                  {chosen === key && <CircleCheck size={15} />}
                </button>
              );
            })}
          </div>
          <div className="demo-account">
            <span className="eyebrow">{t("NÜMUNƏ HESAB", "DEMO ACCOUNT")}</span>
            <div>
              <span className="avatar">
                {profile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
              <span>
                <strong>{profile.name}</strong>
                <small>{profile.email}</small>
              </span>
              <LockKeyhole size={16} />
            </div>
          </div>
          <Button
            variant="primary login-submit"
            icon={ArrowRight}
            onClick={() => login(chosen)}
          >
            {t("Demo panelə daxil ol", "Enter demo workspace")}
          </Button>
          <div className="login-note">
            <Sparkles size={16} />
            <p>
              {t(
                "Şifrə tələb olunmur. Bütün şəxslər və qeydlər nümunədir.",
                "No password needed. All people and records are fictional.",
              )}
            </p>
          </div>
        </div>
        <footer>
          © 2026 Glodemia OS{" "}
          <span>{t("Təhsil üçün düşünülüb.", "Designed for education.")}</span>
        </footer>
      </main>
    </div>
  );
}
