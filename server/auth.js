import docusign from "docusign-esign";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let cachedToken = null;
let tokenExpiry = 0;

/**
 * Get a JWT access token from DocuSign.
 * Caches the token until it expires.
 */
export async function getToken() {
  // Return cached token if still valid (with 5 min buffer)
  if (cachedToken && Date.now() < tokenExpiry - 5 * 60 * 1000) {
    return cachedToken;
  }

  const apiClient = new docusign.ApiClient();
  apiClient.setOAuthBasePath("account-d.docusign.com");

  const privateKeyPath = path.resolve(
    __dirname,
    "..",
    process.env.DOCUSIGN_PRIVATE_KEY_PATH
  );
  const privateKey = fs.readFileSync(privateKeyPath, "utf8");

  const results = await apiClient.requestJWTUserToken(
    process.env.DOCUSIGN_INTEGRATION_KEY,
    process.env.DOCUSIGN_USER_ID,
    ["signature", "impersonation"],
    privateKey,
    3600 // token valid for 1 hour
  );

  cachedToken = results.body.access_token;
  tokenExpiry = Date.now() + results.body.expires_in * 1000;

  console.log("JWT token obtained successfully");
  return cachedToken;
}
