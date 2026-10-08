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
  {
    id: 7, category: "civil", title: "Indian Contract Act 1872 – Essentials of a Valid Contract",
    summary: "A valid contract needs offer, acceptance, consideration, and free consent between parties competent to contract, for a lawful object.",
    content: "Under Section 10 of the Indian Contract Act 1872, an agreement becomes a contract when made by parties competent to contract, with free consent, for a lawful consideration and lawful object, and not expressly declared void.\n\nKey elements:\n1. Offer and Acceptance (Sections 2-9)\n2. Lawful Consideration (Section 23-25)\n3. Free Consent - not caused by coercion, undue influence, fraud, misrepresentation, or mistake (Sections 13-22)\n4. Capacity to Contract - parties must be of the age of majority, sound mind, and not disqualified by law (Section 11)\n\nAgreements without consideration are void (Section 25), with exceptions like natural love and affection between close relatives, or compensation for past voluntary services.",
    tags: ["Contract Act", "Civil Law", "Agreements"]
  },
  {
    id: 8, category: "civil", title: "Limitation Act 1963 – Time Limits for Civil Suits",
    summary: "The Limitation Act sets deadlines for filing civil suits; most contract and tort claims must be filed within 3 years of the cause of action.",
    content: "The Limitation Act 1963 prescribes time limits within which suits, appeals, and applications must be filed, after which the right to sue is generally barred.\n\nCommon limitation periods:\n- Suit for breach of contract: 3 years from the date the breach occurs\n- Suit for recovery of possession of immovable property: 12 years\n- Suit based on a mortgage: 12 years\n- Suit for compensation for tort (general): 1 to 3 years depending on the tort\n\nSection 5 allows condonation of delay for appeals and certain applications if the applicant shows 'sufficient cause' for not filing on time. Courts have discretion here, and this ground does not extend to ordinary civil suits, only appeals and specified applications.",
    tags: ["Limitation Act", "Civil Procedure", "Deadlines"]
  },
  {
    id: 9, category: "property", title: "Transfer of Property Act 1882 – Sale, Mortgage, and Lease",
    summary: "The Transfer of Property Act governs how immovable property can be sold, mortgaged, leased, or gifted between living persons in India.",
    content: "The Transfer of Property Act 1882 deals with transfers of property between living persons (inter vivos), distinct from inheritance which is governed by succession laws.\n\nKey concepts:\n- Sale (Section 54): Transfer of ownership for a price; sale of tangible immovable property worth Rs. 100 or more must be by a registered instrument\n- Mortgage (Section 58): Transfer of an interest in property to secure repayment of a loan, without transferring full ownership\n- Lease (Section 105): Transfer of a right to enjoy property for a term, in exchange for rent, without transferring ownership\n- Gift (Section 122): Voluntary transfer without consideration, which must be accepted by the donee during the donor's lifetime\n\nSection 53A introduces 'part performance' - protecting a buyer in possession under an unregistered but part-performed contract of sale from being evicted by the seller.",
    tags: ["Property Act", "Sale Deed", "Mortgage"]
  },
  {
    id: 10, category: "property", title: "Registration Act 1908 – Why Registration Matters",
    summary: "Certain documents, including most sales of immovable property over Rs. 100, must be registered to be legally valid and admissible as evidence.",
    content: "The Registration Act 1908 makes registration compulsory for certain categories of documents (Section 17), including:\n- Instruments of gift of immovable property\n- Non-testamentary instruments creating or transferring any right, title, or interest in immovable property worth Rs. 100 or more\n- Leases of immovable property for terms exceeding one year\n\nAn unregistered document that is compulsorily registrable generally cannot be used as evidence of the transaction in court (subject to limited exceptions), and does not by itself pass title.\n\nRegistration must typically happen within 4 months of execution (Section 23), though delayed registration is possible with additional fees under Section 25 and 34, subject to time limits and the Registrar's discretion.",
    tags: ["Registration Act", "Property", "Documentation"]
  },
  {
    id: 11, category: "criminal", title: "Bharatiya Nyaya Sanhita 2023 – Replacing the IPC",
    summary: "The BNS 2023 replaced the 163-year-old Indian Penal Code, renumbering offences, adding new crimes like mob lynching, and revising some punishments.",
    content: "The Bharatiya Nyaya Sanhita (BNS) 2023 came into force in 2024, replacing the Indian Penal Code 1860. It retains most core offence definitions but renumbers sections and makes several changes.\n\nNotable changes:\n- Murder, previously Section 302 IPC, is now Section 103 BNS\n- New offences added, including organized crime and terrorism (previously handled under special laws), and mob lynching as an aggravated form of murder\n- Community service introduced as a form of punishment for minor offences for the first time\n- Sedition (Section 124A IPC) was repealed and replaced with a redefined offence relating to acts endangering sovereignty, unity, and integrity of India\n\nThe BNS works alongside the Bharatiya Nagarik Suraksha Sanhita (replacing the CrPC) and the Bharatiya Sakshya Adhiniyam (replacing the Evidence Act).",
    tags: ["BNS", "IPC", "Criminal Law Reform"]
  },
  {
    id: 12, category: "constitutional", title: "Article 32 – The Right to Constitutional Remedies",
    summary: "Article 32 lets citizens go directly to the Supreme Court to enforce fundamental rights, and was called the 'heart and soul' of the Constitution by Dr. Ambedkar.",
    content: "Article 32 guarantees the right to move the Supreme Court directly for enforcement of fundamental rights under Part III of the Constitution.\n\nThe Supreme Court can issue five types of writs under Article 32:\n1. Habeas Corpus - produce a detained person before the court\n2. Mandamus - direct a public authority to perform its duty\n3. Prohibition - stop a lower court from exceeding jurisdiction\n4. Certiorari - quash an order of a lower court or tribunal\n5. Quo Warranto - question the legality of a person holding public office\n\nHigh Courts have a parallel, and in some ways wider, writ power under Article 226, which extends to enforcement of legal rights generally, not just fundamental rights. This dual system means a person can approach either the High Court or the Supreme Court for a fundamental rights violation.",
    tags: ["Article 32", "Writs", "Constitutional Remedies"]
  },
  {
    id: 13, category: "corporate", title: "SEBI Insider Trading Regulations – The Basics",
    summary: "SEBI's Prohibition of Insider Trading Regulations bar trading in securities while in possession of unpublished price-sensitive information (UPSI).",
    content: "The SEBI (Prohibition of Insider Trading) Regulations 2015 prohibit 'insiders' - including designated persons, connected persons, and anyone in possession of unpublished price-sensitive information (UPSI) - from trading in a company's securities based on that information.\n\nKey concepts:\n- UPSI includes information about financial results, dividends, mergers, acquisitions, and changes in key managerial personnel, that is not yet public and would materially affect share price\n- Insiders and their immediate relatives are required to make periodic disclosures of their trading and holdings\n- Companies must maintain a structured digital database recording UPSI and the people who have access to it\n- Trading window closures are mandated before results and other major announcements\n\nViolations can attract penalties under the SEBI Act and, in serious cases, criminal prosecution, in addition to disgorgement of profits made from the trades.",
    tags: ["SEBI", "Insider Trading", "Securities Law"]
  },
  {
    id: 14, category: "family", title: "Muslim Personal Law – Marriage and Divorce Essentials",
    summary: "Muslim marriage under Indian law is treated as a civil contract (nikah), with divorce available through several routes including talaq and khula.",
    content: "Marriage (nikah) under Muslim personal law in India is treated as a civil contract requiring offer (ijab) and acceptance (qubul) in the presence of witnesses, along with a mandatory mahr (dower) payable to the wife.\n\nModes of divorce include:\n- Talaq - pronounced by the husband; 'triple talaq' in a single sitting was declared unconstitutional by the Supreme Court in Shayara Bano v. Union of India (2017) and later criminalized by the Muslim Women (Protection of Rights on Marriage) Act 2019\n- Khula - divorce initiated by the wife, typically by returning the mahr\n- Mubarat - divorce by mutual consent\n- Judicial divorce - available to wives under the Dissolution of Muslim Marriages Act 1939, on grounds including cruelty, desertion, and failure to maintain\n\nMaintenance for divorced Muslim women is governed by the Muslim Women (Protection of Rights on Divorce) Act 1986, as interpreted by courts to ensure reasonable and fair provision extending beyond the iddat period in many cases.",
    tags: ["Muslim Law", "Marriage", "Divorce"]
  },
  {
    id: 15, category: "cyber", title: "Digital Personal Data Protection Act 2023 – Overview",
    summary: "The DPDP Act 2023 is India's first comprehensive data protection law, governing how businesses and the government can collect and use personal data.",
    content: "The Digital Personal Data Protection Act 2023 establishes rules for processing digital personal data in India, applying to both domestic processing and foreign processing that targets goods or services offered to individuals in India.\n\nKey features:\n- Consent is the primary legal basis for processing personal data, with certain 'legitimate uses' as exceptions (e.g., for employment purposes, medical emergencies, or state functions)\n- Individuals ('Data Principals') get rights to access, correct, and erase their data, and to nominate someone to exercise these rights after death or incapacity\n- Organizations processing data ('Data Fiduciaries') must implement reasonable security safeguards and report data breaches to the Data Protection Board\n- Significant penalties are prescribed for non-compliance, going up to Rs. 250 crore for failing to prevent a data breach\n\nThe Act also creates a Data Protection Board of India to handle enforcement, though rules for its full operationalization have been rolled out gradually.",
    tags: ["DPDP Act", "Data Protection", "Privacy"]
  },
  {
    id: 16, category: "labour", title: "Employees' Provident Fund Act – Retirement Savings Basics",
    summary: "The EPF Act requires employers and employees to contribute a portion of wages toward a retirement savings fund managed by the EPFO.",
    content: "The Employees' Provident Funds and Miscellaneous Provisions Act 1952 applies to establishments with 20 or more employees and mandates contributions toward retirement savings.\n\nHow it works:\n- Both employer and employee typically contribute 12% of basic wages plus dearness allowance to the Provident Fund\n- Part of the employer's contribution is diverted to the Employees' Pension Scheme (EPS), which provides a monthly pension after retirement subject to eligibility conditions\n- The Employees' Deposit Linked Insurance (EDLI) scheme provides a lump sum benefit to the family in case of death of the employee while in service\n- Withdrawals are permitted for specific purposes such as home purchase, medical treatment, and marriage, subject to conditions and minimum service periods\n\nThe EPFO (Employees' Provident Fund Organisation) administers the scheme, and account holders can track balances and file claims through the UMANG app or EPFO's online portal.",
    tags: ["EPF", "Retirement", "Employee Benefits"]
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
const LEXAI_BASE_URL = LEXAI_ENDPOINT.replace(/\/ask$/, "");
const AI_HISTORY_LIMIT = 50;
const DAY_MS = 24 * 60 * 60 * 1000;
const HISTORY_DELETE_OPTIONS = [
  { label: "Older than 1 day", days: 1 },
  { label: "Older than 1 week", days: 7 },
  { label: "Older than 1 month", days: 30 },
  { label: "All history", days: 0 },
];

function lexAIUrl(path) {
  return `${LEXAI_BASE_URL}${path}`;
}

function normalizeHistoryEntry(entry) {
  const timestamp = entry.timestamp ? new Date(entry.timestamp).getTime() : Date.now();

  return {
    q: entry.question || entry.q || "",
    a: entry.answer || entry.a || "",
    time: new Date(timestamp).toLocaleString(),
    timestamp,
    relatedQuestions: entry.relatedQuestions || [],
  };
}

async function fetchAIHistory() {
  const response = await fetch(lexAIUrl(`/history?limit=${AI_HISTORY_LIMIT}`));
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Could not load chat history.");
  }

  return Array.isArray(data.history) ? data.history.map(normalizeHistoryEntry) : [];
}

