import ProductModel from "./models/product.js";

async function getAllProducts(req, res) {
  try {
    const products = await ProductModel.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

async function getProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await ProductModel.find({ _id: id });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}
async function addProduct(req, res) {
  try {
    const { name, description, price, quantity } = req.body;
    const newProduct = new ProductModel({ name, description, price, quantity });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

async function updatePdtQuantity(order) {
  try {
    const product = await ProductModel.findOne({ _id: order.productId });
    if (product) {
      product.quantity -= order.quantity;
      if (product.quantity <= 0) {
        product.inStock = false;
        product.quantity = 0;
      }
      await product.save();
    }
  } catch (error) {
    console.error("❌ Failed to update product quantity:", error);
  }
}
export { getAllProducts, getProduct, addProduct, updatePdtQuantity };
