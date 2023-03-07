import express from "express";
import cors from "cors";
import { db_connection } from "./db/index.js";
import { wsServer } from "./websocket/index.js";

const app = express();
app.use(cors());
app.use(express.json());

wsServer.on("request", (request) => {
  const connection = request.accept(null, request.origin);

  connection.on("message", (message) => {
    addIncomingMessage(JSON.parse(message.utf8Data));
    wsServer.broadcast(message.utf8Data);
  });
  connection.on("close", (message) => {
    console.log("El cliente se desconecto");
  });
});

/**
 * permite "almacenar/insertar" en la base de datos un mensjae entrante del websocket
 * @param {Object} msg
 */
const addIncomingMessage = async (msg = null) => {
  try {
    let modelUserPasos = {
      id: isset(msg.id),
      name: isset(msg.name),
      pasos: isset(msg.pasos),
      metros: isset(msg.metros),
      corporativo: isset(msg.corporativo),
    };
    // se asegura que si exista el usuario
    let user = await getUserCorporativo(modelUserPasos);
    await addUserPasos({
      pasos: modelUserPasos.pasos,
      metros: modelUserPasos.metros,
      user_id: user[0].id,
    });
  } catch (error) {
    console.error("Error inserting message into database", error);
  }
};

/**
 * Se consulta el usuario corporativo si existe
 * @param {*} model
 * @returns
 */
const getUserCorporativo = async (model = null) => {
  try {
    return new Promise(function (resolve, reject) {
      db_connection.query(
        `SELECT * FROM user_corporativos WHERE user_corporativos.id = ${model.id} OR user_corporativos.nombre LIKE "%${model.name}%"`,
        (results, fields) => {
          resolve(fields);
        }
      );
    });
  } catch (error) {
    console.error("Error  database", error);
  }
};
/**
 * agregar los pasos del usuario
 * @param {*} model
 * @returns
 */
const addUserPasos = async (model = null) => {
  try {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    const formattedToday = yyyy + "-" + mm + "-" + dd;

    return new Promise(function (resolve, reject) {
      db_connection.query(
        `INSERT INTO pasos (pasos, metros,user_corporativo_id,created,modified) VALUES (${model.pasos},${model.metros},${model.user_id},"${formattedToday}","${formattedToday}")`,
        (error, results, fields) => {
          resolve(fields);
        }
      );
    });
  } catch (error) {
    console.error("Error  database", error);
  }
};

/**
 * Detecta si una variable está definida y su valor no es null ni undefined
 * @param {*} el
 */
const isset = (el = null) => {
  if (typeof el !== "undefined" && el !== null) {
    return el;
  } else {
    return null;
  }
};
