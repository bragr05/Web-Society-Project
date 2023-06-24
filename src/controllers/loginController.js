import Users from "../models/Schemas/usuarios.js";
import Bcrypt from "bcrypt";

// Función para realizar la compración contraseña ingresada vs la que se encuentra en BD
const verifyPassword = async (password, hashedPassword) => {
  try {
    return await Bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw error;
  }
};

const loginController = {
  loginPage: async (req, res) => {
    try {
      res.render("login");
    } catch (error) {
      console.error("Error loading login page:", error);
      throw error;
    }
  },
  validateCredentials: async (req, res) => {
    try {
      const username = req.body.username;
      const password = req.body.password;

      if (!username || !password) {
        return res.render("login", {
          errorMessage: "Please enter your username and password to log in!",
        });
      }

      //Obener informacion del usuario si es que existe
      const user = await Users.findOne({ username });
      if (!user) {
        return res.render("login", {
          errorMessage: "The usuername or password are not matched!",
        });
      }

      // Verificar la contraseña ingresada comparando los hash
      const passwordMatch = await verifyPassword(password, user.password);
      if (!passwordMatch) {
        return res.render("login", {
          errorMessage: "The usuername or password are not matched!",
        });
      }

      req.session.isLoggedIn = user.username;
      req.session.idUser = user._id;

      res.redirect("/");
    } catch (error) {
      console.error(
        "An error occurred while validating the credentials!",
        error
      );
      throw error;
    }
  },
  checkLoggedIn: async (req, res) => {
    try {
      res.json({ isLoggedIn: req.session.isLoggedIn });
    } catch (error) {
      console.error("An error occurred while checking the session", error);
      throw error;
    }
  },
  logOut: async (req, res) => {
    try {
      delete req.session.isLoggedIn;
      res.redirect("/");
    } catch (error) {
      console.error("An error occurred while logging out", error);
      throw error;
    }
  },
};

export default loginController;
