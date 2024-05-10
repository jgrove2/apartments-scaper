import { Database as sqlite } from "bun:sqlite";
import Logger from "../../../util/classes/Logger";
export default interface ILogger {
  db: sqlite;
  logger: Logger;
  getAllData(): string;
}
