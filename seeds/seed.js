const mysql = require("mysql2/promise");
require("dotenv").config();

async function seed() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    console.log("Connecté à la base pour le seed...");

    // Données à insérer
    const clients = [
      ["Jean Dupont", "jean.dupont@email.com"],
      ["Marie Martin", "marie.martin@email.com"],
      ["Paul Durand", "paul.durand@email.com"],
      ["Sophie Bernard", "sophie.bernard@email.com"]
    ];

    // Requête SQL
    const sql = `
      INSERT INTO clients (nom, email)
      VALUES ?
    `;

    await connection.query(sql, [clients]);

    console.log("Seed terminé avec succès ✅");

    await connection.end();
  } catch (error) {
    console.error("Erreur lors du seed :", error);
    process.exit(1);
  }
}

seed();