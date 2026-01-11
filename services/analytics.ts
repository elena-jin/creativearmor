import { snowflakeQuery } from "./snowflake";

export async function logScanEvent(
  faceHash: string,
  result: "REAL" | "AI_GENERATED",
  category: string
) {
  const sql = `
    INSERT INTO creativearmor_scans
    VALUES (
      '${crypto.randomUUID()}',
      '${faceHash}',
      '${result}',
      '${category}',
      CURRENT_TIMESTAMP()
    )
  `;

  await snowflakeQuery(sql);
}
