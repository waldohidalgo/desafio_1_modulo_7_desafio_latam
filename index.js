import pkg from "pg";
import "dotenv/config";
const { Pool } = pkg;

const connectionString = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DATABASE}`;

const config = {
  connectionString: connectionString,
  idleTimeoutMillis: 0,
  allowExitOnIdle: true,
};
const connection_pool = new Pool(config);

const arrayComandos = process.argv.slice(2);

if (arrayComandos[0]) {
  switch (arrayComandos[0]) {
    case "nuevo":
      ingresarEstudiante(arrayComandos, connection_pool);
      break;
    case "rut":
      consultarRut(arrayComandos, connection_pool);
      break;
    case "consulta":
      consultarTodosLosEstudiantes(connection_pool);
      break;
    case "editar":
      editarEstudiante(arrayComandos, connection_pool);
      break;
    case "eliminar":
      eliminarEstudiante(arrayComandos, connection_pool);
      break;
    default:
      console.log("Comando inválido");
  }
} else {
  console.log("Debes ingresar un comando");
}

//Logica de insercion
async function insertEstudiantetoDatabase(pool, nombre, rut, curso, nivel) {
  try {
    const text =
      "insert into estudiantes (nombre,rut,curso,nivel) values ($1, $2,$3, $4)";
    const values = [nombre, rut, curso, nivel];
    const response = await pool.query(text, values);
    if (response.rowCount == 1) {
      console.log(`Estudiante ${nombre} insertado con éxito`);
    }
  } catch (error) {
    console.log(error.message);
  }
}

function ingresarEstudiante(arrayComandos, connection_pool) {
  if (
    arrayComandos[1] &&
    arrayComandos[2] &&
    arrayComandos[3] &&
    arrayComandos[4]
  ) {
    const nombre = arrayComandos[1];
    const rut = arrayComandos[2];
    const curso = arrayComandos[3];
    const nivel = arrayComandos[4];
    insertEstudiantetoDatabase(connection_pool, nombre, rut, curso, nivel);
  } else {
    console.log(
      `Falta la data de ingreso para: ${arrayComandos[1] ? "" : "nombre"} ${
        arrayComandos[2] ? "" : "rut"
      } ${arrayComandos[3] ? "" : "curso"} ${arrayComandos[4] ? "" : "nivel"}`,
    );
  }
}

// Logica de Consulta por Rut
async function consultaRuttoDatabase(pool, rut) {
  try {
    const text = "select * from estudiantes where rut = $1";
    const values = [rut];
    const response = await pool.query(text, values);
    if (response.rowCount == 0) {
      console.log("Estudiante no encontrado");
    } else {
      console.log(response.rows);
    }
  } catch (error) {
    console.log(error);
  }
}

function consultarRut(arrayComandos, connection_pool) {
  if (arrayComandos[1]) {
    const rut = arrayComandos[1];
    consultaRuttoDatabase(connection_pool, rut);
  } else {
    console.log("Debes ingresar un rut");
  }
}

/*
Lógica de consulta global
*/
async function consultaGlobaltoDatabase(pool) {
  try {
    const text = "select * from estudiantes";

    const response = await pool.query(text);
    if (response.rowCount == 0) {
      console.log("Estudiantes no encontrados");
    } else {
      console.log(response.rows);
    }
  } catch (error) {
    console.log(error);
  }
}

function consultarTodosLosEstudiantes(connection_pool) {
  consultaGlobaltoDatabase(connection_pool);
}
/*
Lógica de edición
*/
async function editarEstudiantetoDatabase(pool, nombre, rut, curso, nivel) {
  try {
    const text =
      "update estudiantes set nombre=$1, rut=$2, curso=$3, nivel=$4 where rut=$2";
    const values = [nombre, rut, curso, nivel];
    const response = await pool.query(text, values);
    if (response.rowCount == 1) {
      console.log(`Estudiante ${nombre} modificado con éxito`);
    }
    if (response.rowCount == 0) {
      console.log("Estudiante no encontrado");
    }
  } catch (error) {
    console.log(error.message);
  }
}

function editarEstudiante(arrayComandos, connection_pool) {
  if (
    arrayComandos[1] &&
    arrayComandos[2] &&
    arrayComandos[3] &&
    arrayComandos[4]
  ) {
    const nombre = arrayComandos[1];
    const rut = arrayComandos[2];
    const curso = arrayComandos[3];
    const nivel = arrayComandos[4];
    editarEstudiantetoDatabase(connection_pool, nombre, rut, curso, nivel);
  } else {
    console.log(
      `Falta la Data de Edición para: ${arrayComandos[1] ? "" : "nombre"} ${
        arrayComandos[2] ? "" : "rut"
      } ${arrayComandos[3] ? "" : "curso"} ${arrayComandos[4] ? "" : "nivel"}`,
    );
  }
}

/*
Lógica de Eliminación
*/
async function eliminarEstudiantetoDatabase(pool, rut) {
  try {
    const text = "delete from estudiantes where rut = $1";
    const values = [rut];
    const response = await pool.query(text, values);
    if (response.rowCount == 0) {
      console.log("Estudiante no encontrado");
    }
    if (response.rowCount == 1) {
      console.log(`Estudiante con rut ${rut} eliminado con éxito`);
    }
  } catch (error) {
    console.log(error.message);
  }
}
function eliminarEstudiante(arrayComandos, connection_pool) {
  if (arrayComandos[1]) {
    const rut = arrayComandos[1];
    eliminarEstudiantetoDatabase(connection_pool, rut);
  } else {
    console.log("Debes ingresar un rut");
  }
}
