import { Database as sqlite } from "bun:sqlite";
import Logger from "../../../util/classes/Logger";
export default interface ILogger {
  db: sqlite;
  logger: Logger;
  minBathroom: string;
  minBedrooms: string;
  getAllData(): string;
  selectNewApartments(): Promise<any[]>;
  updateAllOldApartmentsToOld(): void;
}
