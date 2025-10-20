type LogLevel = "error" | "warn" | "info" | "debug"

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  data?: unknown
  error?: unknown
}

export const logger = {
  error: (message: string, error?: unknown) => {
    const entry: LogEntry = {
      level: "error",
      message,
      timestamp: new Date().toISOString(),
      error,
    }
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${message}`, error)
    // Integrar com Sentry/LogRocket aqui no futuro
  },

  warn: (message: string, data?: unknown) => {
    const entry: LogEntry = {
      level: "warn",
      message,
      timestamp: new Date().toISOString(),
      data,
    }
    // eslint-disable-next-line no-console
    console.warn(`[WARN] ${message}`, data)
  },

  info: (message: string, data?: unknown) => {
    const entry: LogEntry = {
      level: "info",
      message,
      timestamp: new Date().toISOString(),
      data,
    }
    // eslint-disable-next-line no-console
    console.info(`[INFO] ${message}`, data)
  },

  debug: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === "development") {
      const entry: LogEntry = {
        level: "debug",
        message,
        timestamp: new Date().toISOString(),
        data,
      }
      // eslint-disable-next-line no-console
      console.debug(`[DEBUG] ${message}`, data)
    }
  },
}