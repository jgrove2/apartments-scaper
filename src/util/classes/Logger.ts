import type ILogger from "../interfaces/ILogger";

export default class Logger implements ILogger {
  time: Date;
  constructor() {
    this.time = new Date();
  }
  logInfo(info: string): void {
    console.log(`[${this.getFullTimestamp()}]: ${info}`);
  }
  logWarning(warning: string): void {
    throw new Error("Method not implemented.");
  }
  logError(warning: string, error: Error): void {
    throw new Error("Method not implemented.");
  }
  getFullTimestamp() {
    const pad = (n: any, s = 2) => `${new Array(s).fill(0)}${n}`.slice(-s);
    const d = new Date();

    return `${pad(d.getFullYear(), 4)}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(
      d.getMilliseconds(),
      3
    )}`;
  }
}
