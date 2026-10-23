import assert from "node:assert/strict";
import { once } from "node:events";
import { after, before, test } from "node:test";
import app from "../src/app.js";

let server;
let baseUrl;

before(async () => {
    server = app.listen(0);
    await once(server, "listening");
    baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
    const closed = once(server, "close");
    server.close();
    await closed;
});

test("GET /health confirma que la API está activa", async () => {
    const response = await fetch(`${baseUrl}/health`);

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { estado: "ok", version: "1.0.0" });
});

test("POST /api/v1/notas rechaza datos inválidos sin consultar MySQL", async () => {
    const response = await fetch(`${baseUrl}/api/v1/notas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo: "x" }),
    });

    assert.equal(response.status, 400);
    assert.ok((await response.json()).errores.length > 0);
});

test("GET /api/v1/notas/:id rechaza IDs que no caben en INT UNSIGNED", async () => {
    const response = await fetch(`${baseUrl}/api/v1/notas/4294967296`);

    assert.equal(response.status, 400);
});

test("las rutas desconocidas responden 404", async () => {
    const response = await fetch(`${baseUrl}/ruta-inexistente`);

    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), { error: "Ruta no encontrada." });
});
