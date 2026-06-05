const fs = require('fs');
const path = require('path');
const { ProductService } = require('../services/ProductService');
const { successResponse } = require('../../../core/utils/response');

class ProductController {
  constructor(productService = new ProductService()) {
    this.productService = productService;
  }

  getImagePath(imageUrl) {
    return path.join(__dirname, '../../../', imageUrl.replace(/^\//, ''));
  }

  deleteImageIfExists(imageUrl) {
    if (!imageUrl) {
      return;
    }

    const imagePath = this.getImagePath(imageUrl);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  async list(req, res, next) {
    try {
      const products = await this.productService.listProducts();
      return successResponse(res, products, 'Products retrieved successfully');
    } catch (error) {
      return next(error);
    }
  }

  async view(req, res, next) {
    try {
      const product = await this.productService.getProduct(Number(req.params.id));
      return successResponse(res, product, 'Product retrieved successfully');
    } catch (error) {
      return next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { name, description, price, stock } = req.body;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

      const product = await this.productService.createProduct({
        name,
        description,
        price: Number(price),
        stock: Number(stock || 0),
        imageUrl
      });

      return successResponse(res, product, 'Product created successfully', 201);
    } catch (error) {
      return next(error);
    }
  }

  async update(req, res, next) {
    try {
      const productId = Number(req.params.id);
      const existingProduct = await this.productService.getProduct(productId);
      const { name, description, price, stock } = req.body;
      const updateData = {
        name: name ?? existingProduct.name,
        description: description ?? existingProduct.description,
        price: price !== undefined && price !== '' ? Number(price) : existingProduct.price,
        stock: stock !== undefined && stock !== '' ? Number(stock) : existingProduct.stock
      };

      if (req.file) {
        updateData.imageUrl = `/uploads/${req.file.filename}`;
        this.deleteImageIfExists(existingProduct.imageUrl);
      }

      const product = await this.productService.updateProduct(productId, updateData);
      return successResponse(res, product, 'Product updated successfully');
    } catch (error) {
      return next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const productId = Number(req.params.id);
      const existingProduct = await this.productService.getProduct(productId);
      this.deleteImageIfExists(existingProduct.imageUrl);

      const product = await this.productService.deleteProduct(productId);
      return successResponse(res, product, 'Product deleted successfully');
    } catch (error) {
      return next(error);
    }
  }
}

module.exports.ProductController = ProductController;
