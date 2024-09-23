import { HttpException, Injectable } from '@nestjs/common';
import { UpdateRestaurantDto } from './dto/update.restaurant.dto';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class RestaurantsService {
  constructor(private readonly dbService: DatabaseService) {}

  async create(createRestaurantDto: CreateRestaurantDto) {
    try {
      const { name, description, email, address, website, phone, vendorId } =
        createRestaurantDto;
      const vendor = await this.dbService.vendor.findFirst({
        where: { id: vendorId },
      });
      if (!vendor) {
        throw new HttpException('Vendor not found', 404);
      }

      const restaurant = await this.dbService.restaurant.create({
        data: {
          name,
          description,
          address,
          phone,
          email,
          website,
          Vendor: {
            connect: {
              id: vendorId,
            },
          },
        },
      });

      return {
        data: restaurant,
        message: 'Restaurant created successfully',
      };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async findAll() {
    const restaurants = await this.dbService.restaurant.findMany();
    return {
      data: restaurants,
      message: 'Restaurants retrieved successfully',
    };
  }

  async findOne(id: number) {
    const restaurant = await this.dbService.restaurant.findUnique({
      where: { id },
    });
    if (!restaurant) {
      throw new HttpException('Restaurant not found', 404);
    }
    return {
      data: restaurant,
      message: 'Restaurant retrieved successfully',
    };
  }

  async update(id: number, updateRestaurantDto: UpdateRestaurantDto) {
    const restaurant = await this.dbService.restaurant.findFirst({
      where: { id },
    });
    if (!restaurant) {
      throw new HttpException('Restaurant not found', 404);
    }

    const updatedRestaurant = await this.dbService.restaurant.update({
      where: { id },
      data: updateRestaurantDto,
    });

    return {
      data: updatedRestaurant,
      message: 'Restaurant updated successfully',
    };
  }

  async remove(id: number) {
    try {
      await this.dbService.restaurant.delete({ where: { id } });
      return {
        message: 'Restaurant deleted successfully',
      };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}
