import Users from "../models/users.js";
import tokensController from "./tokensControllers.js";
import Bcrypt from "bcrypt";

async function verifyPasswordExistenceHistory(username, newPassword, res, req) {
  try {
    const user = await Users.findOne({ username });
    const currentPasswordMatch = await Bcrypt.compare(
      newPassword,
      user.password
    );

    if (currentPasswordMatch) {
      return res.render("resetPassword", {
        errorMessage:
          "The password cannot be the same as the current password!",
      });
    }

    // Verificar si se encuentra en el historial
    let isDifferent = true;

    for (let passwordIteration of user.passwordHistory) {
      let passwordMatch = await Bcrypt.compare(
        newPassword,
        passwordIteration.password
      );
      if (passwordMatch) {
        isDifferent = false;
        break;
      }
    }

    if (!isDifferent) {
      return res.render("resetPassword", {
        errorMessage: "The key must be different from the last 5!",
      });
    }

    // Guardar la contraseña si no hay problemas y reiniciar intentos de login
    user.password = newPassword;
    user.loginAttempts = 0;
    user.accountLocked = false;
    await user.save();

    delete req.session.changePasswordUsername;

    res.render("login", {
      successMessage: "Password has been successfully changed.!",
    });
  } catch (error) {
    console.error(
      "An error occurred while validating the existence of the password!",
      error
    );
    throw error;
  }
}

const passwordController = {
  changePasswordPage: async (req, res) => {
    try {
      res.render("changePassword");
    } catch (error) {
      console.error("Error loading change password page", error);
      throw error;
    }
  },
  validateEmailAndUsername: async (req, res) => {
    try {
      const username = req.body.username;
      const email = req.body.email;

      if (!username || !email) {
        return res.render("changePassword", {
          errorMessage: "You must enter the requested information!",
        });
      }

      const user = await Users.findOne({ username });

      if (!user) {
        return res.render("changePassword", {
          errorMessage: "The email address and user name do not match!",
        });
      }

      if (user.email != email) {
        return res.render("changePassword", {
          errorMessage: "The email address and user name do not match!",
        });
      }

      //Si todo es correcto realizar envio del token
      // Enviar el token por email y obtener el secreto generado para la validacion del mismo
      const secret = await tokensController.sendToken(user.email, 2);
      const fechaGeneracionToken = new Date();

      const tokenData = {
        tokenGenerationDate: fechaGeneracionToken,
        tempSecret: secret,
      };

      const changePasswordUsername = user.username;

      //Almecenar el secreto generado y fecha generacion del token
      req.session.tokenData = tokenData;
      req.session.changePasswordUsername = changePasswordUsername;

      res.render("changePasswordToken");
    } catch (error) {
      console.error("Error validating email and username", error);
      throw error;
    }
  },
  validateChangePasswordToken: (req, res) => {
    try {
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
          return res.render("changePasswordToken", {
            errorMessage:
              "The token has expired, you must start the process again!",
          });
        }

        return res.render("changePasswordToken", {
          errorMessage: "The token entered is invalid!",
        });
      }

      delete req.session.tokenData;

      res.render("resetPassword");
    } catch (error) {
      console.error(
        "An error occurred while validating the token for password change!",
        error
      );
      throw error;
    }
  },
  validateNewPassword: async (req, res) => {
    try {
      const username = req.session.changePasswordUsername;
      const newPassword = req.body.newPassword;
      const confirmNewPassword = req.body.confirmNewPassword;

      //Validar si las contraseñas ingresadas son iguales
      if (newPassword != confirmNewPassword) {
        return res.render("resetPassword", {
          errorMessage: "Passwords do not match, they must be the same!",
        });
      }

      /*
        Debe tener al menos 8 caracteres
        Debe contener al menos una letra mayúscula
        Debe contener al menos una letra minúscula
        Debe contener al menos un dígito numerico
      */
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        return res.render("resetPassword", {
          errorMessage: "Password does not comply with the standard",
        });
      }

      await verifyPasswordExistenceHistory(username, newPassword, res, req);
    } catch (error) {
      console.error("An error occurred while changing the password!", error);
      throw error;
    }
  },
};

export default passwordController;
