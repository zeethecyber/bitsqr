import { HttpException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ProductsService {
  constructor(private readonly dbService: DatabaseService) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const { name, description, price, categoryId } = createProductDto;

      const category = await this.dbService.category.findFirst({
        where: {
          id: categoryId,
        },
      });

      if (!category) {
        throw new HttpException('Category not found', 404);
      }

      const product = await this.dbService.product.create({
        data: {
          name,
          description,
          price,
          categoryId,
        },
      });

      return {
        data: product,
        message: 'Product created successfully',
      };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async findAll() {
    const products = await this.dbService.product.findMany();

    if (!products.length) {
      throw new HttpException('No products found', 404);
    }

    return {
      data: products,
      message: 'Products retrieved successfully',
    };
  }

  async findOne(id: number) {
    const product = await this.dbService.product.findFirst({
      where: {
        id,
      },
    });

    if (!product) {
      throw new HttpException('Product not found', 404);
    }

    return {
      data: product,
      message: 'Product retrieved successfully',
    };
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      if (updateProductDto.categoryId) {
        const category = await this.dbService.category.findFirst({
          where: {
            id: updateProductDto.categoryId,
          },
        });
        if (!category) {
          throw 'Category not found';
        }
      }
      const product = await this.dbService.product.update({
        where: {
          id,
        },
        data: updateProductDto,
      });

      return {
        data: product,
        message: 'Product updated successfully',
      };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async remove(id: number) {
    try {
      await this.dbService.product.delete({
        where: {
          id,
        },
      });

      return {
        message: 'Product deleted successfully',
      };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}
