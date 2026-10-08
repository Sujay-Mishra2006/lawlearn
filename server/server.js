import express from "express";
import cors from "cors";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenAI } from "@google/genai";
import mongoose from "mongoose";

const serverDir = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(serverDir, ".env");

if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, "utf8");

  for (const line of envFile.split(/\r?\n/)) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (!match || match[1].startsWith("#")) continue;

    const [, key, rawValue = ""] = match;
    const value = rawValue.replace(/^['"]|['"]$/g, "");

    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

const app = express();
const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
const MONGODB_URI = process.env.MONGODB_URI;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const PROVISION_TYPES = [
  "ARTICLE",
  "SECTION",
  "RULE",
  "REGULATION",
  "SCHEDULE",
  "CLAUSE",
  "NOTIFICATION",
  "ORDER",
];
const RELATIONSHIP_TYPES = [
  "REFERENCES",
  "AMENDS",
  "REPEALS",
  "RELATED_TO",
  "DEFINES",
  "REPLACED_BY",
];
const DEFAULT_CATEGORIES = [
  { name: "Criminal Law", slug: "criminal", icon: "⚖️", description: "Criminal statutes, offences, procedure, and penalties.", sortOrder: 1 },
  { name: "Civil Law", slug: "civil", icon: "📜", description: "Civil rights, contracts, procedure, and remedies.", sortOrder: 2 },
  { name: "Constitutional Law", slug: "constitutional", icon: "🏛️", description: "The Constitution of India, fundamental rights, and institutions.", sortOrder: 3 },
  { name: "Corporate Law", slug: "corporate", icon: "🏢", description: "Companies, securities, governance, and commercial regulation.", sortOrder: 4 },
  { name: "Family Law", slug: "family", icon: "👨‍👩‍👧", description: "Marriage, divorce, maintenance, succession, and personal laws.", sortOrder: 5 },
  { name: "Property Law", slug: "property", icon: "🏠", description: "Transfer, registration, ownership, and land-related laws.", sortOrder: 6 },
  { name: "Cyber Law", slug: "cyber", icon: "💻", description: "Technology, data, cyber offences, and digital rights.", sortOrder: 7 },
  { name: "Labour Law", slug: "labour", icon: "👷", description: "Employment, wages, social security, and workplace standards.", sortOrder: 8 },
];

const IMPORTANT_LEGAL_SAMPLE = {
  acts: [
    ...[
      ["Criminal Law", "Bharatiya Nyaya Sanhita, 2023", "BNS", 2023, "103", "Punishment for murder"],
      ["Criminal Law", "Bharatiya Nagarik Suraksha Sanhita, 2023", "BNSS", 2023, "173", "Information in cognizable cases"],
      ["Criminal Law", "Bharatiya Sakshya Adhiniyam, 2023", "BSA", 2023, "24", "Confession caused by inducement"],
      ["Criminal Law", "Protection of Children from Sexual Offences Act, 2012", "POCSO", 2012, "4", "Punishment for penetrative sexual assault"],
      ["Criminal Law", "Prevention of Corruption Act, 1988", "PCA", 1988, "7", "Public servant taking undue advantage"],
      ["Civil Law", "Code of Civil Procedure, 1908", "CPC", 1908, "9", "Courts to try all civil suits"],
      ["Civil Law", "Indian Contract Act, 1872", "Contract Act", 1872, "10", "What agreements are contracts"],
      ["Civil Law", "Specific Relief Act, 1963", "SRA", 1963, "10", "Specific performance of contracts"],
      ["Civil Law", "Limitation Act, 1963", "Limitation Act", 1963, "3", "Bar of limitation"],
      ["Civil Law", "Consumer Protection Act, 2019", "CPA", 2019, "35", "Manner of making complaint"],
      ["Constitutional Law", "Constitution of India", "Constitution", 1950, "14", "Equality before law"],
      ["Constitutional Law", "Constitution of India", "Constitution", 1950, "19", "Protection of freedoms"],
      ["Constitutional Law", "Constitution of India", "Constitution", 1950, "21", "Protection of life and liberty"],
      ["Constitutional Law", "Constitution of India", "Constitution", 1950, "32", "Remedies for enforcement of rights"],
      ["Constitutional Law", "Constitution of India", "Constitution", 1950, "226", "High Court writ jurisdiction"],
      ["Corporate Law", "Companies Act, 2013", "Companies Act", 2013, "166", "Duties of directors"],
      ["Corporate Law", "Limited Liability Partnership Act, 2008", "LLP Act", 2008, "27", "Extent and limitation of liability"],
      ["Corporate Law", "Securities and Exchange Board of India Act, 1992", "SEBI Act", 1992, "15A", "Penalty for failure to furnish information"],
      ["Corporate Law", "Insolvency and Bankruptcy Code, 2016", "IBC", 2016, "7", "Corporate insolvency by financial creditor"],
      ["Corporate Law", "Competition Act, 2002", "Competition Act", 2002, "3", "Anti-competitive agreements"],
      ["Family Law", "Hindu Marriage Act, 1955", "HMA", 1955, "13", "Divorce"],
      ["Family Law", "Special Marriage Act, 1954", "SMA", 1954, "4", "Conditions relating to solemnization"],
      ["Family Law", "Hindu Succession Act, 1956", "HSA", 1956, "8", "General rules of succession for males"],
      ["Family Law", "Guardians and Wards Act, 1890", "GWA", 1890, "17", "Matters considered by court"],
      ["Family Law", "Protection of Women from Domestic Violence Act, 2005", "DV Act", 2005, "12", "Application to Magistrate"],
      ["Property Law", "Transfer of Property Act, 1882", "TPA", 1882, "54", "Sale of immovable property"],
      ["Property Law", "Registration Act, 1908", "Registration Act", 1908, "17", "Documents requiring registration"],
      ["Property Law", "Indian Easements Act, 1882", "Easements Act", 1882, "4", "Easement defined"],
      ["Property Law", "Right to Fair Compensation and Transparency in Land Acquisition Act, 2013", "LARR Act", 2013, "24", "Land acquisition process in certain cases"],
      ["Property Law", "Real Estate (Regulation and Development) Act, 2016", "RERA", 2016, "31", "Filing complaints"],
      ["Cyber Law", "Information Technology Act, 2000", "IT Act", 2000, "66", "Computer related offences"],
      ["Cyber Law", "Information Technology Act, 2000", "IT Act", 2000, "67", "Publishing obscene material electronically"],
      ["Cyber Law", "Digital Personal Data Protection Act, 2023", "DPDP Act", 2023, "6", "Consent"],
      ["Cyber Law", "Digital Personal Data Protection Act, 2023", "DPDP Act", 2023, "8", "Obligations of data fiduciary"],
      ["Cyber Law", "Information Technology Act, 2000", "IT Act", 2000, "69A", "Power to block public access"],
      ["Labour Law", "Code on Wages, 2019", "Wage Code", 2019, "6", "Fixing minimum wages"],
      ["Labour Law", "Industrial Relations Code, 2020", "IR Code", 2020, "76", "Notice of change"],
      ["Labour Law", "Code on Social Security, 2020", "Social Security Code", 2020, "3", "Social security schemes"],
      ["Labour Law", "Occupational Safety, Health and Working Conditions Code, 2020", "OSH Code", 2020, "6", "Duties of employer"],
      ["Labour Law", "Employees' Provident Funds and Miscellaneous Provisions Act, 1952", "EPF Act", 1952, "6", "Contributions"],
    ].map(([category, name, shortName, year, number, title]) => ({
      name,
      shortName,
      year,
      categories: [category],
      jurisdiction: "Central",
      status: "ACTIVE",
      sourceName: "Curated LawLearn starter dataset",
      sourceUrl: "https://www.indiacode.nic.in/",
      provisions: [{
        number,
        title,
        type: name === "Constitution of India" ? "ARTICLE" : "SECTION",
        text: `${title} is one of the commonly used provisions under ${name}. This starter entry is for browsing, search, and LexAI context. Replace it with verified authoritative text from India Code during the full database population step.`,
        sourceName: "Curated LawLearn starter dataset",
        sourceUrl: "https://www.indiacode.nic.in/",
      }],
    })),
  ],
};

let mongoConnectionPromise = null;

app.use(cors());
app.use(express.json());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      error: "Invalid JSON request body.",
      answer: "LexAI received an invalid request. Please try again.",
    });
  }

  next(err);
});

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

const visitSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  browser: {
    type: String,
    default: "Unknown",
  },
  userAgent: {
    type: String,
    default: "",
  },
  ip: {
    type: String,
    default: "",
  },
  page: {
    type: String,
    default: "",
  },
  question: {
    type: String,
    default: undefined,
  },
});

const Visit = mongoose.models.Visit || mongoose.model("Visit", visitSchema);

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true, trim: true },
  description: { type: String, default: "" },
  icon: { type: String, default: "" },
  sortOrder: { type: Number, default: 100 },
}, { timestamps: true });

const actSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  shortName: { type: String, default: "", trim: true },
  actNumber: { type: String, default: "", trim: true },
  year: { type: Number },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category", index: true }],
  jurisdiction: { type: String, default: "Central", trim: true },
  ministry: { type: String, default: "", trim: true },
  enactmentDate: { type: Date },
  commencementDate: { type: Date },
  status: { type: String, default: "UNKNOWN", trim: true },
  sourceUrl: { type: String, default: "", trim: true },
  sourceName: { type: String, default: "Unknown", trim: true },
  lastUpdated: { type: Date },
  retrievedAt: { type: Date },
  isConstitution: { type: Boolean, default: false },
}, { timestamps: true });

const provisionSchema = new mongoose.Schema({
  act: { type: mongoose.Schema.Types.ObjectId, ref: "Act", required: true, index: true },
  provisionNumber: { type: String, required: true, trim: true },
  title: { type: String, default: "", trim: true },
  text: { type: String, required: true, trim: true },
  provisionType: { type: String, enum: PROVISION_TYPES, required: true, index: true },
  parentProvision: { type: mongoose.Schema.Types.ObjectId, ref: "Provision", default: null, index: true },
  sourceUrl: { type: String, default: "", trim: true },
  sourceName: { type: String, default: "Unknown", trim: true },
  lastUpdated: { type: Date },
  retrievedAt: { type: Date },
  status: { type: String, default: "ACTIVE", trim: true },
}, { timestamps: true });