async function deleteAIHistory(days) {
  const range = days === 0 ? "all" : String(days);
  const response = await fetch(lexAIUrl(`/history?range=${range}`), {
    method: "DELETE",
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Could not delete chat history.");
  }

  return data;
}

async function fetchLegalCategories() {
  const response = await fetch(lexAIUrl("/legal/categories"));
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Could not load legal categories.");
  }

  return data.categories || [];
}

async function fetchCategoryActs(slug, query = "") {
  const params = new URLSearchParams({ limit: "50" });
  if (query.trim()) params.set("q", query.trim());

  const response = await fetch(lexAIUrl(`/legal/categories/${slug}/acts?${params.toString()}`));
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Could not load acts.");
  }

  return data.acts || [];
}

async function fetchActProvisions(actId, query = "") {
  const params = new URLSearchParams({ limit: "100" });
  if (query.trim()) params.set("q", query.trim());

  const response = await fetch(lexAIUrl(`/legal/acts/${actId}/provisions?${params.toString()}`));
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Could not load provisions.");
  }

  return data.provisions || [];
}

async function fetchProvisionDetail(provisionId) {
  const response = await fetch(lexAIUrl(`/legal/provisions/${provisionId}`));
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Could not load provision.");
  }

  return data.provision;
}

async function searchLegalDatabase(query) {
  if (!query.trim()) return [];

  const params = new URLSearchParams({ q: query.trim(), limit: "50" });
  const response = await fetch(lexAIUrl(`/legal/search?${params.toString()}`));
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Could not search legal database.");
  }

  return data.results || [];
}

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
    return {
      answer: data.answer || "Unable to fetch response. Please try again.",
      relatedQuestions: data.relatedQuestions || [],
    };
  } catch (error) {
    return {
      answer: `LexAI could not answer right now.\n\n${error.message}\n\nIf you are running this locally, start the backend server and set GEMINI_API_KEY in server/.env.`,
      relatedQuestions: [],
    };
  }
}

