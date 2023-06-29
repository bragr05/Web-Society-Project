import Users from "../models/users.js";
import Validator from "validator";
import Big from "big.js";
import speakeasy from "speakeasy";
import nodemailer from "nodemailer";
import {} from "../config/env.js";

// Funcion para generar y enviar el token
async function sendToken(email) {
  // Generar un secreto para el usuario y la comparacion fututa del token
  const secret = speakeasy.generateSecret();

  const token = speakeasy.totp({
    secret: secret.base32,
    encoding: "base32",
  });

  const emailTransporter = process.env.EMAIL_TRANSPORTER;
  const emailPassword = process.env.PASS_EMAIL_TRANSPORTER;

  // Configurar el transporte del correo electrónico
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: emailTransporter,
      pass: emailPassword,
    },
  });

  // Esperar hasta que se envíe el correo electrónico
  await transporter.sendMail({
    from: emailTransporter,
    to: email,
    subject: "Token de autenticación de doble factor",
    html: `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
    
        <style>
          @import url("https://fonts.googleapis.com/css2?family=Heebo:wght@100;200;300;400;500;600;700;800;900&display=swap");
          @import url("https://fonts.googleapis.com/css2?family=Geologica:wght@100;200;300;400;500;600;700;800;900&display=swap");
    
          * {
            margin: 0;
            padding: 0;
          }
    
          .contenedor-imagen{
            padding: 50px;
            padding-bottom: 0px;
            align-items: center;
            text-align: center;
          }
    
          img{
            width: auto;
            height: 100px;
          }
    
          .contenedor-texto {
            padding: 50px 50px 50px 50px;
            font-family: "Heebo", sans-serif;
            font-weight: 300;
          }
    
          .contenedor-token{
            display: flex;
            flex-direction: row;
            font-family: "Heebo", sans-serif;
            font-size: x-large;
          }
    
          .text-token{
            margin-left: 2px;
            font-weight: bold;
          }
    
          footer{
            background-color: #202020;
            padding: 50px;
            align-items: center;
            text-align: center;
          }
    
          .footer-text{
            color: white;
            font-family: "Heebo", sans-serif;
            font-weight: 500;
          }
        </style>
      </head>
      <body>
        <div class="contenedor-imagen">
          <img src="https://tiusr3pl.cuc-carrera-ti.ac.cr/clase/brian/progra05/logo.png" alt="">
        </div>
        <div class="contenedor-texto">
          <p>
            Kind regards. We are pleased to inform you that we have received a
            request to reset your account password. To ensure the protection of your
            personal data, we have generated a unique security token that you will
            need to use to complete the reset process.
          </p>
          <br />
          <p>
            Below you will find the token needed to proceed with your password
            reset:
          </p>
          <br />
          <div class="contenedor-token">
            <p>Security Token: </p>
            <p class="text-token"> ${token}</p>
          </div>
          
          <br />
          <p>
            If you have NOT requested a password reset, we strongly urge you to
            <strong>delete this email immediately</strong> and take the necessary
            steps to protect your account. If you have any concerns or suspect that
            your account may be at risk, we encourage you to contact our support
            team as soon as possible.
          </p>
        </div>
        <footer>
          <div>
            <p class="footer-text">Project Development Team</p>
          </div>
        </footer>
      </body>
    </html>
    
    `,
  });

  // El secreto se usará adelante para aplicar la validación
  return secret;
}

// Funcion para validar el token ingresado por el usuario
function validateToken(userEnteredToken, tempSecret) {
  // Valida esto por medio del "secret" generado al inicio
  const isValidToken = speakeasy.totp.verify({
    secret: tempSecret.base32,
    encoding: "base32",
    token: userEnteredToken,
    window: 10, // 9 intervalos * 30 segundos por intervalo = 270 segundos
  });

  // NOTA: Parametro window: 1 para aceptar token debido a la diferencia horaria
  return isValidToken;
}

// Funcion para saber si el token a expirado
function validateTimeToken(tokenGeneration) {
  const currentDate = new Date();
  const tokenGenerationDate = new Date(tokenGeneration);

  const diferenciaMilisegundos =
    currentDate.getTime() - tokenGenerationDate.getTime();
  const diferenciaMinutos = Math.floor(diferenciaMilisegundos / (1000 * 60));

  return diferenciaMinutos < 5;
}

const registerController = {
  emailRegistrationPage: async (req, res) => {
    try {
      res.render("registrationEmail");
    } catch (error) {
      console.error("Error loading registration page:", error);
      throw error;
    }
  },
  validateRegistrationEmail: async (req, res) => {
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

      // Enviar el token por email y obtener el secreto generado para la validacion del mismo
      const secret = await sendToken(email);
      const fechaGeneracionToken = new Date();

      // Definir el obj para guardar datos del registro
      const userData = {
        email: email,
      };

      const tokenData = {
        tokenGenerationDate: fechaGeneracionToken,
        tempSecret: secret,
      };

      //Almacenar en variable de session datos del registro de la cuenta
      req.session.userData = userData;
      //Almecenar el secreto generado y fecha generacion del token
      req.session.tokenData = tokenData;

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
      const tokenEntered = req.body.token;

      if (!name || !lastname || !latitude || !longitude || !tokenEntered) {
        return res.render("registrationPersonalData", {
          errorMessage: "All fields are required",
        });
      }

      // Obtener los datos del registro de email,username y password
      const userData = req.session.userData;
      // Obtener el secreto generado
      const tokenData = req.session.tokenData;

      //Validar el token ingresado tomando como referencia el secreto
      const isValidToken = validateToken(tokenEntered, tokenData.tempSecret);

      if (!isValidToken) {
        const tokenExpired = validateTimeToken(tokenData.tokenGenerationDate);

        if (!tokenExpired) {
          return res.render("login", {
            errorMessage:
              "The token has expired, you must start the process again!",
          });
        }

        return res.render("registrationPersonalData", {
          errorMessage: "The token entered is invalid!",
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

      // Eliminar las variables de sesion
      delete req.session.userData;
      delete req.session.tokenData;

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
