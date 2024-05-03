const sqlite3 = require('sqlite3').verbose();

export function uploadApartmentToDB(apartment: {url: string, price: number, bedrooms: number, bathrooms: number}){
    var db = new sqlite3.Database('./db/apartments.db', sqlite3.OPEN_WRITE, (err: any) => {
        if (err) return console.error(err.message);
    });
    var sql = `INSERT INTO apartments(url, price, bedrooms, bathrooms) VALUES (?,?,?,?)`;
    db.run(sql,[apartment.url, apartment.price, apartment.bedrooms, apartment.bathrooms], (err: any) => {
        if(err) return console.error(err.message);
    })
}