import { text } from "express";

const onboardingController = {
  onboardingPage: async (req, res) => {
    try {

      const data = [
        {
          image: "Onboarding1.jpg",
          text: "Immerse yourself in the fascinating world of sneakers and discover the latest news of its brands.",
          icon:"fa-solid fa-magnifying-glass"
        },
        {
          image: "Onboarding2.jpg",
          text: "Get the details of your favorite sneakers.",
          icon:"fa-solid fa-info"
        },
        {
          image: "Onboarding3.jpg",
          text: "Don't worry! Manage and pay securely with Paypal shopping cart.",
          icon:"fa-solid fa-cart-arrow-down"
        },
      ];

      res.render("Onboarding", { data });
    } catch (error) {
      console.error("Error loading Onboarding page:", error);
      throw error;
    }
  },
};

export default onboardingController;
