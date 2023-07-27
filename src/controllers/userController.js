import Users from "../models/users.js";
import axios from "axios";

const UsersController = {
  loadUserProfile: async (req, res) => {
    try {
      const username = req.session.isLoggedIn;
      //const user = await Users.findOne({ username });
      
      const userAPI = await axios.get(
        `http://127.0.0.1:8000/user/profile/${username}`
      );

      console.log(userAPI.data.dataUserProfile);

      res.render("userProfile", { userData: userAPI.data.dataUserProfile });
    } catch (error) {
      console.error("Error loading the user profile:", error);
      throw error;
    }
  },
};

export default UsersController;
