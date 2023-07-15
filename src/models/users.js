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
    province: {
      type: String,
      required: true,
    },
    canton: {
      type: String,
      required: true,
    },
    district:{
      type: String,
      required: true,
    }
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

    // Encriptar y agregar la nueva contraseña al historial
    const newHistoryEntry = {
      password: hashedPassword,
      createdAt: new Date(),
    };
    this.passwordHistory.push(newHistoryEntry);

    // Verificar si hay más de 5 contraseñas en el historial
    if (this.passwordHistory.length > 5) {
      // Eliminar la contraseña más antigua del historial queue
      this.passwordHistory.shift();
    }

    return next();
  } catch (error) {
    return next(error);
  }
});

const Users = mongoose.model("Users", userSchema);

export default Users;
