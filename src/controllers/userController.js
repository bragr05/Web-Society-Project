import Users from "../models/users.js";

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
};

export default UsersController;
