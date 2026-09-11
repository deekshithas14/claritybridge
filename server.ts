import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "35mb" }));

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in the environment.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const clarityResponseSchema = {
  type: Type.OBJECT,
  properties: {
    headline: {
      type: Type.STRING,
      description: "A single concise, punchy sentence explaining the essence of this document in plain English.",
    },
    documentType: {
      type: Type.STRING,
      description: "The specific classification of the document (e.g., Medical Explanation of Benefits, Residential Lease Notice, Municipal Traffic Citation, SaaS Agreement).",
    },
    urgencyLevel: {
      type: Type.STRING,
      description: "One of: low, medium, high, critical",
    },
    urgencyReason: {
      type: Type.STRING,
      description: "Why this urgency level applies (mentioning specific upcoming deadlines, consequences, or penalties).",
    },
    simpleExplanation: {
      type: Type.OBJECT,
      properties: {
        summaryParagraphs: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "2 to 3 friendly, highly readable paragraphs translating convoluted terminology and bureaucratic jargon into everyday conversational language.",
        },
        theBottomLine: {
          type: Type.STRING,
          description: "The fundamental takeaway in 1-2 direct sentences: what is actually happening and the core reality.",
        },
        whoIsAffected: {
          type: Type.STRING,
          description: "Clear explanation of who the involved parties are and their roles.",
        },
        toneSummary: {
          type: Type.STRING,
          description: "Brief characterization of the document tone (e.g., Standard informational statement, Strict legal warning, High-pressure renewal).",
        },
      },
      required: ["summaryParagraphs", "theBottomLine", "whoIsAffected", "toneSummary"],
    },
    keyInformation: {
      type: Type.ARRAY,
      description: "Crucial extracted data points (monetary figures, dates, account numbers, entities, deadlines).",
      items: {
        type: Type.OBJECT,
        properties: {
          label: {
            type: Type.STRING,
            description: "Clear label (e.g. Total Amount Billed, Patient Responsibility, Filing Deadline, Citation #).",
          },
          value: {
            type: Type.STRING,
            description: "The exact extracted value or amount.",
          },
          note: {
            type: Type.STRING,
            description: "Critical context or caveat regarding this figure (e.g., 'Subject to provider appeal', 'Increases by $45 after Oct 19').",
          },
          category: {
            type: Type.STRING,
            description: "Group category: Financial, Dates & Deadlines, Identifiers, Entities, or Legal Terms.",
          },
          iconType: {
            type: Type.STRING,
            description: "One of: money, calendar, hash, building, person, phone, alert, file, shield",
          },
        },
        required: ["label", "value", "category", "iconType"],
      },
    },
    importantPoints: {
      type: Type.ARRAY,
      description: "Critical nuances, fine print stipulations, rights, hidden fees, or risks people frequently overlook.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: "Concise title for the point.",
          },
          detail: {
            type: Type.STRING,
            description: "Detailed explanation of the rule, caveat, or risk in clear words.",
          },
          severity: {
            type: Type.STRING,
            description: "One of: info, warning, critical",
          },
        },
        required: ["title", "detail", "severity"],
      },
    },
    whatToDoNext: {
      type: Type.ARRAY,
      description: "Ordered, concrete actionable steps the user should take to protect themselves or resolve the issue.",
      items: {
        type: Type.OBJECT,
        properties: {
          stepNumber: {
            type: Type.INTEGER,
            description: "Step order (1, 2, 3...)",
          },
          action: {
            type: Type.STRING,
            description: "Direct action verb statement (e.g., 'Verify Pre-Authorization with Clinic', 'Submit Written Contest Form').",
          },
          details: {
            type: Type.STRING,
            description: "Step-by-step practical guidance: what to say, what forms to request, what pitfalls to avoid.",
          },
          timeframe: {
            type: Type.STRING,
            description: "Expected timeframe or hard deadline (e.g., 'Immediate (within 48 hours)', 'Before October 19, 2025').",
          },
          priority: {
            type: Type.STRING,
            description: "One of: urgent, recommended, optional",
          },
        },
        required: ["stepNumber", "action", "details", "timeframe", "priority"],
      },
    },
  },
  required: [
    "headline",
    "documentType",
    "urgencyLevel",
    "urgencyReason",
    "simpleExplanation",
    "keyInformation",
    "importantPoints",
    "whatToDoNext",
  ],
};

