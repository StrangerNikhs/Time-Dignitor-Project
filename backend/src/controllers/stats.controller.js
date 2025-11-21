const Product = require("../models/product.model");

exports.getStats = async (req, res) => {
  const totalAndPrices = await Product.aggregate([
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        avgPrice: { $avg: "$price" },
        maxPrice: { $max: "$price" },
        minPrice: { $min: "$price" },
      },
    },
  ]);

  const perCategory = await Product.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        avgPrice: { $avg: "$price" },
      },
    },
    { $sort: { count: -1 } },
  ]);

  const highest = await Product.find().sort({ price: -1 }).limit(1);

  res.json({
    summary: totalAndPrices[0] || {
      totalProducts: 0,
      avgPrice: 0,
      maxPrice: 0,
      minPrice: 0,
    },
    perCategory,
    highest: highest[0] || null,
  });
};
