import Users from "../models/users.js";
import Bcrypt from "bcrypt";
import tokensController from "./tokensControllers.js";
import loginDetails from "../models/LoginDetailsSchema.js";

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

      //Verificar si tiene la cuenta bloqueada
      if (user.accountLocked) {
        return res.render("login", {
          errorMessage:
            'For security reasons we have locked your account! Press "Forgot Password" to start the process of unlocking and changing your password!',
        });
      }

      // Verificar la contraseña ingresada comparando los hash
      const passwordMatch = await verifyPassword(password, user.password);
      if (!passwordMatch) {
        if (user.loginAttempts >= 3) {
          user.accountLocked = true;
          await user.save();
          return res.render("login", {
            errorMessage:
              'For security reasons we have locked your account! Press "Forgot Password" to start the process of unlocking and changing your password!',
          });
        } else {
          user.loginAttempts += 1;
          await user.save();
        }
        return res.render("login", {
          errorMessage: "The usuername or password are not matched!",
        });
      }

      // Enviar el token por email y obtener el secreto generado para la validacion del mismo
      const secret = await tokensController.sendToken(user.email, 3);
      const fechaGeneracionToken = new Date();

      const tokenData = {
        tokenGenerationDate: fechaGeneracionToken,
        tempSecret: secret,
      };

      const loginData = {
        isLoggedIn: user.username,
        userId: user._id,
      };

      //Almecenar el secreto generado y fecha generacion del token
      req.session.tokenData = tokenData;
      req.session.loginData = loginData;

      res.render("loginToken");
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
      delete req.session.userId;
      res.redirect("/");
    } catch (error) {
      console.error("An error occurred while logging out", error);
      throw error;
    }
  },
  validateLoginToken: (req, res) => {
    try {
      // Obtener los datos del username y password
      const loginData = req.session.loginData;
      // Obtener el secreto generado
      const tokenData = req.session.tokenData;

      const tokenEntered = req.body.token;

      //Validar el token ingresado tomando como referencia el secreto
      const isValidToken = tokensController.validateToken(
        tokenEntered,
        tokenData.tempSecret
      );

      if (!isValidToken) {
        const tokenExpired = tokensController.validateTimeToken(
          tokenData.tokenGenerationDate
        );

        if (!tokenExpired) {
          return res.render("login", {
            errorMessage:
              "The token has expired, you must start the process again!",
          });
        }

        return res.render("loginToken", {
          errorMessage: "The token entered is invalid!",
        });
      }

      req.session.isLoggedIn = loginData.isLoggedIn;
      req.session.userId = loginData.userId;

      delete req.session.loginData;
      delete req.session.tokenData;

      const currentDate = new Date();
      const ip = req.ip;

      //Obtener datos para realizar auditoria de seguimiento
      const loginInformation = new loginDetails({
        userId: loginData.userId,
        loginTime: currentDate,
        ipAddress: ip
      });
      loginInformation.save()

      res.redirect("/");
    } catch (error) {
      console.error("Error validating login token", error);
      throw error;
    }
  },
};

export default loginController;
