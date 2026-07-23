import { useState, useEffect, useCallback } from "react";

const ADMIN_PASSWORD = "lex2024";

const initialCategories = [
  { id: "criminal", label: "Criminal Law", icon: "⚖️", color: "#1a3a5c", light: "#e6f1fb" },
  { id: "civil", label: "Civil Law", icon: "📜", color: "#0f6e56", light: "#e1f5ee" },
  { id: "constitutional", label: "Constitutional", icon: "🏛️", color: "#533a7d", light: "#eeedfe" },
  { id: "corporate", label: "Corporate Law", icon: "🏢", color: "#854f0b", light: "#faeeda" },
  { id: "family", label: "Family Law", icon: "👨‍👩‍👧", color: "#a32d2d", light: "#fcebeb" },
  { id: "property", label: "Property Law", icon: "🏠", color: "#3b6d11", light: "#eaf3de" },
  { id: "cyber", label: "Cyber Law", icon: "💻", color: "#185fa5", light: "#e6f1fb" },
  { id: "labour", label: "Labour Law", icon: "👷", color: "#993556", light: "#fbeaf0" },
];

const initialArticles = [
  {
    id: 1, category: "criminal", title: "Understanding Section 302 IPC – Murder",
    summary: "Section 302 of IPC defines murder and prescribes punishment. Learn about the essential ingredients, landmark cases, and recent amendments.",
    content: "Murder under Indian law requires intention or knowledge that the act is likely to cause death. The punishment ranges from death penalty to life imprisonment with fine. Key ingredients: (1) Causing death of a person, (2) Act done with intention of causing death, (3) Done with intention of causing such bodily injury as is likely to cause death.\n\nLandmark cases include K.M. Nanavati v. State of Maharashtra (1962) which changed jury trial system in India.",
    tags: ["IPC", "Murder", "Criminal"]
  },
  {
    id: 2, category: "constitutional", title: "Right to Privacy – Article 21 Explained",
    summary: "The Supreme Court's landmark 2017 judgment in K.S. Puttaswamy vs Union of India declared privacy a fundamental right under Article 21.",
    content: "The right to privacy is protected as an intrinsic part of the right to life and personal liberty under Article 21. This judgment laid the foundation for data protection laws in India. Key aspects: Informational privacy, privacy of choice, physical privacy.\n\nThis decision has since impacted Aadhaar, surveillance laws, and the proposed Digital Personal Data Protection Act 2023.",
    tags: ["Article 21", "Fundamental Rights", "Privacy"]
  },
  {
    id: 3, category: "cyber", title: "IT Act 2000 & Cyber Crimes in India",
    summary: "The Information Technology Act 2000 governs cyber crimes in India. Section 66A, though struck down, and Sections 67, 70, 72 remain critical.",
    content: "The IT Act 2000 provides legal recognition for electronic transactions and defines cyber offences. Important sections:\n- Section 43: Penalty for damage to computer\n- Section 66: Computer related offences\n- Section 67: Publishing obscene material\n- Section 70: Protected systems\n- Section 72: Breach of confidentiality\n\nAmendments in 2008 added stronger provisions for cyber terrorism and data theft.",
    tags: ["IT Act", "Cyber Crime", "Digital"]
  },
  {
    id: 4, category: "family", title: "Hindu Marriage Act 1955 – Grounds for Divorce",
    summary: "Section 13 of the Hindu Marriage Act lists grounds for divorce including cruelty, desertion, adultery, conversion, unsoundness of mind.",
    content: "Grounds for divorce under Hindu Marriage Act:\n1. Adultery (Section 13(1)(i))\n2. Cruelty (Section 13(1)(i-a))\n3. Desertion for 2 years (Section 13(1)(i-b))\n4. Conversion to another religion\n5. Unsoundness of mind\n6. Leprosy or venereal disease\n7. Renouncing the world\n8. Not heard alive for 7 years\n\nMutual consent divorce under Section 13-B requires 1 year separation and 6-18 months cooling period.",
    tags: ["Marriage", "Divorce", "Family"]
  },
  {
    id: 5, category: "corporate", title: "Companies Act 2013 – Director's Liability",
    summary: "Directors can be held personally liable under Companies Act 2013 for fraud, negligence, and failure to disclose interests.",
    content: "Director's liability under Companies Act 2013:\n- Section 166: Duties of directors\n- Section 447: Punishment for fraud (up to 10 years)\n- Section 149: Independent director qualifications\n- Section 184: Disclosure of interest\n\nThe concept of 'piercing the corporate veil' allows courts to hold directors personally liable in cases of fraud or misuse of corporate form.",
    tags: ["Companies Act", "Directors", "Corporate"]
  },
  {
    id: 6, category: "labour", title: "New Labour Codes 2020 – Key Changes",
    summary: "India's 4 new labour codes consolidate 44 existing laws. The Wage Code, Industrial Relations Code, Social Security Code, and OSH Code bring major reforms.",
    content: "The four Labour Codes:\n1. Code on Wages 2019 – Universal minimum wage\n2. Industrial Relations Code 2020 – Hire and fire flexibility\n3. Code on Social Security 2020 – Gig workers coverage\n4. OSH, Working Conditions Code 2020 – Safety standards\n\nKey changes: Fixed-term employment, 12-hour workday possibility, gratuity from Day 1, ESIC & PF for gig workers, retrenchment easier for companies up to 300 workers.",
    tags: ["Labour", "Wages", "Employment"]
  },
];

