import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { BookMarked, BookOpen, Brain, Calculator, ChartNoAxesCombined, Check, CheckCircle2, ChevronRight, ClipboardCheck, ClipboardList, Cpu, CreditCard, DraftingCompass, FlaskConical, Gift, Landmark, LayoutDashboard, LifeBuoy, ListFilter, LockKeyhole, LockKeyholeOpen, LogOut, Map as MapIcon, MonitorPlay, PenLine, Play, Repeat2, RotateCcw, Send, Settings, ShieldAlert, ShieldCheck, Sparkles, Target, Timer, UserRound, Users, X } from "lucide-react";
import { curriculum, subjects, topicsFor } from "./curriculum.js";
import { exampleBeats, formulaBeats } from "./lessonBeats.js";
import { AdminDashboard } from "./AdminDashboard.jsx";
import { AccountSettings } from "./AccountSettings.jsx";
import { AttemptRecorder } from "./AttemptRecorder.jsx";
import { CurriculumProgress } from "./CurriculumProgress.jsx";
import { BeatPlayer } from "./BeatPlayer.jsx";
import { DailyGoal } from "./DailyGoal.jsx";
import { ThemeToggle } from "./ThemeToggle.jsx";
import { DiagnosticAssessment } from "./DiagnosticAssessment.jsx";
import { LegalNotice } from "./LegalNotice.jsx";
import { LearnerProfileSetup } from "./LearnerProfileSetup.jsx";
import { EmailVerification, LoginScreen, PasswordReset, SignupHandoff } from "./PasswordLogin.jsx";
import { ProgressDashboard } from "./ProgressDashboard.jsx";
import { CheckoutConfirming } from "./CheckoutConfirming.jsx";
import { SubscriberSignup } from "./SubscriberSignup.jsx";
import { SubscriptionPage } from "./SubscriptionPage.jsx";
import { authFetch, clearAuthToken, getAuthToken, readJson, setAuthToken } from "./auth.js";
import { loadDiagnostic, personaliseTopics, saveDiagnostic } from "./diagnostic.js";
import { boardFor, loadLearnerProfile, saveLearnerProfile } from "./learnerProfile.js";
import { formatTopicGuide, getTopicGuide, getAuthoredExample } from "./topicGuides.js";
import { subtopicsFor } from "./subtopics.js";
import { selectExplanation } from './data/selectExplanation.js';
import { warrantsWorkedExample } from "./data/workedExampleOutcomes.js";
import { hasMaths, MathsText } from "./MathsText.jsx";
import { stopSpeaking } from "./speech.js";
import { stopPlayback } from "./playback.js";
import { LessonPlayer } from "./LessonPlayer.jsx";
import { QuestionPanel } from "./QuestionPanel.jsx";
import { ReviewPanel } from "./ReviewPanel.jsx";
import { ContentReview } from "./ContentReview.jsx";
import { SafeguardingReview } from "./SafeguardingReview.jsx";
import { PaymentsDashboard } from "./PaymentsDashboard.jsx";
import { SupportTickets } from "./SupportTickets.jsx";
import "katex/dist/katex.min.css";
import "./styles.css";
import { BrandLogo } from "./BrandLogo.jsx";

const subjectIcons = {
  Maths: Calculator,
  Science: FlaskConical,
  English: PenLine,
  History: Landmark,
  Geography: MapIcon,
  Computing: Cpu,
  "Design & Technology": DraftingCompass,
};

// What the check said about a topic, in words a learner can act on. The stored
// values are "priority", "developing" and "strength". The short forms are for
// the topic dropdown, where the title is already using most of the line.
const checkVerdicts = {
  priority: "Your check says: start here",
  developing: "Your check says: nearly there",
  strength: "Your check says: this looked strong",
};

const checkLabels = {
  priority: "start here",
  developing: "nearly there",
  strength: "looked strong",
};

const learningModes = {
  learn: { label: "Learn", icon: BookMarked, action: "Explain this topic", prompt: "Teach me this topic Socratically. Start with one question to check what I already understand, then use a worked example." },
  practice: { label: "Practice", icon: ClipboardList, action: "Generate question", prompt: "Give me one original adaptive practice question. Do not reveal the answer until I respond." },
  exam: { label: "Exam", icon: Timer, action: "Start timed question", prompt: "Give me one original exam-style question. State the suggested time and marks available, then wait for my answer." },
  review: { label: "Review", icon: Repeat2, action: "Start recall", prompt: "Test me with one short retrieval question on this weak topic. Wait for my answer before giving a hint." },
};

// A sub-topic is ticked once its lesson is finished and the topic has this
// many answers in both practice and exam. Practice and exam are set on the
// whole topic, so every sub-topic of it shares the same two counts.
// The statuses the API treats as paid. past_due is one of them: Stripe is still
// retrying, and access continues while it does.
const paidStatuses = ["active", "past_due"];

// A free trial is an account that has not paid: it may study one topic. The
// API enforces this; the app only follows it, so a locked topic is offered
// rather than requested and refused.
function trialFor(isAdmin, subscription) {
  return !isAdmin && !paidStatuses.includes(subscription?.status);
}

function topicById(topicId) {
  return topicId ? curriculum.find((entry) => entry.id === topicId) ?? null : null;
}

const answersToFinish = 10;
// How long the end of a worked example must stay on screen to count as read.
const exampleReadSeconds = 15;

const previewMode = import.meta.env.DEV
  ? new URLSearchParams(window.location.search).get("preview")
  : null;
const profilePreview = previewMode === "profile";
const adminPreview = previewMode === "admin";
const appPreview = previewMode === "app" || adminPreview;
const localSession = import.meta.env.DEV && new URLSearchParams(window.location.search).get("local") === "1";
const subscriptionPreview = previewMode === "subscription";
const signupPreview = previewMode === "signup";
const signupToken = new URLSearchParams(window.location.search).get("signup");
// Handoff from the marketing site: it has collected an email and a username
// and sends the visitor here to set a password and pay. Never a password -
// that is not put in a URL.
const registerHandoff = (() => {
  const query = new URLSearchParams(window.location.search);
  if (query.get("register") !== "1") return null;
  return {
    email: (query.get("email") ?? "").trim().toLowerCase(),
    username: (query.get("username") ?? "").trim(),
  };
})();
const resetToken = new URLSearchParams(window.location.search).get("reset");
const verifyToken = new URLSearchParams(window.location.search).get("verify");
const resetPreview = previewMode === "reset";
const previewReviewRows = [
  {
    topicId: "y10-maths-number", rowKey: "practice-0-AQA-Higher", type: "practice", subject: "Maths", year: 10,
    topicTitle: "Accuracy, Bounds and Standard Form", subtopicTitle: "Use standard form",
    origin: "model", model: "gpt-5-nano", reviewStatus: "pending", reviewed: false, reviewedBy: "", storedAt: "2026-09-14T09:00:00.000Z",
    payload: { question: String.raw`Calculate $(3.6 \times 10^{7}) \times (2.5 \times 10^{-4})$ and give your answer in standard form.`, hint: "Multiply the coefficients, then add the exponents.", working: [String.raw`Coefficients: $3.6 \times 2.5 = 9.0$`, "Exponents: $7 + (-4) = 3$"], answer: String.raw`$9.0 \times 10^{3}$` },
  },
  {
    topicId: "y10-maths-number", rowKey: "exam-0-Edexcel-Higher", type: "exam", subject: "Maths", year: 10,
    topicTitle: "Accuracy, Bounds and Standard Form", subtopicTitle: "Apply bounds",
    origin: "model", model: "gpt-5-nano", reviewStatus: "pending", reviewed: false, reviewedBy: "", storedAt: "2026-09-14T09:00:00.000Z",
    payload: { question: "A rectangle measures $12$ cm by $5$ cm, each to the nearest centimetre. Find the upper bound of the area.", marks: 3, markScheme: ["Upper bounds $12.5$ and $5.5$", String.raw`Multiplies $12.5 \times 5.5$`, "States $68.75$ cm$^2$"], answer: "$68.75$ cm$^2$" },
  },
];

let previewFlags = [
  {
    id: "preview-learner/flag-1", learnerId: "preview-learner", rowKey: "flag-1",
    email: "maya@example.com", studentName: "Maya Patel", year: 10, subject: "Science",
    topicId: "y10-science-cells", topicTitle: "Cells and Control", mode: "learn",
    verdict: "block", reason: "unsafe", severity: "high",
    message: "i keep thinking about hurting myself when i get these wrong",
    createdAt: "2026-09-15T18:42:00.000Z", status: "open", reviewedBy: "", reviewedAt: "", note: "",
    alerted: true, alertError: "",
    guardian: { name: "Sam Patel", relationship: "Parent", phone: "07700 900123" },
  },
  {
    id: "preview-learner/flag-2", learnerId: "preview-learner", rowKey: "flag-2",
    email: "maya@example.com", studentName: "Maya Patel", year: 10, subject: "English",
    topicId: "y10-english-writing", topicTitle: "Transactional Writing", mode: "practice",
    verdict: "redirect", reason: "integrity", severity: "low",
    message: "just write my essay for me please",
    createdAt: "2026-09-14T11:05:00.000Z", status: "open", reviewedBy: "", reviewedAt: "", note: "",
    alerted: false, alertError: "",
    guardian: { name: "Sam Patel", relationship: "Parent", phone: "07700 900123" },
  },
];

