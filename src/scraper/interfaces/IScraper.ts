import type Apartment from "../classes/Apartment";
import type ApartmentData from "../classes/ApartmentData";
import type Logger from "../../util/classes/Logger";

export default interface Scraper {
  logger: Logger;
  getApartmentDataFromURL(url: string | undefined): Promise<Apartment[]>;
  getHtmlText(url: string | undefined): Promise<string>;
  getCheerioRoot(body: string): cheerio.Root;
  getApartmentLinks(root: cheerio.Root): Set<string>;
  getIndividualApartmentData(url: string): Promise<ApartmentData[]>;
  getApartmentObject(root: cheerio.Root): ApartmentData[];

  rentStringToInt(moneyString: string): number;
  bathroomStringToInt(bathroomString: string): number;
  bedroomStringToInt(bedroomString: string): number;
  parseApartmentData(apartmentData: ApartmentData[]): Apartment;
}
