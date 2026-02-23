const mysql = require("mysql2/promise");
require("dotenv").config();

async function migrate() {
  try {
    // Connexion sans spécifier la base
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      multipleStatements: true
    });

    console.log("Connecté à MySQL...");

    // Requêtes SQL
    const sql = `
      CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;
      USE \`${process.env.DB_NAME}\`;

      CREATE TABLE IF NOT EXISTS clients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS commandes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_id INT NOT NULL,
        montant DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients(id)
          ON DELETE CASCADE
      );
    `;

    await connection.query(sql);

    console.log("Migration terminée avec succès ✅");

    await connection.end();
  } catch (error) {
    console.error("Erreur lors de la migration :", error);
    process.exit(1);
  }
}

migrate();