// Development-only year selection makes every curriculum year reviewable.
const requestedPreviewYear = Number(new URLSearchParams(window.location.search).get('year'));
const previewYear = appPreview && [7, 8, 9, 10, 11].includes(requestedPreviewYear) ? requestedPreviewYear : 7;
const previewProfile = {
  ownerEmail: "parent@example.com",
  firstName: "Alex",
  dateOfBirth: "2014-01-15",
  year: previewYear,
  examBoard: "AQA",
  examBoards: { Maths: "AQA", Science: "Edexcel" },
  tier: "Higher",
  subject: "Maths",
  topicId: "y7-maths-number",
};
const previewProgress = {
  attempts: [],
  lessons: [],
  mastery: [
    { id: "preview-1", year: 7, subject: "Maths", topicId: "y7-maths-number", topicTitle: "Integers and Place Value", attempts: 4, accuracy: 0.88, confidence: 4.2, totalTimeSeconds: 2700, masteryScore: 86, lastPractised: "2026-09-08T16:00:00.000Z", nextReviewAt: "2026-09-18T16:00:00.000Z" },
    { id: "preview-2", year: 7, subject: "Maths", topicId: "y7-maths-fractions", topicTitle: "Fractions, Decimals and Percentages", attempts: 2, accuracy: 0.64, confidence: 3, totalTimeSeconds: 1500, masteryScore: 63, lastPractised: "2026-09-07T16:00:00.000Z", nextReviewAt: "2026-09-14T16:00:00.000Z" },
    { id: "preview-3", year: 7, subject: "Maths", topicId: "y7-maths-algebra", topicTitle: "Expressions and Equations", attempts: 2, accuracy: 0.48, confidence: 2.5, totalTimeSeconds: 1200, masteryScore: 48, lastPractised: "2026-09-01T16:00:00.000Z", nextReviewAt: "2026-09-03T16:00:00.000Z" },
    { id: "preview-4", year: 7, subject: "Science", topicId: "y7-science-cells", topicTitle: "Cells and Organisation", attempts: 3, accuracy: 0.82, confidence: 4, totalTimeSeconds: 2100, masteryScore: 81, lastPractised: "2026-09-06T16:00:00.000Z", nextReviewAt: "2026-09-16T16:00:00.000Z" },
  ],
};
let previewUsers = [
  { id: "preview-parent", name: "Sam Patel", email: "parent@example.com", role: "parent", status: "active", createdAt: "2026-09-01T09:00:00.000Z", updatedAt: "2026-09-01T09:00:00.000Z" },
  { id: "preview-student", name: "Maya Patel", email: "maya@example.com", role: "student", status: "active", createdAt: "2026-09-02T09:00:00.000Z", updatedAt: "2026-09-02T09:00:00.000Z" },
  { id: "preview-teacher", name: "A. Teacher", email: "teacher@example.com", role: "teacher", status: "inactive", createdAt: "2026-09-03T09:00:00.000Z", updatedAt: "2026-09-03T09:00:00.000Z" },
];

function previewResponse(body, status = 200) {
  return new Response(status === 204 ? null : JSON.stringify(body), {
    status,
    headers: status === 204 ? {} : { "Content-Type": "application/json" },
  });
}

async function previewApiRequest(url, options = {}) {
  const { pathname } = new URL(url, window.location.origin);
  const method = options.method ?? "GET";
  if (pathname === "/api/progress" && method === "GET") return previewResponse(previewProgress);
  if (pathname.startsWith("/api/progress/review")) {
    return previewResponse({
      queue: [{
        key: "y7-maths-algebra/practice-0-core-core", topicId: "y7-maths-algebra", topicTitle: "Expressions and Equations",
        subject: "Maths", contentType: "practice", contentRowKey: "practice-0-core-core",
        accuracy: 0.33, lastSeen: "2026-09-10T16:00:00.000Z", overdue: true, masteryScore: 48,
      }],
      topicsDue: [{ topicId: "y7-maths-algebra", topicTitle: "Expressions and Equations", masteryScore: 48, nextReviewAt: "2026-09-03T16:00:00.000Z" }],
      totalDue: 1,
    });
  }
  if (pathname === "/api/progress" && method === "POST") {
    const input = JSON.parse(options.body);
    if (input.kind === "lesson") {
      const lesson = { year: input.year, subject: input.subject, topicId: input.topicId, index: input.index, completedAt: new Date().toISOString() };
      previewProgress.lessons = [lesson, ...previewProgress.lessons];
      return previewResponse({ lesson }, 201);
    }
    const mastery = { id: input.topicId, ...input, attempts: 1, masteryScore: Math.round(input.accuracy * 100), totalTimeSeconds: input.durationSeconds, lastPractised: new Date().toISOString(), nextReviewAt: new Date(Date.now() + 86400000).toISOString() };
    previewProgress.mastery = [mastery, ...previewProgress.mastery.filter((item) => item.topicId !== input.topicId)];
    return previewResponse({ mastery });
  }
  if (pathname.startsWith("/api/review")) {
    if (pathname.endsWith("/summary")) return previewResponse({ totals: { pending: 2, approved: 1, rejected: 0 }, byType: {} });
    if (method === "POST") return previewResponse({ ok: true });
    return previewResponse({ rows: previewReviewRows });
  }
  if (pathname.startsWith("/api/safeguarding")) {
    if (pathname.endsWith("/summary")) {
      const open = previewFlags.filter((flag) => flag.status === "open");
      return previewResponse({
        open: {
          high: open.filter((flag) => flag.severity === "high").length,
          medium: open.filter((flag) => flag.severity === "medium").length,
          low: open.filter((flag) => flag.severity === "low").length,
        },
        totals: { open: open.length, acknowledged: 0, escalated: 0, closed: previewFlags.length - open.length },
        learnersWithOpenFlags: new Set(open.map((flag) => flag.learnerId)).size,
      });
    }
    if (method === "POST") {
      const input = JSON.parse(options.body);
      previewFlags = previewFlags.map((flag) => flag.rowKey === input.rowKey
        ? { ...flag, status: input.status, note: input.note ?? "", reviewedBy: "Administrator preview", reviewedAt: new Date().toISOString() }
        : flag);
      return previewResponse({ flag: previewFlags.find((flag) => flag.rowKey === input.rowKey) });
    }
    if (pathname.endsWith("/learner")) return previewResponse({ rows: previewFlags });
    const wanted = new URL(url, window.location.origin).searchParams;
    const status = wanted.get("status") ?? "open";
    const severity = wanted.get("severity") ?? "";
    return previewResponse({
      rows: previewFlags.filter((flag) => (status === "all" || flag.status === status) && (!severity || flag.severity === severity)),
      cursor: "",
    });
  }
  if (pathname === "/api/content") {
    const input = JSON.parse(options.body);
    const guide = getTopicGuide(input.subject, input.topic, input.tier ?? 'Foundation');
    if (input.type === 'example' || !input.type) {
      const tier = input.topic.tiers?.length ? input.tier ?? 'Foundation' : null;
      const example = getAuthoredExample(input.subject, input.topic, input.subtopic?.index ?? 0, tier);
      if (!example) return previewResponse({error: 'No authored worked example is available for this sub-topic in the preview.'}, 404);
      return previewResponse({content: {...example,source:'catalogue'},route:'stored',generated:false});
    }
    const content = input.type === "explanation"
      ? selectExplanation({ explanation: guide.explanation, keyIdeas: guide.keyIdeas, formulae: guide.formulae, subtopics: guide.subtopics }, input.subtopic?.index, input.tier ?? 'Foundation')
      : { formulae: guide.formulae, question: guide.question, steps: guide.steps, answer: guide.answer };
    return previewResponse({ content: { ...content, source: "stored" }, route: "stored", generated: false });
  }
  if (pathname === "/api/tutor") {
    const input = JSON.parse(options.body);
    return previewResponse({ answer: formatTopicGuide(input.subject, input.topic, input.tier ?? 'Foundation') });
  }
  if (pathname === "/api/diagnostic") {
    const input = JSON.parse(options.body);
    return previewResponse({
      completedAt: new Date().toISOString(), year: input.year, subject: input.subject,
      evidenceCount: input.responses.length,
      gradePrediction: { status: "insufficient-evidence", minimumEvidence: 15 },
      results: input.responses.map((item, index) => ({ topicId: item.topicId, topic: item.topic, score: index % 3, classification: index % 3 === 0 ? "priority" : "developing", feedback: "Preview diagnostic feedback.", nextStep: item.outcome })),
    });
  }
  if (pathname === "/api/users" && method === "GET") return previewResponse({ users: previewUsers });
  if (pathname === "/api/users" && method === "POST") {
    const input = JSON.parse(options.body);
    const now = new Date().toISOString();
    const user = { id: `preview-${Date.now()}`, ...input, status: "active", createdAt: now, updatedAt: now };
    previewUsers = [user, ...previewUsers];
    return previewResponse({ user }, 201);
  }
  if (pathname.startsWith("/api/users/") && method === "PATCH") {
    const id = pathname.split("/").pop();
    const input = JSON.parse(options.body);
    previewUsers = previewUsers.map((user) => user.id === id ? { ...user, status: input.status, updatedAt: new Date().toISOString() } : user);
    return previewResponse({ user: previewUsers.find((user) => user.id === id) });
  }
  if (pathname.startsWith("/api/users/") && method === "DELETE") {
    const id = pathname.split("/").pop();
    previewUsers = previewUsers.filter((user) => user.id !== id);
    return previewResponse({}, 204);
  }
  return previewResponse({ error: "This action needs the connected Azure Functions API." }, 503);
}

