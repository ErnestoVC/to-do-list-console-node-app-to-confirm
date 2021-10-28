require("colors");

const {
    guardarDB,
    leerDB
} = require("./helpers/guardarArchivo");
const {
    inquireMenu,
    pausa,
    leerInput,
    mostrarListadoChecklist,
    listadoTareasBorrar,
    confirmar
} = require("./helpers/inquirer");
const Tareas = require("./models/tareas");

console.clear();

const main = async () => {
    let opt = "";
    const tareas = new Tareas();
    const tareasDB = leerDB();

    if (tareasDB) {
        tareas.cargarTareasFromArray(tareasDB);
    }

    do {
        opt = await inquireMenu();

        switch (opt) {
            case "1":
                //crear tarea
                const desc = await leerInput("Descripción: ");
                tareas.crearTarea(desc);
                break;

            case "2":
                tareas.listadoCompleto();
                break;

            case "3": // listar completadas
                tareas.listarPendientesCompletadas(true);
                break;

            case "4": // listar pendientes
                tareas.listarPendientesCompletadas(false);
                break;

            case "5": // completado | pendiente
                const ids = await mostrarListadoChecklist(tareas.listadoArr);
                tareas.toggleCompletadas(ids);
                break;

            case "6":
                const id = await listadoTareasBorrar(tareas.listadoArr);
                if (id !== "0") {
                    const ok = await confirmar("¿Está seguro?");
                    if (ok) {
                        tareas.borrarTarea(id);
                        console.log("Tarea borrada");
                    }
                }

                default:
                    break;
        }

        guardarDB(tareas.listadoArr);

        await pausa();
    } while (opt !== "0");

    //pausa();
};

main();