const provisionRelationshipSchema = new mongoose.Schema({
  sourceProvision: { type: mongoose.Schema.Types.ObjectId, ref: "Provision", required: true, index: true },
  targetProvision: { type: mongoose.Schema.Types.ObjectId, ref: "Provision", required: true, index: true },
  relationshipType: { type: String, enum: RELATIONSHIP_TYPES, required: true },
  sourceUrl: { type: String, default: "", trim: true },
  sourceName: { type: String, default: "Unknown", trim: true },
}, { timestamps: true });

const chatHistorySchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now, index: true },
  question: { type: String, required: true, trim: true },
  answer: { type: String, required: true, trim: true },
  relatedQuestions: [{ type: String, trim: true }],
  relatedHistory: [{
    question: String,
    answerExcerpt: String,
  }],
  page: { type: String, default: "/ask" },
  userAgent: { type: String, default: "" },
  ip: { type: String, default: "" },
});

actSchema.index({ name: 1, year: 1 }, { unique: true });
actSchema.index({ name: "text", shortName: "text", actNumber: "text", ministry: "text" });
provisionSchema.index({ act: 1, provisionNumber: 1, provisionType: 1 }, { unique: true });
provisionSchema.index({ provisionNumber: "text", title: "text", text: "text" });
provisionRelationshipSchema.index({ sourceProvision: 1, targetProvision: 1, relationshipType: 1 }, { unique: true });
chatHistorySchema.index({ question: "text", answer: "text" });

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
const Act = mongoose.models.Act || mongoose.model("Act", actSchema);
const Provision = mongoose.models.Provision || mongoose.model("Provision", provisionSchema);
const ProvisionRelationship = mongoose.models.ProvisionRelationship || mongoose.model("ProvisionRelationship", provisionRelationshipSchema);
const ChatHistory = mongoose.models.ChatHistory || mongoose.model("ChatHistory", chatHistorySchema);

