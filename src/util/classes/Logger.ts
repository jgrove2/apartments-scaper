import type ILogger from "../interfaces/ILogger";

export default class Logger implements ILogger {
  time: Date;
  constructor() {
    this.time = new Date();
  }
  logInfo(info: string): void {
    console.log(`[${this.time.getUTCDate()}]: ${info}`);
  }
  logWarning(warning: string): void {
    throw new Error("Method not implemented.");
  }
  logError(warning: string, error: Error): void {
    throw new Error("Method not implemented.");
  }
}