const aiResponsePalette = {
  default: { accent: "#185fa5", bg: "#eef6ff", border: "#bfd9f4" },
  law: { accent: "#533a7d", bg: "#f3f0ff", border: "#d7cdf7" },
  assessment: { accent: "#0f6e56", bg: "#e9f8f2", border: "#bce6d5" },
  warning: { accent: "#854f0b", bg: "#fff7df", border: "#e8c96a" },
  action: { accent: "#a32d2d", bg: "#fff0f0", border: "#f0c2c2" },
};

function getResponseTone(text = "") {
  const lower = text.toLowerCase();

  if (lower.includes("disclaimer") || lower.includes("caution") || lower.includes("important")) return "warning";
  if (lower.includes("law") || lower.includes("section") || lower.includes("act")) return "law";
  if (lower.includes("assessment") || lower.includes("conclusion") || lower.includes("summary")) return "assessment";
  if (lower.includes("next") || lower.includes("steps") || lower.includes("action") || lower.includes("remedy")) return "action";

  return "default";
}

function cleanAIText(text = "") {
  return text
    .replace(/^LEXAI:\s*/i, "")
    .replace(/^LexAI:\s*/i, "")
    .replace(/^[-*]\s+/, "")
    .trim();
}

function renderInlineMarkdown(text) {
  const parts = cleanAIText(text).split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);

    if (boldMatch) {
      return (
        <strong key={index} style={{ color: "#0d1b2a", fontWeight: 800 }}>
          {boldMatch[1]}
        </strong>
      );
    }

    return <span key={index}>{part.replace(/\*/g, "")}</span>;
  });
}

function parseAIResponse(answer = "") {
  const blocks = [];
  let listItems = [];
  let lastHeadingKey = "";

  const flushList = () => {
    if (listItems.length) {
      blocks.push({ type: "list", items: listItems });
      listItems = [];
    }
  };

  answer.split(/\r?\n/).forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) {
      flushList();
      return;
    }

    const headingMatch = line.match(/^#{1,4}\s+(.+)$/);
    if (headingMatch) {
      flushList();
      const text = cleanAIText(headingMatch[1]);
      blocks.push({ type: "heading", text });
      lastHeadingKey = text.toLowerCase().replace(/^\d+[.)]?\s*/, "").replace(/[^a-z0-9 ]/g, "").trim();
      return;
    }

    const labelOnlyMatch = line.match(/^(?:\*\*)?([^:*]{2,32}):(?:\*\*)?$/);
    if (labelOnlyMatch) {
      flushList();
      const text = cleanAIText(labelOnlyMatch[1]);
      const headingKey = text.toLowerCase().replace(/^\d+[.)]?\s*/, "").replace(/[^a-z0-9 ]/g, "").trim();
      if (headingKey !== lastHeadingKey) {
        blocks.push({ type: "subheading", text });
      }
      lastHeadingKey = headingKey;
      return;
    }

    const bulletMatch = line.match(/^[-*]\s+(.+)$/);
    if (bulletMatch) {
      listItems.push(cleanAIText(bulletMatch[1]));
      return;
    }

    const numberedMatch = line.match(/^\d+[.)]\s+(.+)$/);
    if (numberedMatch) {
      listItems.push(cleanAIText(numberedMatch[1]));
      return;
    }

    flushList();
    blocks.push({ type: "paragraph", text: cleanAIText(line) });
  });

  flushList();
  return blocks;
}

