
import app from './app.js';
import pool from './config/db.js';

const PORT = Number(process.env.SERVER_PORT || 3000);

if (!process.env.DB_USER || !process.env.DB_NAME) {
    throw new Error("Configura DB_USER y DB_NAME en el archivo .env.");
}

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
    throw new Error("SERVER_PORT debe ser un número entre 1 y 65535.");
}

try {
    await pool.query("SELECT 1");

    app.listen(PORT, () => {
        console.log(`API lista en http://localhost:${PORT}`);
        console.log("Conexión a MySQL verificada correctamente.");
    });
} catch (error) {
    console.error("No fue posible conectar con MySQL:", error.message);
    process.exit(1);
}
