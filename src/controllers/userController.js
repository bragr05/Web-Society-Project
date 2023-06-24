import Users from "../models/Schemas/usuarios.js";

const UserController = {
  cargarPerfilUsuario: async (req, res) => {
    const username = req.session.isLoggedIn;
    const usuario = await Users.findOne({ username });

    try {
      res.render("perfilUsuario", { dataUsuario: usuario });
    } catch (error) {
      console.error("Error al realizar el login:", error);
      throw error;
    }
  },
};

export default UserController;
