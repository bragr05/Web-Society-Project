import Users from "../models/users.js";
import Validator from "validator";
import Big from "big.js";

const UsersController = {
  loadUserProfile: async (req, res) => {
    try {
      const username = req.session.isLoggedIn;
      const user = await Users.findOne({ username });

      res.render("userProfile", { userData: user });
    } catch (error) {
      console.error("Error loading the user profile:", error);
      throw error;
    }
  },
  accountRegistrationPage: async (req, res) => {
    try {
      res.render("accountRegistration");
    } catch (error) {
      console.error("Error al el registro:", error);
      throw error;
    }
  },
  validateAccountRegistration: async (req, res) => {
    try {
      const username = req.body.username;
      const password = req.body.password;
      const email = req.body.email;

      if (!username || !password || !email) {
        return res.render("accountRegistration", {
          errorMessage: "All fields are required",
        });
      }

      const existingUser = await Users.findOne({ username });
      if (existingUser) {
        return res.render("accountRegistration", {
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
        return res.render("accountRegistration", {
          errorMessage: "Password does not comply with the standard",
        });
      }

      if (!Validator.isEmail(email)) {
        return res.render("accountRegistration", {
          errorMessage: "Invalid email address!",
        });
      }

      //Almacenar en variable de session datos del registro de la cuenta
      req.session.accountRegistrationData = {
        username: username,
        password: password,
        email: email,
      };

      res.render("completeProfile");
    } catch (error) {
      console.error("Error in account registration:", error);
      throw error;
    }
  },

  validateCompleteProfile: async (req, res) => {
    try {
      const name = req.body.name;
      const lastname = req.body.lastName;
      const latitude = req.body.latitude;
      const longitude = req.body.longitude;

      // Obtener los datos del registro de cuenta
      const accountRegistrationData = req.session.accountRegistrationData;

      if (!name || !lastname || !latitude || !longitude) {
        return res.render("completeProfile", {
          errorMessage: "All fields are required",
        });
      }

      //Objeto para guardar en BD
      const completeRegistration = {
        firstName: name,
        lastName: lastname,
        email: accountRegistrationData.email,
        location: {
          latitude: new Big(latitude),
          longitude: new Big(longitude),
        },
        username: accountRegistrationData.username,
        password: accountRegistrationData.password,
      };

      const newUser = new Users(completeRegistration);
      await newUser.save();

      delete req.session.accountRegistrationData;

      res.render("login", {
        successMessage: "The account has been successfully created!",
      });
    } catch (error) {
      console.error("Error in registering profile data:", error);
      throw error;
    }
  },
};

export default UsersController;
