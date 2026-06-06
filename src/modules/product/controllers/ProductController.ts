import fs from 'fs';
import path from 'path';
import type { NextFunction, Request, Response } from 'express';
import { ProductService } from '../services/ProductService';
import { successResponse } from '../../../core/utils/response';
import type { Product } from '../models/Product';

type MulterRequest = Request & { file?: Express.Multer.File };

export class ProductController {
  productService: ProductService;

  constructor(productService = new ProductService()) {
    this.productService = productService;
  }

  getImagePath(imageUrl: string) {
    return path.join(__dirname, '../../../', imageUrl.replace(/^\//, ''));
  }

  deleteImageIfExists(imageUrl?: string | null) {
    if (!imageUrl) {
      return;
    }

    const imagePath = this.getImagePath(imageUrl);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const products = await this.productService.listProducts();
      return successResponse(res, products, 'Products retrieved successfully');
    } catch (error) {
      return next(error);
    }
  }

  async view(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await this.productService.getProduct(Number(req.params.id));
      return successResponse(res, product, 'Product retrieved successfully');
    } catch (error) {
      return next(error);
    }
  }

  async create(req: MulterRequest, res: Response, next: NextFunction) {
    try {
      const { name, description, price, stock } = req.body;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

      const product = await this.productService.createProduct({
        name,
        description,
        price: Number(price),
        stock: Number(stock || 0),
        imageUrl
      } as Partial<Product>);

      return successResponse(res, product, 'Product created successfully', 201);
    } catch (error) {
      return next(error);
    }
  }

  async update(req: MulterRequest, res: Response, next: NextFunction) {
    try {
      const productId = Number(req.params.id);
      const existingProduct = await this.productService.getProduct(productId);
      const { name, description, price, stock } = req.body;
      const updateData: Partial<Product> = {
        name: name ?? existingProduct.name,
        description: description ?? existingProduct.description,
        price: price !== undefined && price !== '' ? Number(price) : existingProduct.price,
        stock: stock !== undefined && stock !== '' ? Number(stock) : existingProduct.stock
      };

      if (req.file) {
        updateData.imageUrl = `/uploads/${req.file.filename}`;
        this.deleteImageIfExists(existingProduct.imageUrl || null);
      }

      const product = await this.productService.updateProduct(productId, updateData);
      return successResponse(res, product, 'Product updated successfully');
    } catch (error) {
      return next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = Number(req.params.id);
      const existingProduct = await this.productService.getProduct(productId);
      this.deleteImageIfExists(existingProduct.imageUrl || null);

      const product = await this.productService.deleteProduct(productId);
      return successResponse(res, product, 'Product deleted successfully');
    } catch (error) {
      return next(error);
    }
  }
}
