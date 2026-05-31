function validateCreateProduct(req, res, next) {
  const { name, price } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ success: false, message: 'Product name is required' });
  }

  if (price === undefined || price === null || price === '' || Number.isNaN(Number(price))) {
    return res.status(400).json({ success: false, message: 'Product price is required and must be a number' });
  }

  next();
}

function validateUpdateProduct(req, res, next) {
  const { price } = req.body;

  if (price !== undefined && price !== '' && Number.isNaN(Number(price))) {
    return res.status(400).json({ success: false, message: 'Product price must be a number' });
  }

  next();
}

module.exports = {
  validateCreateProduct,
  validateUpdateProduct
};