const hotTopicsData = [
  { id: 1, title: "SC Upholds Electoral Bond Scheme Nullification", category: "constitutional", urgency: "high", time: "2 hrs ago" },
  { id: 2, title: "DPDP Act Rules – Public Consultation Round 2", category: "cyber", urgency: "high", time: "4 hrs ago" },
  { id: 3, title: "BNS 2023 Implementation – Section-wise Guide", category: "criminal", urgency: "medium", time: "6 hrs ago" },
  { id: 4, title: "New Arbitration Amendment Bill 2024", category: "civil", urgency: "medium", time: "8 hrs ago" },
  { id: 5, title: "Supreme Court on Marital Rape – Judgment Awaited", category: "family", urgency: "high", time: "10 hrs ago" },
  { id: 6, title: "Labour Code Rollout – Implementation Delayed Again", category: "labour", urgency: "low", time: "12 hrs ago" },
];

const FAQ_DATA = [
  { q: "What is FIR and how to file one?", a: "An FIR (First Information Report) is the first step in a criminal case. You can file it at any police station (nearest to the place of offence). Under Section 154 CrPC (now BNSS), police must register your complaint. If refused, you can approach the SP or a Magistrate." },
  { q: "What are my rights during arrest?", a: "Under Article 22 and BNSS: Right to know grounds of arrest, Right to inform a friend/relative, Right to consult a lawyer, Right to be produced before Magistrate within 24 hours, Right against self-incrimination (Article 20(3))." },
  { q: "How to send a legal notice?", a: "A legal notice is a formal communication before filing a lawsuit. Draft it clearly stating facts, relief sought, and a timeline. Send via registered post with acknowledgment due. Keep copies. A lawyer can draft it for ₹500–₹5,000." },
  { q: "What is PIL and who can file it?", a: "Public Interest Litigation (PIL) can be filed in High Court (Article 226) or Supreme Court (Article 32) by any citizen on behalf of the public. No special locus standi required. Even a letter to the court can be treated as PIL." },
  { q: "Difference between cognizable and non-cognizable offence?", a: "Cognizable offences (murder, rape, robbery) allow police to arrest without warrant and register FIR directly. Non-cognizable offences (cheating, assault, trespass) require magistrate permission to investigate and cannot be registered as FIR directly." },
];

const LEXAI_ENDPOINT =
  import.meta.env.VITE_LEXAI_ENDPOINT ||
  (import.meta.env.DEV ? "/api/ask" : "https://lawlearn.onrender.com/ask");