// API Health
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// API Analyze (Text or Image)
app.post("/api/analyze", async (req, res) => {
  try {
    const { mode, text, image, userFocus } = req.body;

    if (mode === "text" && (!text || typeof text !== "string" || text.trim().length === 0)) {
      return res.status(400).json({ error: "Please provide some text to analyze." });
    }

    if (mode === "image" && (!image || !image.data || !image.mimeType)) {
      return res.status(400).json({ error: "Please provide valid image data." });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are ClarityBridge, an elite expert communicator and document translator.
Your mission is to examine complicated, dense, messy, and bureaucratic real-world information (medical bills, EOBs, lease renewals, court/parking citations, legal contracts, utility notices, insurance statements, financial fine print, etc.).
You must:
1. Decode the underlying reality: what is really going on?
2. Translate everything into accessible, clear Plain English that any non-expert can immediately grasp.
3. Extract key data points accurately (monetary figures, exact dates, reference numbers, parties involved).
4. Uncover the fine print, hidden traps, deadlines, and rights in the Important Points.
5. Provide a realistic, prioritized, actionable checklist of What To Do Next so the user knows exactly what move to make first, second, and third.

Guidelines:
- If a document says "THIS IS NOT A BILL", explain what that means and whether the patient actually owes money now or later.
- Never use dry legalese when explaining. Be candid, empowering, and helpful.
- For urgencyLevel: choose 'critical' for imminent legal/financial consequences or cutoffs (< 7 days), 'high' for standard formal deadlines (< 30 days), 'medium' for regular business timelines, 'low' for purely informational items.
${userFocus ? `Specific user focus: "${userFocus}". Make sure to address this question/concern directly in the explanation and next steps.` : ""}`;

    let contents: any;

    if (mode === "text") {
      contents = [
        {
          text: `Analyze the following messy or complex text:\n\n---\n${text.trim()}\n---`,
        },
      ];
    } else {
      // Clean base64 data if it contains a data URL prefix
      let base64Data = image.data;
      if (base64Data.includes(",")) {
        base64Data = base64Data.split(",")[1];
      }

      contents = {
        parts: [
          {
            inlineData: {
              mimeType: image.mimeType,
              data: base64Data,
            },
          },
          {
            text: "Carefully inspect and read all visible text, tables, figures, disclaimers, stamps, and annotations in this image. Decode the document, extract all vital information, translate it simply, and tell the user what to do next.",
          },
        ],
      };
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: clarityResponseSchema,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Gemini returned an empty response.");
    }

    const parsedData = JSON.parse(responseText);

    // Attach unique IDs and timestamp
    const analysisId = `cb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const enrichedAnalysis = {
      id: analysisId,
      ...parsedData,
      keyInformation: (parsedData.keyInformation || []).map((item: any, idx: number) => ({
        ...item,
        id: `ki-${idx + 1}`,
      })),
      importantPoints: (parsedData.importantPoints || []).map((point: any, idx: number) => ({
        ...point,
        id: `ip-${idx + 1}`,
      })),
      whatToDoNext: (parsedData.whatToDoNext || []).map((step: any, idx: number) => ({
        ...step,
        id: `step-${step.stepNumber || idx + 1}`,
        completed: false,
      })),
      analyzedAt: new Date().toISOString(),
      inputMode: mode,
      previewSnippet: mode === "text" ? text.slice(0, 140) + (text.length > 140 ? "..." : "") : undefined,
    };

    return res.json(enrichedAnalysis);
  } catch (error: any) {
    console.error("ClarityBridge Analysis Error:", error);
    return res.status(500).json({
      error: error?.message || "Failed to analyze the document. Please try again.",
    });
  }
});

// API Clarification (Follow-up Question)
app.post("/api/clarify", async (req, res) => {
  try {
    const { question, documentSummary } = req.body;
    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "Please enter a question." });
    }

    const ai = getGeminiClient();

    const prompt = `You are ClarityBridge's expert advisor. A user has a specific follow-up question regarding a document they had you analyze.

DOCUMENT CONTEXT:
${documentSummary ? JSON.stringify(documentSummary, null, 2) : "User document"}

USER'S QUESTION:
"${question}"

Provide a clear, reassuring, direct, and jargon-free answer in Plain English.
If there are practical risks or specific actions to take, be explicit. Keep your answer concise (2-4 paragraphs or a short bulleted list), empathetic, and directly helpful.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return res.json({
      answer: response.text || "No response generated.",
      answeredAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Clarification Error:", error);
    return res.status(500).json({
      error: error?.message || "Failed to answer question.",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ClarityBridge Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