function App() {
  const [authStatus, setAuthStatus] = useState(
    previewMode ? "signed-in" : (getAuthToken() || localSession) ? "checking" : "signed-out"
  );
  const [authError, setAuthError] = useState("");
  const [currentUser, setCurrentUser] = useState(
    previewMode
      ? { name: adminPreview ? "Administrator preview" : "Student preview", email: "parent@example.com", picture: "", isAdmin: adminPreview, accessRole: adminPreview ? "admin" : "student" }
      : null
  );
  const [learnerProfile, setLearnerProfile] = useState(appPreview ? previewProfile : null);
  const [diagnostic, setDiagnostic] = useState(null);
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [requestedView, setView] = useState(adminPreview ? "admin" : ["admin", "review", "safeguarding", "payments", "progress", "account", "support"].includes(window.location.hash.slice(1)) ? window.location.hash.slice(1) : "learning");
  // An administrator-only view requested by somebody who is not one falls back
  // to the learning hub rather than rendering an empty screen.
  const view = ["admin", "review", "safeguarding", "payments"].includes(requestedView) && !currentUser?.isAdmin
    ? "learning"
    : requestedView;
  const [subject, setSubject] = useState("Maths");
  const [unitFilter, setUnitFilter] = useState("All");
  const [selectedTopicId, setSelectedTopicId] = useState(curriculum[0].id);
  const [selectedSubtopicId, setSelectedSubtopicId] = useState("");
  const [explanationState, setExplanation] = useState({ status: "idle" });
  const [exampleState, setWorkedExample] = useState({ status: "idle" });
  // Sub-topic lessons finished, by sub-topic id ("topicId::index").
  const [lessonsDone, setLessonsDone] = useState(() => new Set());
  const [lessonSaveError, setLessonSaveError] = useState("");
  const exampleEnd = useRef(null);
  // The beat being read aloud in each section, so the line being spoken can
  // be marked. Two of them: the formulas play separately from the example.
  const [exampleBeat, setExampleBeat] = useState(null);
  const [formulaBeat, setFormulaBeat] = useState(null);
  const [bankItem, setBankItem] = useState({ status: "idle" });
  const [bankIndex, setBankIndex] = useState(0);
  const [marking, setMarking] = useState(false);
  const [markResult, setMarkResult] = useState(null);
  const [reviewQueue, setReviewQueue] = useState({ status: "idle", items: [], topicsDue: [], totalDue: 0 });
  const [reviewPosition, setReviewPosition] = useState(0);
  const exampleTicket = useRef(0);
  const bankTicket = useRef(0);
  const explanationTicket = useRef(0);
  // Engagement for the topic currently open, flushed when the learner moves on.
  const activity = useRef({ startedAt: Date.now(), questionsAsked: 0, examplesOpened: 0, topicId: null, topicTitle: "", subject: "" });
  const [prompt, setPrompt] = useState("");
  // The tutor is a chat the learner opens, not a panel competing with the
  // lesson for space. It appears once they ask for it, below the explanation.
  const [tutorOpen, setTutorOpen] = useState(false);
  const tutorPanelRef = useRef(null);
  const tutorInputRef = useRef(null);
  // The narrated lesson is opened on request rather than shown by default:
  // a learner who only wants to read should not meet a player first.

  const [playerOpen, setPlayerOpen] = useState(false);
  // Bumped whenever an answer is recorded, so the daily goal reflects it at once
  // rather than at the next page load - the whole point of a target is watching
  // it move.
  const [habitKey, setHabitKey] = useState(0);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Choose a subject and topic from your year-group learning path. Ask for an explanation, a quiz question, a worked example, or GCSE-style feedback.",
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [learningMode, setLearningMode] = useState("learn");
  const [activityStartedAt, setActivityStartedAt] = useState(Date.now());
  const [examSeconds, setExamSeconds] = useState(0);
  const [examRunning, setExamRunning] = useState(false);
  const [attemptOpen, setAttemptOpen] = useState(false);
  const [savingAttempt, setSavingAttempt] = useState(false);
  const [attemptMessage, setAttemptMessage] = useState("");

  function openTutor() {
    setTutorOpen(true);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        tutorPanelRef.current?.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start",
        });
        tutorInputRef.current?.focus({ preventScroll: true });
      });
    });
  }
  const [mastery, setMastery] = useState([]);
  const [subscription, setSubscription] = useState(subscriptionPreview ? null : previewMode ? { plan: "admin", status: "active", onboardingComplete: appPreview } : null);
  const [billingChecked, setBillingChecked] = useState(Boolean(previewMode));
  const [legalSection, setLegalSection] = useState(null);
  const checkoutState = new URLSearchParams(window.location.search).get("checkout");
  const appRequest = appPreview ? previewApiRequest : authFetch;

  const learnerYear = Number(learnerProfile?.year ?? 7);
  const stage = learnerYear <= 9 ? "KS3" : "KS4";

  const baseVisibleTopics = useMemo(
    () => topicsFor({
      year: learnerYear,
      subject,
      examBoard: boardFor(learnerProfile, subject),
      tier: learnerProfile?.tier,
    }),
    [learnerProfile, learnerYear, subject]
  );

  const activeDiagnostic =
    diagnostic?.year === learnerYear && diagnostic?.subject === subject ? diagnostic : null;

  const visibleTopics = useMemo(
    () => personaliseTopics(baseVisibleTopics, activeDiagnostic),
    [activeDiagnostic, baseVisibleTopics]
  );

  const evidenceByTopic = useMemo(
    () => new Map((activeDiagnostic?.results ?? []).map((item) => [item.topicId, item])),
    [activeDiagnostic]
  );


  const availableUnits = useMemo(
    () => ["All", ...new Set(visibleTopics.map((topic) => topic.unit))],
    [visibleTopics]
  );

  const displayedTopics = useMemo(
    () => unitFilter === "All" ? visibleTopics : visibleTopics.filter((topic) => topic.unit === unitFilter),
    [unitFilter, visibleTopics]
  );

  const selectedTopic =
    displayedTopics.find((topic) => topic.id === selectedTopicId) ?? displayedTopics[0];
  const selectedEvidence = selectedTopic ? evidenceByTopic.get(selectedTopic.id) : null;
  const selectedMastery = selectedTopic ? mastery.find((item) => item.topicId === selectedTopic.id) : null;
  const trial = trialFor(currentUser?.isAdmin, subscription);
  const freeTopic = trial ? topicById(subscription?.freeTopicId) : null;
  // Every topic is listed in a trial, so the learner can see what the plan
  // covers. One that is not their free topic is shown as an offer instead of a
  // lesson, and nothing is requested for it.
  const selectedLocked = trial && Boolean(selectedTopic) && selectedTopic.id !== freeTopic?.id;
  const [freeTopicState, setFreeTopicState] = useState({ busy: false, error: "" });
  const topicOptionGroups = useMemo(() => {
    const groups = new Map();
    for (const topic of displayedTopics) {
      if (!groups.has(topic.unit)) groups.set(topic.unit, []);
      groups.get(topic.unit).push(topic);
    }
    return [...groups];
  }, [displayedTopics]);

  const subtopics = useMemo(() => subtopicsFor(selectedTopic), [selectedTopic]);
  const selectedSubtopic =
    subtopics.find((subtopic) => subtopic.id === selectedSubtopicId) ?? subtopics[0];
  // Hide the old selection immediately, before the fetching effects run.
  // Request tickets also prevent a slower previous request from winning.
  const explanation = explanationState.selection === selectedSubtopic?.id
    ? explanationState : { status: 'loading' };
  const workedExample = exampleState.selection === selectedSubtopic?.id
    ? exampleState : { status: 'loading' };

  // Memoised: a fresh array on every render would look like a new sequence
  // to the player and stop the audio each time anything else on the page
  // changed.
  const workedExampleBeats = useMemo(
    () => (workedExample.status === "ready" && workedExample.question
      ? exampleBeats(workedExample, selectedSubtopic?.title ?? selectedTopic?.title ?? "")
      : []),
    [workedExample, selectedSubtopic, selectedTopic]
  );
  const keyFormulaBeats = useMemo(
    () => formulaBeats(explanation.formulae),
    [explanation.formulae]
  );
  // Only Maths content is typeset, and only when the stored row was written for it.
  // Maths always typesets; every other subject typesets whatever carries LaTeX,
  // which is most of the science, computing, geography and DT formulae.
  const maths = subject === "Maths";
  const typeset = (text) => maths || hasMaths(text);

  useEffect(() => {
    // A voice carrying on about the previous topic is worse than no voice.
    // Both halves are needed: stopPlayback() stops whichever player holds the
    // floor, including a recorded clip in its own audio element, and
    // stopSpeaking() catches any device utterance no player owns.
    stopPlayback();
    stopSpeaking();
    setPlayerOpen(false);
    setFormulaBeat(null);
    setExampleBeat(null);
  }, [selectedTopicId, selectedSubtopic?.id, learningMode, subject, view]);

  const checkSession = useCallback(async () => {
    setAuthStatus("checking");
    setAuthError("");
    try {
      const response = await authFetch("/api/session");
      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        throw new Error("The authentication API is not connected in this local session.");
      }
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.error ?? "Sign-in could not be verified.");
      setCurrentUser({ ...data.user, isAdmin: data.isAdmin, accessRole: data.accessRole });
      setView(data.isAdmin ? "admin" : "learning");
      let billingSubscription = null;
      if (data.hasAccess) {
        const billingResponse = await authFetch("/api/billing/status");
        const billingData = await readJson(billingResponse);
        if (!billingResponse.ok) throw new Error(billingData.error ?? "Subscription status could not be loaded.");
        billingSubscription = billingData.subscription;
        setSubscription(billingSubscription);
        setBillingChecked(true);

        // A free trial is set up before it pays, so the profile is loaded for
        // any account that has finished setup, not only a paid one.
        if (!data.isAdmin && billingSubscription?.onboardingComplete) {
          const profileResponse = await authFetch("/api/profile");
          const profileData = await readJson(profileResponse);
          if (!profileResponse.ok || !profileData.profile) throw new Error(profileData.error ?? "The registered learner profile could not be loaded.");
          const existingProfile = loadLearnerProfile(data.user.email);
          const registered = profileData.profile;
          const initialTopics = topicsFor({
            year: registered.year,
            subject: existingProfile?.subject ?? "Maths",
            examBoard: boardFor(registered, existingProfile?.subject ?? "Maths"),
            tier: registered.tier,
          });
          saveLearnerProfile(data.user.email, {
            firstName: registered.studentFirstName,
            dateOfBirth: registered.dateOfBirth,
            year: registered.year,
            examBoard: registered.examBoard,
            examBoards: registered.examBoards ?? {},
            tier: registered.tier,
            subject: existingProfile?.subject ?? "Maths",
            topicId: existingProfile?.topicId ?? initialTopics[0]?.id ?? "",
            yearLocked: true,
          });
        }
      }
      const storedProfile = loadLearnerProfile(data.user.email);
      setLearnerProfile(storedProfile);
      if (storedProfile) {
        // A trial opens on its free topic, which may be in another subject from
        // the one last studied.
        const freeTopic = trialFor(data.isAdmin, billingSubscription) ? topicById(billingSubscription?.freeTopicId) : null;
        const storedSubject = freeTopic?.subject ?? storedProfile.subject ?? "Maths";
        setSubject(storedSubject);
        setSelectedTopicId(freeTopic?.id ?? storedProfile.topicId);
        const storedDiagnostic = loadDiagnostic(data.user.email, storedProfile.year, storedSubject);
        setDiagnostic(storedDiagnostic);
        // The placement check spans the whole year, so it is part of the paid plan.
        setShowDiagnostic(!storedDiagnostic && !trialFor(data.isAdmin, billingSubscription));
      }
      setAuthStatus(data.hasAccess ? "signed-in" : "pending");
    } catch (error) {
      clearAuthToken();
      setCurrentUser(null);
      setAuthError(error.message === "Log in to continue." ? "" : error.message);
      setAuthStatus("signed-out");
    }
  }, []);

  useEffect(() => {
    if (!previewMode) checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (!examRunning) return undefined;
    const timer = window.setInterval(() => setExamSeconds((seconds) => seconds + 1), 1000);
    return () => window.clearInterval(timer);
  }, [examRunning]);

  useEffect(() => {
    if (!learnerProfile || previewMode) return;
    appRequest(`/api/progress?year=${learnerYear}`)
      .then(async (response) => response.ok ? readJson(response) : Promise.reject())
      .then((data) => {
        setMastery(data.mastery ?? []);
        setLessonsDone(new Set((data.lessons ?? []).map((lesson) => `${lesson.topicId}::${lesson.index}`)));
      })
      .catch(() => {});
  }, [learnerProfile, learnerYear]);

  const handleGoogleCredential = useCallback(async (credential) => {
    setAuthToken(credential);
    await checkSession();
  }, [checkSession]);

  async function signOut() {
    await authFetch("/api/auth/logout", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    window.google?.accounts?.id?.disableAutoSelect();
    clearAuthToken();
    setCurrentUser(null);
    setLearnerProfile(null);
    setDiagnostic(null);
    setShowDiagnostic(false);
    setAuthError("");
    setAuthStatus("signed-out");
    setMastery([]);
    setSubscription(null);
    setBillingChecked(false);
  }

  function chooseSubject(nextSubject) {
    const nextTopic = topicsFor({
      year: learnerYear,
      subject: nextSubject,
      examBoard: boardFor(learnerProfile, nextSubject),
      tier: learnerProfile?.tier,
    })[0];
    setSubject(nextSubject);
    setDiagnostic(loadDiagnostic(currentUser.email, learnerYear, nextSubject));
    setUnitFilter("All");
    setSelectedTopicId(nextTopic?.id);
    setActivityStartedAt(Date.now());
    setAttemptOpen(false);
  }

  function chooseTopic(topicId) {
    setSelectedTopicId(topicId);
    setSelectedSubtopicId("");
    setBankIndex(0);
    setMarkResult(null);
    setActivityStartedAt(Date.now());
    setAttemptOpen(false);
    setAttemptMessage("");
    setExamRunning(false);
    setExamSeconds(0);
  }

  // Spends the trial's one free topic, so it asks first. The API keeps the
  // first choice whatever happens, and says which topic that was.
  async function chooseFreeTopic(topic) {
    if (!topic || freeTopicState.busy) return;
    if (!window.confirm(`Make "${topic.title}" your free topic? You cannot change it later.`)) return;
    setFreeTopicState({ busy: true, error: "" });
    try {
      const response = await appRequest("/api/billing/free-topic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicId: topic.id }),
      });
      const data = await readJson(response);
      if (data.freeTopicId) setSubscription((current) => ({ ...current, freeTopicId: data.freeTopicId }));
      if (!response.ok) throw new Error(data.error ?? "The free topic could not be saved. Please try again.");
      setFreeTopicState({ busy: false, error: "" });
    } catch (failure) {
      setFreeTopicState({ busy: false, error: failure.message });
    }
  }

  function openFreeTopic() {
    if (!freeTopic) return;
    if (freeTopic.subject !== subject) chooseSubject(freeTopic.subject);
    setUnitFilter("All");
    chooseTopic(freeTopic.id);
  }

  function storeProfile(profile) {
    const profileToStore = learnerProfile?.yearLocked
      ? { ...profile, year: learnerProfile.year, yearLocked: true }
      : profile;
    const stored = saveLearnerProfile(currentUser.email, profileToStore);
    const nextSubject = stored.subject ?? subject;
    const availableTopics = topicsFor({
      year: stored.year,
      subject: nextSubject,
      examBoard: boardFor(stored, nextSubject),
      tier: stored.tier,
    });
    const nextTopic = availableTopics.find((item) => item.id === stored.topicId) ?? availableTopics[0];
    setLearnerProfile(stored);
    setSubject(nextSubject);
    setUnitFilter("All");
    setSelectedTopicId(nextTopic?.id);
    const storedDiagnostic = loadDiagnostic(currentUser.email, stored.year, nextSubject);
    setDiagnostic(storedDiagnostic);
    setShowDiagnostic(!storedDiagnostic && !trial);
  }

  function completeDiagnostic(result) {
    const stored = saveDiagnostic(currentUser.email, result);
    const ordered = personaliseTopics(baseVisibleTopics, stored);
    setDiagnostic(stored);
    setSelectedTopicId(ordered[0]?.id);
    setUnitFilter("All");
    setShowDiagnostic(false);
  }

  function chooseView(nextView) {
    if (["admin", "review", "safeguarding", "payments"].includes(nextView) && !currentUser?.isAdmin) return;
    setView(nextView);
    window.location.hash = nextView === "learning" ? "" : nextView;
  }

  function openTrackedTopic(topic) {
    setSubject(topic.subject);
    setSelectedTopicId(topic.id);
    setUnitFilter("All");
    setActivityStartedAt(Date.now());
    setAttemptOpen(false);
    chooseView("learning");
  }

  function chooseMode(nextMode) {
    setLearningMode(nextMode);
    setBankIndex(0);
    setMarkResult(null);
    setReviewPosition(0);
    setActivityStartedAt(Date.now());
    setExamRunning(false);
    setExamSeconds(0);
    setAttemptOpen(false);
    setAttemptMessage("");
    setMessages([{ role: "assistant", text: `${learningModes[nextMode].label} mode is ready for ${selectedTopic?.title ?? "this topic"}.` }]);
    if (nextMode === "review") {
      const now = Date.now();
      const reviewTopic = [...mastery]
        .filter((item) => item.subject === subject)
        .sort((left, right) => {
          const leftDue = new Date(left.nextReviewAt).getTime() <= now ? 0 : 1;
          const rightDue = new Date(right.nextReviewAt).getTime() <= now ? 0 : 1;
          return leftDue - rightDue || left.masteryScore - right.masteryScore;
        })[0];
      if (reviewTopic && visibleTopics.some((topic) => topic.id === reviewTopic.topicId)) setSelectedTopicId(reviewTopic.topicId);
    }
  }

  // Curriculum content is routed by the API: explanations always come from storage,
  // worked examples come from storage and fall back to the model only on a miss.
  const requestContent = useCallback(async (type, topic, subtopic, refresh, index = 0) => {
    const response = await appRequest("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        year: learnerYear,
        examBoard: boardFor(learnerProfile, subject),
        tier: learnerProfile?.tier,
        subject,
        topic,
        subtopic,
        refresh,
        index,
      }),
    });
    const data = await readJson(response);
    if (!response.ok) {
      const failure = new Error(data.error ?? "That part of the lesson could not be loaded right now.");
      failure.noWorkedExample = data.noWorkedExample === true;
      throw failure;
    }
    return data;
  }, [appRequest, learnerProfile, learnerYear, subject]);

  const loadExplanation = useCallback(async (topic, subtopic) => {
    if (!topic || !subtopic) return;
    const ticket = explanationTicket.current + 1;
    explanationTicket.current = ticket;
    setExplanation({ status: "loading", selection: subtopic.id });
    try {
      const data = await requestContent("explanation", topic, subtopic, false);
      if (explanationTicket.current === ticket) setExplanation({ ...data.content, status: "ready", selection: subtopic.id });
    } catch (failure) {
      if (explanationTicket.current === ticket) setExplanation({ status: "error", error: failure.message, selection: subtopic.id });
    }
  }, [requestContent]);

  // Practice and exam questions come from the stored bank, and fall back to the
  // model only for a topic, board, and tier the bank has not reached yet.
  const loadBankItem = useCallback(async (type, topic, index) => {
    if (!topic) return;
    const ticket = bankTicket.current + 1;
    bankTicket.current = ticket;
    setBankItem({ status: "loading" });
    setMarkResult(null);
    try {
      const data = await requestContent(type, topic, null, false, index);
      if (bankTicket.current === ticket) setBankItem({ status: "ready", ...data.content });
    } catch (failure) {
      if (bankTicket.current === ticket) setBankItem({ status: "error", error: failure.message });
    }
  }, [requestContent]);

  useEffect(() => {
    if (view !== "learning" || !learnerProfile || !selectedTopic || selectedLocked) return;
    if (learningMode !== "practice" && learningMode !== "exam") return;
    loadBankItem(learningMode, selectedTopic, bankIndex);
  }, [bankIndex, learnerProfile, learningMode, loadBankItem, selectedLocked, selectedTopic, view]);

  const loadReviewQueue = useCallback(async () => {
    setReviewQueue((current) => ({ ...current, status: "loading" }));
    try {
      const response = await appRequest(`/api/progress/review?year=${learnerYear}&subject=${encodeURIComponent(subject)}`);
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.error ?? "The review queue could not be loaded.");
      setReviewQueue({ status: "ready", items: data.queue ?? [], topicsDue: data.topicsDue ?? [], totalDue: data.totalDue ?? 0 });
      setReviewPosition(0);
    } catch (failure) {
      setReviewQueue({ status: "error", items: [], topicsDue: [], totalDue: 0, error: failure.message });
    }
  }, [appRequest, learnerYear, subject]);

  useEffect(() => {
    if (view !== "learning" || !learnerProfile || learningMode !== "review") return;
    loadReviewQueue();
  }, [learnerProfile, learningMode, loadReviewQueue, view]);

  // Each queue entry names an exact stored question, so it is fetched by key
  // rather than regenerated.
  const reviewItem = reviewQueue.items[reviewPosition] ?? null;
  const loadReviewQuestion = useCallback(async (entry) => {
    if (!entry) return;
    const ticket = bankTicket.current + 1;
    bankTicket.current = ticket;
    setBankItem({ status: "loading" });
    setMarkResult(null);
    try {
      const response = await appRequest("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: entry.contentType,
          year: learnerYear,
          examBoard: boardFor(learnerProfile, subject),
          tier: learnerProfile?.tier,
          subject,
          topic: { id: entry.topicId, title: entry.topicTitle, unit: "Review", outcomes: [] },
          rowKey: entry.contentRowKey,
        }),
      });
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.error ?? "That question could not be loaded again.");
      if (bankTicket.current === ticket) setBankItem({ status: "ready", ...data.content });
    } catch (failure) {
      if (bankTicket.current === ticket) setBankItem({ status: "error", error: failure.message });
    }
  }, [appRequest, learnerProfile, learnerYear, subject]);

  useEffect(() => {
    if (learningMode !== "review") return;
    loadReviewQuestion(reviewItem);
  }, [learningMode, loadReviewQuestion, reviewItem]);

  // Shown straight away, and taken back if it could not be saved, so the tick
  // never claims a lesson the server does not have.
  const markLessonDone = useCallback((subtopic) => {
    if (!subtopic || lessonsDone.has(subtopic.id)) return;
    const forget = () => {
      setLessonsDone((done) => {
        const next = new Set(done);
        next.delete(subtopic.id);
        return next;
      });
      setLessonSaveError("That could not be saved just now. Please try again.");
    };
    setLessonSaveError("");
    setLessonsDone((done) => new Set(done).add(subtopic.id));
    appRequest("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "lesson", year: learnerYear, subject, topicId: subtopic.topicId, index: subtopic.index }),
    }).then((response) => { if (!response.ok) forget(); }).catch(forget);
  }, [appRequest, learnerYear, lessonsDone, subject]);

  // A failed save belongs to the sub-topic it was for.
  useEffect(() => setLessonSaveError(""), [selectedSubtopic?.id]);

  const topicAnswers = useCallback((topicId) => {
    const item = mastery.find((entry) => entry.topicId === topicId);
    return { practice: item?.practiceAnswered ?? 0, exam: item?.examAnswered ?? 0 };
  }, [mastery]);

  // Reading to the end counts as finishing the lesson: the end of the worked
  // example has to stay on screen for a while, so scrolling past it does not.
  useEffect(() => {
    const end = exampleEnd.current;
    if (!end || workedExample.status !== "ready" || !selectedSubtopic || lessonsDone.has(selectedSubtopic.id)) return undefined;
    if (typeof IntersectionObserver === "undefined") return undefined;
    let timer = null;
    const observer = new IntersectionObserver(([entry]) => {
      window.clearTimeout(timer);
      if (entry.isIntersecting) timer = window.setTimeout(() => markLessonDone(selectedSubtopic), exampleReadSeconds * 1000);
    });
    observer.observe(end);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [lessonsDone, markLessonDone, selectedSubtopic, workedExample.status]);

  const loadWorkedExample = useCallback(async (topic, subtopic, { refresh = false } = {}) => {
    if (!topic || !subtopic) return;
    const ticket = exampleTicket.current + 1;
    exampleTicket.current = ticket;
    // Outcomes with no method to work through have no example at all, so the
    // section is left out rather than asked for and shown as a failure. The
    // server applies the same list; its answer is honoured too, in case the
    // two ever disagree.
    if (!warrantsWorkedExample(topic.id, subtopic.index)) {
      setWorkedExample({ status: "none", selection: subtopic.id });
      return;
    }
    setWorkedExample({ status: "loading", selection: subtopic.id });
    activity.current.examplesOpened += 1;
    try {
      const data = await requestContent("example", topic, subtopic, refresh);
      if (exampleTicket.current === ticket) setWorkedExample({ ...data.content, status: "ready", selection: subtopic.id });
    } catch (failure) {
      if (exampleTicket.current !== ticket) return;
      setWorkedExample({ ...(failure.noWorkedExample ? { status: "none" } : { status: "error", error: failure.message }), selection: subtopic.id });
    }
  }, [requestContent]);

  useEffect(() => {
    if (view !== "learning" || !learnerProfile || !selectedTopic || selectedLocked) return;
    loadExplanation(selectedTopic, selectedSubtopic);
  }, [learnerProfile, loadExplanation, selectedLocked, selectedTopic, selectedSubtopic, view]);

  useEffect(() => {
    if (view !== "learning" || !learnerProfile || !selectedTopic || !selectedSubtopic || selectedLocked) return;
    loadWorkedExample(selectedTopic, selectedSubtopic);
  }, [learnerProfile, loadWorkedExample, selectedLocked, selectedSubtopic, selectedTopic, view]);

  // Time on task and engagement are recorded for every mode. They never carry
  // accuracy, so they cannot move a mastery score.
  const flushActivity = useCallback(() => {
    const current = activity.current;
    const durationSeconds = Math.round((Date.now() - current.startedAt) / 1000);
    // A glance at a topic is not study, and should not become a record.
    if (!current.topicId || durationSeconds < 20) return;
    appRequest("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "activity",
        year: learnerYear,
        subject: current.subject,
        topicId: current.topicId,
        topicTitle: current.topicTitle,
        mode: learningMode,
        durationSeconds,
        questionsAsked: current.questionsAsked,
        examplesOpened: current.examplesOpened,
      }),
    }).catch(() => {
      // Losing an engagement record must never interrupt the lesson.
    });
  }, [appRequest, learnerYear, learningMode]);

  useEffect(() => {
    // Looking at a locked topic's offer is not study, so it is not recorded.
    if (view !== "learning" || !learnerProfile || !selectedTopic || selectedLocked) return undefined;
    activity.current = {
      startedAt: Date.now(), questionsAsked: 0, examplesOpened: 0,
      topicId: selectedTopic.id, topicTitle: selectedTopic.title, subject,
    };
    return () => flushActivity();
  }, [flushActivity, learnerProfile, selectedLocked, selectedTopic, subject, view]);

  // A submitted answer is marked by the tutor against the stored question, which
  // is also what triggers the automatic progress record.
  async function submitBankAnswer(learnerAnswer, learnerWorking = "") {
    if (bankItem.status !== "ready" || marking) return;
    setMarking(true);
    setMarkResult(null);
    try {
      const questionContext = bankItem.marks
        ? `${bankItem.question} (${bankItem.marks} marks)`
        : bankItem.question;
      const response = await appRequest("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage,
          year: learnerYear,
          examBoard: boardFor(learnerProfile, subject),
          tier: learnerProfile?.tier,
          subject,
          topic: selectedTopic,
          mode: learningMode,
          mastery: selectedMastery,
          // Framed explicitly as marking. With only the question in the history the
          // model often treated the reply as a new request and skipped the mark line.
          // The working goes to the marker as well as the answer. A method with
          // one slip earns most of the marks in a real paper, and a marker that
          // only sees the final line cannot award them.
          question: `Here is my answer to the question you set.

Question: ${questionContext}
${learnerWorking ? `
My working:
${learnerWorking}
` : ""}
My answer: ${learnerAnswer}

Mark my answer.`,
          contentType: bankItem.marks ? "exam" : "practice",
          contentRowKey: bankItem.rowKey ?? "",
          history: [
            { role: "user", text: `Give me a ${learningMode} question on ${selectedTopic.title}.` },
            { role: "assistant", text: questionContext },
          ],
          topicTitles: visibleTopics.map((item) => item.title),
          durationSeconds: Math.max(1, Math.round((Date.now() - activityStartedAt) / 1000)),
        }),
      });
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.error ?? "That answer could not be marked right now.");
      setMarkResult({ feedback: data.answer, mark: data.recorded?.mark ?? null });
      if (data.recorded?.mastery) {
        const updated = data.recorded.mastery;
        setMastery((items) => [updated, ...items.filter((item) => item.topicId !== updated.topicId)]);
        setHabitKey((key) => key + 1);
      }
      setExamRunning(false);
    } catch (failure) {
      setMarkResult({ feedback: failure.message, mark: null });
    } finally {
      setMarking(false);
    }
  }

  async function sendTutorPrompt(rawPrompt) {
    const studentPrompt = rawPrompt.trim();
    if (!studentPrompt || isThinking) return;

    const nextMessages = [...messages, { role: "user", text: studentPrompt }];
    setMessages(nextMessages);
    setPrompt("");
    setIsThinking(true);
    activity.current.questionsAsked += 1;

    try {
      const response = await appRequest("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage,
          year: learnerYear,
          examBoard: boardFor(learnerProfile, subject),
          tier: learnerProfile.tier,
          subject,
          topic: selectedTopic,
          mode: learningMode,
          mastery: selectedMastery,
          question: studentPrompt,
          history: nextMessages.slice(-6),
          durationSeconds: Math.max(1, Math.round((Date.now() - activityStartedAt) / 1000)),
          // Lets the guard tell "another topic in this subject" apart from "not curriculum at all".
          topicTitles: visibleTopics.map((item) => item.title),
        }),
      });

      const data = await readJson(response);
      if (!response.ok) {
        const refusal = new Error(data.error ?? "The tutor could not answer right now.");
        // A limit or a locked topic is an answer the learner should read, not a
        // connection fault.
        refusal.fromServer = Boolean(data.error) && [403, 429].includes(response.status);
        throw refusal;
      }

      setMessages((items) => [...items, { role: "assistant", text: data.answer, source: data.source, guard: data.guard }]);
      // The tutor marked the answer and the server recorded it, so mastery is refreshed here.
      if (data.recorded?.mastery) {
        const updated = data.recorded.mastery;
        setMastery((items) => [updated, ...items.filter((item) => item.topicId !== updated.topicId)]);
        setAttemptMessage(`Progress recorded automatically: ${data.recorded.mark.earned}/${data.recorded.mark.available}`);
        setActivityStartedAt(Date.now());
        setHabitKey((key) => key + 1);
      }
    } catch (failure) {
      setMessages((items) => [
        ...items,
        {
          role: "assistant",
          text: failure.fromServer
            ? failure.message
            : "Sonia could not be reached yet. Check the backend environment variables and your sign-in, then try again.",
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  }

  function askTutor(event) {
    event.preventDefault();
    sendTutorPrompt(prompt);
  }

  function startActivity() {
    setTutorOpen(true);
    setActivityStartedAt(Date.now());
    setAttemptMessage("");
    if (learningMode === "exam") {
      setExamSeconds(0);
      setExamRunning(true);
    }
    sendTutorPrompt(learningModes[learningMode].prompt);
  }

  function startExamTimer() {
    setExamRunning(true);
  }

  function resetExamTimer() {
    if (!window.confirm("Are you sure you want to reset the timer? Your elapsed time will return to 00:00.")) return;
    setExamRunning(false);
    setExamSeconds(0);
  }

  async function saveAttempt(details) {
    setSavingAttempt(true);
    setAttemptMessage("");
    try {
      const response = await appRequest("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...details, year: learnerYear, subject, mode: learningMode }),
      });
      const data = await readJson(response);
      if (!response.ok) throw new Error(data.error ?? "Progress could not be saved.");
      setMastery((items) => [data.mastery, ...items.filter((item) => item.topicId !== data.mastery.topicId)]);
      setAttemptMessage("Progress saved");
      setAttemptOpen(false);
      setActivityStartedAt(Date.now());
      setExamRunning(false);
    } catch (error) {
      setAttemptMessage(error.message);
    } finally {
      setSavingAttempt(false);
    }
  }

  // Stripe returns the customer before its webhook necessarily has, so the
  // post-checkout screen polls this rather than assuming the paywall is right.
  const recheckBilling = useCallback(async () => {
    const response = await authFetch("/api/billing/status");
    const data = await readJson(response);
    if (response.ok && data.subscription) setSubscription(data.subscription);
    return data.subscription?.status === "active";
  }, []);

  // Learner setup is a one-time step, and the whole app reads from the profile
  // it just created. Reloading is the honest way to pick that up everywhere at
  // once, and it clears the ?checkout= parameter from the address bar.
  function completeOnboarding() {
    window.location.assign("/");
  }

  async function beginCheckout() {
    const response = await authFetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await readJson(response);
    if (!response.ok) throw new Error(data.error ?? "Secure checkout could not be opened.");
    // The payment form is mounted in the page now, so the session's client
    // secret is handed back rather than a URL to redirect to.
    return data.client_secret;
  }

  function finishAccountDeletion() {
    localStorage.removeItem("education-hub-learner-profile");
    localStorage.removeItem("education-hub-diagnostics");
    signOut();
  }

  if (signupToken || signupPreview) {
    return <SubscriberSignup preview={signupPreview} token={signupToken} />;
  }

  if (verifyToken) {
    return <EmailVerification token={verifyToken} />;
  }

  if (resetToken || resetPreview) {
    return <PasswordReset token={resetToken} />;
  }

  if (authStatus === "signed-out" && checkoutState === "success") {
    return <main className="password-login"><div className="login-box">
      <div className="password-brand"><BrandLogo /></div>
      <h1>Payment received</h1>
      <p>Check your email. We have sent a link to set your password, and it works for seven days.</p>
      <p className="login-no-account">The link takes you to sign in once your password is set, and we then ask for the learner's details.</p>
      {/* No sign-in button here: there is no password yet, so signing in can
          only fail. What can go wrong at this point is the email not arriving. */}
      <button type="button" className="login-link" onClick={() => window.location.assign("/?forgot=1")}>Didn't get the email? Send another link</button>
    </div></main>;
  }

  if (authStatus === "signed-out" && registerHandoff?.email && registerHandoff?.username) {
    return (
      <SignupHandoff
        email={registerHandoff.email}
        username={registerHandoff.username}
      />
    );
  }

  if (authStatus === "signed-out" || authStatus === "checking") {
    return (
      <LoginScreen
        checking={authStatus === "checking"}
        error={authError}
        onAuthenticated={checkSession}
      />
    );
  }

  if (authStatus === "pending") {
    return (
      <main className="pending-page">
        <div className="pending-panel">
          <div className="pending-icon"><ShieldCheck size={28} /></div>
          <p className="eyebrow">Account recognised</p>
          <h1>Access is awaiting approval</h1>
          <p>Ask a Y7to11.AI administrator to add <strong>{currentUser?.email}</strong> to the user dashboard.</p>
          <button onClick={signOut} type="button"><LogOut size={18} /> Sign out</button>
        </div>
      </main>
    );
  }

  const subscriptionActive = subscription?.status === "active";
  const setupIncomplete = !currentUser?.isAdmin && !subscription?.onboardingComplete;

  // Back from Stripe before its webhook: wait for the payment rather than show
  // a free trial to somebody who has just paid.
  if (authStatus === "signed-in" && billingChecked && !subscriptionActive && checkoutState === "success") {
    return <CheckoutConfirming email={currentUser.email} onRecheck={recheckBilling} onSignOut={signOut} />;
  }
  // Learner setup happens here, in the app, before anything else - paid or
  // not, because a free trial chooses its topic from the learner's year. It
  // used to be an emailed one-time link, which added a 48-hour deadline and a
  // spam filter between a parent and the thing they had signed up for.
  if (authStatus === "signed-in" && billingChecked && setupIncomplete) {
    return <SubscriberSignup account={currentUser} onComplete={completeOnboarding} />;
  }
  // A trial reaches the subscription page when it asks to, and can go back.
  if (authStatus === "signed-in" && billingChecked && trial && (view === "subscribe" || checkoutState === "cancelled")) {
    return <>
      <SubscriptionPage
        checkoutState={checkoutState}
        currentUser={currentUser}
        freeTopic={freeTopic}
        onBack={() => {
          // Clears ?checkout= as well, so going back does not land here again.
          window.history.replaceState(null, "", "/");
          chooseView("learning");
        }}
        onCheckout={beginCheckout}
        onPrivacy={setLegalSection}
        onSignOut={signOut}
      />
      {legalSection && <LegalNotice onClose={() => setLegalSection(null)} section={legalSection} />}
    </>;
  }

  if (currentUser?.isAdmin && view === "admin") {
    return <main>
      <header className="admin-session-header">
        <strong className="admin-brand"><BrandLogo height={32} /><span>Administration</span></strong>
        <span>{currentUser.name}</span>
        <button onClick={() => chooseView("learning")} type="button"><BookOpen size={18} /> Learning hub</button>
        <button onClick={signOut} type="button"><LogOut size={18} /> Log out</button>
      </header>
      <AdminDashboard request={appRequest} />
    </main>;
  }

  // The learner profile is established during paid signup, so this wizard is only
  // ever the first-run path. It is deliberately not reachable from the sidebar.
  if (!learnerProfile) {
    return (
      <LearnerProfileSetup
        initialProfile={learnerProfile}
        onSave={storeProfile}
        yearLocked={learnerProfile?.yearLocked}
      />
    );
  }

  if (showDiagnostic) {
    return (
        <DiagnosticAssessment
        learner={{ ...learnerProfile, subject }}
        onCancel={() => setShowDiagnostic(false)}
        onComplete={completeDiagnostic}
        request={appRequest}
      />
    );
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div>
            <h1><BrandLogo height={38} /></h1>
            <p>Years 7 to 11 · KS3 to GCSE</p>
          </div>
        </div>

        {view === "learning" && <div className="year-context">
          <div>
            <span className="label">Learning path</span>
            <strong>Year {learnerYear}</strong>
            <small>{stage === "KS3" ? (learnerProfile.examBoards?.[subject] ? `Key Stage 3 / ${boardFor(learnerProfile, subject)}` : "Key Stage 3") : `${subject}: ${boardFor(learnerProfile, subject)} / ${learnerProfile.tier}`}</small>
          </div>
        </div>}

        

        <nav className="primary-nav" aria-label="Primary navigation">
          <button className={view === "learning" ? "active" : ""} onClick={() => chooseView("learning")} title="Learning hub" type="button">
            <LayoutDashboard size={18} />
            <span>Learning hub</span>
          </button>
          <button className={view === "progress" ? "active" : ""} onClick={() => chooseView("progress")} title="My progress" type="button">
            <ChartNoAxesCombined size={18} />
            <span>My progress</span>
          </button>
          {currentUser?.isAdmin && (
            <button className={view === "admin" ? "active" : ""} onClick={() => chooseView("admin")} title="User management" type="button">
              <Users size={18} />
              <span>User management</span>
            </button>
          )}
          {currentUser?.isAdmin && (
            <button className={view === "review" ? "active" : ""} onClick={() => chooseView("review")} title="Content review" type="button">
              <ClipboardCheck size={18} />
              <span>Content review</span>
            </button>
          )}
          {currentUser?.isAdmin && (
            <button className={view === "safeguarding" ? "active" : ""} onClick={() => chooseView("safeguarding")} title="Safeguarding" type="button">
              <ShieldAlert size={18} />
              <span>Safeguarding</span>
            </button>
          )}
          {currentUser?.isAdmin && (
            <button className={view === "payments" ? "active" : ""} onClick={() => chooseView("payments")} title="Payments" type="button">
              <CreditCard size={18} />
              <span>Payments</span>
            </button>
          )}
        </nav>

{view === "learning" && <nav className="subject-list" aria-label="Subjects">
          {subjects.map((item) => {
            const Icon = subjectIcons[item] ?? BookOpen;
            return (
              <button
                className={item === subject ? "subject active" : "subject"}
                // The subject's colour is carried on the element itself, so the
                // tab, its icon and the workspace it opens all read from one
                // token rather than seven hard-coded rules.
                data-subject={item}
                key={item}
                onClick={() => chooseSubject(item)}
                type="button"
              >
                <Icon size={18} />
                <span>{item}</span>
                <ChevronRight size={16} />
              </button>
            );
          })}
        </nav>}

        <nav className="sidebar-utilities" aria-label="Account">
          <button className={view === "support" ? "active" : ""} onClick={() => chooseView("support")} title="Help and support" type="button">
            <LifeBuoy size={18} />
            <span>Help and support</span>
          </button>
          <button className={view === "account" ? "active" : ""} onClick={() => chooseView("account")} title="Account & privacy" type="button">
            <Settings size={18} />
            <span>Account & privacy</span>
          </button>
        </nav>

        <ThemeToggle />

        <div className="account-panel">
          {currentUser?.picture ? <img alt="" src={currentUser.picture} /> : <span>{currentUser?.name?.charAt(0) ?? "U"}</span>}
          <div><strong>{currentUser?.name}</strong><small>{currentUser?.email}</small></div>
          <button aria-label="Sign out" onClick={signOut} title="Sign out" type="button"><LogOut size={17} /></button>
        </div>
      </aside>

      {view === "review" ? (
        <ContentReview request={appRequest} />
      ) : view === "safeguarding" ? (
        <SafeguardingReview request={appRequest} />
      ) : view === "payments" ? (
        <PaymentsDashboard request={appRequest} />
      ) : view === "support" ? (
        <SupportTickets />
      ) : view === "account" ? (
        <AccountSettings currentUser={currentUser} freeTopic={freeTopic} onDeleted={finishAccountDeletion} onSubscribe={() => chooseView("subscribe")} request={appRequest} subscription={subscription} trial={trial} />
      ) : view === "progress" ? (
        <ProgressDashboard learner={learnerProfile} onOpenTopic={openTrackedTopic} request={appRequest} />
      ) : <section className="workspace" data-subject={subject}>
        <header className="topbar">
          <div>
            <p className="eyebrow">{learnerProfile.firstName}'s Year {learnerYear} learning path</p>
            <h2>{subject}</h2>
          </div>
          <div className="topbar-actions">
            <label className="unit-filter">
              <ListFilter size={16} />
              <select aria-label="Filter by unit" onChange={(event) => setUnitFilter(event.target.value)} value={unitFilter}>
                {availableUnits.map((unit) => <option key={unit}>{unit}</option>)}
              </select>
            </label>
            {!trial && <button className="retake-check" onClick={() => setShowDiagnostic(true)} type="button">
              <Target size={15} />
              <span>{activeDiagnostic ? "Retake check" : "Take the check"}</span>
            </button>}
            <button
              aria-controls="sonia-chat"
              aria-expanded={tutorOpen}
              className="model-pill"
              disabled={selectedLocked && learningMode !== "review"}
              onClick={openTutor}
              title={selectedLocked && learningMode !== "review" ? "Sonia is available in your free topic" : undefined}
              type="button"
            >
              <Sparkles size={16} />
              <span>Sonia · Your AI Tutor</span>
            </button>
          </div>
        </header>

        {/* The timer sits beside the box rather than inside it. In the box it
            was a fifth item, so the box was one width in Exam and another in
            the other three modes. */}
        <div className="mode-row">
          <section className="mode-toolbar" aria-label="Learning mode">
            {Object.entries(learningModes).map(([mode, config]) => {
              const ModeIcon = config.icon;
              return <button className={learningMode === mode ? "active" : ""} key={mode} onClick={() => chooseMode(mode)} type="button">
                <ModeIcon size={17} /><span>{config.label}</span>
              </button>;
            })}
          </section>
          {learningMode === "exam" && <div className={`exam-timer ${examRunning ? "running" : ""}`}>
            <Timer size={16} />
            <strong>{String(Math.floor(examSeconds / 60)).padStart(2, "0")}:{String(examSeconds % 60).padStart(2, "0")}</strong>
            <div className="exam-timer-actions">
              <button
                aria-label="Start exam timer"
                className="exam-timer-control"
                disabled={examRunning}
                onClick={startExamTimer}
                title="Start timer"
                type="button"
              >
                <Play size={15} />
              </button>
              <button
                aria-label="Reset exam timer"
                className="exam-timer-control"
                disabled={examSeconds === 0}
                onClick={resetExamTimer}
                title="Reset timer"
                type="button"
              >
                <RotateCcw size={15} />
              </button>
            </div>
          </div>}
        </div>

        {trial && <section className="trial-banner" aria-label="Free trial">
          <Gift size={18} />
          <p>
            <strong>Free trial.</strong>{" "}
            {freeTopic
              ? <>Your free topic is <button className="trial-topic-link" onClick={openFreeTopic} type="button">{freeTopic.title}</button>{freeTopic.subject !== subject ? ` in ${freeTopic.subject}` : ""}.</>
              : "Choose any one topic to study free: lessons, practice, exam questions and a few questions to Sonia."}
          </p>
          <button className="trial-unlock" onClick={() => chooseView("subscribe")} type="button"><LockKeyholeOpen size={16} /> Unlock every topic</button>
        </section>}

        <DailyGoal refreshKey={habitKey} request={appRequest} />


        <section className="curriculum-browser" aria-label="Curriculum">
          <CurriculumProgress
            mastery={mastery}
            subject={subject}
            topics={baseVisibleTopics}
            year={learnerYear}
          />
          <label className="topic-picker">
            <span>Topic</span>
            <select
              aria-label="Choose a topic"
              onChange={(event) => chooseTopic(event.target.value)}
              value={selectedTopic.id}
            >
              {topicOptionGroups.map(([unit, unitTopics]) => (
                <optgroup key={unit} label={unit}>
                  {unitTopics.map((topic) => {
                    const evidence = evidenceByTopic.get(topic.id);
                    const label = evidence ? `${topic.title} - ${checkLabels[evidence.classification] ?? "checked"}` : topic.title;
                    // Before a free topic is chosen every topic is a candidate,
                    // so none is marked locked yet.
                    const trialNote = !trial ? "" : topic.id === freeTopic?.id ? " (free)" : freeTopic ? " (locked)" : "";
                    return <option key={topic.id} value={topic.id}>
                      {label}{trialNote}
                    </option>;
                  })}
                </optgroup>
              ))}
            </select>
          </label>
          {learningMode === "learn" && !selectedLocked && <div className="subtopic-grid" aria-label="Sub-topics">
            {subtopics.map((subtopic) => {
              const answers = topicAnswers(subtopic.topicId);
              const lessonDone = lessonsDone.has(subtopic.id);
              const complete = lessonDone && answers.practice >= answersToFinish && answers.exam >= answersToFinish;
              const summary = `Lesson ${lessonDone ? "done" : "not done"}. Practice ${Math.min(answers.practice, answersToFinish)} of ${answersToFinish}. Exam ${Math.min(answers.exam, answersToFinish)} of ${answersToFinish}.`;
              return <button
                aria-pressed={subtopic.id === selectedSubtopic?.id}
                className={`subtopic-card${subtopic.id === selectedSubtopic?.id ? " active" : ""}${complete ? " complete" : ""}`}
                key={subtopic.id}
                onClick={() => setSelectedSubtopicId(subtopic.id)}
                title={complete ? "Completed: lesson, practice and exam all done" : summary}
                type="button"
              >
                {complete && <span className="subtopic-tick" aria-label="Completed" role="img"><CheckCircle2 size={20} strokeWidth={2.4} /></span>}
                <span className="subtopic-index">Sub-topic {subtopic.index + 1}</span>
                <strong>{subtopic.title}</strong>
                {/* The three things that finish a sub-topic, each ticked as it is
                    done, so progress shows before the whole card is. */}
                <small className="subtopic-steps">
                  <span className={lessonDone ? "done" : undefined}>{lessonDone && <Check size={12} strokeWidth={3} />}Lesson</span>
                  <span className={answers.practice >= answersToFinish ? "done" : undefined}>{answers.practice >= answersToFinish && <Check size={12} strokeWidth={3} />}Practice {Math.min(answers.practice, answersToFinish)}/{answersToFinish}</span>
                  <span className={answers.exam >= answersToFinish ? "done" : undefined}>{answers.exam >= answersToFinish && <Check size={12} strokeWidth={3} />}Exam {Math.min(answers.exam, answersToFinish)}/{answersToFinish}</span>
                </small>
              </button>;
            })}
          </div>}
        </section>

        <section className="learning-layout">
          {selectedLocked && learningMode !== "review" ? <article className="lesson-panel trial-offer" aria-live="polite">
            <div className="panel-heading">
              <LockKeyhole size={20} />
              <div>
                <p className="eyebrow">{selectedTopic.exam} / {selectedTopic.unit}</p>
                <h3>{freeTopic ? `${selectedTopic.title} is part of the full plan` : `Try ${selectedTopic.title} free`}</h3>
              </div>
            </div>
            <p className="lesson-goal">{selectedTopic.title} — {selectedTopic.goal}</p>
            {freeTopic ? <>
              <p>Your free topic is <strong>{freeTopic.title}</strong>{freeTopic.subject !== subject ? ` in ${freeTopic.subject}` : ""}. Subscribe to open this topic and every other topic in Year {learnerYear}.</p>
              <div className="trial-actions">
                <button className="subscribe-button" onClick={() => chooseView("subscribe")} type="button"><LockKeyholeOpen size={17} /> Unlock every topic</button>
                <button className="secondary-button" onClick={openFreeTopic} type="button">Go to my free topic</button>
              </div>
            </> : <>
              <p>You can study one topic free, with its lessons, worked examples, practice and exam questions, and a few questions to Sonia, your AI tutor. Pick the one that matters most: the choice cannot be changed afterwards.</p>
              <div className="trial-actions">
                <button className="subscribe-button" disabled={freeTopicState.busy} onClick={() => chooseFreeTopic(selectedTopic)} type="button">
                  <Gift size={17} /> {freeTopicState.busy ? "Saving..." : "Make this my free topic"}
                </button>
                <button className="secondary-button" onClick={() => chooseView("subscribe")} type="button">Subscribe for every topic</button>
              </div>
            </>}
            {freeTopicState.error && <p className="login-error" role="alert">{freeTopicState.error}</p>}
          </article> : learningMode === "review" ? <ReviewPanel
            error={bankItem.error}
            item={bankItem}
            marking={marking}
            maths={maths}
            onNext={() => setReviewPosition((current) => Math.min(current + 1, Math.max(0, reviewQueue.items.length - 1)))}
            onPractise={() => chooseMode("practice")}
            onRetry={() => loadReviewQuestion(reviewItem)}
            onSubmit={submitBankAnswer}
            queue={{ ...reviewQueue, position: reviewPosition, onRetry: loadReviewQueue }}
            result={markResult}
            status={bankItem.status}
            topic={reviewItem ? { id: reviewItem.topicId, title: reviewItem.topicTitle, unit: "Review" } : selectedTopic}
          /> : learningMode === "practice" || learningMode === "exam" ? <QuestionPanel
            error={bankItem.error}
            examRunning={examRunning}
            examSeconds={examSeconds}
            index={bankIndex}
            item={bankItem}
            marking={marking}
            maths={maths}
            mode={learningMode}
            onNext={() => setBankIndex((current) => current + 1)}
            onRetry={() => loadBankItem(learningMode, selectedTopic, bankIndex)}
            onSubmit={submitBankAnswer}
            result={markResult}
            status={bankItem.status}
            topic={selectedTopic}
          /> : <article className="lesson-panel">
            <div className="panel-heading">
              <Brain size={20} />
              <div>
                <p className="eyebrow">{selectedTopic.exam} / {selectedTopic.unit}</p>
                <h3>{selectedSubtopic?.title ?? selectedTopic.title}</h3>
              </div>
              {explanation.status === "ready" && <button className="ask-tutor play-lesson" onClick={() => {
                // Opening the lesson player is the learner asking for the
                // lesson, so anything else speaking gives way to it.
                stopPlayback();
                stopSpeaking();
                setPlayerOpen((open) => !open);
              }} type="button">
                <MonitorPlay size={16} /> {playerOpen ? "Close the lesson player" : "Play this as a lesson"}
              </button>}
            </div>
            <p className="lesson-goal">{selectedTopic.title} — {selectedTopic.goal}</p>
            <div className="topic-guide">
              {/* The narrated lesson presents the same authored content, so it
                  takes the place of the written explanation rather than sitting
                  alongside it and saying everything twice. */}
              {playerOpen && explanation.status === "ready" ? (
                <section className="guide-section">
                  <LessonPlayer key={selectedSubtopic?.id} content={explanation} request={appRequest} topic={selectedTopic} />
                </section>
              ) : <>
                <section className="guide-section">
                  <h4>{explanation.scope === 'topic' ? 'Topic overview' : 'Clear explanation'}</h4>
                  {explanation.scope === 'topic' && <p className="example-status">This overview covers the whole topic. A separate explanation for this subtopic is not yet available.</p>}
                  {explanation.status === "loading" && <p className="example-status" role="status">Loading this subtopic...</p>}
                  {explanation.status === "error" && <p className="login-error" role="alert">{explanation.error}</p>}
                  {explanation.status === "ready" && <>
                    <p><MathsText enabled={typeset(explanation.explanation)}>{explanation.explanation}</MathsText></p>
                    <ul>
                      {(explanation.keyIdeas ?? []).map((idea) => <li key={idea}><MathsText enabled={typeset(idea)}>{idea}</MathsText></li>)}
                    </ul>
                  </>}
                </section>
                {explanation.status === "ready" && (explanation.formulae ?? []).length > 0 && (
                  <section className="guide-section formula-guide">
                    <div className="worked-example-heading">
                      <h4>{explanation.scope === 'topic' ? 'Topic formulas' : 'Key formulas'}</h4>
                      <BeatPlayer
                        beats={keyFormulaBeats}
                        label="Play the key formulas"
                        onBeat={setFormulaBeat}
                        request={appRequest}
                        topic={selectedTopic}
                      />
                    </div>
                    {explanation.formulae.map((formula, index) => (
                      <code
                        className={`${typeset(formula) ? "typeset" : ""}${formulaBeat?.position === index ? " speaking" : ""}`.trim()}
                        key={formula}
                      >
                        <MathsText enabled={typeset(formula)}>{formula}</MathsText>
                      </code>
                    ))}
                  </section>
                )}
              </>}
              {workedExample.status !== "none" && <section className="guide-section worked-example">
                <div className="worked-example-heading">
                  <h4>Worked example: {selectedSubtopic?.title ?? selectedTopic.title}</h4>
                  {workedExample.status === "ready" && workedExample.question && (
                    <BeatPlayer
                      beats={workedExampleBeats}
                      label="Play the worked example"
                      onBeat={setExampleBeat}
                      onComplete={() => markLessonDone(selectedSubtopic)}
                      request={appRequest}
                      topic={selectedTopic}
                    />
                  )}
                  {workedExample.status === "ready" && currentUser?.isAdmin && (
                    <button
                      className="example-refresh"
                      onClick={() => loadWorkedExample(selectedTopic, selectedSubtopic, { refresh: true })}
                      type="button"
                    >
                      <Repeat2 size={15} /> New example
                    </button>
                  )}
                </div>
                {workedExample.status === "loading" && (
                  <p className="example-status" role="status">Writing a worked example for this sub-topic...</p>
                )}
                {workedExample.status === "error" && (
                  <div className="example-status error">
                    <p role="alert">{workedExample.error}</p>
                    <button onClick={() => loadWorkedExample(selectedTopic, selectedSubtopic, { refresh: true })} type="button">Try again</button>
                  </div>
                )}
                {workedExample.status === "ready" && (workedExample.question ? (
                  <>
                    {workedExample.formulae?.length > 0 && (
                      <div className="example-formulae">
                        {workedExample.formulae.map((formula, index) => (
                          <code
                            className={`${typeset(formula) ? "typeset" : ""}${exampleBeat?.kind === "formula" && exampleBeat.position === index ? " speaking" : ""}`.trim()}
                            key={formula}
                          >
                            <MathsText enabled={typeset(formula)}>{formula}</MathsText>
                          </code>
                        ))}
                      </div>
                    )}
                    {/* While it is being read aloud, the line being spoken is
                        marked, so a learner following along knows where they
                        are without having to guess from the voice. */}
                    <p className={exampleBeat?.kind === "question" ? "speaking" : undefined}><strong>Question:</strong> <MathsText enabled={typeset(workedExample.question)}>{workedExample.question}</MathsText></p>
                    <ol>
                      {workedExample.steps.map((step, index) => (
                        <li
                          className={exampleBeat?.kind === "step" && exampleBeat.position === index ? "speaking" : undefined}
                          key={`${index}-${step}`}
                        >
                          <MathsText enabled={typeset(step)}>{step}</MathsText>
                        </li>
                      ))}
                    </ol>
                    {workedExample.answer && <p className={`worked-answer${exampleBeat?.kind === "answer" ? " speaking" : ""}`}><strong>Answer:</strong> <MathsText enabled={typeset(workedExample.answer)}>{workedExample.answer}</MathsText></p>}
                  </>
                ) : <p className="example-raw">{workedExample.raw}</p>)}
                {workedExample.status === "ready" && <span aria-hidden="true" className="example-end" ref={exampleEnd} />}
              </section>}
              {selectedSubtopic && (lessonsDone.has(selectedSubtopic.id) ? (
                <p className="lesson-done" role="status"><CheckCircle2 size={17} /> Lesson finished for this sub-topic</p>
              ) : (
                <div className="lesson-done-action">
                  <button className="secondary-button lesson-done-button" onClick={() => markLessonDone(selectedSubtopic)} type="button">
                    <CheckCircle2 size={16} /> Mark this lesson as done
                  </button>
                  {lessonSaveError && <p className="lesson-done-error" role="alert">{lessonSaveError}</p>}
                </div>
              ))}
            </div>
            {selectedEvidence && (
              <div className={`topic-evidence ${selectedEvidence.classification}`}>
                <strong>{checkVerdicts[selectedEvidence.classification] ?? "From your check"}</strong>
                <p>{selectedEvidence.feedback}</p>
                <span>Next step: {selectedEvidence.nextStep}</span>
              </div>
            )}
            <div className="lesson-actions">
              {learningMode !== "learn" && <button className="start-activity" disabled={isThinking} onClick={startActivity} type="button">
                <Play size={15} /> {learningModes[learningMode].action}
              </button>}
              {!tutorOpen && <button className="ask-tutor" onClick={openTutor} type="button">
                <Sparkles size={16} /> Ask Sonia (Your AI Tutor)
              </button>}
            </div>
            <div className="attempt-actions">
              <button onClick={() => setAttemptOpen(true)} type="button"><CheckCircle2 size={17} /> Record progress</button>
              {attemptMessage && <span role="status">{attemptMessage}</span>}
            </div>
            {attemptOpen && <AttemptRecorder
              mode={learningMode}
              onCancel={() => setAttemptOpen(false)}
              onSave={saveAttempt}
              saving={savingAttempt}
              startedAt={activityStartedAt}
              topic={selectedTopic}
            />}
          </article>}

          {tutorOpen && !(selectedLocked && learningMode !== "review") && <section className="tutor-panel" aria-label="Chat with Sonia, your AI tutor" id="sonia-chat" ref={tutorPanelRef}>
            <div className="chat-header">
              <Sparkles size={20} />
              <div>
                <h3>Sonia</h3>
                <p>Your AI Tutor · {learningModes[learningMode].label} / {selectedTopic.title}</p>
              </div>
              {learningMode !== "learn" && <button className="start-activity" disabled={isThinking} onClick={startActivity} type="button"><Play size={15} /> {learningModes[learningMode].action}</button>}
              <button aria-label="Close the chat with Sonia" className="close-tutor" onClick={() => setTutorOpen(false)} title="Close the chat" type="button"><X size={18} /></button>
            </div>

            <div className="messages">
              {messages.map((message, index) => (
                <div className={`message ${message.role}${message.guard ? " guarded" : ""}`} key={`${message.role}-${index}`}>
                  {/* Stored Maths answers carry LaTeX, so the chat typesets it too. */}
                  <MathsText enabled={maths && message.role === "assistant"}>{message.text}</MathsText>
                  {message.source === "stored" && <span className="message-source">From your study material</span>}
                  {message.guard && <span className="message-source">Kept to this topic</span>}
                </div>
              ))}
              {isThinking && <div className="message assistant">Thinking...</div>}
            </div>

            <form className="composer" onSubmit={askTutor}>
              <input
                aria-label="Ask Sonia"
                onChange={(event) => setPrompt(event.target.value)}
                placeholder={`${learningModes[learningMode].label}: ask or submit an answer...`}
                ref={tutorInputRef}
                value={prompt}
              />
              <button aria-label="Send" disabled={isThinking} type="submit">
                <Send size={18} />
              </button>
            </form>
          </section>}
        </section>
      </section>}
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
