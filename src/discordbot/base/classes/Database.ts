import { Database as sqlite } from "bun:sqlite";
import { AsciiTable3 } from "ascii-table3";

import type IDatabase from "../interfaces/IDatabase";
import Logger from "../../../util/classes/Logger";
import { Client } from "discord.js";

export default class Database implements IDatabase {
  db: sqlite;
  logger: Logger;
  minBathroom: string;
  minBedrooms: string;
  constructor() {
    this.db = new sqlite("./db/apartments.db");
    this.logger = new Logger();
    this.minBathroom = Bun.env.MIN_BATHROOMS ?? "1";
    this.minBedrooms = Bun.env.MIN_BEDROOMS ?? "2";
  }
  async selectNewApartments(): Promise<any[]> {
    this.logger.logInfo("selectNewApartments - Starting function");
    let query = this.db.query(`SELECT * FROM apartments WHERE new = 1`);
    let result = await query.all();
    this.logger.logInfo("selectNewApartments - Ending function");
    return result;
  }
  getAllData(): string {
    this.logger.logInfo("getAllData - Starting function");
    let query = this.db.query(
      `SELECT * FROM apartments WHERE bathrooms >= ${this.minBathroom} AND bedrooms = ${this.minBedrooms}`
    );
    let result = query.all();
    let resultString = "";
    let table = new AsciiTable3().setHeading(
      "Address",
      "Price",
      "Bedrooms",
      "Bathrooms",
      "New"
    );
    result.forEach((apartment: any) => {
      table.addRow(
        `${apartment["address"]}`,
        `$${apartment["price"]}`,
        apartment["bedrooms"],
        apartment["bathrooms"],
        apartment["new"] == 1 ? "True" : "False"
      );
      this.logger.logInfo(`[Link](${apartment.url})`);
    });
    this.logger.logInfo("getAllData - Ending function");
    this.logger.logInfo(table.toString());
    return table.toString();
  }
  updateAllOldApartmentsToOld(): void {
    this.logger.logInfo("updateAllOldApartmentsToOld - Starting function");
    this.db.run("UPDATE apartments SET new=0");
    this.logger.logInfo("updateAllOldApartmentsToOld - Ending function");
  }
}
