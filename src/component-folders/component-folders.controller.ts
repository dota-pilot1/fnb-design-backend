import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common'
import { ComponentFoldersService } from './component-folders.service'
import { CreateComponentFolderDto } from './dto/create-folder.dto'
import { UpdateComponentFolderDto, ReorderFoldersDto } from './dto/update-folder.dto'

@Controller('component-folders')
export class ComponentFoldersController {
  constructor(private readonly service: ComponentFoldersService) {}

  @Get()
  findAll() {
    return this.service.findAllWithComponents()
  }

  @Post()
  create(@Body() dto: CreateComponentFolderDto) {
    return this.service.create(dto)
  }

  @Patch('reorder')
  reorder(@Body() dto: ReorderFoldersDto) {
    return this.service.reorder(dto)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateComponentFolderDto) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id)
  }
}
