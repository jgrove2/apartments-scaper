import { Database } from "bun:sqlite";

export function uploadApartmentsToDB(
  apartmentData: {
    $url: string;
    $price: number;
    $bedrooms: number;
    $bathrooms: number;
  }[]
) {
  deleteAllApartmentsNotExisting(apartmentData);
  updateAllOldApartmentsToOld(apartmentData);
  insertAllNewApartments(apartmentData);
}

export function deleteAllApartmentsNotExisting(
  apartmentData: {
    $url: string;
    $price: number;
    $bedrooms: number;
    $bathrooms: number;
  }[]
) {
  console.log("[deleteAllApartmentsNotExisting]: Starting function...");
  var db = new Database("./db/apartments.db");

  db.run(
    `DELETE FROM apartments WHERE url NOT IN (${apartmentData
      .map((data) => `\'${data.$url}\'`)
      .join(", ")})`
  );
  db.close(false);
  console.log("[deleteAllApartmentsNotExisting]: Ending function...");
}

export function updateAllOldApartmentsToOld(
  apartmentData: {
    $url: string;
    $price: number;
    $bedrooms: number;
    $bathrooms: number;
  }[]
) {
  console.log("[updateAllOldApartmentsToOld]: Starting function...");
  var db = new Database("./db/apartments.db");
  db.run("UPDATE apartments SET new=0");
  db.close(false);
  console.log("[updateAllOldApartmentsToOld]: Ending function...");
}

export function insertAllNewApartments(
  apartmentData: {
    $url: string;
    $price: number;
    $bedrooms: number;
    $bathrooms: number;
  }[]
) {
  console.log("[insertAllNewApartments]: Starting function...");
  var db = new Database("./db/apartments.db");

  const insert = db.prepare(
    "INSERT or IGNORE INTO apartments (url, price, bedrooms, bathrooms, new) VALUES ($url, $price, $bedrooms, $bathrooms, $new)"
  );
  const insertApartments = db.transaction((apartments) => {
    for (const aprt of apartments) insert.run(aprt);
    return apartments.length;
  });

  const count = insertApartments(apartmentData);

  console.log(`[insertAllNewApartments]: Added/Updated ${count} apartments`);
  db.close(false);
  console.log("[insertAllNewApartments]: Ending function...");
}

export function createTableIfNotCreated() {
  console.log("[CreateTableIfNotCreated]: starting function...");
  var db = new Database("./db/apartments.db", { create: true });
  const query = db.query(`CREATE TABLE IF NOT EXISTS apartments (
        id INTEGER PRIMARY KEY,
        url TEXT UNIQUE,
        price INTEGER,
        bedrooms INTEGER,
        bathrooms REAL,
        new INTEGER
    )`);
  query.run();
  db.close(false);
  console.log("[CreateTableIfNotCreated]: ending function...");
}
