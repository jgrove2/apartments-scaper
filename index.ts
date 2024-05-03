import {getApartmentDataFromURL, Apartment} from "./src/scraper";
import { uploadApartmentsToDB, createTableIfNotCreated} from "./src/database";
import * as dotenv from 'dotenv';
import {Database} from "bun:sqlite";

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
        let apartmentData = await getApartmentDataFromURL(location_url)
        uploadApartmentsToDB(apartmentData);
        
    }
    console.log("[Main]: Finishing scheduled job...");
}

await main();