import * as dotenv from "dotenv";
import { CronJob } from "cron";
import { uploadApartmentsToDB, createTableIfNotCreated } from "./src/database";
import { getApartmentDataFromURL, Apartment } from "./src/scraper";
import CustomClient from "./src/discordbot/base/classes/CustomClient";
import Ping from "./src/discordbot/base/classes/commands/Ping";
import type Command from "./src/discordbot/base/classes/Command";

dotenv.config({ path: __dirname + "/.env" });

async function main() {
  console.log("[Main] Starting scheduled job...");
  let location_url = process.env.LOCATION_URL;
  let discordToken = process.env.DISCORD_TOKEN;

  createTableIfNotCreated();
  const job = await CronJob.from({
    cronTime: "0 0 8 * * *",
    onTick: async function () {
      let apartmentData = await getApartmentDataFromURL(location_url);
      uploadApartmentsToDB(apartmentData);
    },
    start: true,
    timeZone: "America/New_York",
  });
  await (new CustomClient).Init();

  console.log("[Main]: Finishing scheduled job...");
}

await main();
