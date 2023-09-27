import { Router } from "express";
import { cartsManager } from "../CartsManager.js";
const router = Router();

router.post("/", async (req, res) => {
  try {
    const newCart = await cartsManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: "Error creating cart" });
  }
});

router.get("/", async (req, res) => {
  try {
    const carts = await cartsManager.getCarts(req.query);
    if (!carts.length) {
      return res.status(200).json({ message: "No carts" });
    }
    res.status(200).json({ message: "Cart not found", carts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:idCart", async (req, res) => {
  const { idCart } = req.params;
  try {
    const cart = await cartsManager.getCartById(parseInt(idCart));
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ error: "Cart not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching cart" });
  }
});

router.post("/:idCart/product/:idProduct", async (req, res) => {
  const { idCart, idProduct } = req.body;
  try {
    await cartsManager.addProductToCart(parseInt(idCart), parseInt(idProduct));
    res.status(200).json({ message: "Product added to cart successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error adding product to cart" });
  }
});

router.delete("/:idCart", async (req, res) => {
  const { idCart } = req.params;
  try {
    const cart = await cartsManager.getCartById(parseInt(idCart));
    if (!cart) {
      return res.status(404).json({ message: "No cart found with that id" });
    }
    await cartsManager.deleteCart(+idCart);
    res.status(200).json({ message: "Cart deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;