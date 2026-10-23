import assert from "node:assert/strict";
import { test } from "node:test";
import pool from "../src/config/db.js";
import { Nota } from "../src/models/nota.model.js";

function reemplazarExecute(mockExecute) {
    const descriptor = Object.getOwnPropertyDescriptor(pool, "execute");
    pool.execute = mockExecute;

    return () => {
        if (descriptor) {
            Object.defineProperty(pool, "execute", descriptor);
        } else {
            delete pool.execute;
        }
    };
}

test("crear devuelve la nota insertada con los datos de MySQL", async () => {
    const nota = {
        id: 7,
        titulo: "Repasar álgebra",
        contenido: "Resolver ejercicios",
        categoria: "clase",
    };
    const llamadas = [];
    const restaurarExecute = reemplazarExecute(async (sql, parametros) => {
        llamadas.push({ sql, parametros });

        if (sql.startsWith("INSERT")) {
            return [{ insertId: nota.id }, undefined];
        }

        if (sql.startsWith("SELECT")) {
            return [[nota], undefined];
        }

        throw new Error(`Consulta inesperada: ${sql}`);
    });

    try {
        assert.deepEqual(await Nota.crear(nota), nota);
        assert.equal(llamadas.length, 2);
        assert.deepEqual(llamadas[0].parametros, [
            nota.titulo,
            nota.contenido,
            nota.categoria,
        ]);
        assert.deepEqual(llamadas[1].parametros, [nota.id]);
    } finally {
        restaurarExecute();
    }
});

test("actualizar devuelve la nota existente aunque MySQL no cambie filas", async () => {
    const nota = {
        id: 7,
        titulo: "Repasar álgebra",
        contenido: "Resolver ejercicios",
        categoria: "clase",
    };
    let llamadasSelect = 0;
    const restaurarExecute = reemplazarExecute(async (sql) => {
        if (sql.startsWith("UPDATE")) {
            return [{ affectedRows: 0 }, undefined];
        }

        if (sql.startsWith("SELECT")) {
            llamadasSelect += 1;
            return [[nota], undefined];
        }

        throw new Error(`Consulta inesperada: ${sql}`);
    });

    try {
        assert.deepEqual(await Nota.actualizar(nota.id, { titulo: nota.titulo }), nota);
        assert.equal(llamadasSelect, 1);
    } finally {
        restaurarExecute();
    }
});
