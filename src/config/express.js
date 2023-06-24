// Archivo de configuración de Express

// Importar módulos y librerías
import express from "express";
import session from "express-session";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import {} from "./env.js";

// Crear instancia de la aplicación Express
const app = express();

// Configuración de la vista de plantillas
app.set("view engine", "pug");
app.set("views", join(__dirname, "../views"));

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Directorio estático para archivos de Bootstrap
const bootstrapPath = join(__dirname, "../../node_modules/bootstrap/dist");

// Middlewares
app.use(express.json());
app.use(express.static(join(__dirname, "../assets")));
app.use(express.urlencoded({ extended: false }));
app.use("/bootstrap", express.static(bootstrapPath));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Rutas
import router from "../routes/router.js";
app.use(router);

// Exportar la aplicación
export default app;
