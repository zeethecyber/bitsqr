import { HttpException, Injectable } from '@nestjs/common';
import { CreateAddonDto } from './dto/create-addon.dto';
import { UpdateAddonDto } from './dto/update-addon.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AddonsService {
  constructor(private readonly dbService: DatabaseService) {}

  async create(createAddonDto: CreateAddonDto) {
    try {
      const restaurant = await this.dbService.restaurant.findFirst({
        where: { id: createAddonDto.restaurantId },
      });
      if (!restaurant) {
        throw 'Restaurant not found';
      }
      const addon = await this.dbService.addon.create({
        data: createAddonDto,
      });

      return {
        data: addon,
        message: 'Addon has been created successfully',
      };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async findAll() {
    try {
      const addons = await this.dbService.addon.findMany();

      return {
        data: addons,
        message: 'Successfully retrieved addons',
      };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async findOne(id: number) {
    try {
      const addon = await this.dbService.addon.findUnique({
        where: { id },
      });

      if (!addon) {
        throw 'Addon not found';
      }

      return {
        data: addon,
        message: 'Successfully retrieved addon',
      };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async update(id: number, updateAddonDto: UpdateAddonDto) {
    try {
      const updatedAddon = await this.dbService.addon.update({
        where: { id },
        data: updateAddonDto,
      });

      return {
        data: updatedAddon,
        message: 'Addon has been updated successfully',
      };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async remove(id: number) {
    try {
      await this.dbService.addon.delete({
        where: { id },
      });

      return {
        message: 'Addon has been deleted successfully',
      };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}
