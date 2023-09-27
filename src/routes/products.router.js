import { Router } from "express";
import { productsManager } from "../ProductManager.js";
const router = Router();

router.get("/", async (req, res) => {
  try {
    const products = await productsManager.getProducts(req.query);
    if (!products.length) {
      return res.status(200).json({ message: "No products" });
    }
    res.status(200).json({ message: "Products found", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:idProduct", async (req, res) => {
  const { idProduct } = req.params;
  try {
    const product = await productsManager.getProductById(+idProduct);
    if (!product) {
      return res.status(404).json({ message: "No product found with that id" });
    }
    res.status(200).json({ message: "Product found", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  const { title, description, code, price, stock } = req.body;
  if (!title || !description || !code || !price || !stock) {
    res.status(400).json({ message: "Required data is missing" });
  }
  try {
    const newProduct = await productsManager.createProduct(req.body);
    res.status(200).json({ message: "Product created", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:idProduct", async (req, res) => {
  const { idProduct } = req.params;
  try {
    const product = await productsManager.getProductById(+idProduct);
    if (!product) {
      return res.status(404).json({ message: "No product found with that id" });
    }
    await productsManager.deleteProduct(+idProduct);
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;