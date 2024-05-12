import { Database as sqlite } from "bun:sqlite";
import { AsciiTable3 } from "ascii-table3";

import type IDatabase from "../interfaces/IDatabase";
import Logger from "../../../util/classes/Logger";

export default class Database implements IDatabase {
  db: sqlite;
  logger: Logger;
  constructor() {
    this.db = new sqlite("./db/apartments.db");
    this.logger = new Logger();
  }
  getAllData(): string {
    this.logger.logInfo("getAllData - Starting function");
    let query = this.db.query(
      `SELECT * FROM apartments WHERE bathrooms >= 2 AND bedrooms = 4`
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
}
