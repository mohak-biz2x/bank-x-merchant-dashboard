import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { getToken } from "./auth.js";
import { createEnvelope, getEmbeddedSigningUrl } from "./docusign.js";

config({ path: "../docusign.env" });

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

/**
 * POST /api/envelopes
 * Creates an envelope and returns an embedded signing URL.
 *
 * Body: {
 *   signerEmail: string,
 *   signerName: string,
 *   documentBase64?: string,   // optional: base64-encoded PDF
 *   documentName?: string,     // optional: filename
 *   subject?: string           // optional: email subject
 * }
 */
app.post("/api/envelopes", async (req, res) => {
  try {
    const { signerEmail, signerName, documentBase64, documentName, subject } =
      req.body;

    if (!signerEmail || !signerName) {
      return res
        .status(400)
        .json({ error: "signerEmail and signerName are required" });
    }

    // Get JWT access token
    const accessToken = await getToken();

    // Create envelope
    const envelopeId = await createEnvelope(accessToken, {
      signerEmail,
      signerName,
      documentBase64,
      documentName,
      subject,
    });

    // Get embedded signing URL
    const signingUrl = await getEmbeddedSigningUrl(accessToken, envelopeId, {
      signerEmail,
      signerName,
      returnUrl: "http://localhost:5173/signing-complete",
    });

    res.json({ envelopeId, signingUrl });
  } catch (error) {
    console.error("Error creating envelope:", error.message || error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

/**
 * GET /api/envelopes/:envelopeId/status
 * Returns the status of an envelope.
 */
app.get("/api/envelopes/:envelopeId/status", async (req, res) => {
  try {
    const accessToken = await getToken();
    const { envelopeId } = req.params;

    const docusign = await import("docusign-esign");
    const apiClient = new docusign.ApiClient();
    apiClient.setBasePath(`${process.env.DOCUSIGN_BASE_URL}/restapi`);
    apiClient.addDefaultHeader("Authorization", `Bearer ${accessToken}`);

    const envelopesApi = new docusign.EnvelopesApi(apiClient);
    const envelope = await envelopesApi.getEnvelope(
      process.env.DOCUSIGN_ACCOUNT_ID,
      envelopeId
    );

    res.json({
      envelopeId: envelope.envelopeId,
      status: envelope.status,
      statusChangedDateTime: envelope.statusChangedDateTime,
    });
  } catch (error) {
    console.error("Error getting envelope status:", error.message || error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`DocuSign backend running on http://localhost:${PORT}`);
});
