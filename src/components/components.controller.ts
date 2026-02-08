import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common'
import { ComponentsService } from './components.service'
import { CreateComponentDto } from './dto/create-component.dto'
import { UpdateComponentDto, MoveComponentDto } from './dto/update-component.dto'

@Controller('components')
export class ComponentsController {
  constructor(private readonly service: ComponentsService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id)
  }

  @Get('folder/:folderId')
  findByFolder(@Param('folderId') folderId: string) {
    return this.service.findByFolder(folderId)
  }

  @Post()
  create(@Body() dto: CreateComponentDto) {
    return this.service.create(dto)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateComponentDto) {
    return this.service.update(id, dto)
  }

  @Patch(':id/folder')
  moveToFolder(@Param('id') id: string, @Body() dto: MoveComponentDto) {
    return this.service.moveToFolder(id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id)
  }
}
