import { HttpException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly dbService: DatabaseService) {}

  async create(CreateCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.dbService.category.create({
        data: {
          name: CreateCategoryDto.name,
          restaurantId: CreateCategoryDto.restaurantId,
        },
      });

      return {
        data: category,
        message: 'Category created successfully',
      };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async findAll() {
    const categories = await this.dbService.category.findMany();
    if (!categories) {
      throw new HttpException('No categories found', 404);
    }
    return {
      data: categories,
      message: 'Categories retrieved successfully',
    };
  }

  async findOne(id: number) {
    const category = await this.dbService.category.findFirst({
      where: {
        id,
      },
    });
    if (!category) {
      throw new HttpException('Category not found', 404);
    }
    return {
      data: category,
      message: 'Category retrieved successfully',
    };
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.dbService.category.update({
        where: {
          id,
        },
        data: {
          name: updateCategoryDto.name,
        },
      });

      return {
        data: category,
        message: 'Category updated successfully',
      };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async remove(id: number) {
    try {
      await this.dbService.category.delete({
        where: {
          id,
        },
      });
      return {
        message: 'Category deleted successfully',
      };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}
