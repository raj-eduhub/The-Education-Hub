import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BookOpen,
  BookMarked,
  Brain,
  Calculator,
  CheckCircle2,
  ChartNoAxesCombined,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  FlaskConical,
  GraduationCap,
  LayoutDashboard,
  Landmark,
  ListFilter,
  LockKeyhole,
  LogOut,
  Map as MapIcon,
  MessageCircle,
  PenLine,
  Play,
  Repeat2,
  Cpu,
  DraftingCompass,
  Send,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
  Square,
  UserRound,
  Volume2,
  X,
  Users,
} from "lucide-react";
import { curriculum, subjects, topicsFor } from "./curriculum.js";
import { AdminDashboard } from "./AdminDashboard.jsx";
import { AccountSettings } from "./AccountSettings.jsx";
import { AttemptRecorder } from "./AttemptRecorder.jsx";
import { DiagnosticAssessment } from "./DiagnosticAssessment.jsx";
import { LegalNotice } from "./LegalNotice.jsx";
import { LearnerProfileSetup } from "./LearnerProfileSetup.jsx";
import { LoginScreen, PasswordReset } from "./PasswordLogin.jsx";
import { ProgressDashboard } from "./ProgressDashboard.jsx";
import { CheckoutConfirming } from "./CheckoutConfirming.jsx";
import { SubscriberSignup } from "./SubscriberSignup.jsx";
import { SubscriptionPage } from "./SubscriptionPage.jsx";
import { authFetch, clearAuthToken, getAuthToken, readJson, setAuthToken } from "./auth.js";
import { loadDiagnostic, personaliseTopics, saveDiagnostic } from "./diagnostic.js";
import { boardFor, loadLearnerProfile, saveLearnerProfile } from "./learnerProfile.js";
import { formatTopicGuide, getTopicGuide } from "./topicGuides.js";
import { subtopicsFor } from "./subtopics.js";
import { hasMaths, MathsText } from "./MathsText.jsx";
import { speak, speechSupported, stopSpeaking } from "./speech.js";
import { QuestionPanel } from "./QuestionPanel.jsx";
import { ReviewPanel } from "./ReviewPanel.jsx";
import { ContentReview } from "./ContentReview.jsx";
import { SafeguardingReview } from "./SafeguardingReview.jsx";
import "katex/dist/katex.min.css";
import "./styles.css";

const subjectIcons = {
  Maths: Calculator,
  Science: FlaskConical,
  English: PenLine,
  History: Landmark,
  Geography: MapIcon,
  Computing: Cpu,
  "Design Technology": DraftingCompass,
};

const learningModes = {
  learn: { label: "Learn", icon: BookMarked, action: "Explain this topic", prompt: "Teach me this topic Socratically. Start with one question to check what I already understand, then use a worked example." },
  practice: { label: "Practice", icon: ClipboardList, action: "Generate question", prompt: "Give me one original adaptive practice question. Do not reveal the answer until I respond." },
  exam: { label: "Exam", icon: Timer, action: "Start timed question", prompt: "Give me one original exam-style question. State the suggested time and marks available, then wait for my answer." },
  review: { label: "Review", icon: Repeat2, action: "Start recall", prompt: "Test me with one short retrieval question on this weak topic. Wait for my answer before giving a hint." },
};

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
const resetToken = new URLSearchParams(window.location.search).get("reset");
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

