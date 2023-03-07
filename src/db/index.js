import mysql from "mysql2";

export const db_connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "testcakephp",
});

db_connection.connect((error) => {
  if (error) {
    console.error("Error connecting to database", error);
  } else {
    console.log("Connected to database");
  }
});
