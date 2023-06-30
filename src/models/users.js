import mongoose from "mongoose";

// Para poder encriptar la clave del usuario en BD
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  location: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  accountLocked: {
    type: Boolean,
    default: false,
  },
  passwordHistory: [
    {
      password: String,
      createdAt: Date,
    },
  ],
  passwordLastChangedAt: {
    type: Date,
  },
  registeredSince: {
    type: Date,
    default: Date.now,
  },
});
// Middleware para encriptar la contraseña antes de guardarla

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;

    // Encriptar contraseñas en el historial
    for (let i = 0; i < this.passwordHistory.length; i++) {
      const passwordEntry = this.passwordHistory[i];
      const hashedPasswordEntry = await bcrypt.hash(
        passwordEntry.password,
        salt
      );
      passwordEntry.password = hashedPasswordEntry;
    }

    return next();
  } catch (error) {
    return next(error);
  }
});

const Users = mongoose.model("Users", userSchema);

export default Users;
