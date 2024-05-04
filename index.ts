import {getApartmentDataFromURL, Apartment} from "./src/scraper";
import { uploadApartmentsToDB, createTableIfNotCreated} from "./src/database";
import * as dotenv from 'dotenv';
import {CronJob} from 'cron';

dotenv.config({path: __dirname +'/.env'});

async function main(){

    

    console.log("[Main] Starting scheduled job...")
    let location_url = process.env.LOCATION_URL;
    let connectionString = process.env.SQLITE_CONNECTION_STRING;

    if (location_url == null){
        console.error("No url assigned in env variables")
    }
    else {
        createTableIfNotCreated();
        // 
        // 
        const job = await CronJob.from({
            cronTime: '0 0 8 * * *',
            onTick: async function () {
                let apartmentData = await getApartmentDataFromURL(location_url)
                uploadApartmentsToDB(apartmentData);
            },
            start: true,
            timeZone: 'America/New_York'
        });
    }
    console.log("[Main]: Finishing scheduled job...");
}

await main();