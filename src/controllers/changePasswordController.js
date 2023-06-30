import Users from "../models/users.js";

const verifyPassword = async (password, hashedPassword) => {
  try {
    return await Bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw error;
  }
};

async function verifyPasswordExistenceHistory(username, newPassword, res) {
  try {
    const user = await Users.findOne({ username });

    // Verificar si la contraseña es igual a la actual
    const currentPasswordMatch = await verifyPassword(
      newPassword,
      user.password
    );
    if (!currentPasswordMatch) {
      return res.render("resetPassword", {
        errorMessage:
          "The password cannot be the same as the current password!",
      });
    }

    // Veririfica si se encuentra en el historial
    for (const passwordIteration of user.passwordHistory) {
      const passwordMatch = await verifyPassword(
        newPassword,
        passwordIteration.password
      );
      if (passwordMatch) {
        return res.render("resetPassword", {
          errorMessage: "The key must be different from the last 5!",
        });
      }
    }
  } catch (error) {
    console.error(
      "An error occurred while validating the existence of the password!",
      error
    );
    throw error;
  }
}

async function addPasswordToHistory(username, newPassword) {
  try {
    const user = await Users.findOne({ username });

    //Actualizar la contraseña actual
    user.password = newPassword;

    const newPasswordEntry = {
      password: newPassword,
      createdAt: Date.now(),
    };

    user.passwordHistory.push(newPasswordEntry);

    // Verificar si hay más de 5 contraseñas en el historial
    if (user.passwordHistory.length > 5) {
      // Eliminar la contraseña más antigua del historial queue
      user.passwordHistory.shift();
    }

    await user.save();
  } catch (error) {
    console.error(
      "An error has occurred while adding the password to the history!",
      error
    );
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

      res.render("changePasswordToken");
    } catch (error) {
      console.error("Error validating email and username", error);
      throw error;
    }
  },
  changePassword: async (req, res) => {
    const username = req.session.username;
    const newPassword = req.body.newPassword;

    await verifyPasswordExistenceHistory(username, newPassword, res);

    await addPasswordToHistory(username, newPassword);
  },
};

export default passwordController;
