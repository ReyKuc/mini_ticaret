const Client = require("../models/client");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const exists = await Client.findOne({ username });
    if (exists) return res.status(400).json({ message: "Client already exists" });

    const client = new Client({ username, password });
    await client.save();
    res.status(201).json({ message: "Client registered" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const client = await Client.findOne({ username });
    if (!client) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await client.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ clientId: client._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const client = await Client.findById(req.user.clientId).select("-password");
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
