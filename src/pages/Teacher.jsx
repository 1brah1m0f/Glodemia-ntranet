import { useState } from "react";
import {
  Users,
  BookOpen,
  ClipboardCheck,
  FileText,
  ArrowRight,
  Plus,
  Check,
  CalendarDays,
  MessageSquare,
  Send,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { useApp } from "../context";
import { groups, assignments, copy } from "../data";
import {
  Card,
  PageHeading,
  SectionHeading,
  Button,
  Badge,
  Avatar,
  Stat,
  SearchField,
  Progress,
  Modal,
  ActionLink,
  Empty,
  Tabs,
} from "../components/ui";
import { ResourceLibrary } from "../components/Learning";
const myGroups = groups.filter((g) => g.teacher === "t1");
export default function Teacher({ page }) {
  const {
    t,
    pick,
    students,
    submissions,
    update,
    notify,
    navigate,
    attendance,
    date,
  } = useApp();
  const [group, setGroup] = useState("g1"),
    [search, setSearch] = useState(""),
    [modal, setModal] = useState(null),
    [submissionTab, setSubmissionTab] = useState("submitted");
  const mine = students.filter((s) => myGroups.some((g) => g.id === s.group));
  const list = mine.filter(
    (s) =>
      (group === "all" || s.group === group) &&
      s.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
  );
  const visibleSubmissions = submissions.filter((s) =>
    mine.some((st) => st.id === s.student),
  );
  const pending = visibleSubmissions.filter((s) => s.status === "submitted");
  const attendanceKey = `2026-10-15-${group === "all" ? "g1" : group}`;
  const [marks, setMarks] = useState({});
  const stored = attendance[attendanceKey] || {};
  const groupMarks = marks[attendanceKey] || stored;
  const currentMark = (id) => groupMarks[id] || "present";
  const go = (id) => navigate(`/teacher/${id}`);
  const avg = Math.round(
    mine.reduce((s, v) => s + v.attendance, 0) / mine.length,
  );
  const titles = {
    overview: [
      t("Uğura istiqamət verin, Nigar.", "Guide their next success, Nigar."),
      t(
        "Tələbələrinizin inkişafı hər gün sizinlə başlayır.",
        "Your students’ progress starts with you, every day.",
      ),
    ],
    groups: [
      t("Qruplarınız. Ortaq hədəflər.", "Your groups. Shared ambitions."),
      t(
        "Öz qruplarınızı və öyrənmə göstəricilərini izləyin.",
        "Keep track of your groups and their learning progress.",
      ),
    ],
    students: [
      t("Hər tələbəyə daha yaxın.", "Closer to every learner."),
      t(
        "Davamiyyəti, nəticələri və dəstəyə ehtiyacı olan tələbələri görün.",
        "See attendance, results, and students who could use extra support.",
      ),
    ],
    attendance: [
      t("Hər iştirak önəmlidir.", "Every class counts."),
      t(
        "Qrupunuzu seçin və dərsdə iştirakı qeyd edin.",
        "Select your group and record class attendance.",
      ),
    ],
    assignments: [
      t(
        "İnkişafı yönləndirən rəylər.",
        "Feedback that moves learning forward.",
      ),
      t(
        "Cavabları nəzərdən keçirin, qiymət və faydalı rəy verin.",
        "Review responses, assign a score, and offer helpful feedback.",
      ),
    ],
    materials: [
      t("Bilik paylaşdıqca böyüyür.", "Knowledge grows when shared."),
      t(
        "Qruplarınıza dərs materialları və məşqlər əlavə edin.",
        "Share lesson notes and practice material with your groups.",
      ),
    ],
  };
  const title = titles[page] || titles.overview;
  const studentDetail = modal?.student
    ? students.find((s) => s.id === modal.student)
    : null;
  return (
    <>
      <PageHeading
        eyebrow={t("MÜƏLLİMİN İŞ MƏKANI", "THE TEACHER WORKSPACE")}
        title={title[0]}
        subtitle={title[1]}
      >
        {page === "materials" ? (
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setModal({ type: "resource" })}
          >
            {t("Material əlavə et", "Add resource")}
          </Button>
        ) : (
          <Button
            icon={MessageSquare}
            onClick={() => setModal({ type: "announcement" })}
          >
            {t("Qrupa elan yaz", "Post announcement")}
          </Button>
        )}
      </PageHeading>
      {page === "overview" && (
        <>
          <div className="stats-grid">
            <Stat
              label={t("Tələbələrim", "My students")}
              value={mine.length}
              icon={Users}
              note={t("İki proqramda", "Across two programs")}
            />
            <Stat
              label={t("Aktiv qruplarım", "My active groups")}
              value={myGroups.length}
              icon={BookOpen}
              note="IELTS · TOEFL"
            />
            <Stat
              label={t("Yoxlanmalı cavablar", "Awaiting review")}
              value={pending.length}
              icon={FileText}
              note={t("Rəyinizi gözləyir", "Waiting for your feedback")}
            />
            <Stat
              label={t("Orta davamiyyət", "Average attendance")}
              value={`${avg}%`}
              icon={ClipboardCheck}
              note={t("Qruplarım üzrə", "Across my groups")}
            />
          </div>
          <div className="teacher-focus">
            <div>
              <span className="eyebrow">
                {t("BU GÜNÜN FOKUSU", "TODAY’S FOCUS")}
              </span>
              <h2>
                {t(
                  "Düzgün rəy böyük fərq yaradır.",
                  "The right feedback makes a difference.",
                )}
              </h2>
              <p>
                {t(
                  `${pending.length} tələbə cavabı rəyinizi gözləyir. Bir tövsiyəniz növbəti uğurun başlanğıcı ola bilər.`,
                  `${pending.length} student responses are waiting for your feedback. One suggestion can spark their next success.`,
                )}
              </p>
              <Button
                variant="primary"
                icon={ArrowRight}
                onClick={() => go("assignments")}
              >
                {t("Cavabları yoxla", "Review responses")}
              </Button>
            </div>
            <div className="focus-illustration" aria-hidden="true">
              <FileText size={48} />
              <span>
                <Check size={24} />
              </span>
            </div>
          </div>
          <div className="overview-grid">
            <Card>
              <SectionHeading
                title={t("Qruplarıma baxış", "My groups at a glance")}
                subtitle={t(
                  "Göstəricilər və növbəti addımlar",
                  "Indicators and next steps",
                )}
              />
              <div className="teacher-group-list">
                {myGroups.map((g) => (
                  <div key={g.id}>
                    <span className="course-icon">
                      <BookOpen size={20} />
                    </span>
                    <div>
                      <h3>{g.name}</h3>
                      <p>
                        {mine.filter((s) => s.group === g.id).length}{" "}
                        {t("tələbə", "students")} · {g.time}
                      </p>
                    </div>
                    <Button
                      icon={ArrowRight}
                      onClick={() => {
                        setGroup(g.id);
                        go("students");
                      }}
                    >
                      {t("Bax", "View")}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <SectionHeading
                title={t("Diqqətinizdən kənarda qalmasın", "Keep an eye on")}
                subtitle={t(
                  "Əlavə dəstək üçün imkanlar",
                  "Opportunities for extra support",
                )}
              />
              <div className="attention-list">
                {mine
                  .filter((s) => s.attendance < 95 || s.progress < 70)
                  .slice(0, 3)
                  .map((s) => (
                    <button
                      key={s.id}
                      onClick={() =>
                        setModal({ type: "student", student: s.id })
                      }
                    >
                      <Avatar name={s.name} />
                      <span>
                        <strong>{s.name}</strong>
                        <small>
                          {t("Davamiyyət", "Attendance")}: {s.attendance}%
                        </small>
                      </span>
                      <ArrowRight size={15} />
                    </button>
                  ))}
              </div>
            </Card>
          </div>
        </>
      )}
      {page === "groups" && (
        <div className="group-grid teacher-groups">
          {myGroups.map((g) => {
            let members = mine.filter((s) => s.group === g.id);
            return (
              <Card className="group-card" key={g.id}>
                <div className="group-top">
                  <span className="course-icon">
                    <BookOpen size={24} />
                  </span>
                  <Badge tone="success">{t("Aktiv", "Active")}</Badge>
                </div>
                <span className="eyebrow">{g.program}</span>
                <h2>{g.name}</h2>
                <p>
                  {pick(g.days)} · {g.time}
                </p>
                <div className="group-students">
                  <div className="mini-avatars">
                    {members.slice(0, 4).map((s) => (
                      <Avatar key={s.id} name={s.name} />
                    ))}
                  </div>
                  <span>
                    {members.length} {t("tələbə", "students")}
                  </span>
                </div>
                <Progress
                  label={t("Orta davamiyyət", "Avg. attendance")}
                  value={Math.round(
                    members.reduce((sum, s) => sum + s.attendance, 0) /
                      members.length,
                  )}
                />
                <div className="group-card-footer">
                  <span>
                    {t("Otaq", "Room")} {g.room}
                  </span>
                  <Button
                    icon={ArrowRight}
                    onClick={() => {
                      setGroup(g.id);
                      go("students");
                    }}
                  >
                    {t("Tələbələrə bax", "View students")}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      {page === "students" && (
        <Card>
          <div className="table-toolbar">
            <SearchField
              value={search}
              onChange={setSearch}
              placeholder={t("Tələbə axtar…", "Search students…")}
            />
            <select
              aria-label={t("Qrup seç", "Select group")}
              value={group}
              onChange={(e) => setGroup(e.target.value)}
            >
              <option value="all">
                {t("Bütün qruplarım", "All my groups")}
              </option>
              {myGroups.map((g) => (
                <option value={g.id} key={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>{t("TƏLƏBƏ", "STUDENT")}</th>
                  <th>{t("QRUP", "GROUP")}</th>
                  <th>{t("DAVAMİYYƏT", "ATTENDANCE")}</th>
                  <th>{t("İRƏLİLƏYİŞ", "PROGRESS")}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {list.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div className="person">
                        <Avatar name={s.name} />
                        <span>
                          <strong>{s.name}</strong>
                          <small>{s.id}</small>
                        </span>
                      </div>
                    </td>
                    <td>{groups.find((g) => g.id === s.group).program}</td>
                    <td>
                      <Badge tone={s.attendance < 85 ? "warning" : "success"}>
                        {s.attendance}%
                      </Badge>
                    </td>
                    <td>
                      <Progress value={s.progress} />
                      <span className="table-progress-number">
                        {s.progress}%
                      </span>
                    </td>
                    <td>
                      <button
                        className="table-arrow"
                        aria-label={`${t("Tələbə profili", "Student profile")}: ${s.name}`}
                        onClick={() =>
                          setModal({ type: "student", student: s.id })
                        }
                      >
                        <ArrowRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!list.length && (
              <Empty
                title={t("Tələbə tapılmadı", "No students found")}
                description={t(
                  "Başqa ad və ya qrup seçin.",
                  "Try another name or group.",
                )}
              />
            )}
          </div>
        </Card>
      )}
      {page === "attendance" && (
        <>
          <Card className="attendance-controls">
            <div>
              <span className="eyebrow">
                {t("DAVAMİYYƏT JURNALI", "ATTENDANCE REGISTER")}
              </span>
              <h2>
                {date("2026-10-15", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </h2>
            </div>
            <select
              aria-label={t("Davamiyyət qrupu", "Attendance group")}
              value={group === "all" ? "g1" : group}
              onChange={(e) => setGroup(e.target.value)}
            >
              {myGroups.map((g) => (
                <option value={g.id} key={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
            <Badge
              tone={stored && Object.keys(stored).length ? "success" : "info"}
            >
              {Object.keys(stored).length
                ? t("Saxlanılıb", "Saved")
                : t("Qeyd edilməyib", "Not recorded")}
            </Badge>
          </Card>
          <Card>
            <div className="table-toolbar">
              <div className="attendance-legend">
                <span>
                  <i className="present" />
                  {t("İştirak edir", "Present")}
                </span>
                <span>
                  <i className="late" />
                  {t("Gecikib", "Late")}
                </span>
                <span>
                  <i className="absent" />
                  {t("İştirak etmir", "Absent")}
                </span>
              </div>
              <Button
                onClick={() => {
                  let g = group === "all" ? "g1" : group;
                  setMarks((d) => ({
                    ...d,
                    [`2026-10-15-${g}`]: Object.fromEntries(
                      mine
                        .filter((s) => s.group === g)
                        .map((s) => [s.id, "present"]),
                    ),
                  }));
                }}
                icon={Check}
              >
                {t("Hamısı iştirak edir", "Mark all present")}
              </Button>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>{t("TƏLƏBƏ", "STUDENT")}</th>
                    <th>{t("İŞTİRAK STATUSU", "ATTENDANCE STATUS")}</th>
                  </tr>
                </thead>
                <tbody>
                  {mine
                    .filter((s) => s.group === (group === "all" ? "g1" : group))
                    .map((s) => (
                      <tr key={s.id}>
                        <td>
                          <div className="person">
                            <Avatar name={s.name} />
                            <span>
                              <strong>{s.name}</strong>
                              <small>{s.id}</small>
                            </span>
                          </div>
                        </td>
                        <td>
                          <div
                            className="attendance-options"
                            role="group"
                            aria-label={`${s.name} ${t("davamiyyət", "attendance")}`}
                          >
                            {[
                              ["present", t("İştirak edir", "Present")],
                              ["late", t("Gecikib", "Late")],
                              ["absent", t("İştirak etmir", "Absent")],
                            ].map(([id, label]) => (
                              <button
                                key={id}
                                className={currentMark(s.id) === id ? id : ""}
                                aria-pressed={currentMark(s.id) === id}
                                onClick={() =>
                                  setMarks((d) => ({
                                    ...d,
                                    [attendanceKey]: {
                                      ...groupMarks,
                                      [s.id]: id,
                                    },
                                  }))
                                }
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="attendance-save">
              <p>
                {t(
                  "Dəyişikliklər tələbə və admin panellərində də əks olunacaq.",
                  "Changes will also appear in the student and admin workspaces.",
                )}
              </p>
              <Button
                variant="primary"
                icon={Check}
                onClick={() => {
                  const roster = mine.filter(
                    (s) => s.group === (group === "all" ? "g1" : group),
                  );
                  const record = Object.fromEntries(
                    roster.map((s) => [s.id, currentMark(s.id)]),
                  );
                  update((d) => ({
                    attendance: { ...d.attendance, [attendanceKey]: record },
                    students: d.students.map((s) =>
                      record[s.id]
                        ? {
                            ...s,
                            baselineAttendance:
                              s.baselineAttendance ?? s.attendance,
                            attendance: Math.round(
                              ((s.baselineAttendance ?? s.attendance) * 19 +
                                (record[s.id] === "absent"
                                  ? 0
                                  : record[s.id] === "late"
                                    ? 50
                                    : 100)) /
                                20,
                            ),
                          }
                        : s,
                    ),
                  }));
                  notify("Davamiyyət saxlanıldı.", "Attendance saved.");
                }}
              >
                {t("Davamiyyəti saxla", "Save attendance")}
              </Button>
            </div>
          </Card>
        </>
      )}
      {page === "assignments" && (
        <>
          <div className="directory-summary">
            <div>
              <span>{t("Yoxlanmalı", "Awaiting review")}</span>
              <strong>{pending.length}</strong>
            </div>
            <div>
              <span>{t("Qiymətləndirilib", "Graded")}</span>
              <strong>
                {visibleSubmissions.filter((s) => s.status === "graded").length}
              </strong>
            </div>
            <div>
              <span>{t("Tapşırıqlar", "Assignments")}</span>
              <strong>
                {
                  assignments.filter((a) =>
                    myGroups.some((g) => g.id === a.group),
                  ).length
                }
              </strong>
            </div>
          </div>
          <Card>
            <div className="review-tabs">
              <Tabs
                value={submissionTab}
                onChange={setSubmissionTab}
                items={[
                  {
                    id: "submitted",
                    label: t("Yoxlanmalı cavablar", "Awaiting review"),
                    count: pending.length,
                  },
                  {
                    id: "graded",
                    label: t("Qiymətləndirilmiş", "Graded"),
                    count: visibleSubmissions.length - pending.length,
                  },
                ]}
              />
            </div>
            <div className="submission-list">
              {visibleSubmissions
                .filter((s) => s.status === submissionTab)
                .map((s) => {
                  const student = students.find((st) => st.id === s.student);
                  const assignment = assignments.find(
                    (a) => a.id === s.assignment,
                  );
                  return (
                    <div className="submission-row" key={s.id}>
                      <Avatar name={student.name} />
                      <div>
                        <strong>{student.name}</strong>
                        <h3>{pick(assignment.title)}</h3>
                        <p>{groups.find((g) => g.id === student.group).name}</p>
                      </div>
                      {s.status === "graded" ? (
                        <Badge tone="success">{s.score}/100</Badge>
                      ) : (
                        <Badge tone="warning">
                          {t("Rəy gözləyir", "Needs feedback")}
                        </Badge>
                      )}
                      <Button
                        icon={ArrowRight}
                        onClick={() =>
                          setModal({ type: "grade", submission: s.id })
                        }
                      >
                        {t("Nəzərdən keçir", "Review")}
                      </Button>
                    </div>
                  );
                })}
              {!visibleSubmissions.some((s) => s.status === submissionTab) && (
                <Empty
                  title={t("Bütün cavablar yoxlanılıb", "You’re all caught up")}
                  description={t(
                    "Yeni cavablar təqdim ediləndə burada görünəcək.",
                    "New responses will appear here when students submit them.",
                  )}
                />
              )}
            </div>
          </Card>
        </>
      )}
      {page === "materials" && (
        <ResourceLibrary groupIds={myGroups.map((g) => g.id)} teacher />
      )}
      {studentDetail && (
        <Modal
          title={studentDetail.name}
          subtitle={`${studentDetail.id} · ${groups.find((g) => g.id === studentDetail.group).name}`}
          onClose={() => setModal(null)}
        >
          <div className="profile-summary">
            <Avatar name={studentDetail.name} size="large" />
            <div>
              <h3>{t("Tələbənin inkişafı", "Student progress")}</h3>
              <p>{studentDetail.email}</p>
            </div>
          </div>
          <Progress
            value={studentDetail.attendance}
            label={t("Davamiyyət", "Attendance")}
          />
          <Progress
            value={studentDetail.progress}
            label={t("Öyrənmə irəliləyişi", "Learning progress")}
          />
          <dl className="detail-list">
            <div>
              <dt>
                {t("Təqdim edilmiş tapşırıqlar", "Submitted assignments")}
              </dt>
              <dd>
                {
                  submissions.filter((s) => s.student === studentDetail.id)
                    .length
                }
              </dd>
            </div>
            <div>
              <dt>{t("Son qeydiyyat", "Enrollment date")}</dt>
              <dd>{date(studentDetail.joined)}</dd>
            </div>
          </dl>
        </Modal>
      )}
      {modal?.type === "grade" && (
        <GradeModal id={modal.submission} onClose={() => setModal(null)} />
      )}
      {modal?.type === "resource" && (
        <Modal
          wide
          title={t("Yeni dərs materialı", "New learning resource")}
          subtitle={t(
            "Material seçilən qrupun tələbələrinə görünəcək.",
            "The resource will be visible to students in the selected group.",
          )}
          onClose={() => setModal(null)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              update((d) => ({
                resources: [
                  ...d.resources,
                  {
                    id: `r-${Date.now()}`,
                    group: fd.get("group"),
                    title: copy(fd.get("titleAz"), fd.get("titleEn")),
                    description: copy(
                      fd.get("bodyAz").slice(0, 100),
                      fd.get("bodyEn").slice(0, 100),
                    ),
                    kind: copy("Müəllim qeydləri", "Instructor notes"),
                    minutes: 5,
                    sections: [
                      {
                        title: copy(fd.get("titleAz"), fd.get("titleEn")),
                        body: copy(fd.get("bodyAz"), fd.get("bodyEn")),
                      },
                    ],
                  },
                ],
              }));
              setModal(null);
              notify("Material dərc edildi.", "Resource published.");
            }}
          >
            <label>
              {t("Qrup", "Group")}
              <select name="group">
                {myGroups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="form-grid">
              <label>
                {t("Başlıq (AZ)", "Title (AZ)")}
                <input name="titleAz" required minLength="3" maxLength="100" />
              </label>
              <label>
                {t("Başlıq (EN)", "Title (EN)")}
                <input name="titleEn" required minLength="3" maxLength="100" />
              </label>
            </div>
            <div className="form-grid">
              <label>
                {t("Məzmun (AZ)", "Content (AZ)")}
                <textarea
                  name="bodyAz"
                  required
                  minLength="20"
                  maxLength="12000"
                />
              </label>
              <label>
                {t("Məzmun (EN)", "Content (EN)")}
                <textarea
                  name="bodyEn"
                  required
                  minLength="20"
                  maxLength="12000"
                />
              </label>
            </div>
            <div className="modal-actions">
              <Button type="button" onClick={() => setModal(null)}>
                {t("Ləğv et", "Cancel")}
              </Button>
              <Button variant="primary" type="submit" icon={Plus}>
                {t("Materialı dərc et", "Publish resource")}
              </Button>
            </div>
          </form>
        </Modal>
      )}
      {modal?.type === "announcement" && (
        <Modal
          title={t("Qrup üçün elan", "Group announcement")}
          subtitle={t(
            "Elan tələbə panelində görünəcək.",
            "The announcement will appear in the student workspace.",
          )}
          onClose={() => setModal(null)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              update((d) => ({
                announcements: [
                  ...d.announcements,
                  {
                    id: Date.now(),
                    group: fd.get("group"),
                    body: String(fd.get("body")).trim(),
                  },
                ],
              }));
              setModal(null);
              notify("Elan paylaşıldı.", "Announcement posted.");
            }}
          >
            <label>
              {t("Qrup", "Group")}
              <select name="group">
                {myGroups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t("Elanın mətni", "Announcement")}
              <textarea name="body" required minLength="10" maxLength="1500" />
            </label>
            <div className="modal-actions">
              <Button variant="primary" type="submit" icon={Send}>
                {t("Elanı paylaş", "Post announcement")}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
function GradeModal({ id, onClose }) {
  const { t, pick, submissions, students, update, notify } = useApp();
  const response = submissions.find((s) => s.id === id);
  const student = students.find((s) => s.id === response.student),
    task = assignments.find((a) => a.id === response.assignment);
  const [score, setScore] = useState(response.score ?? ""),
    [feedback, setFeedback] = useState(response.feedback);
  return (
    <Modal
      wide
      title={pick(task.title)}
      subtitle={`${student.name} · ${t("Tapşırıq cavabı", "Assignment response")}`}
      onClose={onClose}
    >
      <div className="student-response">
        <span className="eyebrow">
          {t("TƏLƏBƏNİN CAVABI", "STUDENT RESPONSE")}
        </span>
        <p>{response.answer}</p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!feedback.trim()) return;
          update((d) => ({
            submissions: d.submissions.map((s) =>
              s.id === id
                ? {
                    ...s,
                    status: "graded",
                    score: Number(score),
                    feedback: feedback.trim(),
                  }
                : s,
            ),
            students: d.students.map((s) =>
              s.id === response.student
                ? {
                    ...s,
                    progress: Math.max(
                      s.progress,
                      Math.round(Number(score) * 0.8),
                    ),
                  }
                : s,
            ),
          }));
          notify(
            "Qiymət və rəy tələbə panelinə əlavə edildi.",
            "Score and feedback added to the student workspace.",
          );
          onClose();
        }}
      >
        <label>
          {t("Qiymət (0–100)", "Score (0–100)")}
          <input
            type="number"
            min="0"
            max="100"
            required
            value={score}
            onChange={(e) => setScore(e.target.value)}
          />
        </label>
        <label>
          {t("Tələbəyə rəy", "Feedback for the student")}
          <textarea
            required
            minLength="5"
            maxLength="3000"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder={t(
              "Nə yaxşı alınıb və nəyi inkişaf etdirmək olar?",
              "What worked well, and what could improve?",
            )}
          />
        </label>
        <div className="modal-actions">
          <Button type="button" onClick={onClose}>
            {t("Ləğv et", "Cancel")}
          </Button>
          <Button variant="primary" type="submit" icon={Check}>
            {t("Qiyməti yadda saxla", "Save assessment")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
