import { generateText } from "./gemini";

const fallbackTemplate = (
  platform: string,
  alertId: string,
  identityName: string
) => {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return `DMCA TAKEDOWN NOTICE

Date: ${date}
Platform: ${platform}
Alert ID: ${alertId}

To Whom It May Concern,

I, ${identityName}, am submitting this notice under the Digital Millennium Copyright Act (17 U.S.C. § 512).

The content associated with Alert ID ${alertId} contains an unauthorized AI-generated deepfake using my biometric identity. This identity is cryptographically registered on the Solana blockchain, and the content does not match my registered original.

I have a good faith belief that this use is not authorized by me, my agent, or the law.

The information in this notice is accurate, and I declare under penalty of perjury that I am the rightful owner of the identity being misused.

Please remove the infringing content immediately.

Sincerely,
${identityName}
CreativeArmor Active Defense`;
};

export async function generateDMCANotice(
  platform: "TikTok" | "Instagram" | "YouTube" | "X",
  alertId: string,
  identityName: string
): Promise<string> {

  const prompt = `
Write a formal DMCA takedown notice for deepfake identity theft.

Victim: ${identityName}
Platform: ${platform}
Alert ID: ${alertId}

The identity is cryptographically verified on the Solana blockchain and the detected media is an unauthorized AI-generated impersonation.

The letter must:
- Be legally professional
- Cite DMCA 17 U.S.C. § 512
- Include good faith + perjury statements
- Demand immediate removal
- Mention cryptographic proof

Return only the DMCA letter.
`;

  try {
    const result = await generateText(prompt);

    // Safety check: Gemini sometimes returns empty or junk
    if (!result || result.length < 300) {
      throw new Error("Weak Gemini response");
    }

    return result;
  } catch (err) {
    console.warn("Gemini failed, using fallback DMCA:", err);
    return fallbackTemplate(platform, alertId, identityName);
  }
}
