export const appConfig = {
  diagnostics: {
    exportFormats: ['csv', 'excel'] as const,
    defaultFormat: 'excel' as const,
  },
  logging: {
    level: 'info' as const,
    outputChannel: 'HEX Problems Exporter' as const
  }
} as const;

export type AppConfig = typeof appConfig;
