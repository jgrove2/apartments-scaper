import * as dotenv from "dotenv";
import { CronJob } from "cron";
import CustomClient from "./src/discordbot/base/classes/CustomClient";
import Database from "./src/scraper/classes/Database";
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
    cronTime: "0 0 */2 * * *",
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
