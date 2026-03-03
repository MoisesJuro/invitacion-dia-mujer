const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

db.connect(err => {
  if (err) {
    console.error("Error conectando a MySQL:", err);
  } else {
    console.log("Conectado a MySQL Railway");
  }
});

app.get("/", (req, res) => {
  res.send("Servidor invitación día de la mujer activo 🚀");
});

app.post("/confirmar", (req, res) => {

  const { nombre, telefono, iglesia } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: "Nombre requerido" });
  }

  const sql = `
    INSERT INTO confirmaciones (nombre, telefono, iglesia)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [nombre, telefono, iglesia], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al guardar" });
    }
    res.json({ mensaje: "Guardado correctamente" });
  });

});

app.get("/confirmaciones", (req, res) => {

  db.query("SELECT * FROM confirmaciones ORDER BY fecha DESC", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al obtener datos" });
    }
    res.json(results);
  });

});

app.get("/crear-tabla", (req, res) => {

  const sql = `
    CREATE TABLE IF NOT EXISTS confirmaciones (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      telefono VARCHAR(20),
      iglesia VARCHAR(100),
      fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  db.query(sql, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error creando tabla" });
    }
    res.json({ mensaje: "Tabla creada correctamente" });
  });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});
