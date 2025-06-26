import Product from "../models/Product.js";

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({
      createdAt: -1,
    });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// Get single product
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      message: "Error fetching product",
      error: error.message,
    });
  }
};

// Create product
export const createProduct = async (req, res) => {
  try {
    console.log("Creating product with data:", req.body);
    const { name, price, description, image, quantity, unit } = req.body;

    // Validate required fields
    if (!name || !price || !description || !quantity || !unit) {
      console.log("Missing required fields:", {
        name,
        price,
        description,
        quantity,
        unit,
      });
      return res.status(400).json({
        message: "All fields are required",
        missingFields: {
          name: !name,
          price: !price,
          description: !description,
          quantity: !quantity,
          unit: !unit,
        },
      });
    }

    // Validate numeric fields
    if (isNaN(price) || price < 0) {
      return res.status(400).json({
        message: "Price must be a positive number",
      });
    }

    if (isNaN(quantity) || quantity < 0) {
      return res.status(400).json({
        message: "Quantity must be a positive number",
      });
    }

    // Validate unit
    const validUnits = ["liter", "kg", "piece"];
    if (!validUnits.includes(unit)) {
      return res.status(400).json({
        message: `Unit must be one of: ${validUnits.join(", ")}`,
      });
    }

    const product = new Product({
      name,
      price,
      description,
      image: image || "https://via.placeholder.com/150",
      quantity,
      unit,
      isActive: true,
    });

    console.log("Saving product:", product);
    const savedProduct = await product.save();
    console.log("Product saved successfully:", savedProduct);

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        error: error.message,
        details: Object.values(error.errors).map((err) => err.message),
      });
    }
    res.status(500).json({
      message: "Error creating product",
      error: error.message,
    });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    console.log("Updating product:", req.params.id, "with data:", req.body);
    const { name, price, description, image, quantity, unit } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Validate numeric fields if provided
    if (price !== undefined && (isNaN(price) || price < 0)) {
      return res.status(400).json({
        message: "Price must be a positive number",
      });
    }

    if (quantity !== undefined && (isNaN(quantity) || quantity < 0)) {
      return res.status(400).json({
        message: "Quantity must be a positive number",
      });
    }

    // Validate unit if provided
    if (unit) {
      const validUnits = ["liter", "kg", "piece"];
      if (!validUnits.includes(unit)) {
        return res.status(400).json({
          message: `Unit must be one of: ${validUnits.join(", ")}`,
        });
      }
    }

    // Update fields if provided
    if (name) product.name = name;
    if (price !== undefined) product.price = price;
    if (description) product.description = description;
    if (image !== undefined) product.image = image;
    if (quantity !== undefined) product.quantity = quantity;
    if (unit) product.unit = unit;

    console.log("Saving updated product:", product);
    const updatedProduct = await product.save();
    console.log("Product updated successfully:", updatedProduct);

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        error: error.message,
        details: Object.values(error.errors).map((err) => err.message),
      });
    }
    res.status(500).json({
      message: "Error updating product",
      error: error.message,
    });
  }
};

// Delete product (soft delete)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Soft delete by setting isActive to false
    product.isActive = false;
    await product.save();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      message: "Error deleting product",
      error: error.message,
    });
  }
};
