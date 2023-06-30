// Archivo de configuración de Express

// Importar módulos y librerías
import express from "express";
import session from "express-session";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import {} from "./env.js";

// Crear instancia de la aplicación Express
const app = express();

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración de la vista de plantillas
app.set("view engine", "pug");
app.set("views", join(__dirname, "../views"));

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
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
  })
);

// Rutas
import routerLogin from "../routes/login.routes.js";
import routerRegistration from "../routes/registration.routes.js";
import routerGarments from "../routes/garments.routes.js";
import routerMain from "../routes/main.routes.js";
import routerUsers from "../routes/user.routes.js";
import routershoppingCart from "../routes/shoppingCart.routes.js";
import routerChangePassword from "../routes/changePassword.routes.js";
app.use(routerLogin);
app.use(routerRegistration);
app.use(routerGarments);
app.use(routerMain);
app.use(routerUsers);
app.use(routershoppingCart);
app.use(routerChangePassword);

// Exportar la aplicación
export default app;
