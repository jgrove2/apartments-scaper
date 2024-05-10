import * as dotenv from "dotenv";
import { CronJob } from "cron";
import { uploadApartmentsToDB, createTableIfNotCreated } from "./src/database";
import { getApartmentDataFromURL } from "./src/scraper";
import CustomClient from "./src/discordbot/base/classes/CustomClient";
import Database from "./src/scraper/classes/Database";
import Apartment from "./src/scraper/classes/Apartment";
import Scraper from "./src/scraper/classes/Scraper";

dotenv.config({ path: __dirname + "/.env" });

async function main() {
  console.log("[Main] Starting scheduled job...");
  let location_url = process.env.LOCATION_URL;
  let discordToken = process.env.DISCORD_TOKEN;
  let DatabaseEngine = new Database();
  let scraperEngine = new Scraper();

  DatabaseEngine.createTableIfNotCreated();
  const job = await CronJob.from({
    cronTime: "0 2 20 * * *",
    onTick: async function () {
      let apartmentData = await scraperEngine.getApartmentDataFromURL(
        location_url
      );
      DatabaseEngine.uploadApartmentsToDB(apartmentData);
    },
    start: true,
    timeZone: "America/New_York",
  });
  await new CustomClient().Init();

  console.log("[Main]: Finishing scheduled job...");
}

await main();