async function connectMongo() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured on the server.");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!mongoConnectionPromise) {
    mongoConnectionPromise = mongoose.connect(MONGODB_URI).catch((err) => {
      mongoConnectionPromise = null;
      throw err;
    });
  }

  return mongoConnectionPromise;
}

function slugify(value = "") {
  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseLimit(value, fallback = DEFAULT_LIMIT) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, MAX_LIMIT);
}

function parsePage(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
}

function toDate(value) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function escapeRegex(value = "") {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getQuestionTerms(text = "") {
  const stopWords = new Set([
    "what", "when", "where", "which", "who", "why", "how", "can", "could", "would",
    "should", "the", "and", "for", "with", "from", "about", "into", "under", "does",
    "are", "is", "was", "were", "this", "that", "your", "you", "rights", "india",
    "indian", "law", "legal", "tell", "explain",
  ]);

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(term => term.length > 2 && !stopWords.has(term));
}

async function ensureDefaultCategories() {
  await connectMongo();

  await Promise.all(DEFAULT_CATEGORIES.map(category =>
    Category.updateOne(
      { slug: category.slug },
      { $setOnInsert: category },
      { upsert: true },
    )
  ));

  return Category.find().sort({ sortOrder: 1, name: 1 }).lean();
}

async function resolveCategories(categoryInput) {
  const values = Array.isArray(categoryInput) ? categoryInput : [categoryInput];
  const cleaned = values.filter(Boolean).map(value => value.toString().trim()).filter(Boolean);

  if (!cleaned.length) {
    throw new Error("At least one category is required.");
  }

  const categories = [];

  for (const value of cleaned) {
    const slug = slugify(value);
    const category = await Category.findOneAndUpdate(
      { $or: [{ slug }, { name: value }] },
      { $setOnInsert: { name: value, slug, description: "Imported legal category." } },
      { new: true, upsert: true },
    );
    categories.push(category._id);
  }

  return categories;
}

function normalizeProvisionType(value = "SECTION") {
  const type = value.toString().trim().toUpperCase();
  if (!PROVISION_TYPES.includes(type)) {
    throw new Error(`Invalid provision type: ${value}`);
  }
  return type;
}

function normalizeImportPayload(payload) {
  if (payload?.act) {
    return [{ ...payload.act, provisions: payload.provisions || [] }];
  }

  if (Array.isArray(payload?.acts)) {
    return payload.acts;
  }

  throw new Error("Import payload must contain either an act object or an acts array.");
}

async function importLegalData(payload) {
  await ensureDefaultCategories();

  const acts = normalizeImportPayload(payload);
  const result = {
    actsImported: 0,
    actsUpdated: 0,
    provisionsImported: 0,
    provisionsUpdated: 0,
    errors: [],
  };

  for (const actInput of acts) {
    try {
      if (!actInput.name) throw new Error("Act name is required.");

      const categoryInput = actInput.categories || actInput.category || actInput.categorySlug || "Civil Law";
      const categoryIds = await resolveCategories(categoryInput);
      const actFilter = {
        name: actInput.name.trim(),
        year: actInput.year || undefined,
      };
      const existingAct = await Act.findOne(actFilter);
      const act = await Act.findOneAndUpdate(
        actFilter,
        {
          $set: {
            name: actInput.name.trim(),
            shortName: actInput.short_name || actInput.shortName || "",
            actNumber: actInput.act_number || actInput.actNumber || "",
            year: actInput.year,
            categories: categoryIds,
            jurisdiction: actInput.jurisdiction || "Central",
            ministry: actInput.ministry || "",
            enactmentDate: toDate(actInput.enactment_date || actInput.enactmentDate),
            commencementDate: toDate(actInput.commencement_date || actInput.commencementDate),
            status: actInput.status || "UNKNOWN",
            sourceUrl: actInput.source_url || actInput.sourceUrl || "",
            sourceName: actInput.source_name || actInput.sourceName || "Unknown",
            lastUpdated: toDate(actInput.last_updated || actInput.lastUpdated),
            retrievedAt: toDate(actInput.retrieved_at || actInput.retrievedAt) || new Date(),
            isConstitution: Boolean(actInput.is_constitution || actInput.isConstitution),
          },
        },
        { new: true, upsert: true },
      );

      if (existingAct) result.actsUpdated += 1;
      else result.actsImported += 1;

      for (const provisionInput of actInput.provisions || []) {
        try {
          const provisionNumber = provisionInput.number || provisionInput.provision_number || provisionInput.provisionNumber;
          if (!provisionNumber) throw new Error(`Provision number is required for ${act.name}.`);
          if (!provisionInput.text) throw new Error(`Provision text is required for ${act.name} ${provisionNumber}.`);

          const provisionType = normalizeProvisionType(provisionInput.type || provisionInput.provision_type || provisionInput.provisionType);
          const existingProvision = await Provision.findOne({ act: act._id, provisionNumber, provisionType });
          await Provision.findOneAndUpdate(
            { act: act._id, provisionNumber, provisionType },
            {
              $set: {
                act: act._id,
                provisionNumber,
                title: provisionInput.title || "",
                text: provisionInput.text,
                provisionType,
                sourceUrl: provisionInput.source_url || provisionInput.sourceUrl || act.sourceUrl,
                sourceName: provisionInput.source_name || provisionInput.sourceName || act.sourceName,
                lastUpdated: toDate(provisionInput.last_updated || provisionInput.lastUpdated || actInput.last_updated || actInput.lastUpdated),
                retrievedAt: toDate(provisionInput.retrieved_at || provisionInput.retrievedAt) || new Date(),
                status: provisionInput.status || "ACTIVE",
              },
            },
            { upsert: true },
          );

          if (existingProvision) result.provisionsUpdated += 1;
          else result.provisionsImported += 1;
        } catch (err) {
          result.errors.push(err.message);
        }
      }
    } catch (err) {
      result.errors.push(err.message);
    }
  }

  return result;
}

function getClientIp(req) {
  const forwardedFor = req.headers["x-forwarded-for"];

  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.socket?.remoteAddress || req.ip || "";
}

function getBrowser(userAgent = "") {
  if (userAgent.includes("Edg/")) return "Edge";
  if (userAgent.includes("Chrome/")) return "Chrome";
  if (userAgent.includes("Firefox/")) return "Firefox";
  if (userAgent.includes("Safari/") && !userAgent.includes("Chrome/")) return "Safari";
  if (userAgent.includes("OPR/") || userAgent.includes("Opera/")) return "Opera";

  return "Unknown";
}

async function createVisit(req, overrides = {}) {
  await connectMongo();

  const userAgent = req.get("user-agent") || overrides.userAgent || "";
  const browser = overrides.browser || req.body?.browser || getBrowser(userAgent);
  const page = overrides.page || req.body?.page || req.get("referer") || req.originalUrl || "";
  const question = overrides.question ?? req.body?.question;

  const visit = await Visit.create({
    timestamp: new Date(),
    browser,
    userAgent,
    ip: overrides.ip || getClientIp(req),
    page,
    ...(question ? { question } : {}),
  });

  return visit;
}

async function logVisitSafely(req, overrides = {}) {
  try {
    return await createVisit(req, overrides);
  } catch (err) {
    console.warn("Visit logging failed:", err.message);
    return null;
  }
}

async function findRelatedChatHistory(question) {
  try {
    await connectMongo();
    const currentTerms = new Set(getQuestionTerms(question));
    if (!currentTerms.size) return [];

    const recentHistory = await ChatHistory.find()
      .sort({ timestamp: -1 })
      .limit(50)
      .lean();

    return recentHistory
      .map(entry => {
        const previousTerms = new Set(getQuestionTerms(entry.question));
        const overlap = [...currentTerms].filter(term => previousTerms.has(term));
        const score = overlap.length / Math.max(currentTerms.size, 1);

        return { ...entry, overlap, score };
      })
      .filter(entry => entry.overlap.length >= 2 || entry.score >= 0.35)
      .sort((a, b) => b.score - a.score || new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 3);
  } catch (err) {
    console.warn("Chat history lookup failed:", err.message);
    return [];
  }
}

async function saveChatHistorySafely(req, question, answer, relatedHistory = []) {
  try {
    await connectMongo();

    await ChatHistory.create({
      question,
      answer,
      relatedQuestions: relatedHistory.map(entry => entry.question),
      relatedHistory: relatedHistory.map(entry => ({
        question: entry.question,
        answerExcerpt: (entry.answer || "").slice(0, 450),
      })),
      page: "/ask",
      userAgent: req.get("user-agent") || "",
      ip: getClientIp(req),
    });
  } catch (err) {
    console.warn("Chat history save failed:", err.message);
  }
}

async function findRelevantProvisions(question) {
  try {
    await connectMongo();

    const terms = getQuestionTerms(question).slice(0, 6);
    if (!terms.length) return [];

    const regex = new RegExp(terms.map(escapeRegex).join("|"), "i");
    return Provision.find({
      $or: [
        { provisionNumber: regex },
        { title: regex },
        { text: regex },
      ],
    })
      .populate({ path: "act", populate: { path: "categories", select: "name slug" } })
      .limit(5)
      .lean();
  } catch (err) {
    console.warn("Legal retrieval failed:", err.message);
    return [];
  }
}

function buildAIContext(baseContext, relatedHistory = [], relevantProvisions = []) {
  const parts = [];
  if (baseContext) parts.push(baseContext);

  if (relevantProvisions.length) {
    parts.push(`Relevant imported legal provisions from the database:
${relevantProvisions.map((provision, index) => `${index + 1}. ${provision.act?.name || "Unknown Act"} - ${provision.provisionType} ${provision.provisionNumber}${provision.title ? ` (${provision.title})` : ""}
Source: ${provision.sourceName || "Unknown"} ${provision.sourceUrl || ""}
Text excerpt: ${provision.text.slice(0, 700)}`).join("\n\n")}

Use these imported sources when relevant. If the database does not contain a needed provision, say that the legal source is not yet imported instead of inventing a provision.`);
  }

  if (relatedHistory.length) {
    parts.push(`Related previous user questions from saved MongoDB chat history:
${relatedHistory.map((entry, index) => `${index + 1}. Previous question: ${entry.question}
Previous answer excerpt: ${(entry.answer || "").slice(0, 450)}`).join("\n\n")}

When useful, briefly mention how the current question connects to the previous question(s) and give the logical link.`);
  }

  return parts.join("\n\n");
}

function legalAnswerPrompt(question, context = "") {
  return `
You are LexAI, an Indian legal assistant.

Rules:
- Explain Indian law in calm, simple English that a non-lawyer can follow.
- Do not claim a legal result is certain unless the facts and law support that conclusion. Separate known facts, assumptions, and missing details.
- Never invent statutes, section numbers, deadlines, procedures, or case citations. Use imported legal sources when provided; if a needed source is missing, say so plainly.
- Give a short, useful response. Do not repeat section labels or leave a heading without content.
- For a question describing a personal situation, use these markdown sections, each with at least one complete sentence or useful bullet:
  ### In brief
  ### Assessment
  ### Action plan
  ### Important
  ### Next steps
- In Assessment, explain what appears to matter, what is uncertain, and what facts or documents could change the view. Avoid definitive statements based on one-sided or incomplete facts.
- In Action plan, give practical, ordered actions. Under Important, call out relevant deadlines, evidence to preserve, and actions to avoid; do not invent a deadline or give a blanket warning that may not fit.
- In Next steps, say who the user can contact and what to take or ask, when that is relevant. Make urgency clear when there may be immediate danger or a short legal deadline.
- For a simple definition or general-information question, answer directly and use only the sections that add value.
- Use **bold** sparingly for the law, risks, and key actions. Add a short informational disclaimer where appropriate; do not let it replace the answer.

${context ? `Context:\n${context}\n` : ""}
Question:
${question}
`;
}

function hotTopicsPrompt() {
  return `
You are LexAI, an Indian legal research assistant.

Return only valid JSON, with no markdown fences or explanation.
Create 6 current Indian legal hot topics as an array of objects.
Each object must have: id, title, category, urgency, time.
category must be one of: criminal, civil, constitutional, corporate, family, property, cyber, labour.
urgency must be one of: high, medium, low.
time should be a short relative label such as "2 hrs ago".
`;
}

function cleanJsonText(text) {
  return text.replace(/```json|```/g, "").trim();
}

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    model: MODEL,
    aiConfigured: Boolean(ai),
    mongoConfigured: Boolean(MONGODB_URI),
    mongoConnected: mongoose.connection.readyState === 1,
  });
});

