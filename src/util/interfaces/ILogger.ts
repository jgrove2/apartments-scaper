export default interface ILogger {
  time: Date;
  logInfo(info: string): void;
  logWarning(warning: string): void;
  logError(warning: string, error: Error): void;
  getFullTimestamp(): string;
}
