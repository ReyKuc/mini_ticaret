const Order = require("../models/order");
const Product = require("../models/product");

exports.createOrder = async (req, res) => {
  try {
    const { products } = req.body;

    const productIds = products.map((p) => p.productId);
    const dbProducts = await Product.find({ _id: { $in: productIds } });

    if (dbProducts.length !== products.length) {
      return res.status(404).json({ message: "Ürünlerden biri bulunamadı" });
    }

    for (let item of products) {
      const foundProduct = dbProducts.find(
        (p) => p._id.toString() === item.productId
      );

      if (!foundProduct || foundProduct.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Stokta yeterli '${foundProduct?.name || "ürün"}' yok.` });
      }
    }

    for (let item of products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    
    const totalAmount = products.reduce((acc, item) => {
      const matchedProduct = dbProducts.find(p => p._id.toString() === item.productId);
      return acc + matchedProduct.price * item.quantity;
    }, 0);

    const order = await Order.create({
      user: req.user.id,
      products,
      totalAmount,
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("products.productId");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("products.productId");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status || order.status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
