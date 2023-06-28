import shoppingCart from "../models/shoppingCart.js";
import Garmets from "../models/garments.js";

const shoppingCartController = {
  addToCart: async (req, res) => {
    try {
      const userId = req.session.userId;
      const garmentId = req.body.garmentId;
      const selectedSize = req.body.selectedSize;

      const shoppingCartUser = await shoppingCart.findOne({ userId: userId });

      if (!shoppingCartUser) {
        // El carrito no existe, crear uno nuevo
        const newUserShoppingCart = new shoppingCart({
          userId: userId,
          garmets: [{ garmentId: garmentId, size: selectedSize }],
        });

        await newUserShoppingCart.save();
      } else {
        // El carrito existe, agregar la nueva prenda
        shoppingCartUser.garmets.push({
          garmentId: garmentId,
          size: selectedSize,
        });
        await shoppingCartUser.save();
      }

      res.redirect("/");
    } catch (error) {
      console.error("Error adding item to shopping cart:", error);
      throw error;
    }
  },
  getGarmentsCart: async (req, res) => {
    try {
      const userId = req.session.userId;
      const shoppingCartUser = await shoppingCart.findOne({ userId: userId });

      if (!shoppingCartUser) {
        // El carrito no existe para el usuario
        res.render("shoppingCart", {
          shoppingCartUser: {},
          totalPrice: 0,
          quantityGarments: 0,
        });
      } else {
        const shoppingCartUserGarmets = await Promise.all(
          shoppingCartUser.garmets.map(async (garmet) => {
            const userGarmet = await Garmets.findById(garmet.garmentId);

            return {
              garmentId: userGarmet._id,
              size: garmet.size,
              brand: userGarmet.brand,
              name: userGarmet.name,
              price: userGarmet.price,
              image_url: userGarmet.image_url,
              stock: userGarmet.stock,
            };
          })
        );

        const totalPrice = shoppingCartUserGarmets.reduce(
          (acum, garmet) => acum + garmet.price,
          0
        );
        const quantityGarments = shoppingCartUserGarmets.length;

        res.render("carrito-compras", {
          shoppingCartUser: shoppingCartUserGarmets,
          totalPrice: totalPrice,
          quantityGarments: quantityGarments,
        });
      }
    } catch (error) {
      console.error("Error retrieving user shopping cart:", error);
      throw error;
    }
  },
  deleteGarmentCart: async (req, res) => {
    try {
      const userId = req.session.userId;
      const garmentId = req.body.garmentId;

      const shoppingCartUser = await shoppingCart.findOne({ userId: userId });

      // Filtrar el array de items para excluir la prenda a eliminar
      shoppingCartUser.garmets = shoppingCartUser.garmets.filter(
        (garmet) => garmet.garmentId.toString() !== garmentId
      );

      await shoppingCartUser.save();

      res.redirect("/recover-cart");
    } catch (error) {
      console.error("Error deleting garment from cart", error);
      throw error;
    }
  },
  confirmShoppingCart: async (req, res) => {
    try {
      const userId = req.session.userId;

      const shoppingCartUser = await shoppingCart.findOne({ userId: userId });

      // Eliminar todos los elementos del array del index 0 a su longitud total
      shoppingCartUser.garmets.splice(0, shoppingCartUser.garmets.length);
      await shoppingCartUser.save();

      res.render("invoicePurchase ");
    } catch (error) {
      console.error("Error confirming shopping cart purchase", error);
      throw error;
    }
  },
};

export default shoppingCartController;
