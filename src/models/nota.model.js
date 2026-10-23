import pool from "../config/db.js";

export const Nota = {
    async crear({ titulo, contenido, categoria }) {
        const [resultado] = await pool.execute(
            `INSERT INTO notas (titulo, contenido, categoria)
             VALUES (?, ?, ?)`,
            [titulo, contenido, categoria]
        );

        return this.obtenerPorId(resultado.insertId);
    },

    async obtenerTodas() {
        const [notas] = await pool.execute(
            "SELECT * FROM notas ORDER BY id DESC"
        );

        return notas;
    },

    async obtenerPorId(id) {
        const [notas] = await pool.execute(
            "SELECT * FROM notas WHERE id = ?",
            [id]
        );

        return notas[0] ?? null;
    },
    
    async actualizar(id, datos) {
        const camposPermitidos = ["titulo", "contenido", "categoria"];
        const entradas = Object.entries(datos).filter(
            ([campo, valor]) =>
                camposPermitidos.includes(campo) && valor !== undefined
        );

        if (entradas.length === 0) {
            return this.obtenerPorId(id);
        }

        const columnas = entradas.map(([campo]) => `${campo} = ?`).join(", ");
        const valores = entradas.map(([, valor]) => valor);

        const [resultado] = await pool.execute(
            `UPDATE notas SET ${columnas} WHERE id = ?`,
            [...valores, id]
        );

        return this.obtenerPorId(id);
    },
    
    async eliminar(id) {
        const [resultado] = await pool.execute(
            "DELETE FROM notas WHERE id = ?",
            [id]
        );

        return resultado.affectedRows > 0;
    }

};