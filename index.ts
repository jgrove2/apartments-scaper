import {getHtmlFromURL} from "./src/scraper";
import { uploadApartmentToDB } from "./src/database";
import * as dotenv from 'dotenv';
dotenv.config({path: __dirname +'/.env'});

let location_url = process.env.LOCATION_URL;

if (location_url == null){
    console.error("No url assigned in env variables")
} else {
    console.log(await getHtmlFromURL(location_url));
}
