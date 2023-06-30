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

const passwordController = {
  changePassword: async (req, res) => {
    const username = req.session.username;
    const newPassword = req.body.newPassword;

    await verifyPasswordExistenceHistory(username, newPassword, res);
  },
};

export default passwordController;
