import { useState } from "react";
import {
  BookOpen,
  Bookmark,
  Check,
  Clock3,
  Download,
  ArrowRight,
  FileText,
} from "lucide-react";
import { useApp } from "../context";
import { groups, teachers } from "../data";
import {
  Card,
  Button,
  Avatar,
  Badge,
  SearchField,
  Empty,
  Modal,
  downloadFile,
} from "./ui";
export function ResourceLibrary({ groupIds, teacher = false }) {
  const { t, pick, resources, saved, read, update } = useApp();
  const [query, setQuery] = useState(""),
    [tab, setTab] = useState("all"),
    [group, setGroup] = useState("all"),
    [opened, setOpened] = useState(null);
  const available = resources.filter((r) => groupIds.includes(r.group));
  const filtered = available.filter(
    (r) =>
      (group === "all" || r.group === group) &&
      (tab !== "saved" || saved.includes(r.id)) &&
      `${pick(r.title)} ${pick(r.description)}`
        .toLocaleLowerCase()
        .includes(query.toLocaleLowerCase()),
  );
  return (
    <>
      <div className="library-controls">
        <div className="tabs">
          <button
            onClick={() => setTab("all")}
            className={tab === "all" ? "active" : ""}
          >
            {t("Bütün materiallar", "All resources")}
            <span>{available.length}</span>
          </button>
          <button
            onClick={() => setTab("saved")}
            className={tab === "saved" ? "active" : ""}
          >
            {t("Saxlanılanlar", "Saved")}
            <span>{available.filter((r) => saved.includes(r.id)).length}</span>
          </button>
        </div>
        <div className="table-toolbar">
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder={t(
              "Material və ya mövzu axtar…",
              "Search resources or topics…",
            )}
          />
          {groupIds.length > 1 && (
            <select
              aria-label={t("Qrup filtri", "Group filter")}
              value={group}
              onChange={(e) => setGroup(e.target.value)}
            >
              <option value="all">{t("Bütün qruplar", "All groups")}</option>
              {groups
                .filter((g) => groupIds.includes(g.id))
                .map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
            </select>
          )}
        </div>
      </div>
      <div className="resource-grid">
        {filtered.map((r) => {
          const course = groups.find((g) => g.id === r.group);
          const owner = teachers.find((te) => te.id === course.teacher);
          return (
            <Card className="resource-card" key={r.id}>
              <div className="resource-card-top">
                <Badge tone="info">{course.program}</Badge>
                <button
                  className={`bookmark-button ${saved.includes(r.id) ? "saved" : ""}`}
                  aria-label={`${t("Saxla", "Save")}: ${pick(r.title)}`}
                  aria-pressed={saved.includes(r.id)}
                  onClick={() =>
                    update((d) => ({
                      saved: d.saved.includes(r.id)
                        ? d.saved.filter((x) => x !== r.id)
                        : [...d.saved, r.id],
                    }))
                  }
                >
                  <Bookmark size={17} />
                </button>
              </div>
              <div className="resource-type">
                <BookOpen size={14} />
                {pick(r.kind)}
                <span>
                  · {r.minutes} {t("dəq", "min")}
                </span>
              </div>
              <h2>{pick(r.title)}</h2>
              <p>{pick(r.description)}</p>
              <div className="resource-author">
                <Avatar name={owner.name} />
                <span>{owner.name}</span>
                {read.includes(r.id) && !teacher && (
                  <small>
                    <Check size={12} />
                    {t("Oxunub", "Read")}
                  </small>
                )}
              </div>
              <Button icon={ArrowRight} onClick={() => setOpened(r)}>
                {t("Materialı aç", "Open resource")}
              </Button>
            </Card>
          );
        })}
      </div>
      {!filtered.length && (
        <Card>
          <Empty
            title={t("Material tapılmadı", "No resources found")}
            description={t(
              "Axtarışı dəyiş və ya bütün materiallara bax.",
              "Try a different search or view all resources.",
            )}
          >
            <Button
              onClick={() => {
                setQuery("");
                setTab("all");
                setGroup("all");
              }}
            >
              {t("Filtrləri sıfırla", "Reset filters")}
            </Button>
          </Empty>
        </Card>
      )}
      {opened && (
        <ResourceModal
          resource={opened}
          onClose={() => setOpened(null)}
          teacher={teacher}
        />
      )}
    </>
  );
}
export function ResourceModal({ resource: r, onClose, teacher = false }) {
  const { t, pick, read, update, notify } = useApp();
  return (
    <Modal
      wide
      title={pick(r.title)}
      subtitle={`${pick(r.kind)} · ${r.minutes} ${t("dəqiqə", "minutes")} · ${t("Nümunə məzmun", "Demo content")}`}
      onClose={onClose}
    >
      <div className="reading-content">
        {r.sections.map((section, i) => (
          <section key={i}>
            <span className="reading-number">0{i + 1}</span>
            <div>
              <h3>{pick(section.title)}</h3>
              <p>{pick(section.body)}</p>
            </div>
          </section>
        ))}
      </div>
      <div className="modal-actions">
        <Button
          icon={Download}
          onClick={() =>
            downloadFile(
              r.id + ".txt",
              "GLODEMIA OS — DEMO\n" +
                pick(r.title) +
                "\n\n" +
                r.sections
                  .map((s) => pick(s.title) + "\n" + pick(s.body))
                  .join("\n\n"),
            )
          }
        >
          {t("Yüklə (.txt)", "Download (.txt)")}
        </Button>
        {!teacher && (
          <Button
            variant="primary"
            icon={Check}
            onClick={() => {
              update((d) => ({
                read: d.read.includes(r.id) ? d.read : [...d.read, r.id],
              }));
              notify(
                "Material oxunmuş kimi qeyd edildi.",
                "Resource marked as read.",
              );
              onClose();
            }}
          >
            {read.includes(r.id)
              ? t("Oxunub", "Read")
              : t("Oxudum", "Mark as read")}
          </Button>
        )}
      </div>
    </Modal>
  );
}
export function SubmitAssignment({ assignment, onClose }) {
  const { t, pick, submissions, update, notify } = useApp();
  const existing = submissions.find(
    (s) => s.assignment === assignment.id && s.student === "ST-241",
  );
  const [answer, setAnswer] = useState(existing?.answer || "");
  return (
    <Modal
      wide
      title={pick(assignment.title)}
      subtitle={t("Demo tapşırıq cavabı", "Demo assignment response")}
      onClose={onClose}
    >
      <p className="assignment-instruction">{pick(assignment.description)}</p>
      {existing?.status === "graded" && (
        <div className="feedback-panel">
          <strong>
            {t("Müəllim rəyi", "Instructor feedback")} · {existing.score}/100
          </strong>
          <p>{existing.feedback}</p>
        </div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (answer.trim().length < 30) return;
          update((d) => ({
            submissions: [
              ...d.submissions.filter(
                (s) =>
                  !(s.assignment === assignment.id && s.student === "ST-241"),
              ),
              {
                id: existing?.id || `submission-${Date.now()}`,
                assignment: assignment.id,
                student: "ST-241",
                answer: answer.trim(),
                status: "submitted",
                score: null,
                feedback: "",
              },
            ],
          }));
          notify(
            "Cavab saxlanıldı və demo müəllim panelinə əlavə edildi.",
            "Response saved and added to the demo teacher workspace.",
          );
          onClose();
        }}
      >
        <label>
          {t("Cavabın", "Your answer")}
          <textarea
            required
            minLength="30"
            maxLength="12000"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={t(
              "Fikirlərini burada yaz…",
              "Write your response here…",
            )}
          />
        </label>
        <div className="answer-meta">
          <span>{t("Minimum 30 simvol", "Minimum 30 characters")}</span>
          <span>{answer.length} / 12000</span>
        </div>
        <div className="modal-actions">
          <Button type="button" onClick={onClose}>
            {t("Ləğv et", "Cancel")}
          </Button>
          <Button variant="primary" icon={ArrowRight} type="submit">
            {t("Cavabı təqdim et", "Submit response")}
          </Button>
        </div>
        <p className="form-note">
          {t(
            "Cavab yalnız bu brauzerdəki demo panelləri arasında paylaşılır.",
            "The response is shared only between demo workspaces in this browser.",
          )}
        </p>
      </form>
    </Modal>
  );
}
