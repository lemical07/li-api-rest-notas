import { Nota } from "../models/nota.model.js";

export const notaService = {
    crear: (datos) => Nota.crear(datos),

    listar: () => Nota.obtenerTodas(),

    buscarPorId: (id) => Nota.obtenerPorId(id),

    actualizar: (id, datos) => Nota.actualizar(id, datos),

    eliminar: (id) => Nota.eliminar(id),
};