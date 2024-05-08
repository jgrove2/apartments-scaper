import { sleep } from "bun";
import * as cheerio from "cheerio";

interface ApartmentData {
  key: string;
  value: string;
}

export class Apartment {
  $url: string;
  $price: number;
  $bedrooms: number;
  $bathrooms: number;

  constructor(
    url: string = "",
    price: number = -1,
    bedrooms: number = -1,
    bathrooms: number = -1
  ) {
    this.$url = url;
    this.$price = price;
    this.$bedrooms = bedrooms;
    this.$bathrooms = bathrooms;
  }
}

export async function getApartmentDataFromURL(url: string | undefined) {
  try {
    console.log("[getApartmentDataFromURL]: starting function...");
    var body = await getHtmlText(url);
    var root = await getCheerioRoot(body);
    var apartmentSet = getApartmentLinks(root);
    var apartmentData: ApartmentData[][] = [];

    console.log("[getIndividualApartmentData]: Getting all apartment data...");
    for (const url of apartmentSet) {
      await sleep(10000 * Math.random());
      var apartment_obj = await getIndividualApartmentData(url);
      apartmentData.push(apartment_obj);
    }
    console.log("[getIndividualApartmentData]: finishing function...");

    console.log(
      "[apartmentParsedData]: parsing all apartment data for sqlite..."
    );
    let apartmentParsedData: Apartment[] = [];
    apartmentData.forEach((apartment) => {
      apartmentParsedData.push(parseApartmentData(apartment));
    });
    console.log("[apartmentParsedData]: finished parsing functions...");
    console.log("[getApartmentDataFromURL]: ending function...");
    return apartmentParsedData;
  } catch (error) {
    console.error(
      "[getApartmentDataFromURL]: Error ocured in this function",
      error
    );
    throw new Error("Error getting apartment data from url");
  }
}

async function getHtmlText(url: string | undefined) {
  if (url == undefined){
    console.error("url is undefined");
  }
  else{
    const response = await fetch(url);
    const body = await response.text();
    return body;
  }
  
}

async function getCheerioRoot(body: string) {
  try {
    var root = cheerio.load(body);
    return root;
  } catch (error) {
    console.error("Cheerio failed to load body text");
    throw error;
  }
}

function getApartmentLinks(root: cheerio.Root) {
  try {
    console.log("[getApartmentLinks]: starting function...");
    var apartmentSet = new Set<string>();

    root(".property-link").each((i, element) => {
      var link = root(element).attr("href");
      link ? apartmentSet.add(link) : null;
    });
    console.log("[getApartmentLinks]: starting function...");
    return apartmentSet;
  } catch (error) {
    console.error("[getApartmentLinks]: An error occured", error);
    throw new Error("Error getting apartment data from url");
  }
}

async function getIndividualApartmentData(url: string) {
  var body = await getHtmlText(url);
  var root = await getCheerioRoot(body);

  var apartment_data: ApartmentData[] = await getApartmentObject(root);
  sleep(8000 * Math.random());
  var urlData: ApartmentData = { key: "url", value: url };
  apartment_data.push(urlData);
  return apartment_data;
}

async function getApartmentObject(
  root: cheerio.Root
): Promise<ApartmentData[]> {
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
  return apartment_obj;
}

function rentStringToInt(moneyString: string): number {
  let str = moneyString.replace(",", "");
  let strmatch = str.match(/(\d+(?:\.\d+)?)/);
  if (strmatch != undefined) {
    return Number(strmatch[0]);
  } else {
    return -1;
  }
}

function bathroomStringToInt(bathroomString: string): number {
  let strmatch = bathroomString.match(/(\d+(?:\.\d+)?)/);
  if (strmatch != undefined) {
    return Number(strmatch[0]);
  } else {
    return -1;
  }
}

function bedroomStringToInt(bedroomString: string): number {
  let strmatch = bedroomString.match(/(\d+(?:\.\d+)?)/);
  if (strmatch != undefined) {
    return Number(strmatch[0]);
  } else {
    return -1;
  }
}

function parseApartmentData(apartmentData: ApartmentData[]) {
  let apartment: Apartment = new Apartment();
  apartmentData.forEach((pair, index) => {
    switch (pair.key) {
      case "Monthly Rent":
        apartment.$price = rentStringToInt(pair.value);
        break;
      case "Bedrooms":
        apartment.$bedrooms = bedroomStringToInt(pair.value);
        break;
      case "Bathrooms":
        apartment.$bathrooms = bathroomStringToInt(pair.value);
        break;
      case "url":
        apartment.$url = pair.value;
        break;
    }
  });
  return apartment;
}
