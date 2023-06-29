import Users from "../models/users.js";
import Validator from "validator";
import Big from "big.js";

const registerController = {
  emailRegistrationPage: async (req, res) => {
    try {
      res.render("registrationEmail");
    } catch (error) {
      console.error("Error loading registration page:", error);
      throw error;
    }
  },
  validateRegistrationEmailAndSendToken: (req, res) => {
    try {
      const email = req.body.email;

      if (!email) {
        return res.render("registrationEmail", {
          errorMessage: "All fields are required",
        });
      }

      // Formato de correo invalido
      if (!Validator.isEmail(email)) {
        return res.render("registrationEmail", {
          errorMessage: "Invalid email address!",
        });
      }

      //Enviar y generar el token

      // Definir el obj para guardar datos del registro
      const userData = {
        email: email,
      };

      //Almacenar en variable de session datos del registro de la cuenta
      req.session.userData = userData;

      res.render("registrationAccessCredentials");
    } catch (error) {
      console.error("Error validating and sending token", error);
      throw error;
    }
  },
  validateRegistrationAccessCredentials: async (req, res) => {
    try {
      const username = req.body.username;
      const password = req.body.password;

      if (!username || !password) {
        return res.render("registrationAccessCredentials", {
          errorMessage: "All fields are required",
        });
      }

      const existingUser = await Users.findOne({ username });
      if (existingUser) {
        return res.render("registrationAccessCredentials", {
          errorMessage: "Username already in use!",
        });
      }

      /*
        Debe tener al menos 8 caracteres
        Debe contener al menos una letra mayúscula
        Debe contener al menos una letra minúscula
        Debe contener al menos un dígito
      */
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.render("registrationAccessCredentials", {
          errorMessage: "Password does not comply with the standard",
        });
      }

      // Obtener los datos del registro de email para agregarle el username y password
      const userData = req.session.userData;

      userData.username = username;
      userData.password = password;

      req.session.userData = userData;

      res.render("registrationPersonalData");
    } catch (error) {
      console.error("Error in registering access credentials", error);
      throw error;
    }
  },
  validateRegistrationPersonalData: async (req, res) => {
    try {
      const name = req.body.name;
      const lastname = req.body.lastName;
      const latitude = req.body.latitude;
      const longitude = req.body.longitude;

      // Obtener los datos del registro de email,username y password
      const userData = req.session.userData;

      if (!name || !lastname || !latitude || !longitude) {
        return res.render("registrationPersonalData", {
          errorMessage: "All fields are required",
        });
      }

      //Objeto para guardar en BD
      const completeRegistration = {
        firstName: name,
        lastName: lastname,
        email: userData.email,
        location: {
          latitude: new Big(latitude),
          longitude: new Big(longitude),
        },
        username: userData.username,
        password: userData.password,
      };

      const newUser = new Users(completeRegistration);
      await newUser.save();

      delete req.session.userData;

      res.render("login", {
        successMessage: "The account has been successfully created!",
      });
    } catch (error) {
      console.error("Error in registering personal data:", error);
      throw error;
    }
  },
};

export default registerController;