async function postLexAI(payload) {
  if (!LEXAI_ENDPOINT) {
    throw new Error("LexAI endpoint is not configured.");
  }

  const response = await fetch(LEXAI_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  let data = {};
  try {
    data = await response.json();
  } catch {
    throw new Error("The AI server returned an invalid response.");
  }

  if (!response.ok) {
    throw new Error(data.error || data.answer || "The AI server could not answer right now.");
  }

  return data;
}

async function askLexAI(question, context = "") {
  try {
    const data = await postLexAI({ question, context });
    return data.answer || "Unable to fetch response. Please try again.";
  } catch (error) {
    return `LexAI could not answer right now.\n\n${error.message}\n\nIf you are running this locally, start the backend server and set GEMINI_API_KEY in server/.env.`;
  }
}

export default function LexLearn() {
  const [tab, setTab] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiHistory, setAiHistory] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminInput, setAdminInput] = useState("");
  const [adminError, setAdminError] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [articles, setArticles] = useState(initialArticles);
  const [hotTopics, setHotTopics] = useState(hotTopicsData);
  const [editingArticle, setEditingArticle] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [newArticleForm, setNewArticleForm] = useState({ title: "", category: "criminal", summary: "", content: "", tags: "" });
  const [showNewForm, setShowNewForm] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);
  const [hotLoading, setHotLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [countdown, setCountdown] = useState(7200);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          refreshHotTopics();
          return 7200;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const refreshHotTopics = useCallback(async () => {
    setHotLoading(true);
    try {
      const data = await postLexAI({ mode: "hotTopics" });
      const text = Array.isArray(data.topics) ? JSON.stringify(data.topics) : data.topics || "[]";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      if (Array.isArray(parsed) && parsed.length) {
        setHotTopics(parsed);
        setLastUpdated(new Date());
        showToast("Hot topics refreshed with latest legal news!");
      }
    } catch (e) {
      showToast("Using cached topics – refresh failed", "error");
    }
    setHotLoading(false);
  }, []);

  const handleAskAI = async () => {
    if (!aiQuestion.trim()) return;
    setAiLoading(true);
    const q = aiQuestion;
    setAiQuestion("");
    const context = selectedArticle ? `User is reading: ${selectedArticle.title}` : "";
    try {
      const answer = await askLexAI(q, context);
      const entry = { q, a: answer, time: new Date().toLocaleTimeString() };
      setAiHistory(h => [entry, ...h.slice(0, 9)]);
      setAiAnswer(answer);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAdminLogin = () => {
    if (adminInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminError("");
      showToast("Admin access granted!");
    } else {
      setAdminError("Incorrect password.");
    }
  };

  const handleSaveEdit = () => {
    setArticles(prev => prev.map(a => a.id === editingArticle.id ? { ...a, ...editForm, tags: editForm.tags.split(",").map(t => t.trim()) } : a));
    setEditingArticle(null);
    showToast("Article updated successfully!");
  };

  const handleDeleteArticle = (id) => {
    setArticles(prev => prev.filter(a => a.id !== id));
    showToast("Article deleted.");
  };

  const handleAddArticle = () => {
    const newArt = {
      id: Date.now(),
      ...newArticleForm,
      tags: newArticleForm.tags.split(",").map(t => t.trim())
    };
    setArticles(prev => [...prev, newArt]);
    setShowNewForm(false);
    setNewArticleForm({ title: "", category: "criminal", summary: "", content: "", tags: "" });
    showToast("New article published!");
  };

  const filteredArticles = articles.filter(a =>
    (!selectedCategory || a.category === selectedCategory) &&
    (!searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const fmtCountdown = () => {
    const h = Math.floor(countdown / 3600);
    const m = Math.floor((countdown % 3600) / 60);
    const s = countdown % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const urgencyColor = { high: "#a32d2d", medium: "#854f0b", low: "#0f6e56" };
  const urgencyBg = { high: "#fcebeb", medium: "#faeeda", low: "#e1f5ee" };

  return (
    <div style={{ fontFamily: "'Georgia', serif", minHeight: "100vh", background: "var(--color-background-tertiary)" }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, background: toast.type === "error" ? "#a32d2d" : "#0f6e56", color: "#fff", padding: "12px 20px", borderRadius: 10, fontSize: 14, fontFamily: "sans-serif", boxShadow: "0 4px 20px rgba(0,0,0,0.2)", maxWidth: 320 }}>
          {toast.type === "error" ? "⚠️" : "✅"} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ background: "#0d1b2a", color: "#fff", padding: "0 0 0 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 42, height: 42, background: "linear-gradient(135deg,#c9a84c,#e8c96a)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>⚖️</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 1, color: "#e8c96a" }}>LexLearn</div>
              <div style={{ fontSize: 11, color: "#8a9bb5", letterSpacing: 2 }}>INDIA'S LAW LEARNING PLATFORM</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            {["home", "learn", "ai-ask", "faq"].map(t => (
              <button key={t} onClick={() => { setTab(t); setSelectedArticle(null); }} style={{ padding: "8px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontFamily: "sans-serif", fontSize: 13, fontWeight: 600, background: tab === t ? "#c9a84c" : "rgba(255,255,255,0.1)", color: tab === t ? "#0d1b2a" : "#cdd9e8", transition: "all 0.2s" }}>
                {t === "home" ? "🏠 Home" : t === "learn" ? "📚 Learn" : t === "ai-ask" ? "🤖 Ask AI" : "❓ FAQ"}
              </button>
            ))}
            {!isAdmin ? (
              <button onClick={() => setShowAdminLogin(true)} style={{ padding: "8px 14px", borderRadius: 20, border: "1px solid #c9a84c", cursor: "pointer", fontFamily: "sans-serif", fontSize: 12, background: "transparent", color: "#c9a84c" }}>🔐 Admin</button>
            ) : (
              <button onClick={() => { setIsAdmin(false); showToast("Logged out"); }} style={{ padding: "8px 14px", borderRadius: 20, border: "1px solid #5dcaa5", cursor: "pointer", fontFamily: "sans-serif", fontSize: 12, background: "rgba(93,202,165,0.1)", color: "#5dcaa5" }}>✓ Admin Mode</button>
            )}
          </div>
        </div>
      </div>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "var(--color-background-primary)", borderRadius: 16, padding: 32, width: 340, fontFamily: "sans-serif" }}>
            <h3 style={{ margin: "0 0 6px", color: "var(--color-text-primary)", fontSize: 18 }}>🔐 Admin Access</h3>
            <p style={{ color: "var(--color-text-secondary)", fontSize: 13, margin: "0 0 20px" }}>Enter admin password to edit content</p>
            <input type="password" placeholder="Password" value={adminInput} onChange={e => setAdminInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAdminLogin()} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--color-border-primary)", fontSize: 14, marginBottom: 10, boxSizing: "border-box", background: "var(--color-background-primary)", color: "var(--color-text-primary)" }} />
            {adminError && <p style={{ color: "#a32d2d", fontSize: 12, margin: "0 0 10px" }}>{adminError}</p>}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleAdminLogin} style={{ flex: 1, padding: "10px", background: "#0d1b2a", color: "#e8c96a", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>Login</button>
              <button onClick={() => { setShowAdminLogin(false); setAdminError(""); setAdminInput(""); }} style={{ padding: "10px 16px", background: "none", border: "1px solid var(--color-border-primary)", borderRadius: 8, cursor: "pointer", fontSize: 14, color: "var(--color-text-secondary)" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Article Modal */}
      {editingArticle && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "var(--color-background-primary)", borderRadius: 16, padding: 28, width: "100%", maxWidth: 600, maxHeight: "90vh", overflowY: "auto", fontFamily: "sans-serif" }}>
            <h3 style={{ margin: "0 0 20px", color: "var(--color-text-primary)" }}>✏️ Edit Article</h3>
            {["title", "summary"].map(f => (
              <div key={f} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: 1 }}>{f}</label>
                <input value={editForm[f] || ""} onChange={e => setEditForm(ef => ({ ...ef, [f]: e.target.value }))} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--color-border-primary)", fontSize: 14, marginTop: 4, boxSizing: "border-box", background: "var(--color-background-primary)", color: "var(--color-text-primary)" }} />
              </div>
            ))}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: 1 }}>Content</label>
              <textarea value={editForm.content || ""} onChange={e => setEditForm(ef => ({ ...ef, content: e.target.value }))} rows={6} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--color-border-primary)", fontSize: 13, marginTop: 4, boxSizing: "border-box", resize: "vertical", background: "var(--color-background-primary)", color: "var(--color-text-primary)" }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: 1 }}>Tags (comma separated)</label>
              <input value={Array.isArray(editForm.tags) ? editForm.tags.join(", ") : editForm.tags || ""} onChange={e => setEditForm(ef => ({ ...ef, tags: e.target.value }))} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--color-border-primary)", fontSize: 14, marginTop: 4, boxSizing: "border-box", background: "var(--color-background-primary)", color: "var(--color-text-primary)" }} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleSaveEdit} style={{ flex: 1, padding: 10, background: "#0f6e56", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>💾 Save Changes</button>
              <button onClick={() => setEditingArticle(null)} style={{ padding: "10px 16px", background: "none", border: "1px solid var(--color-border-primary)", borderRadius: 8, cursor: "pointer", color: "var(--color-text-secondary)" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px 60px" }}>

        {/* HOME TAB */}
        {tab === "home" && (
          <div>
            {/* Hero */}
            <div style={{ background: "linear-gradient(135deg,#0d1b2a 60%,#1a3a5c)", borderRadius: 20, padding: "40px 40px", marginBottom: 28, color: "#fff", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: -20, top: -20, fontSize: 120, opacity: 0.07 }}>⚖️</div>
              <div style={{ fontSize: 13, color: "#c9a84c", letterSpacing: 2, marginBottom: 8, fontFamily: "sans-serif" }}>AI-POWERED · ALWAYS UPDATED · FREE</div>
              <h1 style={{ fontSize: 36, margin: "0 0 12px", fontWeight: 700, lineHeight: 1.2 }}>Understand the Law.<br /><span style={{ color: "#e8c96a" }}>Know Your Rights.</span></h1>
              <p style={{ color: "#9ab4cc", margin: "0 0 24px", maxWidth: 480, fontFamily: "sans-serif", fontSize: 15, lineHeight: 1.6 }}>India's most comprehensive law learning platform. Explore legal topics, ask our AI assistant, and stay updated with the latest legal developments.</p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button onClick={() => setTab("learn")} style={{ padding: "12px 24px", background: "#c9a84c", color: "#0d1b2a", border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "sans-serif", fontSize: 14, fontWeight: 700 }}>📚 Start Learning</button>
                <button onClick={() => setTab("ai-ask")} style={{ padding: "12px 24px", background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, cursor: "pointer", fontFamily: "sans-serif", fontSize: 14 }}>🤖 Ask AI Anything</button>
              </div>
            </div>

            {/* Hot Topics */}
            <div style={{ background: "var(--color-background-primary)", borderRadius: 16, padding: "24px 28px", marginBottom: 28, border: "0.5px solid var(--color-border-tertiary)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "var(--color-text-primary)", fontFamily: "sans-serif" }}>🔥 Hot Legal Topics</div>
                  <div style={{ fontSize: 12, color: "var(--color-text-secondary)", fontFamily: "sans-serif", marginTop: 3 }}>
                    Auto-refreshes every 2 hours · Next in: <span style={{ color: "#c9a84c", fontWeight: 600 }}>{fmtCountdown()}</span> · Last updated: {lastUpdated.toLocaleTimeString()}
                  </div>
                </div>
                <button onClick={refreshHotTopics} disabled={hotLoading} style={{ padding: "8px 16px", background: hotLoading ? "#ccc" : "#0d1b2a", color: "#e8c96a", border: "none", borderRadius: 8, cursor: hotLoading ? "not-allowed" : "pointer", fontFamily: "sans-serif", fontSize: 13, fontWeight: 600 }}>
                  {hotLoading ? "⏳ Refreshing..." : "⟳ Refresh Now"}
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 12 }}>
                {hotTopics.map(t => (
                  <div key={t.id} onClick={() => { setSelectedCategory(t.category); setTab("learn"); }} style={{ padding: "14px 16px", borderRadius: 10, border: "0.5px solid var(--color-border-tertiary)", cursor: "pointer", background: "var(--color-background-secondary)", transition: "all 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "#c9a84c"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "var(--color-border-tertiary)"}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: urgencyBg[t.urgency] || "#f5f5f5", color: urgencyColor[t.urgency] || "#333", fontFamily: "sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{t.urgency}</span>
                      <span style={{ fontSize: 11, color: "var(--color-text-secondary)", fontFamily: "sans-serif" }}>{t.time}</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)", fontFamily: "sans-serif", lineHeight: 1.4 }}>{t.title}</div>
                    <div style={{ fontSize: 12, color: "var(--color-text-secondary)", fontFamily: "sans-serif", marginTop: 4, textTransform: "capitalize" }}>{t.category.replace("-", " ")} Law →</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 16px", color: "var(--color-text-primary)", fontFamily: "sans-serif" }}>📂 Browse by Category</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 12 }}>
                {initialCategories.map(c => (
                  <div key={c.id} onClick={() => { setSelectedCategory(c.id); setTab("learn"); }} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 14, padding: "20px 14px", textAlign: "center", cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = c.light; e.currentTarget.style.borderColor = c.color; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "var(--color-background-primary)"; e.currentTarget.style.borderColor = "var(--color-border-tertiary)"; }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-primary)", fontFamily: "sans-serif", lineHeight: 1.3 }}>{c.label}</div>
                    <div style={{ fontSize: 11, color: "var(--color-text-secondary)", fontFamily: "sans-serif", marginTop: 4 }}>{articles.filter(a => a.category === c.id).length} articles</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12 }}>
              {[["📋", articles.length, "Total Articles"], ["⚖️", "8", "Law Categories"], ["🤖", "AI", "Powered Assistant"], ["🔄", "2hr", "Update Cycle"]].map(([icon, val, label]) => (
                <div key={label} style={{ background: "var(--color-background-primary)", borderRadius: 12, padding: "20px 16px", textAlign: "center", border: "0.5px solid var(--color-border-tertiary)" }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: "#0d1b2a", fontFamily: "sans-serif" }}>{val}</div>
                  <div style={{ fontSize: 12, color: "var(--color-text-secondary)", fontFamily: "sans-serif" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LEARN TAB */}
        {tab === "learn" && !selectedArticle && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <h2 style={{ fontSize: 22, margin: 0, color: "var(--color-text-primary)", fontFamily: "sans-serif" }}>📚 Law Library</h2>
              {isAdmin && (
                <button onClick={() => setShowNewForm(!showNewForm)} style={{ padding: "10px 18px", background: "#0f6e56", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "sans-serif", fontSize: 13, fontWeight: 600 }}>
                  {showNewForm ? "✕ Cancel" : "+ Add Article"}
                </button>
              )}
            </div>

            {/* New Article Form */}
            {isAdmin && showNewForm && (
              <div style={{ background: "var(--color-background-primary)", borderRadius: 14, padding: 24, marginBottom: 24, border: "2px solid #0f6e56", fontFamily: "sans-serif" }}>
                <h3 style={{ margin: "0 0 16px", color: "var(--color-text-primary)" }}>📝 New Article</h3>
                {["title", "summary"].map(f => (
                  <div key={f} style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 12, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: 1 }}>{f}</label>
                    <input value={newArticleForm[f]} onChange={e => setNewArticleForm(nf => ({ ...nf, [f]: e.target.value }))} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--color-border-primary)", fontSize: 14, marginTop: 4, boxSizing: "border-box", background: "var(--color-background-primary)", color: "var(--color-text-primary)" }} />
                  </div>
                ))}
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: 1 }}>Category</label>
                  <select value={newArticleForm.category} onChange={e => setNewArticleForm(nf => ({ ...nf, category: e.target.value }))} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--color-border-primary)", fontSize: 14, marginTop: 4, boxSizing: "border-box", background: "var(--color-background-primary)", color: "var(--color-text-primary)" }}>
                    {initialCategories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: 1 }}>Content</label>
                  <textarea value={newArticleForm.content} onChange={e => setNewArticleForm(nf => ({ ...nf, content: e.target.value }))} rows={5} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--color-border-primary)", fontSize: 13, marginTop: 4, boxSizing: "border-box", resize: "vertical", background: "var(--color-background-primary)", color: "var(--color-text-primary)" }} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: 1 }}>Tags (comma separated)</label>
                  <input value={newArticleForm.tags} onChange={e => setNewArticleForm(nf => ({ ...nf, tags: e.target.value }))} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--color-border-primary)", fontSize: 14, marginTop: 4, boxSizing: "border-box", background: "var(--color-background-primary)", color: "var(--color-text-primary)" }} />
                </div>
                <button onClick={handleAddArticle} style={{ padding: "10px 24px", background: "#0f6e56", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>✓ Publish Article</button>
              </div>
            )}

            {/* Search + Filter */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
              <input placeholder="🔍 Search articles, laws, sections..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ flex: 1, minWidth: 200, padding: "11px 16px", borderRadius: 10, border: "1px solid var(--color-border-primary)", fontSize: 14, background: "var(--color-background-primary)", color: "var(--color-text-primary)", fontFamily: "sans-serif" }} />
              <select value={selectedCategory || ""} onChange={e => setSelectedCategory(e.target.value || null)} style={{ padding: "11px 16px", borderRadius: 10, border: "1px solid var(--color-border-primary)", fontSize: 14, background: "var(--color-background-primary)", color: "var(--color-text-primary)", fontFamily: "sans-serif" }}>
                <option value="">All Categories</option>
                {initialCategories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(310px,1fr))", gap: 16 }}>
              {filteredArticles.map(a => {
                const cat = initialCategories.find(c => c.id === a.category);
                return (
                  <div key={a.id} style={{ background: "var(--color-background-primary)", borderRadius: 14, border: "0.5px solid var(--color-border-tertiary)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                    <div style={{ height: 4, background: cat?.color || "#333" }} />
                    <div style={{ padding: "18px 20px", flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                        <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: cat?.light || "#f5f5f5", color: cat?.color || "#333", fontFamily: "sans-serif", fontWeight: 600 }}>{cat?.icon} {cat?.label}</span>
                        {isAdmin && (
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => { setEditingArticle(a); setEditForm({ ...a, tags: a.tags.join(", ") }); }} style={{ fontSize: 12, padding: "3px 8px", borderRadius: 6, border: "1px solid #185fa5", background: "#e6f1fb", color: "#185fa5", cursor: "pointer", fontFamily: "sans-serif" }}>✏️</button>
                            <button onClick={() => handleDeleteArticle(a.id)} style={{ fontSize: 12, padding: "3px 8px", borderRadius: 6, border: "1px solid #a32d2d", background: "#fcebeb", color: "#a32d2d", cursor: "pointer", fontFamily: "sans-serif" }}>🗑️</button>
                          </div>
                        )}
                      </div>
                      <h3 style={{ fontSize: 16, margin: "0 0 8px", color: "var(--color-text-primary)", fontFamily: "sans-serif", lineHeight: 1.4 }}>{a.title}</h3>
                      <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "0 0 14px", lineHeight: 1.5, fontFamily: "sans-serif" }}>{a.summary}</p>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {a.tags.map(t => <span key={t} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 5, background: "var(--color-background-secondary)", color: "var(--color-text-secondary)", fontFamily: "sans-serif", border: "0.5px solid var(--color-border-tertiary)" }}>{t}</span>)}
                      </div>
                    </div>
                    <div style={{ padding: "12px 20px", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
                      <button onClick={() => setSelectedArticle(a)} style={{ width: "100%", padding: "9px", background: "#0d1b2a", color: "#e8c96a", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "sans-serif", fontSize: 13, fontWeight: 600 }}>Read Article →</button>
                    </div>
                  </div>
                );
              })}
            </div>
            {filteredArticles.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--color-text-secondary)", fontFamily: "sans-serif" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                <div style={{ fontSize: 16 }}>No articles found. Try a different search.</div>
              </div>
            )}
          </div>
        )}

        {/* ARTICLE DETAIL */}
        {tab === "learn" && selectedArticle && (
          <div>
            <button onClick={() => setSelectedArticle(null)} style={{ padding: "8px 16px", background: "none", border: "0.5px solid var(--color-border-primary)", borderRadius: 8, cursor: "pointer", fontFamily: "sans-serif", fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 20 }}>← Back to Library</button>
            <div style={{ background: "var(--color-background-primary)", borderRadius: 16, padding: "32px 36px", border: "0.5px solid var(--color-border-tertiary)" }}>
              <div style={{ marginBottom: 16 }}>
                {selectedArticle.tags.map(t => <span key={t} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: "var(--color-background-secondary)", color: "var(--color-text-secondary)", fontFamily: "sans-serif", marginRight: 6, border: "0.5px solid var(--color-border-tertiary)" }}>{t}</span>)}
              </div>
              <h1 style={{ fontSize: 26, margin: "0 0 12px", color: "var(--color-text-primary)", lineHeight: 1.3 }}>{selectedArticle.title}</h1>
              <p style={{ fontSize: 15, color: "var(--color-text-secondary)", margin: "0 0 28px", lineHeight: 1.6, fontFamily: "sans-serif", borderLeft: "3px solid #c9a84c", paddingLeft: 16 }}>{selectedArticle.summary}</p>
              <div style={{ fontSize: 14, color: "var(--color-text-primary)", lineHeight: 1.9, fontFamily: "sans-serif", whiteSpace: "pre-wrap" }}>{selectedArticle.content}</div>
              <div style={{ marginTop: 32, padding: "20px 24px", background: "#faeeda", borderRadius: 12, border: "1px solid #c9a84c" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#854f0b", marginBottom: 6, fontFamily: "sans-serif" }}>⚠️ Disclaimer</div>
                <div style={{ fontSize: 12, color: "#854f0b", fontFamily: "sans-serif", lineHeight: 1.6 }}>This content is for educational purposes only. For personal legal matters, always consult a qualified advocate or legal professional.</div>
              </div>
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 13, color: "var(--color-text-secondary)", fontFamily: "sans-serif", marginBottom: 10 }}>💬 Ask AI about this topic:</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input placeholder={`Ask about ${selectedArticle.title}...`} value={aiQuestion} onChange={e => setAiQuestion(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAskAI()} style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: "1px solid var(--color-border-primary)", fontSize: 13, background: "var(--color-background-primary)", color: "var(--color-text-primary)", fontFamily: "sans-serif" }} />
                  <button onClick={handleAskAI} disabled={aiLoading || !aiQuestion.trim()} style={{ padding: "10px 18px", background: "#0d1b2a", color: "#e8c96a", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "sans-serif", fontSize: 13, fontWeight: 600 }}>{aiLoading ? "..." : "Ask"}</button>
                </div>
                {aiAnswer && (
                  <div style={{ marginTop: 14, padding: "16px 18px", background: "var(--color-background-secondary)", borderRadius: 10, fontSize: 13, lineHeight: 1.7, color: "var(--color-text-primary)", fontFamily: "sans-serif", border: "0.5px solid var(--color-border-tertiary)", whiteSpace: "pre-wrap" }}>
                    <div style={{ fontSize: 11, color: "#c9a84c", marginBottom: 8, fontWeight: 600 }}>🤖 LexAI Response</div>
                    {aiAnswer}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* AI ASK TAB */}
        {tab === "ai-ask" && (
          <div>
            <div style={{ background: "linear-gradient(135deg,#0d1b2a,#1a3a5c)", borderRadius: 16, padding: "28px 32px", marginBottom: 24, color: "#fff" }}>
              <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>🤖 Ask LexAI</div>
              <p style={{ color: "#9ab4cc", margin: 0, fontFamily: "sans-serif", fontSize: 14 }}>Your AI-powered Indian law assistant. Ask about any legal topic, your rights, or specific laws.</p>
            </div>

            <div style={{ background: "var(--color-background-primary)", borderRadius: 14, padding: "24px", marginBottom: 20, border: "0.5px solid var(--color-border-tertiary)" }}>
              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                <input placeholder="E.g. What is Section 498A? What are my rights during arrest? How to file a consumer complaint?" value={aiQuestion} onChange={e => setAiQuestion(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAskAI()} style={{ flex: 1, padding: "13px 16px", borderRadius: 10, border: "1px solid var(--color-border-primary)", fontSize: 14, background: "var(--color-background-primary)", color: "var(--color-text-primary)", fontFamily: "sans-serif" }} />
                <button onClick={handleAskAI} disabled={aiLoading || !aiQuestion.trim()} style={{ padding: "12px 24px", background: aiLoading ? "#ccc" : "#0d1b2a", color: "#e8c96a", border: "none", borderRadius: 10, cursor: aiLoading ? "not-allowed" : "pointer", fontFamily: "sans-serif", fontSize: 14, fontWeight: 700, whiteSpace: "nowrap" }}>
                  {aiLoading ? "⏳ Thinking..." : "Ask →"}
                </button>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["What is FIR?", "Bail rights in India", "Consumer protection act", "Cyber crime complaint", "Property dispute laws"].map(q => (
                  <button key={q} onClick={() => { setAiQuestion(q); }} style={{ fontSize: 12, padding: "5px 12px", borderRadius: 20, border: "0.5px solid var(--color-border-primary)", background: "var(--color-background-secondary)", color: "var(--color-text-secondary)", cursor: "pointer", fontFamily: "sans-serif" }}>{q}</button>
                ))}
              </div>
            </div>

            {aiHistory.length > 0 && (
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 14, fontFamily: "sans-serif" }}>Recent Q&A</div>
                {aiHistory.map((entry, i) => (
                  <div key={i} style={{ background: "var(--color-background-primary)", borderRadius: 12, padding: "20px 24px", marginBottom: 14, border: "0.5px solid var(--color-border-tertiary)" }}>
                    <div style={{ fontSize: 12, color: "var(--color-text-secondary)", fontFamily: "sans-serif", marginBottom: 8 }}>🕐 {entry.time}</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "var(--color-text-primary)", fontFamily: "sans-serif", marginBottom: 12, paddingBottom: 12, borderBottom: "0.5px solid var(--color-border-tertiary)" }}>❓ {entry.q}</div>
                    <div style={{ fontSize: 13, lineHeight: 1.8, color: "var(--color-text-primary)", fontFamily: "sans-serif", whiteSpace: "pre-wrap" }}>
                      <span style={{ fontSize: 11, color: "#c9a84c", fontWeight: 700 }}>LEXAI: </span>{entry.a}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {aiHistory.length === 0 && (
              <div style={{ textAlign: "center", padding: "50px 20px", color: "var(--color-text-secondary)", fontFamily: "sans-serif" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
                <div style={{ fontSize: 16, marginBottom: 8 }}>Your legal questions, answered instantly</div>
                <div style={{ fontSize: 13 }}>Ask about any aspect of Indian law above</div>
              </div>
            )}
          </div>
        )}

        {/* FAQ TAB */}
        {tab === "faq" && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 24, margin: "0 0 6px", color: "var(--color-text-primary)", fontFamily: "sans-serif" }}>❓ Frequently Asked Questions</h2>
              <p style={{ color: "var(--color-text-secondary)", margin: 0, fontFamily: "sans-serif", fontSize: 14 }}>Common legal questions answered in plain language</p>
            </div>
            <div>
              {FAQ_DATA.map((item, i) => (
                <div key={i} style={{ background: "var(--color-background-primary)", borderRadius: 12, marginBottom: 12, border: "0.5px solid var(--color-border-tertiary)", overflow: "hidden" }}>
                  <div onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{ padding: "18px 22px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "sans-serif" }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: "var(--color-text-primary)", paddingRight: 16 }}>{item.q}</span>
                    <span style={{ fontSize: 18, color: "var(--color-text-secondary)", flexShrink: 0 }}>{faqOpen === i ? "−" : "+"}</span>
                  </div>
                  {faqOpen === i && (
                    <div style={{ padding: "0 22px 18px", fontSize: 14, lineHeight: 1.7, color: "var(--color-text-secondary)", fontFamily: "sans-serif", borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: 16 }}>
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 28, background: "#e6f1fb", borderRadius: 14, padding: "24px 28px" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#0d1b2a", marginBottom: 8, fontFamily: "sans-serif" }}>🔍 Can't find your answer?</div>
              <p style={{ color: "#185fa5", margin: "0 0 14px", fontFamily: "sans-serif", fontSize: 14 }}>Ask our AI assistant for instant answers to any Indian law query.</p>
              <button onClick={() => setTab("ai-ask")} style={{ padding: "10px 22px", background: "#0d1b2a", color: "#e8c96a", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "sans-serif", fontSize: 13, fontWeight: 700 }}>Ask LexAI →</button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ background: "#0d1b2a", color: "#5a7a99", padding: "20px 24px", textAlign: "center", fontFamily: "sans-serif", fontSize: 12 }}>
        <span style={{ color: "#e8c96a" }}>⚖️ LexLearn</span> · Educational purposes only · Not a substitute for professional legal advice · © 2026
      </div>
    </div>
  );
}
