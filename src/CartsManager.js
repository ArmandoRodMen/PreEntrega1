  import { existsSync, promises } from "fs";
  import { productsManager } from "./ProductManager.js";
  const path = "CartsFile.json";

  class CartsManager {
    async getCarts(queryObj = {}) {
      const { limit } = queryObj;

      try {
        if (existsSync(path)) {
          const cartsFile = await promises.readFile(path, "utf-8");
          const cartsData = JSON.parse(cartsFile);
          return limit ? cartsData.slice(0, +limit) : cartsData;
        } else {
          console.log("no existe el archivo");
          return [];
        }
      } catch (error) {
        console.log("error", error);
        return error;
      }
    }

    async createCart() {
      try {
        const carts = await this.getCarts();
        let id;
        if (!carts.length) {
          id = 1;
        } else {
          id = carts[carts.length - 1].id + 1;
        }
        const newCart = { id, products: [] };
        carts.push(newCart);
        await promises.writeFile(path, JSON.stringify(carts));
        return newCart;
      } catch (error) {
        return error;
      }
    }

    async getCartById(id) {
      try {
        const carts = await this.getCarts();
        console.log("carts", carts);
        const cart = carts.find((u) => u.id === id);
        console.log("cart", cart);
        return cart;
      } catch (error) {
        console.log("error catch");
        throw new Error(error.message);
      }
    }

    async addProductToCart(idCart, idProduct) {
      try {
        // Validar que el carrito exista
        const cart = await this.getCartById(idCart);
        if (!cart) {
          throw new Error("There is no cart with this id");
        }
        
        // Validar que el producto exista
        const product = await productsManager.getProductById(idProduct);
        if (!product) {
          throw new Error("There is no product with this id");
        }
        
        const productIndex = cart.products.findIndex((p) => p.product === idProduct);
        
        if (productIndex === -1) {
          // Crear un nuevo producto en el carrito con toda la información del producto
          const newProduct = {
            product: idProduct,
            quantity: 1,
            ...product  // Agregar todas las propiedades del producto
          };
          cart.products.push(newProduct);
        } else {
          cart.products[productIndex].quantity++;
        }
        
        // Obtener la lista completa de carritos
        const carts = await this.getCarts();
        
        // Buscar el carrito actualizado por su ID
        const updatedCartIndex = carts.findIndex((c) => c.id === idCart);
        
        if (updatedCartIndex !== -1) {
          // Actualizar el carrito en la lista de carritos
          carts[updatedCartIndex] = cart;
          
          // Sobrescribir el archivo 'CartsFile.json' con la lista actualizada
          await promises.writeFile(path, JSON.stringify(carts));
          
          return { message: "Product added to cart successfully" };
        } else {
          throw new Error("Cart not found");
        }
      } catch (error) {
        throw new Error("Error adding product to cart: " + error.message);
      }
    }
    

    async deleteCart(idCart) {
      try {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex((cart) => cart.id === idCart);
    
        if (cartIndex !== -1) {
          carts.splice(cartIndex, 1); // Elimina el carrito del arreglo
          await promises.writeFile(path, JSON.stringify(carts)); // Guarda la lista actualizada en el archivo
          return { message: "Cart deleted successfully" };
        } else {
          throw new Error("Cart not found");
        }
      } catch (error) {
        throw new Error("Error deleting cart: " + error.message);
      }
    }
    
  }

  export const cartsManager = new CartsManager();