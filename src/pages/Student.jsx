import { useState } from "react";
import {
  BookOpen,
  FileText,
  CalendarDays,
  ArrowRight,
  Check,
  Clock3,
  Trophy,
  MessageSquare,
  Target,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useApp } from "../context";
import { assignments, groups, teachers } from "../data";
import {
  Card,
  PageHeading,
  SectionHeading,
  Button,
  Badge,
  Progress,
  Avatar,
  ActionLink,
  Stat,
} from "../components/ui";
import {
  ResourceLibrary,
  ResourceModal,
  SubmitAssignment,
} from "../components/Learning";
import { Schedule } from "./Admin";
export default function Student({ page }) {
  const {
    t,
    pick,
    students,
    resources,
    read,
    submissions,
    navigate,
    date,
    announcements,
  } = useApp();
  const [openResource, setOpenResource] = useState(null),
    [task, setTask] = useState(null);
  const me = students.find((s) => s.id === "ST-241");
  const course = groups.find((g) => g.id === me.group);
  const teacher = teachers.find((te) => te.id === course.teacher);
  const mine = resources.filter((r) => r.group === me.group),
    tasks = assignments.filter((a) => a.group === me.group),
    responses = submissions.filter((s) => s.student === me.id),
    graded = responses.filter((s) => s.status === "graded"),
    completed = mine.filter((r) => read.includes(r.id)).length;
  const next = mine.find((r) => !read.includes(r.id)) || mine[0];
  const go = (id) => navigate(`/student/${id}`);
  const titles = {
    overview: [
      t("Öyrənməyə davam et, Aylin.", "Keep moving forward, Aylin."),
      t(
        "Hər kiçik addım səni hədəfinə yaxınlaşdırır.",
        "Every small step brings you closer to your ambition.",
      ),
    ],
    materials: [
      t("Sənin öyrənmə kitabxanan", "Your learning library"),
      t(
        "Dərs qeydləri, məşqlər və uğuruna dəstək olan mənbələr.",
        "Lesson notes, practice, and resources to support your success.",
      ),
    ],
    assignments: [
      t("Fikirlərini nəticəyə çevir.", "Turn your ideas into results."),
      t(
        "Tapşırıqlarını tamamla və müəllimindən rəy al.",
        "Complete your assignments and get feedback from your instructor.",
      ),
    ],
    schedule: [
      t("Həftəni planlaşdır.", "Plan your week."),
      t("Qarşıdakı dərslərinə hazır gəl.", "Arrive ready for your next class."),
    ],
    results: [
      t("İnkişafın görünür.", "See how far you’ve come."),
      t(
        "Davamiyyətin, nəticələrin və müəllim rəylərin.",
        "Your attendance, results, and instructor feedback.",
      ),
    ],
  };
  const title = titles[page] || titles.overview;
  const taskCard = (a) => {
    const response = responses.find((s) => s.assignment === a.id);
    return (
      <Card key={a.id} className="assignment-card">
        <div className="assignment-icon">
          <FileText size={22} />
        </div>
        <div className="assignment-body">
          <div className="assignment-top">
            <span className="eyebrow">{course.program}</span>
            <Badge
              tone={
                response?.status === "graded"
                  ? "success"
                  : response
                    ? "info"
                    : "warning"
              }
            >
              {response?.status === "graded"
                ? t("Qiymətləndirilib", "Graded")
                : response
                  ? t("Göndərilib", "Submitted")
                  : t("Gözləyir", "To do")}
            </Badge>
          </div>
          <h2>{pick(a.title)}</h2>
          <p>{pick(a.description)}</p>
          <div className="assignment-footer">
            <span>
              <Clock3 size={14} />
              {t("Son tarix:", "Due:")} {date(a.due)}
            </span>
            <Button
              icon={ArrowRight}
              variant={!response ? "primary" : ""}
              onClick={() => setTask(a)}
            >
              {response
                ? t("Cavaba bax", "View response")
                : t("Tapşırığı aç", "Open assignment")}
            </Button>
          </div>
        </div>
      </Card>
    );
  };
  return (
    <>
      <PageHeading
        eyebrow={t("SƏNİN ÖYRƏNMƏ MƏKANIN", "YOUR LEARNING SPACE")}
        title={title[0]}
        subtitle={title[1]}
      >
        <div className="student-course-label">
          <span className="avatar">
            <BookOpen size={17} />
          </span>
          <span>
            <b>{course.program}</b>
            <small>{course.name}</small>
          </span>
        </div>
      </PageHeading>
      {page === "overview" && (
        <>
          <section className="learning-banner">
            <div>
              <span className="eyebrow">
                {t("BU GÜN BİR ADDIM İRƏLİ", "ONE STEP FORWARD TODAY")}
              </span>
              <h2>
                {t(
                  "Hədəfinə gedən yol buradan keçir.",
                  "Your next chapter starts here.",
                )}
              </h2>
              <p>
                {t(
                  "Qaldığın yerdən davam et. Yeni bir fikir öyrən, bir məşq tamamla.",
                  "Pick up where you left off. Learn a new idea, finish a practice session.",
                )}
              </p>
              <Button
                variant="primary"
                icon={ArrowRight}
                onClick={() => setOpenResource(next)}
              >
                {t("Öyrənməyə davam et", "Continue learning")}
              </Button>
            </div>
            <div className="learning-ring">
              <svg viewBox="0 0 120 120" aria-hidden="true">
                <circle cx="60" cy="60" r="49" />
                <circle
                  cx="60"
                  cy="60"
                  r="49"
                  strokeDasharray={`${(completed / mine.length) * 308} 308`}
                />
              </svg>
              <div>
                <strong>
                  {Math.round((completed / mine.length) * 100)}
                  <span>%</span>
                </strong>
                <small>{t("tamamlanıb", "completed")}</small>
              </div>
            </div>
            <div className="banner-decoration" aria-hidden="true" />
          </section>
          <div className="student-summary">
            <div>
              <BookOpen size={20} />
              <span>
                <strong>
                  {completed} / {mine.length}
                </strong>
                <small>{t("Oxunmuş material", "Resources read")}</small>
              </span>
            </div>
            <div>
              <FileText size={20} />
              <span>
                <strong>{tasks.length - responses.length}</strong>
                <small>{t("Gözləyən tapşırıq", "Assignments to do")}</small>
              </span>
            </div>
            <div>
              <Check size={20} />
              <span>
                <strong>{me.attendance}%</strong>
                <small>{t("Davamiyyət", "Attendance")}</small>
              </span>
            </div>
            <div>
              <Target size={20} />
              <span>
                <strong>7.5</strong>
                <small>{t("IELTS hədəfi", "IELTS target")}</small>
              </span>
            </div>
          </div>
          <div className="learning-layout">
            <div>
              <SectionHeading
                title={t(
                  "Sənin üçün materiallar",
                  "Selected for your learning",
                )}
                subtitle={t(
                  "Növbəti dərsinə hazırlaş.",
                  "Get ready for your next class.",
                )}
              >
                <ActionLink onClick={() => go("materials")}>
                  {t("Hamısına bax", "View all")}
                </ActionLink>
              </SectionHeading>
              <div className="featured-resources">
                {mine.slice(0, 2).map((r, i) => (
                  <button
                    className="featured-resource"
                    key={r.id}
                    onClick={() => setOpenResource(r)}
                  >
                    <span className="featured-number">0{i + 1}</span>
                    <div>
                      <span>
                        {pick(r.kind)} · {r.minutes} {t("dəq", "min")}
                      </span>
                      <h3>{pick(r.title)}</h3>
                      <p>{pick(r.description)}</p>
                    </div>
                    <span className="featured-arrow">
                      {read.includes(r.id) ? (
                        <Check size={19} />
                      ) : (
                        <ArrowRight size={19} />
                      )}
                    </span>
                  </button>
                ))}
              </div>
              <SectionHeading
                title={t("Qarşıdakı tapşırıq", "Your next assignment")}
                subtitle={t(
                  "Kiçik addımlarla, davamlı inkişaf.",
                  "Steady progress, one step at a time.",
                )}
              />
              {taskCard(tasks[0])}
            </div>
            <aside>
              <Card className="next-lesson">
                <span className="eyebrow">
                  {t("NÖVBƏTİ DƏRS", "NEXT CLASS")}
                </span>
                <span className="lesson-day">
                  16 <small>{t("OKT", "OCT")}</small>
                </span>
                <h2>IELTS B2 Evening</h2>
                <p>18:00–19:30 · {t("Otaq", "Room")} 01</p>
                <div className="lesson-teacher">
                  <Avatar name={teacher.name} />
                  <span>{teacher.name}</span>
                </div>
                <Button icon={CalendarDays} onClick={() => go("schedule")}>
                  {t("Cədvələ bax", "View schedule")}
                </Button>
              </Card>
              <Card className="teacher-note">
                <span className="note-icon">
                  <MessageSquare size={19} />
                </span>
                <h2>
                  {t("Müəllimindən bir qeyd", "A note from your instructor")}
                </h2>
                <p>
                  {announcements.filter((a) => a.group === me.group).at(-1)
                    ?.body ||
                    t(
                      "“Növbəti dərsə qədər esse planını hazırla. Əsas fikrini bir cümlə ilə ifadə etməyə çalış.”",
                      "“Prepare your essay outline before our next class. Try expressing your central idea in a single sentence.”",
                    )}
                </p>
                <small>
                  {teacher.name} · {date("2026-10-15")}
                </small>
              </Card>
            </aside>
          </div>
        </>
      )}
      {page === "materials" && <ResourceLibrary groupIds={[me.group]} />}
      {page === "assignments" && (
        <>
          <div className="directory-summary">
            <div>
              <span>{t("Ümumi tapşırıq", "Total assignments")}</span>
              <strong>{tasks.length}</strong>
            </div>
            <div>
              <span>{t("Təqdim edilib", "Submitted")}</span>
              <strong>{responses.length}</strong>
            </div>
            <div>
              <span>{t("Qiymətləndirilib", "Graded")}</span>
              <strong>{graded.length}</strong>
            </div>
          </div>
          <div className="assignment-list">{tasks.map(taskCard)}</div>
        </>
      )}
      {page === "schedule" && <Schedule student />}
      {page === "results" && (
        <>
          <div className="stats-grid three">
            <Stat
              label={t("Davamiyyət", "Attendance")}
              value={`${me.attendance}%`}
              icon={Check}
              note={t("Cari semestr", "Current term")}
            />
            <Stat
              label={t("Oxunmuş materiallar", "Resources read")}
              value={`${completed} / ${mine.length}`}
              icon={BookOpen}
              note={t("Cari proqram", "Current program")}
            />
            <Stat
              label={t("Orta tapşırıq balı", "Average assignment score")}
              value={
                graded.length
                  ? `${Math.round(graded.reduce((s, g) => s + g.score, 0) / graded.length)}/100`
                  : "—"
              }
              icon={Trophy}
              note={
                graded.length
                  ? t("Müəllim qiymətləndirməsi", "Instructor assessment")
                  : t("İlk qiymətini gözləyirsən", "Awaiting your first grade")
              }
            />
          </div>
          <div className="overview-grid">
            <Card className="progress-card">
              <SectionHeading
                title={t("Öyrənmə irəliləyişin", "Your learning progress")}
                subtitle={course.name}
              />
              <Progress
                value={Math.round((completed / mine.length) * 100)}
                label={t("Materialların tamamlanması", "Resource completion")}
              />
              <Progress
                value={Math.round((responses.length / tasks.length) * 100)}
                label={t(
                  "Tapşırıqların təqdim edilməsi",
                  "Assignment submission",
                )}
              />
              <Progress
                value={me.attendance}
                label={t("Dərsdə iştirak", "Class attendance")}
              />
            </Card>
            <Card className="feedback-card">
              <SectionHeading
                title={t("Müəllim rəyləri", "Instructor feedback")}
                subtitle={t(
                  "Növbəti addımın üçün istiqamət",
                  "Guidance for your next step",
                )}
              />
              {graded.length ? (
                graded.map((s) => (
                  <div className="feedback-entry" key={s.id}>
                    <Badge tone="success">{s.score}/100</Badge>
                    <h3>
                      {pick(
                        assignments.find((a) => a.id === s.assignment).title,
                      )}
                    </h3>
                    <p>{s.feedback}</p>
                    <small>{teacher.name}</small>
                  </div>
                ))
              ) : (
                <div className="empty">
                  <MessageSquare size={28} />
                  <h3>{t("İlk rəyinə doğru", "Your first feedback awaits")}</h3>
                  <p>
                    {t(
                      "Tapşırığını təqdim et. Müəllimin qiymətləndirməsindən sonra rəy burada görünəcək.",
                      "Submit your assignment. Your instructor’s feedback will appear here after review.",
                    )}
                  </p>
                  <Button onClick={() => go("assignments")}>
                    {t("Tapşırıqlara keç", "Go to assignments")}
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </>
      )}
      {openResource && (
        <ResourceModal
          resource={openResource}
          onClose={() => setOpenResource(null)}
        />
      )}{" "}
      {task && (
        <SubmitAssignment assignment={task} onClose={() => setTask(null)} />
      )}
    </>
  );
}
