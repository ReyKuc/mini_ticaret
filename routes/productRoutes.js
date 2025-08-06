const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const authMiddleware = require("../middlewares/authMiddleware");

// Admin only middleware (isteğe bağlı)
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied, admin only" });
  }
  next();
};

// Ürün oluşturma (admin yetkili)
router.post("/", authMiddleware, adminOnly, productController.createProduct);

// Tüm ürünleri listele (herkes erişebilir)
router.get("/", productController.getAllProducts);

// Tek ürün detay
router.get("/:id", productController.getProductById);

// Ürün güncelle (admin)
router.put("/:id", authMiddleware, adminOnly, productController.updateProduct);

// Ürün sil (admin)
router.delete("/:id", authMiddleware, adminOnly, productController.deleteProduct);

module.exports = router;