const previewProfile = {
  ownerEmail: "parent@example.com",
  firstName: "Alex",
  dateOfBirth: "2014-01-15",
  year: 7,
  examBoard: "AQA",
  examBoards: { Maths: "AQA", Science: "Edexcel" },
  tier: "Higher",
  subject: "Maths",
  topicId: "y7-maths-number",
};
const previewProgress = {
  attempts: [],
  mastery: [
    { id: "preview-1", year: 7, subject: "Maths", topicId: "y7-maths-number", topicTitle: "Integers and Place Value", attempts: 4, accuracy: 0.88, confidence: 4.2, totalTimeSeconds: 2700, masteryScore: 86, lastPractised: "2026-09-08T16:00:00.000Z", nextReviewAt: "2026-09-18T16:00:00.000Z" },
    { id: "preview-2", year: 7, subject: "Maths", topicId: "y7-maths-fractions", topicTitle: "Fractions, Decimals and Percentages", attempts: 2, accuracy: 0.64, confidence: 3, totalTimeSeconds: 1500, masteryScore: 63, lastPractised: "2026-09-07T16:00:00.000Z", nextReviewAt: "2026-09-14T16:00:00.000Z" },
    { id: "preview-3", year: 7, subject: "Maths", topicId: "y7-maths-algebra", topicTitle: "Expressions and Equations", attempts: 2, accuracy: 0.48, confidence: 2.5, totalTimeSeconds: 1200, masteryScore: 48, lastPractised: "2026-09-01T16:00:00.000Z", nextReviewAt: "2026-09-03T16:00:00.000Z" },
    { id: "preview-4", year: 7, subject: "Science", topicId: "y7-science-cells", topicTitle: "Cells and Organisation", attempts: 3, accuracy: 0.82, confidence: 4, totalTimeSeconds: 2100, masteryScore: 81, lastPractised: "2026-09-06T16:00:00.000Z", nextReviewAt: "2026-09-16T16:00:00.000Z" },
  ],
};
let previewUsers = [
  { id: "preview-parent", name: "Sam Patel", email: "parent@example.com", role: "parent", status: "active", createdAt: "2026-09-01T09:00:00.000Z" },
  { id: "preview-student", name: "Maya Patel", email: "maya@example.com", role: "student", status: "active", createdAt: "2026-09-02T09:00:00.000Z" },
  { id: "preview-teacher", name: "A. Teacher", email: "teacher@example.com", role: "teacher", status: "inactive", createdAt: "2026-09-03T09:00:00.000Z" },
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
    const guide = getTopicGuide(input.subject, input.topic);
    const content = input.type === "explanation"
      ? { explanation: guide.explanation, keyIdeas: guide.keyIdeas, formulae: guide.formulae }
      : { formulae: guide.formulae, question: guide.question, steps: guide.steps, answer: guide.answer };
    return previewResponse({ content: { ...content, source: "stored" }, route: "stored", generated: false });
  }
  if (pathname === "/api/tutor") {
    const input = JSON.parse(options.body);
    return previewResponse({ answer: formatTopicGuide(input.subject, input.topic) });
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
    const user = { id: `preview-${Date.now()}`, ...input, status: "active", createdAt: new Date().toISOString() };
    previewUsers = [user, ...previewUsers];
    return previewResponse({ user }, 201);
  }
  if (pathname.startsWith("/api/users/") && method === "PATCH") {
    const id = pathname.split("/").pop();
    const input = JSON.parse(options.body);
    previewUsers = previewUsers.map((user) => user.id === id ? { ...user, status: input.status } : user);
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
  const [requestedView, setView] = useState(adminPreview ? "admin" : ["admin", "review", "safeguarding", "progress", "parent", "account"].includes(window.location.hash.slice(1)) ? window.location.hash.slice(1) : "learning");
  const view = ["admin", "review", "safeguarding"].includes(requestedView) && !currentUser?.isAdmin
    ? "learning"
    : requestedView === "parent" && !currentUser?.isAdmin && currentUser?.accessRole !== "parent"
      ? "learning" : requestedView;
  const [subject, setSubject] = useState("Maths");
  const [unitFilter, setUnitFilter] = useState("All");
  const [selectedTopicId, setSelectedTopicId] = useState(curriculum[0].id);
  const [selectedSubtopicId, setSelectedSubtopicId] = useState("");
  const [explanation, setExplanation] = useState({ status: "idle" });
  const [workedExample, setWorkedExample] = useState({ status: "idle" });
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
  const [speaking, setSpeaking] = useState(false);
  const canSpeak = speechSupported();
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
  const [mastery, setMastery] = useState([]);
  const [subscription, setSubscription] = useState(subscriptionPreview ? null : previewMode ? { plan: "admin", status: "active" } : null);
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

  const diagnosticSummary = useMemo(() => {
    const results = activeDiagnostic?.results ?? [];
    return {
      priorities: results.filter((item) => item.classification === "priority").length,
      strengths: results.filter((item) => item.classification === "strength").length,
    };
  }, [activeDiagnostic]);

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
  // Only Maths content is typeset, and only when the stored row was written for it.
  // Maths always typesets; every other subject typesets whatever carries LaTeX,
  // which is most of the science, computing, geography and DT formulae.
  const maths = subject === "Maths";
  const typeset = (text) => maths || hasMaths(text);

  useEffect(() => {
    // A voice carrying on about the previous topic is worse than no voice.
    stopSpeaking();
    setSpeaking(false);
  }, [selectedTopicId, learningMode, subject, view]);

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
      if (data.hasAccess) {
        const billingResponse = await authFetch("/api/billing/status");
        const billingData = await readJson(billingResponse);
        if (!billingResponse.ok) throw new Error(billingData.error ?? "Subscription status could not be loaded.");
        const billingSubscription = billingData.subscription;
        setSubscription(billingSubscription);
        setBillingChecked(true);

        if (!data.isAdmin && billingSubscription?.status === "active" && billingSubscription.onboardingComplete) {
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
        const storedSubject = storedProfile.subject ?? "Maths";
        setSubject(storedSubject);
        setSelectedTopicId(storedProfile.topicId);
        const storedDiagnostic = loadDiagnostic(data.user.email, storedProfile.year, storedSubject);
        setDiagnostic(storedDiagnostic);
        setShowDiagnostic(!storedDiagnostic);
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
      .then((data) => setMastery(data.mastery ?? []))
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
    setShowDiagnostic(!storedDiagnostic);
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
    if (["admin", "review", "safeguarding"].includes(nextView) && !currentUser?.isAdmin) return;
    if (nextView === "parent" && !currentUser?.isAdmin && currentUser?.accessRole !== "parent") return;
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
    if (!response.ok) throw new Error(data.error ?? "That part of the lesson could not be loaded right now.");
    return data;
  }, [appRequest, learnerProfile, learnerYear, subject]);

  const loadExplanation = useCallback(async (topic) => {
    if (!topic) return;
    const ticket = explanationTicket.current + 1;
    explanationTicket.current = ticket;
    setExplanation({ status: "loading" });
    try {
      const data = await requestContent("explanation", topic, null, false);
      if (explanationTicket.current === ticket) setExplanation({ status: "ready", ...data.content });
    } catch (failure) {
      if (explanationTicket.current === ticket) setExplanation({ status: "error", error: failure.message });
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
    if (view !== "learning" || !learnerProfile || !selectedTopic) return;
    if (learningMode !== "practice" && learningMode !== "exam") return;
    loadBankItem(learningMode, selectedTopic, bankIndex);
  }, [bankIndex, learnerProfile, learningMode, loadBankItem, selectedTopic, view]);

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

  const loadWorkedExample = useCallback(async (topic, subtopic, { refresh = false } = {}) => {
    if (!topic || !subtopic) return;
    const ticket = exampleTicket.current + 1;
    exampleTicket.current = ticket;
    setWorkedExample({ status: "loading" });
    activity.current.examplesOpened += 1;
    try {
      const data = await requestContent("example", topic, subtopic, refresh);
      if (exampleTicket.current === ticket) setWorkedExample({ status: "ready", ...data.content });
    } catch (failure) {
      if (exampleTicket.current === ticket) setWorkedExample({ status: "error", error: failure.message });
    }
  }, [requestContent]);

  useEffect(() => {
    if (view !== "learning" || !learnerProfile || !selectedTopic) return;
    loadExplanation(selectedTopic);
  }, [learnerProfile, loadExplanation, selectedTopic, view]);

  useEffect(() => {
    if (view !== "learning" || !learnerProfile || !selectedTopic || !selectedSubtopic) return;
    loadWorkedExample(selectedTopic, selectedSubtopic);
  }, [learnerProfile, loadWorkedExample, selectedSubtopic, selectedTopic, view]);

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
    if (view !== "learning" || !learnerProfile || !selectedTopic) return undefined;
    activity.current = {
      startedAt: Date.now(), questionsAsked: 0, examplesOpened: 0,
      topicId: selectedTopic.id, topicTitle: selectedTopic.title, subject,
    };
    return () => flushActivity();
  }, [flushActivity, learnerProfile, selectedTopic, subject, view]);

  // A submitted answer is marked by the tutor against the stored question, which
  // is also what triggers the automatic progress record.
  async function submitBankAnswer(learnerAnswer) {
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
          question: `Here is my answer to the question you set.

Question: ${questionContext}

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
        throw new Error(data.error ?? "The tutor could not answer right now.");
      }

      setMessages((items) => [...items, { role: "assistant", text: data.answer, source: data.source, guard: data.guard }]);
      // The tutor marked the answer and the server recorded it, so mastery is refreshed here.
      if (data.recorded?.mastery) {
        const updated = data.recorded.mastery;
        setMastery((items) => [updated, ...items.filter((item) => item.topicId !== updated.topicId)]);
        setAttemptMessage(`Progress recorded automatically: ${data.recorded.mark.earned}/${data.recorded.mark.available}`);
        setActivityStartedAt(Date.now());
      }
    } catch {
      setMessages((items) => [
        ...items,
        {
          role: "assistant",
          text:
            "I could not reach the AI tutor yet. Check the backend environment variables and your sign-in, then try again.",
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

  // The authored explanation is on screen and correct, so it is what gets read.
  // Waiting for the model would mean fifteen seconds of silence after a click.
  function readAloud() {
    if (explanation.status !== "ready") return;
    const started = speak([explanation.explanation, ...(explanation.keyIdeas ?? [])], {
      onEnd: () => setSpeaking(false),
    });
    setSpeaking(started);
  }

  function silence() {
    stopSpeaking();
    setSpeaking(false);
  }

  function startActivity() {
    setTutorOpen(true);
    if (canSpeak) readAloud();
    setActivityStartedAt(Date.now());
    setAttemptMessage("");
    if (learningMode === "exam") {
      setExamSeconds(0);
      setExamRunning(true);
    }
    sendTutorPrompt(learningModes[learningMode].prompt);
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
    window.location.assign(data.url);
  }

  function finishAccountDeletion() {
    localStorage.removeItem("education-hub-learner-profile");
    localStorage.removeItem("education-hub-diagnostics");
    signOut();
  }

  if (signupToken || signupPreview) {
    return <SubscriberSignup preview={signupPreview} token={signupToken} />;
  }

  if (resetToken || resetPreview) {
    return <PasswordReset token={resetToken} />;
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
          <p>Ask an Education Hub administrator to add <strong>{currentUser?.email}</strong> to the user dashboard.</p>
          <button onClick={signOut} type="button"><LogOut size={18} /> Sign out</button>
        </div>
      </main>
    );
  }

  const subscriptionActive = subscription?.status === "active";
  const setupIncomplete = !currentUser?.isAdmin && !subscription?.onboardingComplete;

  // Learner setup happens here, in the app, straight after payment. It used to
  // be an emailed one-time link, which added a 48-hour deadline and a spam
  // filter between a paying customer and the thing they had just bought.
  if (authStatus === "signed-in" && billingChecked && subscriptionActive && setupIncomplete) {
    return <SubscriberSignup account={currentUser} onComplete={completeOnboarding} />;
  }
  if (authStatus === "signed-in" && billingChecked && !subscriptionActive && checkoutState === "success") {
    return <CheckoutConfirming email={currentUser.email} onRecheck={recheckBilling} onSignOut={signOut} />;
  }
  if (authStatus === "signed-in" && billingChecked && !subscriptionActive) {
    return <>
      <SubscriptionPage
        checkoutState={checkoutState}
        currentUser={currentUser}
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
        <strong>Education Hub / Administration</strong>
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
        onComplete={completeDiagnostic}
        request={appRequest}
      />
    );
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1>Education Hub</h1>
            <p>KS3 to GCSE</p>
          </div>
        </div>

        <nav className="primary-nav" aria-label="Primary navigation">
          <button className={view === "learning" ? "active" : ""} onClick={() => chooseView("learning")} title="Learning hub" type="button">
            <LayoutDashboard size={18} />
            <span>Learning hub</span>
          </button>
          <button className={view === "progress" ? "active" : ""} onClick={() => chooseView("progress")} title="My progress" type="button">
            <ChartNoAxesCombined size={18} />
            <span>My progress</span>
          </button>
          {(currentUser?.accessRole === "parent" || currentUser?.isAdmin) && (
            <button className={view === "parent" ? "active" : ""} onClick={() => chooseView("parent")} title="Parent dashboard" type="button">
              <UserRound size={18} />
              <span>Parent dashboard</span>
            </button>
          )}
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
          <button className={view === "account" ? "active" : ""} onClick={() => chooseView("account")} title="Account & privacy" type="button">
            <Settings size={18} />
            <span>Account & privacy</span>
          </button>
        </nav>

        {view === "learning" && <div className="year-context">
          <div>
            <span className="label">Learning path</span>
            <strong>Year {learnerYear}</strong>
            <small>{stage === "KS3" ? (learnerProfile.examBoards?.[subject] ? `Key Stage 3 / ${boardFor(learnerProfile, subject)}` : "Key Stage 3") : `${subject}: ${boardFor(learnerProfile, subject)} / ${learnerProfile.tier}`}</small>
          </div>
        </div>}

        {view === "learning" && <nav className="subject-list" aria-label="Subjects">
          {subjects.map((item) => {
            const Icon = subjectIcons[item] ?? BookOpen;
            return (
              <button
                className={item === subject ? "subject active" : "subject"}
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
      ) : view === "account" ? (
        <AccountSettings currentUser={currentUser} onDeleted={finishAccountDeletion} request={appRequest} subscription={subscription} />
      ) : view === "progress" ? (
        <ProgressDashboard learner={learnerProfile} onOpenTopic={openTrackedTopic} request={appRequest} />
      ) : view === "parent" ? (
        <ProgressDashboard audience="parent" learner={learnerProfile} onOpenTopic={openTrackedTopic} request={appRequest} />
      ) : <section className="workspace">
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
            <div className="model-pill">
              <Sparkles size={16} />
              <span>AI tutor</span>
            </div>
          </div>
        </header>

        <section className="mode-toolbar" aria-label="Learning mode">
          {Object.entries(learningModes).map(([mode, config]) => {
            const ModeIcon = config.icon;
            return <button className={learningMode === mode ? "active" : ""} key={mode} onClick={() => chooseMode(mode)} type="button">
              <ModeIcon size={17} /><span>{config.label}</span>
            </button>;
          })}
          {learningMode === "exam" && <div className={`exam-timer ${examRunning ? "running" : ""}`}><Timer size={16} /><strong>{String(Math.floor(examSeconds / 60)).padStart(2, "0")}:{String(examSeconds % 60).padStart(2, "0")}</strong></div>}
        </section>

        <section className="diagnostic-summary" aria-label="Diagnostic evidence">
          <div className="diagnostic-summary-title">
            <Target size={19} />
            <div>
              <strong>{activeDiagnostic ? "Personalised learning order" : "No diagnostic evidence yet"}</strong>
              <span>{activeDiagnostic ? "Priority topics appear first" : `Take a short ${subject} check to personalise this path`}</span>
            </div>
          </div>
          <div className="diagnostic-stat priority"><span>Priority areas</span><strong>{diagnosticSummary.priorities}</strong></div>
          <div className="diagnostic-stat strength"><span>Strengths</span><strong>{diagnosticSummary.strengths}</strong></div>
          <div className="grade-lock">
            <LockKeyhole size={16} />
            <div>
              <span>{activeDiagnostic?.gradePrediction?.status === "evidence-threshold-met" ? "Evidence threshold met" : "Grade prediction locked"}</span>
              <strong>{activeDiagnostic?.evidenceCount ?? 0} / 15 evidence checks</strong>
            </div>
          </div>
          <button className="diagnostic-start" onClick={() => setShowDiagnostic(true)} type="button">
            {activeDiagnostic ? "Retake check" : "Start check"}
          </button>
        </section>

        <section className="curriculum-browser" aria-label="Curriculum">
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
                    return <option key={topic.id} value={topic.id}>
                      {evidence ? `${topic.title} (${evidence.classification})` : topic.title}
                    </option>;
                  })}
                </optgroup>
              ))}
            </select>
          </label>
          {learningMode === "learn" && <div className="subtopic-grid" aria-label="Sub-topics">
            {subtopics.map((subtopic) => (
              <button
                aria-pressed={subtopic.id === selectedSubtopic?.id}
                className={subtopic.id === selectedSubtopic?.id ? "subtopic-card active" : "subtopic-card"}
                key={subtopic.id}
                onClick={() => setSelectedSubtopicId(subtopic.id)}
                type="button"
              >
                <span className="subtopic-index">Sub-topic {subtopic.index + 1}</span>
                <strong>{subtopic.title}</strong>
                <small>Worked example</small>
              </button>
            ))}
          </div>}
        </section>

        <section className="learning-layout">
          {learningMode === "review" ? <ReviewPanel
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
                <h3>{selectedTopic.title}</h3>
              </div>
            </div>
            <p className="lesson-goal">{selectedTopic.goal}</p>
            <div className="topic-guide">
              <section className="guide-section">
                <h4>Clear explanation</h4>
                {explanation.status === "loading" && <p className="example-status" role="status">Loading this topic...</p>}
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
                  <h4>Key formulas</h4>
                  {explanation.formulae.map((formula) => <code className={typeset(formula) ? "typeset" : ""} key={formula}><MathsText enabled={typeset(formula)}>{formula}</MathsText></code>)}
                </section>
              )}
              <section className="guide-section worked-example">
                <div className="worked-example-heading">
                  <h4>Worked example: {selectedSubtopic?.title ?? selectedTopic.title}</h4>
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
                        {workedExample.formulae.map((formula) => <code className={typeset(formula) ? "typeset" : ""} key={formula}><MathsText enabled={typeset(formula)}>{formula}</MathsText></code>)}
                      </div>
                    )}
                    <p><strong>Question:</strong> <MathsText enabled={typeset(workedExample.question)}>{workedExample.question}</MathsText></p>
                    <ol>
                      {workedExample.steps.map((step, index) => <li key={`${index}-${step}`}><MathsText enabled={typeset(step)}>{step}</MathsText></li>)}
                    </ol>
                    {workedExample.answer && <p className="worked-answer"><strong>Answer:</strong> <MathsText enabled={typeset(workedExample.answer)}>{workedExample.answer}</MathsText></p>}
                  </>
                ) : <p className="example-raw">{workedExample.raw}</p>)}
              </section>
            </div>
            {selectedEvidence && (
              <div className={`topic-evidence ${selectedEvidence.classification}`}>
                <strong>Diagnostic: {selectedEvidence.classification}</strong>
                <p>{selectedEvidence.feedback}</p>
                <span>Next step: {selectedEvidence.nextStep}</span>
              </div>
            )}
            <div className="outcomes">
              {selectedTopic.outcomes.map((outcome) => (
                <div className="outcome" key={outcome}>
                  <CheckCircle2 size={16} />
                  <span>{outcome}</span>
                </div>
              ))}
            </div>
            <div className="lesson-actions">
              <button className="start-activity" disabled={isThinking} onClick={startActivity} type="button">
                <Play size={15} /> {learningModes[learningMode].action}
              </button>
              {canSpeak && explanation.status === "ready" && (speaking
                ? <button className="ask-tutor listening" onClick={silence} type="button">
                    <Square size={15} /> Stop reading
                  </button>
                : <button className="ask-tutor" onClick={readAloud} type="button">
                    <Volume2 size={16} /> Read this aloud
                  </button>)}
              {!tutorOpen && <button className="ask-tutor" onClick={() => setTutorOpen(true)} type="button">
                <MessageCircle size={16} /> Ask the tutor a question
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

          {tutorOpen && <section className="tutor-panel" aria-label="AI tutor chat">
            <div className="chat-header">
              <MessageCircle size={20} />
              <div>
                <h3>Tutor</h3>
                <p>{learningModes[learningMode].label} / {selectedTopic.title}</p>
              </div>
              <button className="start-activity" disabled={isThinking} onClick={startActivity} type="button"><Play size={15} /> {learningModes[learningMode].action}</button>
              <button aria-label="Close the tutor" className="close-tutor" onClick={() => setTutorOpen(false)} title="Close the tutor" type="button"><X size={18} /></button>
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
                aria-label="Ask the tutor"
                onChange={(event) => setPrompt(event.target.value)}
                placeholder={`${learningModes[learningMode].label}: ask or submit an answer...`}
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
