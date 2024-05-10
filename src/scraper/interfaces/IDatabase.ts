import type Apartment from "../classes/Apartment";
import { Database as sqlite } from "bun:sqlite";
import type Logger from "../classes/Logger";

export default interface IDatabase {
  db: sqlite;
  logger: Logger;
  uploadApartmentsToDB(apartmentList: Apartment[]): void;
  deleteAllApartmentsNotExisting(apartmentList: Apartment[]): void;
  updateAllOldApartmentsToOld(apartmentList: Apartment[]): void;
  insertAllNewApartments(apartmentList: Apartment[]): void;
  createTableIfNotCreated(): void;
}