app.post("/visit", async (req, res) => {
  try {
    await createVisit(req);

    res.status(201).json({
      success: true,
      message: "Visit logged successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message || "Could not save visit.",
    });
  }
});

app.get("/stats", async (req, res) => {
  try {
    await connectMongo();

    const [totalVisits, last10Visits, totalQuestions] = await Promise.all([
      Visit.countDocuments(),
      Visit.find().sort({ timestamp: -1 }).limit(10).lean(),
      Visit.countDocuments({
        question: {
          $exists: true,
          $ne: "",
        },
      }),
    ]);

    res.json({
      totalVisits,
      totalQuestions,
      last10Visits,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message || "Could not load stats.",
    });
  }
});

app.get("/history", async (req, res) => {
  try {
    await connectMongo();
    const limit = parseLimit(req.query.limit, 50);
    const history = await ChatHistory.find()
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    res.json({ history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Could not load chat history." });
  }
});

app.delete("/history", async (req, res) => {
  try {
    await connectMongo();
    const range = req.query.range || "all";
    const filter = {};

    if (range !== "all") {
      const days = Number.parseInt(range, 10);
      if (![1, 7, 30].includes(days)) {
        return res.status(400).json({ error: "History range must be all, 1, 7, or 30." });
      }
      filter.timestamp = { $lt: new Date(Date.now() - days * 24 * 60 * 60 * 1000) };
    }

    const result = await ChatHistory.deleteMany(filter);
    res.json({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Could not delete chat history." });
  }
});

app.get("/legal/categories", async (req, res) => {
  try {
    const categories = await ensureDefaultCategories();
    const summaries = await Promise.all(categories.map(async (category) => {
      const actIds = await Act.find({ categories: category._id }).distinct("_id");
      const [actCount, provisionCount] = await Promise.all([
        Promise.resolve(actIds.length),
        Provision.countDocuments({ act: { $in: actIds } }),
      ]);

      return {
        id: category._id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        actCount,
        provisionCount,
      };
    }));

    res.json({ categories: summaries });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Could not load legal categories." });
  }
});

app.get("/legal/categories/:slug/acts", async (req, res) => {
  try {
    await ensureDefaultCategories();
    const category = await Category.findOne({ slug: req.params.slug }).lean();
    if (!category) return res.status(404).json({ error: "Category not found." });

    const page = parsePage(req.query.page);
    const limit = parseLimit(req.query.limit);
    const query = req.query.q ? new RegExp(escapeRegex(req.query.q), "i") : null;
    const filter = {
      categories: category._id,
      ...(query ? { $or: [{ name: query }, { shortName: query }, { actNumber: query }] } : {}),
    };

    const [acts, total] = await Promise.all([
      Act.find(filter)
        .sort({ year: -1, name: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Act.countDocuments(filter),
    ]);

    res.json({ category, acts, total, page, limit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Could not load acts." });
  }
});

app.get("/legal/acts/:id", async (req, res) => {
  try {
    await connectMongo();
    const act = await Act.findById(req.params.id).populate("categories", "name slug icon").lean();
    if (!act) return res.status(404).json({ error: "Act not found." });

    const provisionCount = await Provision.countDocuments({ act: act._id });
    res.json({ act: { ...act, provisionCount } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Could not load act." });
  }
});

app.get("/legal/acts/:id/provisions", async (req, res) => {
  try {
    await connectMongo();
    const page = parsePage(req.query.page);
    const limit = parseLimit(req.query.limit);
    const query = req.query.q ? new RegExp(escapeRegex(req.query.q), "i") : null;
    const filter = {
      act: req.params.id,
      ...(query ? { $or: [{ provisionNumber: query }, { title: query }, { text: query }] } : {}),
    };

    const [provisions, total] = await Promise.all([
      Provision.find(filter)
        .sort({ provisionType: 1, provisionNumber: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Provision.countDocuments(filter),
    ]);

    res.json({ provisions, total, page, limit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Could not load provisions." });
  }
});

app.get("/legal/provisions/:id", async (req, res) => {
  try {
    await connectMongo();
    const provision = await Provision.findById(req.params.id)
      .populate({ path: "act", populate: { path: "categories", select: "name slug icon" } })
      .populate("parentProvision", "provisionNumber title provisionType")
      .lean();

    if (!provision) return res.status(404).json({ error: "Provision not found." });

    const relationships = await ProvisionRelationship.find({ sourceProvision: provision._id })
      .populate("targetProvision", "provisionNumber title provisionType")
      .lean();

    res.json({ provision, relationships });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Could not load provision." });
  }
});

app.get("/legal/search", async (req, res) => {
  try {
    await connectMongo();
    const q = (req.query.q || "").toString().trim();
    if (!q) return res.json({ results: [], total: 0 });

    const page = parsePage(req.query.page);
    const limit = parseLimit(req.query.limit);
    const query = new RegExp(escapeRegex(q), "i");
    const filter = {
      $or: [
        { provisionNumber: query },
        { title: query },
        { text: query },
      ],
    };

    const [provisions, total] = await Promise.all([
      Provision.find(filter)
        .populate({ path: "act", populate: { path: "categories", select: "name slug" } })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Provision.countDocuments(filter),
    ]);

    const results = provisions.map(provision => ({
      act: provision.act?.name || "Unknown Act",
      provisionNumber: provision.provisionNumber,
      provisionTitle: provision.title,
      provisionType: provision.provisionType,
      snippet: provision.text.slice(0, 260),
      category: provision.act?.categories?.[0]?.name || "Uncategorized",
      sourceUrl: provision.sourceUrl,
      provisionId: provision._id,
      actId: provision.act?._id,
    }));

    res.json({ results, total, page, limit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Could not search legal provisions." });
  }
});

app.get("/admin/import/sample", (req, res) => {
  res.json(IMPORTANT_LEGAL_SAMPLE);
});

app.post("/admin/import/sample", async (req, res) => {
  try {
    const result = await importLegalData(IMPORTANT_LEGAL_SAMPLE);
    res.status(result.errors.length ? 207 : 200).json({
      success: result.errors.length === 0,
      message: "Important starter Acts and provisions imported.",
      ...result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message || "Sample import failed." });
  }
});

app.post("/admin/import/legal-json", async (req, res) => {
  try {
    const result = await importLegalData(req.body);
    res.status(result.errors.length ? 207 : 200).json({
      success: result.errors.length === 0,
      message: "Legal data import completed.",
      ...result,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      success: false,
      error: err.message || "Legal data import failed.",
    });
  }
});

app.post("/ask", async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY is not configured on the server.",
        answer: "LexAI is not configured yet. Add GEMINI_API_KEY to the backend environment and restart the server.",
      });
    }

    const { question, context = "", mode } = req.body || {};

    if (mode === "hotTopics") {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: hotTopicsPrompt(),
      });
      const text = cleanJsonText(response.text || "");
      const topics = JSON.parse(text);

      await logVisitSafely(req, {
        page: "/ask",
      });

      return res.json({
        topics,
      });
    }

    if (!question || typeof question !== "string") {
      return res.status(400).json({
        error: "Question is required.",
        answer: "Please enter a legal question before asking LexAI.",
      });
    }

    const [relatedHistory, relevantProvisions] = await Promise.all([
      findRelatedChatHistory(question),
      findRelevantProvisions(question),
    ]);
    const enrichedContext = buildAIContext(context, relatedHistory, relevantProvisions);
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: legalAnswerPrompt(question, enrichedContext),
    });

    const answer = (response.text || "").trim();

    if (!answer) {
      throw new Error("Gemini returned an empty response.");
    }

    await logVisitSafely(req, {
      page: "/ask",
      question,
    });
    await saveChatHistorySafely(req, question, answer, relatedHistory);

    res.json({
      answer,
      relatedQuestions: relatedHistory.map(entry => entry.question),
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message || "AI service failed.",
      answer: "Sorry, the AI service is currently unavailable.",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
