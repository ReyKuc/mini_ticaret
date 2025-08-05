require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const adminRoutes = require("./routes/adminRoutes");
const clientRoutes = require("./routes/clientRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MONGODB bağlantısı başarılı");
    app.listen(PORT, () => {
      console.log(`Server ${PORT} portunda çalışıyor`);
    });
  })
  .catch((err) => {
    console.error("MONGODB bağlantı hatası:", err);
  });
