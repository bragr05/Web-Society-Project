import CarritoCompras from "../models/Schemas/carrito-compras.js";
import Prenda from "../models/Schemas/prendas.js";

const carritoController = {
  agregarAlCarrito: async (req, res) => {
    try {
      const userId = req.session.idUser;
      const prendaId = req.body.prendaId;
      const tallaSeleccionada = req.body.tallSeleccionada;

      const carritoUsuario = await CarritoCompras.findOne({ userId: userId });

      if (!carritoUsuario) {
        // El carrito no existe, crear uno nuevo
        const nuevoCarrito = new CarritoCompras({
          userId: userId,
          items: [{ itemId: prendaId, size: tallaSeleccionada }],
        });

        await nuevoCarrito.save();
      } else {
        // El carrito existe, agregar el nuevo item
        carritoUsuario.items.push({
          itemId: prendaId,
          size: tallaSeleccionada,
        });
        await carritoUsuario.save();
      }

      res.redirect("/");
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      throw error;
    }
  },
  recuperarCarrito: async (req, res) => {
    try {
      const userId = req.session.idUser;
      const carritoUsuario = await CarritoCompras.findOne({ userId: userId });

      if (!carritoUsuario) {
        // El carrito no existe para el usuario
        const carritoConPrendas = {};
        res.render("carrito-compras", {
          carritoUsuario: carritoConPrendas,
          totalPrecio: 0,
          cantidadPrendas: 0,
        });
      } else {
        const carritoConPrendas = await Promise.all(
          carritoUsuario.items.map(async (item) => {
            const prenda = await Prenda.findById(item.itemId);

            return {
              prendaID: prenda._id,
              size: item.size,
              brand: prenda.brand,
              name: prenda.name,
              price: prenda.price,
              image_url: prenda.image_url,
              stock: prenda.stock,
            };
          })
        );

        const total = carritoConPrendas.reduce(
          (acum, item) => acum + item.price,
          0
        );
        const cantidad = carritoConPrendas.length;
        res.render("carrito-compras", {
          carritoUsuario: carritoConPrendas,
          totalPrecio: total,
          cantidadPrendas: cantidad,
        });
      }
    } catch (error) {
      console.error("Error recuperar el carrito:", error);
      throw error;
    }
  },
  eliminarDelCarrito: async (req, res) => {
    try {
      const userId = req.session.idUser;
      const prendaId = req.body.prendaId;

      console.log(prendaId);

      const carritoUsuario = await CarritoCompras.findOne({ userId: userId });

      if (!carritoUsuario) {
        // En dado caso de que el carrito del usuario no existiera dara error
        return res
          .status(404)
          .json({ error: "El carrito no existe para el usuario" });
      }

      // Filtrar el array de items para excluir la prenda a eliminar
      carritoUsuario.items = carritoUsuario.items.filter(
        (item) => item.itemId.toString() !== prendaId
      );

      await carritoUsuario.save();

      res.redirect("/recover-cart");
    } catch (error) {
      res.status(500).json({
        error: "Ocurrió un error al eliminar el producto del carrito",
      });
    }
  },
  vaciarCarritoCompras: async (req, res) => {
    try {
      const userId = req.session.idUser;

      const carritoUsuario = await CarritoCompras.findOne({ userId: userId });

      if (!carritoUsuario) {
        // El carrito no existe para el usuario
        return res
          .status(404)
          .json({ error: "El carrito no existe para el usuario" });
      }

      // Eliminar todos los elementos del array del index 0 a su longitud total
      carritoUsuario.items.splice(0, carritoUsuario.items.length);
      await carritoUsuario.save();

      res.render("pago-exitoso");
    } catch (error) {
      res.status(500).json({
        error: "Ocurrió un error al eliminar el producto del carrito",
      });
    }
  },
};

export default carritoController;
