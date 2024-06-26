import type Apartment from "../classes/Apartment";
import { Database as sqlite } from "bun:sqlite";
import type Logger from "../../util/classes/Logger";

export default interface IDatabase {
  db: sqlite;
  logger: Logger;
  uploadApartmentsToDB(apartmentList: Apartment[]): void;
  deleteAllApartmentsNotExisting(apartmentList: Apartment[]): void;
  updateAllOldApartmentsToOld(): void;
  insertAllNewApartments(apartmentList: Apartment[]): void;
  createTableIfNotCreated(): void;
}
