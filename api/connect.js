import mysql from "mysql"

export const db = mysql.createConnection({
    host:"",
    user: "root",
    password: "***REMOVED***",
    database: "reseausocial",
    port: 3306
})

db.connect((err) => {
    if (err) {
        console.error("Erreur de connexion à la base de données:", err);
        return;
    }
});