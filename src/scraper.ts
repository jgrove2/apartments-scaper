import * as cheerio from 'cheerio';

interface ApartmentData {
    key: string;
    value: string;
}

export async function getHtmlFromURL(url: string) {
    try {
        var body = await getHtmlText(url);
        var root = await getCheerioRoot(body);
        var apartmentSet = getApartmentLinks(root);
        var apartmentData: ApartmentData[][] = [];
    
        apartmentSet.forEach(async function (value, key, set) {
            var apartment_obj = await getIndividualApartmentData(value);
            console.log(value);
            apartmentData.push(apartment_obj);
            console.log(apartment_obj);
        });

        return apartmentData;
        
    } catch (error) {
        console.log(error);
        throw error
    }
}

async function getHtmlText(url: string){
    const response = await fetch(url);
    const body = await response.text();
    return body
}

async function getCheerioRoot(body: string){
    try {
        var root = cheerio.load(body);
        return root;
    }
    catch (error){
        console.error("Cheerio failed to load body text");
        throw error
    }
}

function getApartmentLinks(root: cheerio.Root){
    var apartmentSet = new Set<string>();

        root('.property-link').each((i, element) => {
            var link = root(element).attr('href');
            link ? apartmentSet.add(link) : null
        });
        return apartmentSet;
}

async function getIndividualApartmentData(url: string){
    var body = await getHtmlText(url);
    var root = await getCheerioRoot(body);

    var apartment_data: ApartmentData[] = await getApartmentObject(root);
    var urlData: ApartmentData = {key: "url", value: url};
    apartment_data.push(urlData);
    return apartment_data;
}

async function getApartmentObject(root: cheerio.Root): Promise<ApartmentData[]>{
    const apartment_obj: ApartmentData[] = [];
    root('ul.priceBedRangeInfo > li.column').each((index, element) => {
        // Extract the label and detail information
        const label = root(element).find('.rentInfoLabel').text().trim();
        const detail = root(element).find('.rentInfoDetail').text().trim();
    
        // Output the label and detail information
        if(label != "Square Feet"){
            apartment_obj.push({key: label, value: detail});
        }
    });
    return apartment_obj;
}

function rentStringToInt(moneyString: string): number {
    let str = moneyString.replace(",", "");
    let strmatch = str.match(/(\d+(?:\.\d+)?)/);
    if (strmatch != undefined){
        return Number(strmatch[0]);
    } else {
        return -1;
    }
}

function bathroomStringToInt(bathroomString: string): number {
    let strmatch = bathroomString.match(/(\d+(?:\.\d+)?)/);
    if (strmatch != undefined){
        return Number(strmatch[0]);
    } else {
        return -1;
    }
}

function bedroomStringToInt(bedroomString: string): number {
    let strmatch = bedroomString.match(/(\d+(?:\.\d+)?)/);
    if (strmatch != undefined){
        return Number(strmatch[0]);
    } else {
        return -1;
    }
}