function LexAIAnswer({ answer, compact = false }) {
  const blocks = parseAIResponse(answer);

  return (
    <div style={{ display: "grid", gap: compact ? 10 : 14 }}>
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const tone = aiResponsePalette[getResponseTone(block.text)];

          return (
            <div key={index} style={{ marginTop: index ? 8 : 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 6, height: 24, borderRadius: 8, background: tone.accent, flexShrink: 0 }} />
                <h3 style={{ margin: 0, color: "#0d1b2a", fontSize: compact ? 14 : 17, lineHeight: 1.35, fontFamily: "sans-serif" }}>
                  {renderInlineMarkdown(block.text)}
                </h3>
              </div>
            </div>
          );
        }

        if (block.type === "subheading") {
          const tone = aiResponsePalette[getResponseTone(block.text)];

          return (
            <h4 key={index} style={{ margin: "4px 0 0", color: tone.accent, fontSize: compact ? 12 : 14, lineHeight: 1.4, fontWeight: 800, fontFamily: "sans-serif" }}>
              {renderInlineMarkdown(block.text)}
            </h4>
          );
        }

        if (block.type === "list") {
          return (
            <ul key={index} style={{ margin: 0, padding: 0, display: "grid", gap: 8, listStyle: "none" }}>
              {block.items.map((item, itemIndex) => {
                const tone = aiResponsePalette[getResponseTone(item)];

                return (
                  <li key={itemIndex} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: compact ? "8px 10px" : "10px 12px", background: tone.bg, border: `1px solid ${tone.border}`, borderRadius: 8 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: tone.accent, marginTop: 8, flexShrink: 0 }} />
                    <span style={{ color: "#263449", fontSize: compact ? 12 : 14, lineHeight: 1.65, fontFamily: "sans-serif" }}>
                      {renderInlineMarkdown(item)}
                    </span>
                  </li>
                );
              })}
            </ul>
          );
        }

        const tone = aiResponsePalette[getResponseTone(block.text)];
        const labelMatch = block.text.match(/^(?:\*\*)?([^:*]{2,32}):(?:\*\*)?\s+(.+)$/);
        const isCallout = getResponseTone(block.text) !== "default" || labelMatch;

        return (
          <p key={index} style={{ margin: 0, padding: isCallout ? (compact ? "10px 12px" : "12px 14px") : 0, background: isCallout ? tone.bg : "transparent", border: isCallout ? `1px solid ${tone.border}` : "none", borderLeft: isCallout ? `4px solid ${tone.accent}` : "none", borderRadius: isCallout ? 8 : 0, color: "#263449", fontSize: compact ? 12 : 14, lineHeight: 1.75, fontFamily: "sans-serif" }}>
            {labelMatch ? (
              <>
                <strong style={{ color: tone.accent, fontWeight: 800 }}>{labelMatch[1]}: </strong>
                {renderInlineMarkdown(labelMatch[2])}
              </>
            ) : (
              renderInlineMarkdown(block.text)
            )}
          </p>
        );
      })}
    </div>
  );
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
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyMenuOpen, setHistoryMenuOpen] = useState(false);
  const [legalCategories, setLegalCategories] = useState([]);
  const [legalActs, setLegalActs] = useState([]);
  const [legalProvisions, setLegalProvisions] = useState([]);
  const [legalSearchResults, setLegalSearchResults] = useState([]);
  const [selectedAct, setSelectedAct] = useState(null);
  const [selectedProvision, setSelectedProvision] = useState(null);
  const [legalLoading, setLegalLoading] = useState(false);
  const [legalError, setLegalError] = useState("");
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

  const loadAIHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const history = await fetchAIHistory();
      setAiHistory(history);
    } catch {
      showToast("Could not load saved AI history", "error");
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAIHistory();
  }, [loadAIHistory]);

  const loadLegalCategories = useCallback(async () => {
    setLegalLoading(true);
    try {
      const categories = await fetchLegalCategories();
      setLegalCategories(categories);
      setLegalError("");
    } catch {
      setLegalError("Legal database is not available yet.");
    } finally {
      setLegalLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLegalCategories();
  }, [loadLegalCategories]);

  useEffect(() => {
    if (tab !== "learn" || selectedAct || selectedProvision) return;

    let cancelled = false;
    const loadLegalBrowse = async () => {
      setLegalLoading(true);
      try {
        if (searchQuery.trim()) {
          const results = await searchLegalDatabase(searchQuery);
          if (!cancelled) {
            setLegalSearchResults(results);
            setLegalActs([]);
            setLegalError("");
          }
          return;
        }

        setLegalSearchResults([]);

        if (selectedCategory) {
          const acts = await fetchCategoryActs(selectedCategory);
          if (!cancelled) {
            setLegalActs(acts);
            setLegalError("");
          }
        } else if (!cancelled) {
          setLegalActs([]);
        }
      } catch {
        if (!cancelled) setLegalError("Legal source not yet imported.");
      } finally {
        if (!cancelled) setLegalLoading(false);
      }
    };

    loadLegalBrowse();
    return () => {
      cancelled = true;
    };
  }, [tab, selectedCategory, searchQuery, selectedAct, selectedProvision]);

  useEffect(() => {
    if (!selectedAct) return;

    let cancelled = false;
    const loadProvisions = async () => {
      setLegalLoading(true);
      try {
        const provisions = await fetchActProvisions(selectedAct._id || selectedAct.id, searchQuery);
        if (!cancelled) {
          setLegalProvisions(provisions);
          setLegalError("");
        }
      } catch {
        if (!cancelled) setLegalError("No provisions imported for this Act yet.");
      } finally {
        if (!cancelled) setLegalLoading(false);
      }
    };

    loadProvisions();
    return () => {
      cancelled = true;
    };
  }, [selectedAct, searchQuery]);

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
    const articleContext = selectedArticle ? `User is reading: ${selectedArticle.title}` : "";
    try {
      const result = await askLexAI(q, articleContext);
      const now = Date.now();
      const entry = {
        q,
        a: result.answer,
        time: new Date(now).toLocaleTimeString(),
        timestamp: now,
        relatedQuestions: result.relatedQuestions,
      };
      setAiHistory(h => [entry, ...h.slice(0, AI_HISTORY_LIMIT - 1)]);
      setAiAnswer(result.answer);
    } finally {
      setAiLoading(false);
    }
  };

  const handleClearAIHistory = async (days) => {
    setHistoryLoading(true);
    setHistoryMenuOpen(false);
    try {
      await deleteAIHistory(days);

      if (days === 0) {
        setAiHistory([]);
        setAiAnswer("");
        showToast("AI chat history cleared.");
      } else {
        const cutoff = Date.now() - days * DAY_MS;
        setAiHistory(history => history.filter(entry => (entry.timestamp || 0) >= cutoff));
        showToast(`Deleted AI history older than ${days === 1 ? "1 day" : days === 7 ? "1 week" : "1 month"}.`);
      }
    } catch {
      showToast("Could not delete AI history", "error");
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleOpenProvisionFromSearch = async (result) => {
    setLegalLoading(true);
    try {
      const provision = await fetchProvisionDetail(result.provisionId);
      setSelectedAct(provision.act || { _id: result.actId, name: result.act });
      setSelectedProvision(provision);
      setLegalError("");
    } catch {
      setSelectedAct({ _id: result.actId, name: result.act });
      setSelectedProvision({
        _id: result.provisionId,
        title: result.title,
        section: result.section,
        text: result.snippet,
        act: { name: result.act },
      });
      setLegalError("Loaded a search preview because the full provision could not be opened.");
    } finally {
      setLegalLoading(false);
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

  const displayCategories = legalCategories.length
    ? legalCategories.map(category => {
      const fallback = initialCategories.find(c => c.id === category.slug);
      return {
        id: category.slug,
        label: category.name,
        icon: category.icon || fallback?.icon || "§",
        color: fallback?.color || "#185fa5",
        light: fallback?.light || "#e6f1fb",
        actCount: category.actCount || 0,
        provisionCount: category.provisionCount || 0,
        description: category.description,
      };
    })
    : initialCategories.map(category => ({
      ...category,
      actCount: 0,
      provisionCount: 0,
      description: "Legal source not yet imported.",
    }));

  const totalLegalActs = displayCategories.reduce((sum, category) => sum + category.actCount, 0);
  const totalLegalProvisions = displayCategories.reduce((sum, category) => sum + category.provisionCount, 0);
  const usingLegalDatabase = Boolean(legalCategories.length || selectedCategory || searchQuery.trim() || selectedAct || selectedProvision);
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
    <div style={{ fontFamily: "'Georgia', serif", minHeight: "100vh", background: "radial-gradient(circle at top left, rgba(201,168,76,0.16), transparent 28%), linear-gradient(180deg,#f7f9fc 0%, var(--color-background-tertiary) 45%, #e9eff6 100%)" }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, background: toast.type === "error" ? "#a32d2d" : "#0f6e56", color: "#fff", padding: "12px 20px", borderRadius: 10, fontSize: 14, fontFamily: "sans-serif", boxShadow: "0 4px 20px rgba(0,0,0,0.2)", maxWidth: 320 }}>
          {toast.type === "error" ? "⚠️" : "✅"} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#07111f,#0d1b2a 54%,#173554)", color: "#fff", padding: "0 0 0 0", boxShadow: "0 14px 42px rgba(7,17,31,0.22)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
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
              <button key={t} onClick={() => { setTab(t); setSelectedArticle(null); setSelectedAct(null); setSelectedProvision(null); }} style={{ padding: "8px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontFamily: "sans-serif", fontSize: 13, fontWeight: 600, background: tab === t ? "#c9a84c" : "rgba(255,255,255,0.1)", color: tab === t ? "#0d1b2a" : "#cdd9e8", transition: "all 0.2s" }}>
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

      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "28px 24px 64px" }}>

        {/* HOME TAB */}
        {tab === "home" && (
          <div>
            {/* Hero */}
            <div style={{ background: "linear-gradient(135deg,#091827 0%,#0d1b2a 50%,#1c4567 100%)", borderRadius: 20, padding: "42px 42px", marginBottom: 28, color: "#fff", position: "relative", overflow: "hidden", boxShadow: "0 24px 70px rgba(13,27,42,0.28)", border: "1px solid rgba(255,255,255,0.08)" }}>
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
                {displayCategories.map(c => (
                  <div key={c.id} onClick={() => { setSelectedCategory(c.id); setSelectedAct(null); setSelectedProvision(null); setTab("learn"); }} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 14, padding: "20px 14px", textAlign: "center", cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = c.light; e.currentTarget.style.borderColor = c.color; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "var(--color-background-primary)"; e.currentTarget.style.borderColor = "var(--color-border-tertiary)"; }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-primary)", fontFamily: "sans-serif", lineHeight: 1.3 }}>{c.label}</div>
                    <div style={{ fontSize: 11, color: "var(--color-text-secondary)", fontFamily: "sans-serif", marginTop: 4 }}>{c.actCount} Acts</div>
                    <div style={{ fontSize: 11, color: c.provisionCount ? "#0f6e56" : "var(--color-text-secondary)", fontFamily: "sans-serif", marginTop: 2 }}>{c.provisionCount} provisions</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12 }}>
              {[["📋", totalLegalActs, "Imported Acts"], ["⚖️", totalLegalProvisions, "Imported Provisions"], ["🤖", "AI", "Powered Assistant"], ["🔄", "2hr", "Update Cycle"]].map(([icon, val, label]) => (
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
              <select value={selectedCategory || ""} onChange={e => { setSelectedCategory(e.target.value || null); setSelectedAct(null); setSelectedProvision(null); }} style={{ padding: "11px 16px", borderRadius: 10, border: "1px solid var(--color-border-primary)", fontSize: 14, background: "var(--color-background-primary)", color: "var(--color-text-primary)", fontFamily: "sans-serif" }}>
                <option value="">All Categories</option>
                {displayCategories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>

            {usingLegalDatabase && (
              <div style={{ marginBottom: 24 }}>
                {legalError && (
                  <div style={{ marginBottom: 14, padding: "12px 14px", borderRadius: 10, background: "#fff7df", border: "1px solid #e8c96a", color: "#854f0b", fontFamily: "sans-serif", fontSize: 13 }}>
                    {legalError}
                  </div>
                )}

                {selectedProvision && (
                  <div style={{ background: "var(--color-background-primary)", borderRadius: 14, border: "0.5px solid var(--color-border-tertiary)", padding: "24px 26px" }}>
                    <button onClick={() => setSelectedProvision(null)} style={{ padding: "8px 13px", marginBottom: 16, borderRadius: 8, border: "1px solid var(--color-border-primary)", background: "var(--color-background-primary)", color: "var(--color-text-secondary)", cursor: "pointer", fontFamily: "sans-serif", fontSize: 12, fontWeight: 700 }}>Back to provisions</button>
                    <div style={{ fontSize: 12, color: "#185fa5", fontFamily: "sans-serif", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{selectedProvision.act?.name || selectedAct?.name || "Legal Provision"}</div>
                    <h2 style={{ margin: "0 0 10px", color: "var(--color-text-primary)", fontFamily: "sans-serif", fontSize: 24 }}>{selectedProvision.section ? `${selectedProvision.section}: ` : ""}{selectedProvision.title}</h2>
                    {selectedProvision.keywords?.length > 0 && (
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                        {selectedProvision.keywords.map(keyword => <span key={keyword} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: "#e6f1fb", color: "#185fa5", fontFamily: "sans-serif", fontWeight: 700 }}>{keyword}</span>)}
                      </div>
                    )}
                    <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.85, color: "var(--color-text-primary)", fontFamily: "sans-serif", fontSize: 14 }}>{selectedProvision.text || "Full text has not been imported for this provision yet."}</div>
                  </div>
                )}

                {!selectedProvision && selectedAct && (
                  <div>
                    <button onClick={() => { setSelectedAct(null); setLegalProvisions([]); }} style={{ padding: "8px 13px", marginBottom: 16, borderRadius: 8, border: "1px solid var(--color-border-primary)", background: "var(--color-background-primary)", color: "var(--color-text-secondary)", cursor: "pointer", fontFamily: "sans-serif", fontSize: 12, fontWeight: 700 }}>Back to Acts</button>
                    <div style={{ background: "linear-gradient(135deg,#f8fbff,#fffaf0)", border: "1px solid #d6e3ef", borderRadius: 14, padding: "20px 22px", marginBottom: 16 }}>
                      <div style={{ fontSize: 12, color: "#854f0b", fontFamily: "sans-serif", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1 }}>Selected Act</div>
                      <h2 style={{ margin: "6px 0", color: "var(--color-text-primary)", fontFamily: "sans-serif", fontSize: 22 }}>{selectedAct.name}</h2>
                      <div style={{ color: "var(--color-text-secondary)", fontFamily: "sans-serif", fontSize: 13, lineHeight: 1.6 }}>{selectedAct.description || "Browse imported provisions below."}</div>
                    </div>
                    {legalLoading && <div style={{ padding: 18, color: "var(--color-text-secondary)", fontFamily: "sans-serif" }}>Loading provisions...</div>}
                    {!legalLoading && legalProvisions.length === 0 && (
                      <div style={{ textAlign: "center", padding: "45px 20px", color: "var(--color-text-secondary)", fontFamily: "sans-serif", background: "var(--color-background-primary)", borderRadius: 12, border: "0.5px solid var(--color-border-tertiary)" }}>No provisions imported for this Act yet.</div>
                    )}
                    {!legalLoading && legalProvisions.length > 0 && (
                      <div style={{ display: "grid", gap: 12 }}>
                        {legalProvisions.map(provision => (
                          <button key={provision._id} onClick={() => setSelectedProvision(provision)} style={{ textAlign: "left", padding: "16px 18px", background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, cursor: "pointer", fontFamily: "sans-serif" }}>
                            <div style={{ fontSize: 12, color: "#185fa5", fontWeight: 800, marginBottom: 5 }}>{provision.section || "Provision"}</div>
                            <div style={{ fontSize: 15, color: "var(--color-text-primary)", fontWeight: 700, marginBottom: 6 }}>{provision.title}</div>
                            <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>{(provision.text || "").slice(0, 220)}{provision.text?.length > 220 ? "..." : ""}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {!selectedAct && !selectedProvision && searchQuery.trim() && (
                  <div>
                    {legalLoading && <div style={{ padding: 18, color: "var(--color-text-secondary)", fontFamily: "sans-serif" }}>Searching legal database...</div>}
                    {!legalLoading && legalSearchResults.length === 0 && (
                      <div style={{ textAlign: "center", padding: "45px 20px", color: "var(--color-text-secondary)", fontFamily: "sans-serif", background: "var(--color-background-primary)", borderRadius: 12, border: "0.5px solid var(--color-border-tertiary)" }}>No legal database results found. Try a section number, Act name, or keyword.</div>
                    )}
                    {!legalLoading && legalSearchResults.length > 0 && (
                      <div style={{ display: "grid", gap: 12 }}>
                        {legalSearchResults.map(result => (
                          <button key={result.provisionId} onClick={() => handleOpenProvisionFromSearch(result)} style={{ textAlign: "left", padding: "16px 18px", background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, cursor: "pointer", fontFamily: "sans-serif" }}>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                              <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: "#e6f1fb", color: "#185fa5", fontWeight: 800 }}>{result.section || "Provision"}</span>
                              <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: "#fff7df", color: "#854f0b", fontWeight: 800 }}>{result.act}</span>
                            </div>
                            <div style={{ fontSize: 15, color: "var(--color-text-primary)", fontWeight: 700, marginBottom: 6 }}>{result.title}</div>
                            <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>{result.snippet}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {!selectedAct && !selectedProvision && !searchQuery.trim() && selectedCategory && (
                  <div>
                    {legalLoading && <div style={{ padding: 18, color: "var(--color-text-secondary)", fontFamily: "sans-serif" }}>Loading Acts...</div>}
                    {!legalLoading && legalActs.length === 0 && (
                      <div style={{ textAlign: "center", padding: "45px 20px", color: "var(--color-text-secondary)", fontFamily: "sans-serif", background: "var(--color-background-primary)", borderRadius: 12, border: "0.5px solid var(--color-border-tertiary)" }}>Legal source not yet imported for this category.</div>
                    )}
                    {!legalLoading && legalActs.length > 0 && (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
                        {legalActs.map(act => (
                          <button key={act._id} onClick={() => { setSelectedAct(act); setSelectedProvision(null); }} style={{ textAlign: "left", padding: "18px 20px", background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, cursor: "pointer", fontFamily: "sans-serif" }}>
                            <div style={{ fontSize: 16, color: "var(--color-text-primary)", fontWeight: 800, lineHeight: 1.35, marginBottom: 8 }}>{act.name}</div>
                            <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.5, marginBottom: 12 }}>{act.description || "Open to view imported provisions."}</div>
                            <div style={{ fontSize: 12, color: "#0f6e56", fontWeight: 800 }}>{act.provisionCount || 0} provisions</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {!selectedAct && !selectedProvision && !searchQuery.trim() && !selectedCategory && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 14 }}>
                    {displayCategories.map(category => (
                      <button key={category.id} onClick={() => setSelectedCategory(category.id)} style={{ textAlign: "left", padding: "18px 20px", background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, cursor: "pointer", fontFamily: "sans-serif" }}>
                        <div style={{ fontSize: 22, marginBottom: 8 }}>{category.icon}</div>
                        <div style={{ fontSize: 16, color: "var(--color-text-primary)", fontWeight: 800, marginBottom: 6 }}>{category.label}</div>
                        <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.5, marginBottom: 12 }}>{category.description || "Browse Acts and provisions."}</div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: category.light, color: category.color, fontWeight: 800 }}>{category.actCount} Acts</span>
                          <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: "#f5f5f5", color: "var(--color-text-secondary)", fontWeight: 800 }}>{category.provisionCount} provisions</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div style={{ display: usingLegalDatabase ? "none" : "grid", gridTemplateColumns: "repeat(auto-fill,minmax(310px,1fr))", gap: 16 }}>
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
            {!usingLegalDatabase && filteredArticles.length === 0 && (
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
                  <div style={{ marginTop: 14, padding: "18px 20px", background: "linear-gradient(180deg,#ffffff,#f7fbff)", borderRadius: 12, color: "var(--color-text-primary)", fontFamily: "sans-serif", border: "1px solid #d6e3ef", boxShadow: "0 8px 24px rgba(13,27,42,0.08)" }}><div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid #e6edf5" }}><div style={{ fontSize: 11, color: "#c9a84c", fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase" }}>LexAI Response</div><div style={{ fontSize: 11, color: "#5e6f85", fontWeight: 700 }}>Indian Law Assistant</div></div><LexAIAnswer answer={aiAnswer} /></div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* AI ASK TAB */}
        {tab === "ai-ask" && (
          <div>
            <div style={{ background: "linear-gradient(135deg,#07111f,#0d1b2a 58%,#185fa5)", borderRadius: 18, padding: "30px 34px", marginBottom: 24, color: "#fff", boxShadow: "0 22px 58px rgba(13,27,42,0.24)", border: "1px solid rgba(255,255,255,0.1)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: 24, top: 18, width: 130, height: 130, borderRadius: "50%", background: "rgba(232,201,106,0.12)", filter: "blur(2px)" }} />
              <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 6, position: "relative", fontFamily: "sans-serif" }}>LexAI Legal Assistant</div>
              <p style={{ color: "#c8d8ea", margin: 0, fontFamily: "sans-serif", fontSize: 14, position: "relative", maxWidth: 660, lineHeight: 1.6 }}>Ask structured legal questions and get cleaner, sectioned answers with links to your saved context and legal database.</p>
            </div>

            <div style={{ background: "rgba(255,255,255,0.92)", borderRadius: 18, padding: "26px", marginBottom: 22, border: "1px solid rgba(203,213,225,0.9)", boxShadow: "0 18px 45px rgba(23,32,51,0.08)", backdropFilter: "blur(8px)" }}>
              <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "stretch", flexWrap: "wrap" }}>
                <input placeholder="E.g. What is Section 498A? What are my rights during arrest? How to file a consumer complaint?" value={aiQuestion} onChange={e => setAiQuestion(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAskAI()} style={{ flex: 1, minWidth: 260, padding: "15px 18px", borderRadius: 12, border: "1px solid var(--color-border-primary)", fontSize: 14, background: "#fff", color: "var(--color-text-primary)", fontFamily: "sans-serif", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)" }} />
                <button onClick={handleAskAI} disabled={aiLoading || !aiQuestion.trim()} style={{ padding: "12px 28px", background: aiLoading ? "#c8d0da" : "linear-gradient(135deg,#07111f,#0d1b2a)", color: "#e8c96a", border: "none", borderRadius: 12, cursor: aiLoading ? "not-allowed" : "pointer", fontFamily: "sans-serif", fontSize: 14, fontWeight: 800, whiteSpace: "nowrap", boxShadow: aiLoading ? "none" : "0 12px 25px rgba(13,27,42,0.22)" }}>
                  {aiLoading ? "⏳ Thinking..." : "Ask →"}
                </button>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["What is FIR?", "Bail rights in India", "Consumer protection act", "Cyber crime complaint", "Property dispute laws"].map(q => (
                  <button key={q} onClick={() => { setAiQuestion(q); }} style={{ fontSize: 12, padding: "5px 12px", borderRadius: 20, border: "0.5px solid var(--color-border-primary)", background: "var(--color-background-secondary)", color: "var(--color-text-secondary)", cursor: "pointer", fontFamily: "sans-serif" }}>{q}</button>
                ))}
              </div>
              <div style={{ marginTop: 18, paddingTop: 16, borderTop: "0.5px solid var(--color-border-tertiary)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div style={{ fontSize: 12, color: "var(--color-text-secondary)", fontFamily: "sans-serif" }}>{historyLoading ? "Syncing MongoDB history..." : "Chat history is saved on the server."}</div>
                <div style={{ position: "relative" }}>
                  <button onClick={() => setHistoryMenuOpen(open => !open)} disabled={historyLoading} style={{ padding: "9px 14px", borderRadius: 10, border: "1px solid #d4a737", background: "#fff8e5", color: "#854f0b", cursor: historyLoading ? "not-allowed" : "pointer", fontFamily: "sans-serif", fontSize: 12, fontWeight: 800, boxShadow: "0 8px 20px rgba(201,168,76,0.14)" }}>
                    Delete history ▾
                  </button>
                  {historyMenuOpen && (
                    <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", zIndex: 20, width: 230, background: "#fff", border: "1px solid var(--color-border-tertiary)", borderRadius: 12, boxShadow: "0 18px 45px rgba(13,27,42,0.18)", overflow: "hidden", fontFamily: "sans-serif" }}>
                      <div style={{ padding: "10px 12px", fontSize: 11, color: "var(--color-text-secondary)", borderBottom: "1px solid var(--color-border-tertiary)", background: "#f8fbff" }}>Choose how much saved chat history to delete</div>
                      {HISTORY_DELETE_OPTIONS.map(option => (
                        <button key={option.label} onClick={() => handleClearAIHistory(option.days)} style={{ display: "block", width: "100%", textAlign: "left", padding: "11px 12px", border: "none", borderBottom: "1px solid #edf2f7", background: option.days === 0 ? "#fff5f5" : "#fff", color: option.days === 0 ? "#a32d2d" : "var(--color-text-primary)", cursor: "pointer", fontFamily: "sans-serif", fontSize: 12, fontWeight: 700 }}>
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {aiHistory.length > 0 && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text-primary)", fontFamily: "sans-serif" }}>Saved Q&A History</div>
                    <div style={{ fontSize: 12, color: "var(--color-text-secondary)", fontFamily: "sans-serif", marginTop: 3 }}>{historyLoading ? "Syncing server history..." : `${aiHistory.length} saved conversation${aiHistory.length === 1 ? "" : "s"} from MongoDB`}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--color-text-secondary)", fontFamily: "sans-serif", fontWeight: 700 }}>Use Delete history above to choose a period</div>
                </div>
                {aiHistory.map((entry, i) => (
                  <div key={i} style={{ background: "var(--color-background-primary)", borderRadius: 12, padding: "20px 24px", marginBottom: 14, border: "0.5px solid var(--color-border-tertiary)" }}>
                    <div style={{ fontSize: 12, color: "var(--color-text-secondary)", fontFamily: "sans-serif", marginBottom: 8 }}>🕐 {entry.time}</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "var(--color-text-primary)", fontFamily: "sans-serif", marginBottom: 12, paddingBottom: 12, borderBottom: "0.5px solid var(--color-border-tertiary)" }}>❓ {entry.q}</div>
                    {entry.relatedQuestions?.length > 0 && (
                      <div style={{ marginBottom: 12, padding: "9px 11px", borderRadius: 8, background: "#fff7df", border: "1px solid #e8c96a", color: "#854f0b", fontFamily: "sans-serif", fontSize: 12, lineHeight: 1.5 }}>
                        Linked with earlier question: {entry.relatedQuestions[0]}
                      </div>
                    )}
                    <div style={{ padding: "14px 16px", background: "#f8fbff", border: "1px solid #d6e3ef", borderRadius: 10 }}><div style={{ fontSize: 11, color: "#c9a84c", fontWeight: 800, marginBottom: 10, letterSpacing: 1.2, textTransform: "uppercase" }}>LexAI</div><LexAIAnswer answer={entry.a} compact /></div>
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
