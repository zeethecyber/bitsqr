import { HttpException, Injectable } from '@nestjs/common';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TablesService {
  constructor(private readonly dbService: DatabaseService) {}

  async create(createTableDto: CreateTableDto) {
    try {
      const restaurant = await this.dbService.restaurant.findFirst({
        where: {
          id: createTableDto.restaurantId,
        },
      });
      if (!restaurant) {
        throw 'Restaurant not found';
      }
      const table = await this.dbService.table.create({
        data: createTableDto,
      });

      return {
        data: table,
        message: 'Table created successfully',
      };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async findAll() {
    try {
      const tables = await this.dbService.table.findMany();

      return {
        data: tables,
        message: 'Tables retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async findOne(id: number) {
    try {
      const table = await this.dbService.table.findFirst({
        where: {
          id,
        },
      });

      if (!table) {
        throw 'Table not found';
      }

      return {
        data: table,
        message: 'Table retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async update(id: number, updateTableDto: UpdateTableDto) {
    try {
      const table = await this.dbService.table.update({
        where: {
          id,
        },
        data: updateTableDto,
      });

      return {
        data: table,
        message: 'Table updated successfully',
      };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  async remove(id: number) {
    try {
      const table = await this.dbService.table.delete({
        where: {
          id,
        },
      });

      return {
        data: table,
        message: 'Table deleted successfully',
      };
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}
