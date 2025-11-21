const Product = require("../models/product.model");
const redisClient = require("../config/redis");

const PRODUCTS_KEY = "products:all";

exports.createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  await redisClient.del(PRODUCTS_KEY);
  res.status(201).json(product);
};

exports.getProducts = async (req, res) => {
  // support pagination via query params: ?page=1&limit=10
  const page = Math.max(1, parseInt(req.query.page || "1", 10));
  const limit = Math.max(0, parseInt(req.query.limit || "0", 10));

  // if pagination requested, skip cache and return paginated result
  if (limit > 0) {
    const total = await Product.countDocuments();
    const skip = (page - 1) * limit;
    const products = await Product.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    const totalPages = Math.ceil(total / limit);
    return res.json({ source: "db", data: products, meta: { total, page, limit, totalPages } });
  }

  // no pagination: use simple caching for full list
  const cached = await redisClient.get(PRODUCTS_KEY);
  if (cached) {
    return res.json({ source: "cache", data: JSON.parse(cached) });
  }
  const products = await Product.find().sort({ createdAt: -1 });
  const ttl = Number(process.env.REDIS_TTL || 30);
  await redisClient.setex(PRODUCTS_KEY, ttl, JSON.stringify(products));
  res.json({ source: "db", data: products });
};

exports.getProductById = async (req, res) => {
  const prod = await Product.findById(req.params.id);
  if (!prod) return res.status(404).json({ message: "Product not found" });
  res.json(prod);
};

exports.updateProduct = async (req, res) => {
  const prod = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!prod) return res.status(404).json({ message: "Product not found" });
  await redisClient.del(PRODUCTS_KEY);
  res.json(prod);
};

exports.deleteProduct = async (req, res) => {
  const prod = await Product.findByIdAndDelete(req.params.id);
  if (!prod) return res.status(404).json({ message: "Product not found" });
  await redisClient.del(PRODUCTS_KEY);
  res.json({ message: "Deleted" });
};

exports.refreshCache = async (req, res) => {
  await redisClient.del(PRODUCTS_KEY);
  // support pagination here as well
  const page = Math.max(1, parseInt(req.query.page || "1", 10));
  const limit = Math.max(0, parseInt(req.query.limit || "0", 10));

  if (limit > 0) {
    const total = await Product.countDocuments();
    const skip = (page - 1) * limit;
    const products = await Product.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    const totalPages = Math.ceil(total / limit);
    return res.json({ source: "db", data: products, meta: { total, page, limit, totalPages } });
  }

  // return fresh full list
  const products = await Product.find().sort({ createdAt: -1 });
  const ttl = Number(process.env.REDIS_TTL || 30);
  await redisClient.setex(PRODUCTS_KEY, ttl, JSON.stringify(products));
  res.json({ source: "db", data: products });
};
