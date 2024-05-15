import { Component } from "discord.js";
import Scraper from "../../src/scraper/classes/Scraper";
import * as cheerio from "cheerio";
import { setTextRange } from "typescript";
import { main } from "bun";
import Apartment from "../../src/scraper/classes/Apartment";
import ApartmentData from "../../src/scraper/classes/ApartmentData";

describe("Scraper", () => {
  const scraper = new Scraper();
  describe("Scraper text formatting", () => {
    beforeEach(() => {});
    test("check bathroomStringToInt()", () => {
      expect(scraper.bathroomStringToInt("4 ba")).toBe(4);
      expect(scraper.bathroomStringToInt("1.5 ba")).toBe(1.5);
      expect(scraper.bathroomStringToInt("2 - 4 ba")).toBe(2);
      expect(scraper.bathroomStringToInt("invalid")).toBe(-1);
    });
    test("check rentStringToInt()", () => {
      expect(scraper.rentStringToInt("$1,200")).toBe(1200);
      expect(scraper.rentStringToInt("$100")).toBe(100);
      expect(scraper.rentStringToInt("testing")).toBe(-1);
    });
    test("check bedroomStringToInt()", () => {
      expect(scraper.bedroomStringToInt("1 bd")).toBe(1);
      expect(scraper.bedroomStringToInt("2 - 4 bd")).toBe(2);
      expect(scraper.bedroomStringToInt("testing")).toBe(-1);
    });
  });
  describe("root parsing", async () => {
    const mainFile: string = await Bun.file("test/static/mainPage.html").text();
    const apartFile: string = await Bun.file(
      "test/static/apartment.html"
    ).text();

    const mainRoot = cheerio.load(mainFile);
    const apartRoot = cheerio.load(apartFile);
    test("getCheerioRoot()", () => {
      const root = scraper.getCheerioRoot(mainFile);
      expect(root).toBeTruthy();
    });
    test("getApartmentObject()", () => {
      const testSet = new Set<string>();
      testSet.add(
        "https://www.apartments.com/avon-woods-apartments-avon-ct/1bl22r6/"
      );
      testSet.add("https://www.apartments.com/avon-place-avon-ct/577r0bq/");
      testSet.add("https://www.apartments.com/46-avonwood-rd-avon-ct/3ny1v3f/");
      const result = scraper.getApartmentLinks(mainRoot);
      expect(Bun.deepEquals(result, testSet)).toBe(true);
    });
    test("getApartmentObject()", () => {
      const exampleResult: ApartmentData[] = [
        new ApartmentData("Monthly Rent", "$1,528 - $1,820"),
        new ApartmentData("Bedrooms", "1 - 2 bd"),
        new ApartmentData("Bathrooms", "1 - 2 ba"),
        new ApartmentData("address", "75 Avonwood Rd, Avon , CT 06001 – Avon"),
      ];

      const obj_test = scraper.getApartmentObject(apartRoot);
      expect(Bun.deepEquals(obj_test, exampleResult)).toBe(true);
    });
  });
});
