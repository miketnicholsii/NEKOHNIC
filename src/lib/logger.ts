// Production logging service
// Provides minimal, privacy-safe logging for critical events

type LogLevel = "info" | "warn" | "error";

interface LogEvent {
  level: LogLevel;
  category: "auth" | "data" | "network" | "ui" | "general";
  message: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// In-memory log buffer for session (max 50 entries)
const logBuffer: LogEvent[] = [];
const MAX_BUFFER_SIZE = 50;

function sanitizeMetadata(metadata?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!metadata) return undefined;
  
  // Remove sensitive fields
  const sensitiveKeys = ["password", "token", "secret", "key", "auth", "credential", "email", "phone"];
  const sanitized: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(metadata)) {
    const lowerKey = key.toLowerCase();
    if (sensitiveKeys.some(s => lowerKey.includes(s))) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof value === "string" && value.length > 100) {
      sanitized[key] = value.slice(0, 100) + "...";
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

function createLogEvent(
  level: LogLevel,
  category: LogEvent["category"],
  message: string,
  metadata?: Record<string, unknown>
): LogEvent {
  return {
    level,
    category,
    message,
    timestamp: new Date().toISOString(),
    metadata: sanitizeMetadata(metadata),
  };
}

function addToBuffer(event: LogEvent): void {
  logBuffer.push(event);
  if (logBuffer.length > MAX_BUFFER_SIZE) {
    logBuffer.shift();
  }
}

export const logger = {
  // Auth-related events
  authFailure: (message: string, metadata?: Record<string, unknown>) => {
    const event = createLogEvent("error", "auth", message, metadata);
    addToBuffer(event);
    console.error(`[AUTH] ${message}`, metadata);
  },

  authEvent: (message: string, metadata?: Record<string, unknown>) => {
    const event = createLogEvent("info", "auth", message, metadata);
    addToBuffer(event);
    if (import.meta.env.DEV) {
      console.log(`[AUTH] ${message}`, metadata);
    }
  },

  // Data fetch failures
  dataError: (message: string, metadata?: Record<string, unknown>) => {
    const event = createLogEvent("error", "data", message, metadata);
    addToBuffer(event);
    console.error(`[DATA] ${message}`, metadata);
  },

  // Network errors
  networkError: (message: string, metadata?: Record<string, unknown>) => {
    const event = createLogEvent("error", "network", message, metadata);
    addToBuffer(event);
    console.error(`[NETWORK] ${message}`, metadata);
  },

  // UI/rendering errors
  uiError: (message: string, metadata?: Record<string, unknown>) => {
    const event = createLogEvent("error", "ui", message, metadata);
    addToBuffer(event);
    console.error(`[UI] ${message}`, metadata);
  },

  // General warnings
  warn: (message: string, metadata?: Record<string, unknown>) => {
    const event = createLogEvent("warn", "general", message, metadata);
    addToBuffer(event);
    console.warn(`[WARN] ${message}`, metadata);
  },

  // General info (dev only)
  info: (message: string, metadata?: Record<string, unknown>) => {
    if (import.meta.env.DEV) {
      const event = createLogEvent("info", "general", message, metadata);
      addToBuffer(event);
      console.log(`[INFO] ${message}`, metadata);
    }
  },

  // Get recent logs for debugging/reporting
  getRecentLogs: (): LogEvent[] => {
    return [...logBuffer];
  },

  // Get log summary for problem reports
  getLogSummary: (): string => {
    const errors = logBuffer.filter(l => l.level === "error");
    if (errors.length === 0) return "No recent errors";
    
    return errors
      .slice(-5)
      .map(e => `[${e.timestamp}] ${e.category}: ${e.message}`)
      .join("\n");
  },

  // Clear log buffer
  clear: () => {
    logBuffer.length = 0;
  },
};

export default logger;
