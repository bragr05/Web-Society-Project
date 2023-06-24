import Users from "../models/Schemas/usuarios.js";
import validator from "validator";
import Big from "big.js";
import bcrypt from "bcrypt";

// Función para verificar la contraseña
const verifyPassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw error;
  }
};

const loginController = {
  login: async (req, res) => {
    try {
      res.render("login");
    } catch (error) {
      console.error("Error al realizar el login:", error);
      throw error;
    }
  },
  registerPartUno: async (req, res) => {
    try {
      res.render("register-part-uno");
    } catch (error) {
      console.error("Error al el registro:", error);
      throw error;
    }
  },
  validarRegistroPartUno: async (req, res) => {
    try {
      const username = req.body.username;
      const password = req.body.password;
      const email = req.body.email;

      if (!username || !password || !email) {
        const mensajeError = "All fields are required";
        return res.render("register-part-uno", { mensajeError });
      }

      const existingUser = await Users.findOne({ username });

      if (existingUser) {
        const mensajeError = "Username already in use!";
        return res.render("register-part-uno", { mensajeError });
      }

      /*
        Debe tener al menos 8 caracteres
        Debe contener al menos una letra mayúscula
        Debe contener al menos una letra minúscula
        Debe contener al menos un dígito
      */
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(password)) {
        const mensajeError = "Password does not comply with the standard";
        return res.render("register-part-uno", { mensajeError });
      }

      if (!validator.isEmail(email)) {
        const mensajeError = "Invalid email address!";
        return res.render("register-part-uno", { mensajeError });
      }

      //Almacenar en variable de session datos del registro part 1
      req.session.registroPartUno = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
      };

      res.render("register-part-dos");
    } catch (error) {
      console.error("Error en el registro:", error);
      throw error;
    }
  },
  validarRegistroPartDos: async (req, res) => {
    try {
      const name = req.body.name;
      const lastname = req.body.lastName;
      const latitude = req.body.latitude;
      const longitude = req.body.longitude;

      // Obtener los datos del registro 1
      const registroParte1 = req.session.registroPartUno;

      if (!name || !lastname || !latitude || !longitude) {
        const mensajeError = "All fields are required";
        return res.render("register-part-dos", { mensajeError });
      }

      //Objeto para guardar en BD
      const registroCompleto = {
        firstName: name,
        lastName: lastname,
        email: registroParte1.email,
        location: {
          latitude: new Big(latitude),
          longitude: new Big(longitude),
        },
        username: registroParte1.username,
        password: registroParte1.password,
      };

      const newUser = new Users(registroCompleto);
      await newUser.save();

      delete req.session.registro;

      const mensajeExito = "The account has been successfully created!";
      res.render("login", { mensajeExito });
    } catch (error) {
      console.error("Error en el registro:", error);
      throw error;
    }
  },
  validarCredenciales: async (req, res) => {
    try {
      const username = req.body.username;
      const password = req.body.password;

      if (!username || !password) {
        const mensajeError =
          "Please enter your username and password to log in!";
        return res.render("login", { mensajeError });
      }

      //Obener informacion del usuario si es que existe
      const user = await Users.findOne({ username });
      if (!user) {
        const mensajeError = "The usuername or password are not matched!";
        return res.render("login", { mensajeError });
      }

      // Verificar la contraseña ingresada comparando los hash
      const passwordMatch = await verifyPassword(password, user.password);

      if (!passwordMatch) {
        const mensajeError = "The usuername or password are not matched!";
        return res.render("login", { mensajeError });
      }

      req.session.isLoggedIn = user.username;
      req.session.idUser = user._id;

      res.redirect("/");
    } catch (error) {
      console.error("Error al realizar el login:", error);
      throw error;
    }
  },
  validarEstadoSesion: async (req, res) => {
    try {
      res.json({ isLoggedIn: req.session.isLoggedIn });
    } catch (error) {
      console.error("Error al el registro:", error);
      throw error;
    }
  },
  cerrarSesion: async (req, res) => {
    try {
      delete req.session.isLoggedIn;
      res.redirect("/");
    } catch (error) {
      console.error("Error al el registro:", error);
      throw error;
    }
  },
};

export default loginController;
