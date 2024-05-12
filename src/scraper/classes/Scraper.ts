import { sleep } from "bun";
import type IScraper from "../interfaces/IScraper";
import Apartment from "./Apartment";
import type ApartmentData from "./ApartmentData";
import * as cheerio from "cheerio";
import Logger from "../../util/classes/Logger";

export default class Scraper implements IScraper {
  logger: Logger;
  constructor() {
    this.logger = new Logger();
  }
  getApartmentObject(root: cheerio.Root): ApartmentData[] {
    this.logger.logInfo("getApartmentObject - Starting Function");
    const apartment_obj: ApartmentData[] = [];
    root("ul.priceBedRangeInfo > li.column").each((index, element) => {
      // Extract the label and detail information
      const label = root(element).find(".rentInfoLabel").text().trim();
      const detail = root(element).find(".rentInfoDetail").text().trim();
      // Output the label and detail information
      if (label != "Square Feet") {
        apartment_obj.push({ key: label, value: detail });
      }
    });
    let address = root("div.propertyAddressContainer > h2")
      .contents()
      .map((i, el) => root(el).text().trim())
      .get()
      .join(" ")
      .replace(/ +/g, " ")
      .replace(/[\n\t]/g, "")
      .trim();
    this.logger.logInfo(address);
    apartment_obj.push({ key: "address", value: address });
    this.logger.logInfo("getApartmentObject - Ending Function");
    return apartment_obj;
  }
  async getApartmentDataFromURL(url: string | undefined): Promise<Apartment[]> {
    try {
      this.logger.logInfo("getApartmentDataFromUrl - Starting Function");
      var body = await this.getHtmlText(url);
      var root = await this.getCheerioRoot(body);
      var apartmentSet = this.getApartmentLinks(root);
      var apartmentData: ApartmentData[][] = [];
      for (const url of apartmentSet) {
        await sleep(10000 * Math.random());
        var apartment_obj = await this.getIndividualApartmentData(url);
        apartmentData.push(apartment_obj);
      }
      let apartmentParsedData: Apartment[] = [];
      apartmentData.forEach((apartment) => {
        apartmentParsedData.push(this.parseApartmentData(apartment));
      });
      this.logger.logInfo("getApartmentDataFromUrl - Starting Function");
      return apartmentParsedData;
    } catch (error) {
      console.error(
        "[getApartmentDataFromURL]: Error occurred in this function",
        error
      );
      throw new Error("Error getting apartment data from url");
    }
  }
  async getHtmlText(url: string | undefined): Promise<string> {
    this.logger.logInfo("getHtmlText - Starting Function");
    if (url == undefined) return "";
    const response = await fetch(url);
    const body = await response.text();
    this.logger.logInfo("getHtmlText - Ending Function");
    return body;
  }
  getCheerioRoot(body: string): cheerio.Root {
    try {
      this.logger.logInfo("getCheerioRoot - Starting Function");
      var root = cheerio.load(body);
      this.logger.logInfo("getCheerioRoot - Ending Function");
      return root;
    } catch (error) {
      console.error("Cheerio failed to load body text");
      throw error;
    }
  }
  getApartmentLinks(root: cheerio.Root): Set<string> {
    try {
      this.logger.logInfo("getApartmentLinks - Starting Function");
      var apartmentSet = new Set<string>();

      root(".property-link").each((i, element) => {
        var link = root(element).attr("href");
        link ? apartmentSet.add(link) : null;
      });
      this.logger.logInfo("getApartmentLinks - Ending Function");
      return apartmentSet;
    } catch (error) {
      throw new Error("Error getting apartment data from url");
    }
  }
  async getIndividualApartmentData(url: string): Promise<ApartmentData[]> {
    this.logger.logInfo("getIndividualApartmentData - Starting Function");
    var body = await this.getHtmlText(url);
    var root = await this.getCheerioRoot(body);

    var apartment_data: ApartmentData[] = await this.getApartmentObject(root);
    sleep(8000 * Math.random());
    var urlData: ApartmentData = { key: "url", value: url };
    apartment_data.push(urlData);
    this.logger.logInfo("getIndividualApartmentData - Ending Function");
    return apartment_data;
  }
  rentStringToInt(moneyString: string): number {
    let str = moneyString.replace(",", "");
    let strmatch = str.match(/(\d+(?:\.\d+)?)/);
    if (strmatch != undefined) {
      return Number(strmatch[0]);
    } else {
      return -1;
    }
  }
  bathroomStringToInt(bathroomString: string): number {
    let strmatch = bathroomString.match(/(\d+(?:\.\d+)?)/);
    if (strmatch != undefined) {
      return Number(strmatch[0]);
    } else {
      return -1;
    }
  }
  bedroomStringToInt(bedroomString: string): number {
    let strmatch = bedroomString.match(/(\d+(?:\.\d+)?)/);
    if (strmatch != undefined) {
      return Number(strmatch[0]);
    } else {
      return -1;
    }
  }
  parseApartmentData(apartmentData: ApartmentData[]): Apartment {
    let newApartment: Apartment = new Apartment();
    for (const pair of apartmentData) {
      switch (pair.key) {
        case "Monthly Rent":
          newApartment.$price = this.rentStringToInt(pair.value);
          break;
        case "Bedrooms":
          newApartment.$bedrooms = this.bedroomStringToInt(pair.value);
          break;
        case "Bathrooms":
          newApartment.$bathrooms = this.bathroomStringToInt(pair.value);
          break;
        case "url":
          newApartment.$url = pair.value;
          break;
        case "address":
          newApartment.$address = pair.value;
          break;
      }
    }
    newApartment.$new = 1;
    return newApartment;
  }
}
