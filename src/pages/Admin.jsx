import { useState } from "react";
import {
  Users,
  BookOpen,
  Wallet,
  ClipboardCheck,
  Plus,
  Download,
  ArrowRight,
  CalendarDays,
  Check,
  Filter,
  TrendingUp,
  Presentation,
  Mail,
  FileText,
} from "lucide-react";
import { useApp } from "../context";
import { groups, teachers, copy } from "../data";
import {
  Button,
  Card,
  Avatar,
  Badge,
  PageHeading,
  SectionHeading,
  Stat,
  SearchField,
  Modal,
  Progress,
  Empty,
  ActionLink,
  downloadFile,
  csvCell,
} from "../components/ui";
import RevenueChart from "../components/RevenueChart";
export default function Admin({ page }) {
  const { t, pick, students, update, notify, navigate, money, date } = useApp();
  const [search, setSearch] = useState(""),
    [filter, setFilter] = useState("all"),
    [modal, setModal] = useState(null);
  const total = students
      .filter((s) => s.paid)
      .reduce((sum, s) => sum + groups.find((g) => g.id === s.group).fee, 0),
    average = Math.round(
      students.reduce((sum, s) => sum + s.attendance, 0) / students.length,
    );
  const filtered = students.filter(
    (s) =>
      (filter === "all" || s.group === filter || s.status === filter) &&
      `${s.name} ${s.id} ${groups.find((g) => g.id === s.group).program}`
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase()),
  );
  const go = (id) => navigate(`/admin/${id}`);
  const exportReport = () => {
    downloadFile(
      "glodemia-demo-report.csv",
      [
        [
          t("Nümunə məlumat", "Fictional demo data"),
          t("Tələbə", "Student"),
          t("Qrup", "Group"),
          t("Davamiyyət", "Attendance"),
          t("İrəliləyiş", "Progress"),
          t("Ödəniş", "Payment"),
        ],
        ...students.map((s) => [
          "DEMO",
          s.name,
          groups.find((g) => g.id === s.group).name,
          s.attendance + "%",
          s.progress + "%",
          s.paid ? t("Ödənilib", "Paid") : t("Gözləyir", "Pending"),
        ]),
      ]
        .map((r) => r.map(csvCell).join(","))
        .join("\n"),
      "text/csv;charset=utf-8",
    );
    notify("Hesabat yükləndi.", "Report downloaded.");
  };
  const titles = {
    overview: [
      t("Akademiyanın ümumi görünüşü", "Academy overview"),
      t(
        "Xoş gəldiniz, Nigar. Bu gün Glodemia-da baş verənlər.",
        "Welcome back, Nigar. Here’s what’s happening at Glodemia today.",
      ),
    ],
    students: [
      t("Hər tələbənin uğuruna yaxın.", "Closer to every student’s success."),
      t(
        "Qeydiyyat, öyrənmə və inkişaf — vahid görünüşdə.",
        "Enrollment, learning, and progress — in one connected view.",
      ),
    ],
    groups: [
      t("Proqramlar və qruplar", "Courses & groups"),
      t(
        "Öyrənmə yollarını və tədris qruplarını idarə edin.",
        "Manage learning paths and teaching groups.",
      ),
    ],
    schedule: [
      t("Akademiyanın dərs cədvəli", "Academy schedule"),
      t(
        "Dərslər, müəllimlər və otaqlar bir yerdə.",
        "Classes, instructors, and rooms in one place.",
      ),
    ],
    team: [
      t("Uğurun arxasındakı komanda", "The team behind every success"),
      t(
        "Təcrübə, qayğı və ortaq bir məqsəd.",
        "Expertise, care, and a shared ambition.",
      ),
    ],
    finance: [
      t("Maliyyə mənzərəsi", "Financial overview"),
      t(
        "Ödənişlərə nəzarət edin, gələcəyi planlaşdırın.",
        "Keep track of payments and plan ahead.",
      ),
    ],
    reports: [
      t("Qərarlar üçün aydın məlumat", "Clarity for your next decision"),
      t(
        "Akademiyanızın inkişafını ölçün və paylaşın.",
        "Measure and share your academy’s progress.",
      ),
    ],
  };
  const title = titles[page] || titles.overview;
  const selected = modal?.student
    ? students.find((s) => s.id === modal.student)
    : null;
  return (
    <>
      <PageHeading
        eyebrow={t("AKADEMİYA İDARƏETMƏSİ", "ACADEMY MANAGEMENT")}
        title={title[0]}
        subtitle={title[1]}
      >
        <span className="date-chip">
          <CalendarDays size={15} />
          {date("2026-10-15", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
        {page === "students" || page === "overview" ? (
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setModal({ type: "add" })}
          >
            {t("Tələbə əlavə et", "Add student")}
          </Button>
        ) : (
          <Button icon={Download} onClick={exportReport}>
            {t("Hesabatı yüklə", "Export report")}
          </Button>
        )}
      </PageHeading>
      {page === "overview" && (
        <>
          <div className="notice-strip">
            <span className="notice-dot" />
            <span>
              {t(
                "Akademiyanız bir yerdə. Daha aydın görünüş, daha inamlı qərarlar.",
                "Your academy, connected. A clearer picture for more confident decisions.",
              )}
            </span>
            <span className="notice-tag">GLODEMIA OS</span>
          </div>
          <div className="stats-grid">
            <Stat
              label={t("Ümumi tələbələr", "Total students")}
              value={students.length}
              change="12.7%"
              note={t("bu ay", "this month")}
              icon={Users}
            />
            <Stat
              label={t("Aktiv qruplar", "Active groups")}
              value={groups.length}
              change="1"
              note={t("yeni qrup", "new group")}
              icon={BookOpen}
            />
            <Stat
              label={t("Aylıq gəlir", "Monthly revenue")}
              value={money(total)}
              change="18.4%"
              note={t("əvvəlki aya nəzərən", "vs. last month")}
              icon={Wallet}
            />
            <Stat
              label={t("Orta davamiyyət", "Avg. attendance")}
              value={`${average}%`}
              change="2.1%"
              note={t("əvvəlki aya nəzərən", "vs. last month")}
              icon={ClipboardCheck}
            />
          </div>
          <div className="overview-grid">
            <Card>
              <SectionHeading
                title={t("Gəlirin dinamikası", "Revenue overview")}
                subtitle={t(
                  "Akademiyanızın sağlam inkişafı",
                  "A healthy outlook for your academy",
                )}
              />
              <RevenueChart total={total} />
            </Card>
            <Card className="program-card">
              <SectionHeading
                title={t("Proqramlar üzrə tələbələr", "Students by program")}
                subtitle={t(
                  "Fərqli yollar. Ortaq uğur.",
                  "Different paths. Shared ambition.",
                )}
              />
              <div className="program-body">
                <div className="donut">
                  <span>
                    <strong>{students.length}</strong>
                    <small>{t("tələbə", "students")}</small>
                  </span>
                </div>
                <div className="program-legend">
                  {groups.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => {
                        go("students");
                        setFilter(g.id);
                      }}
                    >
                      <i className={`program-dot ${g.color}`} />
                      <span>{g.program}</span>
                      <b>{students.filter((s) => s.group === g.id).length}</b>
                    </button>
                  ))}
                </div>
              </div>
              <div className="program-caption">
                {t(
                  "5 proqram. Bir gələcəyə doğru.",
                  "5 programs. One brighter future.",
                )}
                <BookOpen size={16} />
              </div>
            </Card>
          </div>
          <div className="overview-grid lower">
            <Card>
              <SectionHeading
                title={t("Tələbələrə ümumi baxış", "Student overview")}
                subtitle={t(
                  "Hər tələbə. Hər inkişaf addımı.",
                  "Every student. Every step forward.",
                )}
              >
                <ActionLink onClick={() => go("students")}>
                  {t("Hamısına bax", "View all")}
                </ActionLink>
              </SectionHeading>
              <StudentTable
                compact
                filtered={filtered}
                onSelect={(id) => setModal({ type: "student", student: id })}
              />
              <div className="table-bottom">
                {t(
                  `${students.length} tələbədən 5-i göstərilir`,
                  `Showing 5 of ${students.length} students`,
                )}
                <span>{t("Oktyabr 2026", "October 2026")}</span>
              </div>
            </Card>
            <Card>
              <SectionHeading
                title={t("Son fəaliyyətlər", "Recent activity")}
                subtitle={t(
                  "Akademiyanız hərəkətdədir",
                  "Your academy in motion",
                )}
              >
                <Badge tone="success">{t("Canlı", "Live")}</Badge>
              </SectionHeading>
              <div className="activity-list">
                {[
                  [
                    Users,
                    t("Aylin Məmmədova", "Aylin Məmmədova"),
                    t("IELTS qrupuna qoşuldu.", "joined the IELTS group."),
                    t("12 dəqiqə əvvəl", "12 minutes ago"),
                  ],
                  [
                    Wallet,
                    t("Murad Həsənov", "Murad Həsənov"),
                    t("650 ₼ ödəniş etdi.", "made a payment of ₼650."),
                    t("35 dəqiqə əvvəl", "35 minutes ago"),
                  ],
                  [
                    BookOpen,
                    "SAT October",
                    t("qrupunun cədvəli yeniləndi.", "schedule was updated."),
                    t("1 saat əvvəl", "1 hour ago"),
                  ],
                  [
                    ClipboardCheck,
                    t("Nigar Əliyeva", "Nigar Əliyeva"),
                    t("davamiyyəti qeyd etdi.", "recorded attendance."),
                    t("2 saat əvvəl", "2 hours ago"),
                  ],
                ].map(([Icon, n, body, time]) => (
                  <div className="activity-item" key={n}>
                    <span>
                      <Icon size={15} />
                    </span>
                    <div>
                      <p>
                        <b>{n}</b> {body}
                      </p>
                      <small>{time}</small>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
      {page === "students" && (
        <>
          <div className="directory-summary">
            <div>
              <span>{t("Ümumi tələbə", "Total students")}</span>
              <strong>{students.length}</strong>
            </div>
            <div>
              <span>{t("Aktiv qeydiyyat", "Active enrollment")}</span>
              <strong>
                {students.filter((s) => s.status === "active").length}
              </strong>
            </div>
            <div>
              <span>{t("Nəzarət tələb edir", "Needs attention")}</span>
              <strong>
                {students.filter((s) => s.attendance < 85).length}
              </strong>
            </div>
          </div>
          <Card>
            <div className="table-toolbar">
              <SearchField
                value={search}
                onChange={setSearch}
                placeholder={t(
                  "Ad, ID və ya proqram axtar…",
                  "Search name, ID, or program…",
                )}
              />
              <select
                aria-label={t("Tələbə filtri", "Student filter")}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">
                  {t("Bütün tələbələr", "All students")}
                </option>
                <option value="pending">
                  {t("Qeydiyyatı gözləyənlər", "Pending enrollment")}
                </option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.program}
                  </option>
                ))}
              </select>
              <Button icon={Download} onClick={exportReport}>
                {t("İxrac", "Export")}
              </Button>
            </div>
            <StudentTable
              filtered={filtered}
              onSelect={(id) => setModal({ type: "student", student: id })}
            />
            <div className="table-bottom">
              {filtered.length} {t("tələbə göstərilir", "students shown")}
              <span>
                {t("Nümunə tələbə bazası", "Fictional student directory")}
              </span>
            </div>
          </Card>
        </>
      )}
      {page === "groups" && (
        <div className="group-grid">
          {groups.map((g) => (
            <Card key={g.id} className="group-card">
              <div className="group-top">
                <span className={`course-icon ${g.color}`}>
                  <BookOpen size={23} />
                </span>
                <Badge tone="success">{t("Aktiv", "Active")}</Badge>
              </div>
              <span className="eyebrow">{g.program}</span>
              <h2>{g.name}</h2>
              <p>{teachers.find((te) => te.id === g.teacher).name}</p>
              <div className="group-details">
                <span>
                  <Users size={15} />
                  {students.filter((s) => s.group === g.id).length}{" "}
                  {t("tələbə", "students")}
                </span>
                <span>
                  <CalendarDays size={15} />
                  {pick(g.days)}
                </span>
              </div>
              <div className="group-card-footer">
                <span>{g.time}</span>
                <Button
                  icon={ArrowRight}
                  onClick={() => {
                    go("students");
                    setFilter(g.id);
                  }}
                >
                  {t("Qrupa bax", "View group")}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      {page === "schedule" && <Schedule />}
      {page === "team" && (
        <div className="group-grid">
          {teachers.map((te) => (
            <Card className="team-card" key={te.id}>
              <Avatar name={te.name} size="large" />
              <h2>{te.name}</h2>
              <p>{te.subject}</p>
              <Badge tone="info">{t("Müəllim", "Instructor")}</Badge>
              <div className="team-meta">
                <span>
                  {t("Qruplar", "Groups")}
                  <b>{groups.filter((g) => g.teacher === te.id).length}</b>
                </span>
                <span>
                  {t("Tələbələr", "Students")}
                  <b>
                    {
                      students.filter((s) =>
                        groups.some(
                          (g) => g.id === s.group && g.teacher === te.id,
                        ),
                      ).length
                    }
                  </b>
                </span>
              </div>
              <Button
                icon={Mail}
                onClick={() => setModal({ type: "team", teacher: te })}
              >
                {t("Əlaqə məlumatı", "Contact details")}
              </Button>
            </Card>
          ))}
        </div>
      )}
      {page === "finance" && (
        <>
          <div className="stats-grid three">
            <Stat
              label={t("Toplanmış ödənişlər", "Collected payments")}
              value={money(total)}
              icon={Wallet}
              note={t("Oktyabr 2026", "October 2026")}
            />
            <Stat
              label={t("Gözləyən ödənişlər", "Outstanding payments")}
              value={money(
                students
                  .filter((s) => !s.paid)
                  .reduce(
                    (sum, s) => sum + groups.find((g) => g.id === s.group).fee,
                    0,
                  ),
              )}
              icon={TrendingUp}
              note={t("Bu ay üçün", "For this month")}
            />
            <Stat
              label={t("Ödənişi tamamlayanlar", "Students paid")}
              value={`${students.filter((s) => s.paid).length} / ${students.length}`}
              icon={Check}
              note={t("Nümunə maliyyə qeydləri", "Fictional financial records")}
            />
          </div>
          <Card>
            <SectionHeading
              title={t("Ödəniş qeydləri", "Payment records")}
              subtitle={t(
                "Oktyabr ayı üçün təhsil haqları",
                "Tuition fees for October",
              )}
            />
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>{t("TƏLƏBƏ", "STUDENT")}</th>
                    <th>{t("PROQRAM", "PROGRAM")}</th>
                    <th>{t("MƏBLƏĞ", "AMOUNT")}</th>
                    <th>STATUS</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <div className="person">
                          <Avatar name={s.name} />
                          <span>
                            <strong>{s.name}</strong>
                            <small>INV-{s.id.slice(3)}</small>
                          </span>
                        </div>
                      </td>
                      <td>{groups.find((g) => g.id === s.group).program}</td>
                      <td>{money(groups.find((g) => g.id === s.group).fee)}</td>
                      <td>
                        <Badge tone={s.paid ? "success" : "warning"}>
                          {s.paid
                            ? t("Ödənilib", "Paid")
                            : t("Gözləyir", "Pending")}
                        </Badge>
                      </td>
                      <td>
                        {!s.paid && (
                          <button
                            className="action-link"
                            onClick={() => {
                              update((d) => ({
                                students: d.students.map((x) =>
                                  x.id === s.id ? { ...x, paid: true } : x,
                                ),
                              }));
                              notify(
                                "Demo ödəniş qeyd edildi.",
                                "Demo payment recorded.",
                              );
                            }}
                          >
                            {t("Ödənişi qeyd et", "Record payment")}
                            <Check size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
      {page === "reports" && (
        <>
          <div className="reports-intro">
            <ChartIcon />
            <div>
              <h2>
                {t(
                  "Məlumatı inkişafa çevirin.",
                  "Turn insights into progress.",
                )}
              </h2>
              <p>
                {t(
                  "Əlaqəli tələbə məlumatlarını bir kliklə CSV formatında yükləyin.",
                  "Download connected student data as CSV with a single click.",
                )}
              </p>
            </div>
          </div>
          <div className="report-list">
            {[
              [
                t("Akademiya performansı", "Academy performance"),
                t(
                  "Tələbələr, davamiyyət və öyrənmə göstəriciləri.",
                  "Students, attendance, and learning indicators.",
                ),
              ],
              [
                t("Maliyyə və ödənişlər", "Finance & payments"),
                t(
                  "Proqramlar üzrə təhsil haqları və ödəniş statusları.",
                  "Tuition fees and payment status across programs.",
                ),
              ],
              [
                t("Qrup və proqram xülasəsi", "Groups & program summary"),
                t(
                  "Tələbələrin proqramlara görə bölgüsü.",
                  "An overview of enrollment across programs.",
                ),
              ],
            ].map(([name, desc]) => (
              <Card key={name} className="report-row">
                <span className="report-icon">
                  <FileText size={22} />
                </span>
                <div>
                  <h2>{name}</h2>
                  <p>{desc}</p>
                </div>
                <Badge tone="success">{t("Hazırdır", "Ready")}</Badge>
                <Button icon={Download} onClick={exportReport}>
                  CSV
                </Button>
              </Card>
            ))}
          </div>
        </>
      )}
      {modal?.type === "add" && (
        <Modal
          title={t("Yeni tələbə əlavə et", "Add a new student")}
          subtitle={t(
            "Tələbə məlumatları bütün demo panellərində görünəcək.",
            "The student will appear across the demo workspaces.",
          )}
          onClose={() => setModal(null)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const name = String(fd.get("name")).trim();
              if (name.length < 3) return;
              update((d) => ({
                students: [
                  ...d.students,
                  {
                    id: `ST-${Math.max(...d.students.map((s) => +s.id.slice(3))) + 1}`,
                    name,
                    email: String(fd.get("email")),
                    group: String(fd.get("group")),
                    attendance: 100,
                    progress: 0,
                    status: "active",
                    joined: "2026-10-15",
                    paid: false,
                  },
                ],
              }));
              setModal(null);
              notify("Tələbə əlavə edildi.", "Student added.");
            }}
          >
            <label>
              {t("Ad və soyad", "Full name")}
              <input
                name="name"
                required
                minLength="3"
                maxLength="80"
                autoComplete="name"
                placeholder={t("Məsələn, Aysu Əliyeva", "e.g. Aysu Aliyeva")}
              />
            </label>
            <label>
              {t("E-poçt", "Email")}
              <input
                name="email"
                type="email"
                required
                placeholder="student@example.com"
              />
            </label>
            <label>
              {t("Qrup", "Group")}
              <select name="group">
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="modal-actions">
              <Button type="button" onClick={() => setModal(null)}>
                {t("Ləğv et", "Cancel")}
              </Button>
              <Button variant="primary" type="submit" icon={Plus}>
                {t("Tələbəni əlavə et", "Add student")}
              </Button>
            </div>
          </form>
        </Modal>
      )}
      {selected && (
        <Modal
          title={selected.name}
          subtitle={`${selected.id} · ${t("Nümunə tələbə profili", "Fictional student profile")}`}
          onClose={() => setModal(null)}
        >
          <div className="profile-summary">
            <Avatar name={selected.name} size="large" />
            <div>
              <h3>{groups.find((g) => g.id === selected.group).name}</h3>
              <p>{selected.email}</p>
              <Badge tone="success">{t("Qeydiyyatda", "Enrolled")}</Badge>
            </div>
          </div>
          <Progress
            value={selected.progress}
            label={t("Öyrənmə irəliləyişi", "Learning progress")}
          />
          <Progress
            value={selected.attendance}
            label={t("Davamiyyət", "Attendance")}
          />
          <dl className="detail-list">
            <div>
              <dt>{t("Müəllim", "Instructor")}</dt>
              <dd>
                {
                  teachers.find(
                    (te) =>
                      te.id ===
                      groups.find((g) => g.id === selected.group).teacher,
                  ).name
                }
              </dd>
            </div>
            <div>
              <dt>{t("Aylıq təhsil haqqı", "Monthly tuition")}</dt>
              <dd>{money(groups.find((g) => g.id === selected.group).fee)}</dd>
            </div>
            <div>
              <dt>{t("Ödəniş", "Payment")}</dt>
              <dd>
                {selected.paid
                  ? t("Ödənilib", "Paid")
                  : t("Gözləyir", "Pending")}
              </dd>
            </div>
          </dl>
          <div className="modal-actions">
            <Button onClick={() => setModal(null)}>
              {t("Bağla", "Close")}
            </Button>
          </div>
        </Modal>
      )}
      {modal?.type === "team" && (
        <Modal
          title={modal.teacher.name}
          subtitle={t("Demo müəllim profili", "Demo instructor profile")}
          onClose={() => setModal(null)}
        >
          <dl className="detail-list">
            <div>
              <dt>{t("Proqram", "Program")}</dt>
              <dd>{modal.teacher.subject}</dd>
            </div>
            <div>
              <dt>{t("E-poçt", "Email")}</dt>
              <dd>{modal.teacher.email}</dd>
            </div>
          </dl>
          <p>
            {t(
              "Bu əlaqə ünvanı nümunədir.",
              "This contact address is fictional.",
            )}
          </p>
        </Modal>
      )}
    </>
  );
}
function ChartIcon() {
  return (
    <span className="report-hero-icon">
      <TrendingUp size={38} />
    </span>
  );
}
export function Schedule({ student = false }) {
  const { t, pick, lang } = useApp();
  const [selected, setSelected] = useState(15);
  const [detail, setDetail] = useState(null);
  const days = t(
    ["B.e.", "Ç.a.", "Çər.", "C.a.", "Cümə", "Şən.", "Bazar"],
    ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  );
  const dayIndex = (selected - 12) % 7;
  const todays = (
    student ? groups.filter((g) => g.id === "g1") : groups
  ).filter((g) =>
    g.id === "g1"
      ? [0, 2, 4].includes(dayIndex)
      : g.id === "g2" || g.id === "g4"
        ? [1, 3].includes(dayIndex)
        : g.id === "g3"
          ? [0, 2].includes(dayIndex)
          : dayIndex === 5,
  );
  return (
    <Card className="schedule-card">
      <SectionHeading
        title={t("12–18 oktyabr 2026", "12–18 October 2026")}
        subtitle={t("Həftəlik dərs planı", "Your weekly class plan")}
      >
        <Badge tone="info">{t("Bu həftə", "This week")}</Badge>
      </SectionHeading>
      <div className="week-strip">
        {days.map((d, i) => (
          <button
            key={d}
            onClick={() => setSelected(12 + i)}
            className={selected === 12 + i ? "active" : ""}
            aria-pressed={selected === 12 + i}
          >
            <span>{d}</span>
            <strong>{12 + i}</strong>
            <i />
          </button>
        ))}
      </div>
      <div className="schedule-list">
        {todays.length ? (
          todays.map((g) => (
            <div className="schedule-row" key={g.id}>
              <div className="schedule-time">
                <strong>{g.time.split("–")[0]}</strong>
                <small>{g.time.split("–")[1]}</small>
              </div>
              <span className={`schedule-marker ${g.color}`} />
              <div className="schedule-description">
                <span className="eyebrow">{g.program}</span>
                <h3>{g.name}</h3>
                <p>
                  {teachers.find((te) => te.id === g.teacher).name} ·{" "}
                  {t("Otaq", "Room")} {g.room}
                </p>
              </div>
              <Button icon={ArrowRight} onClick={() => setDetail(g)}>
                {t("Ətraflı", "Details")}
              </Button>
            </div>
          ))
        ) : (
          <Empty
            title={t("Bu gün dərs yoxdur", "No classes today")}
            description={t(
              "Başqa gün seçin və ya müstəqil məşqə vaxt ayırın.",
              "Choose another day or make time for independent practice.",
            )}
          />
        )}
      </div>
      {detail && (
        <Modal
          title={detail.name}
          subtitle={`${selected} ${t("oktyabr", "October")} · ${detail.time}`}
          onClose={() => setDetail(null)}
        >
          <dl className="detail-list">
            <div>
              <dt>{t("Müəllim", "Instructor")}</dt>
              <dd>{teachers.find((te) => te.id === detail.teacher).name}</dd>
            </div>
            <div>
              <dt>{t("Məkan", "Location")}</dt>
              <dd>
                {t("Otaq", "Room")} {detail.room} · Glodemia
              </dd>
            </div>
          </dl>
          <p>
            {t(
              "Dərsə qeyd dəftərini və əvvəlki tapşırığını gətir.",
              "Bring your notebook and your previous assignment.",
            )}
          </p>
        </Modal>
      )}
    </Card>
  );
}

function StudentTable({ compact = false, filtered, onSelect }) {
  const { t } = useApp();
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>{t("TƏLƏBƏ", "STUDENT")}</th>
            <th>{t("PROQRAM", "PROGRAM")}</th>
            <th>{t("DAVAMİYYƏT", "ATTENDANCE")}</th>
            <th>{t("STATUS", "STATUS")}</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {(compact ? filtered.slice(0, 5) : filtered).map((s) => (
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
                <span className={s.attendance < 85 ? "text-warning" : ""}>
                  {s.attendance}%
                </span>
              </td>
              <td>
                <Badge tone={s.status === "pending" ? "warning" : "success"}>
                  {s.status === "pending"
                    ? t("Gözləyir", "Pending")
                    : t("Aktiv", "Active")}
                </Badge>
              </td>
              <td>
                <button
                  className="table-arrow"
                  aria-label={`${t("Profilə bax", "View profile")}: ${s.name}`}
                  onClick={() => onSelect(s.id)}
                >
                  <ArrowRight size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!filtered.length && (
        <Empty
          title={t("Tələbə tapılmadı", "No students found")}
          description={t(
            "Axtarış sözünü və ya filtri dəyişin.",
            "Try a different search or filter.",
          )}
        />
      )}
    </div>
  );
}
