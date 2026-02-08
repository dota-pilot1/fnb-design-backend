import { Module } from '@nestjs/common'
import { DrizzleModule } from '../db/drizzle.module'
import { ComponentFoldersController } from './component-folders.controller'
import { ComponentFoldersService } from './component-folders.service'

@Module({
  imports: [DrizzleModule],
  controllers: [ComponentFoldersController],
  providers: [ComponentFoldersService],
})
export class ComponentFoldersModule {}
