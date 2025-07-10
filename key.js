const crypto = require("crypto");

/**
 * Generates a secure API key with optional metadata
 * @param {number} byteLength - Length in bytes (default 32 = 64 hex chars)
 * @returns {string} API key
 */
function generateApiKey(byteLength = 32) {
  return crypto.randomBytes(byteLength).toString("hex"); // 64 characters
}

// Example: Generate a new key
const apiKey = generateApiKey();

console.log("✅ Generated API Key:");
console.log(apiKey);
