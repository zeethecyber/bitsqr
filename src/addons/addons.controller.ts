import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AddonsService } from './addons.service';
import { CreateAddonDto } from './dto/create-addon.dto';
import { UpdateAddonDto } from './dto/update-addon.dto';
import { JwtGuard } from 'src/guards/jwt.guard';

@Controller('addons')
@UseGuards(JwtGuard)
export class AddonsController {
  constructor(private readonly addonsService: AddonsService) {}

  @Post()
  create(@Body() createAddonDto: CreateAddonDto) {
    return this.addonsService.create(createAddonDto);
  }

  @Get()
  findAll() {
    return this.addonsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addonsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAddonDto: UpdateAddonDto) {
    return this.addonsService.update(+id, updateAddonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addonsService.remove(+id);
  }
}
