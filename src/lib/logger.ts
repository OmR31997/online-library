type LogLevel = "info" | "warn" | "error" | "debug";

// Simple masking function to prevent accidental leakage of secrets in logs
const sanitizeMessage = (message: string): string => {
  if (typeof message !== "string") return message;
  
  return message
    .replace(/(password|secret|token|pass|key)(["']?\s*[:=]\s*["']?)([^\s"';&,\}]+)/gi, "$1$2[REDACTED]")
    .replace(/postgresql:\/\/([^@]+)@/gi, "postgresql://[REDACTED]:[REDACTED]@")
    .replace(/redis:\/\/([^@]+)@/gi, "redis://[REDACTED]:[REDACTED]@");
};

const formatMeta = (meta?: any): string => {
  if (!meta) return "";
  try {
    const metaStr = JSON.stringify(meta);
    return ` | Meta: ${sanitizeMessage(metaStr)}`;
  } catch {
    return " | Meta: [Unserializable Object]";
  }
};

const log = (level: LogLevel, message: string, meta?: any) => {
  const timestamp = new Date().toISOString();
  const sanitizedMsg = sanitizeMessage(message);
  const metaMsg = formatMeta(meta);
  const logLine = `[${timestamp}] [${level.toUpperCase()}] ${sanitizedMsg}${metaMsg}`;

  switch (level) {
    case "error":
      console.error(logLine);
      break;
    case "warn":
      console.warn(logLine);
      break;
    case "info":
      console.log(logLine);
      break;
    case "debug":
      if (process.env.NODE_ENV !== "production") {
        console.debug(logLine);
      }
      break;
  }
};

export const logger = {
  info: (msg: string, meta?: any) => log("info", msg, meta),
  warn: (msg: string, meta?: any) => log("warn", msg, meta),
  error: (msg: string, meta?: any) => log("error", msg, meta),
  debug: (msg: string, meta?: any) => log("debug", msg, meta),
};
