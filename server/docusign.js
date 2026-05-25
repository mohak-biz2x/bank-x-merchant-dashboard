import docusign from "docusign-esign";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// A simple sample document if none is provided
const SAMPLE_DOCUMENT = `
<!DOCTYPE html>
<html>
<head><title>Agreement</title></head>
<body style="font-family: Arial, sans-serif; padding: 40px;">
  <h1>Service Agreement</h1>
  <p>This agreement is entered into by the undersigned party.</p>
  <br/><br/>
  <p>By signing below, you agree to the terms and conditions of this service.</p>
  <br/><br/><br/>
  <p><strong>Signature:</strong> /sn1/</p>
  <p><strong>Date:</strong> /ds1/</p>
</body>
</html>
`;

/**
 * Create an envelope with a document for signing.
 */
export async function createEnvelope(
  accessToken,
  { signerEmail, signerName, documentBase64, documentName, subject }
) {
  const apiClient = new docusign.ApiClient();
  apiClient.setBasePath(`${process.env.DOCUSIGN_BASE_URL}/restapi`);
  apiClient.addDefaultHeader("Authorization", `Bearer ${accessToken}`);

  const envelopesApi = new docusign.EnvelopesApi(apiClient);

  // Build the document
  let document;
  if (documentBase64) {
    // Use provided PDF document
    document = docusign.Document.constructFromObject({
      documentBase64,
      name: documentName || "Document.pdf",
      fileExtension: "pdf",
      documentId: "1",
    });
  } else {
    // Use sample HTML document
    document = docusign.Document.constructFromObject({
      documentBase64: Buffer.from(SAMPLE_DOCUMENT).toString("base64"),
      name: documentName || "Agreement.html",
      fileExtension: "html",
      documentId: "1",
    });
  }

  // Create signer with clientUserId for embedded signing
  const signer = docusign.Signer.constructFromObject({
    email: signerEmail,
    name: signerName,
    recipientId: "1",
    clientUserId: "1000", // This makes it an embedded signer
    routingOrder: "1",
  });

  // Add signature and date tabs using anchor strings
  const signHere = docusign.SignHere.constructFromObject({
    anchorString: "/sn1/",
    anchorUnits: "pixels",
    anchorXOffset: "0",
    anchorYOffset: "-10",
  });

  const dateSigned = docusign.DateSigned.constructFromObject({
    anchorString: "/ds1/",
    anchorUnits: "pixels",
    anchorXOffset: "0",
    anchorYOffset: "-10",
  });

  signer.tabs = docusign.Tabs.constructFromObject({
    signHereTabs: [signHere],
    dateSignedTabs: [dateSigned],
  });

  // Build envelope definition
  const envelopeDefinition = docusign.EnvelopeDefinition.constructFromObject({
    emailSubject: subject || "Please sign this document",
    documents: [document],
    recipients: docusign.Recipients.constructFromObject({
      signers: [signer],
    }),
    status: "sent", // "sent" means immediately available for signing
  });

  const results = await envelopesApi.createEnvelope(
    process.env.DOCUSIGN_ACCOUNT_ID,
    { envelopeDefinition }
  );

  console.log(`Envelope created: ${results.envelopeId}`);
  return results.envelopeId;
}

/**
 * Get an embedded signing URL for a recipient.
 */
export async function getEmbeddedSigningUrl(
  accessToken,
  envelopeId,
  { signerEmail, signerName, returnUrl }
) {
  const apiClient = new docusign.ApiClient();
  apiClient.setBasePath(`${process.env.DOCUSIGN_BASE_URL}/restapi`);
  apiClient.addDefaultHeader("Authorization", `Bearer ${accessToken}`);

  const envelopesApi = new docusign.EnvelopesApi(apiClient);

  const recipientViewRequest =
    docusign.RecipientViewRequest.constructFromObject({
      authenticationMethod: "none",
      clientUserId: "1000", // Must match the clientUserId used when creating the envelope
      recipientId: "1",
      returnUrl: returnUrl || "http://localhost:5173/signing-complete",
      userName: signerName,
      email: signerEmail,
    });

  const results = await envelopesApi.createRecipientView(
    process.env.DOCUSIGN_ACCOUNT_ID,
    envelopeId,
    { recipientViewRequest }
  );

  console.log(`Signing URL generated for envelope: ${envelopeId}`);
  return results.url;
}
