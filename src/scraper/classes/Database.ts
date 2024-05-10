import { Database as sqlite } from "bun:sqlite";

import type IDatabase from "../interfaces/IDatabase";
import type Apartment from "./Apartment";
import Logger from "../../util/classes/Logger";

export default class Database implements IDatabase {
  db: sqlite;
  logger: Logger;
  constructor() {
    this.db = new sqlite("./db/apartments.db");
    this.logger = new Logger();
  }
  uploadApartmentsToDB(apartmentList: Apartment[]): void {
    this.logger.logInfo("updateApartmentsToDB - Starting function");
    this.deleteAllApartmentsNotExisting(apartmentList);
    this.updateAllOldApartmentsToOld(apartmentList);
    this.insertAllNewApartments(apartmentList);
    this.logger.logInfo("updateApartmentsToDB - Ending function");
  }
  deleteAllApartmentsNotExisting(apartmentList: Apartment[]): void {
    this.logger.logInfo("deleteAllApartmentsNotExisting - Starting function");
    this.db.run(
      `DELETE FROM apartments WHERE url NOT IN (${apartmentList
        .map((data) => `\'${data.$url}\'`)
        .join(", ")})`
    );
    this.logger.logInfo("deleteAllApartmentsNotExisting - Ending function");
  }
  updateAllOldApartmentsToOld(apartmentList: Apartment[]): void {
    this.logger.logInfo("updateAllOldApartmentsToOld - Starting function");
    this.db.run("UPDATE apartments SET new=0");
    this.logger.logInfo("updateAllOldApartmentsToOld - Ending function");
  }
  insertAllNewApartments(apartmentList: Apartment[]): void {
    this.logger.logInfo("insertAllNewApartments - Starting function");
    const insert = this.db.prepare(
      "INSERT or IGNORE INTO apartments (url, price, bedrooms, bathrooms, new) VALUES ($url, $price, $bedrooms, $bathrooms, $new)"
    );
    const insertApartments = this.db.transaction((apartments) => {
      for (const aprt of apartments) insert.run(aprt);
      return apartments.length;
    });

    const count = insertApartments(apartmentList);
    console.log(`[insertAllNewApartments]: Added/Updated ${count} apartments`);
    this.logger.logInfo("insertAllNewApartments - Starting function");
  }
  createTableIfNotCreated(): void {
    this.logger.logInfo("createTableIfNotCreated - Starting function");
    const query = this.db.query(`CREATE TABLE IF NOT EXISTS apartments (
            id INTEGER PRIMARY KEY,
            url TEXT UNIQUE,
            price INTEGER,
            bedrooms INTEGER,
            bathrooms REAL,
            new INTEGER
        )`);
    query.run();
    this.logger.logInfo("createTableIfNotCreated - Ending function");
  }
}
