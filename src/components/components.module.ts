import { Module } from '@nestjs/common'
import { DrizzleModule } from '../db/drizzle.module'
import { ComponentsController } from './components.controller'
import { ComponentsService } from './components.service'

@Module({
  imports: [DrizzleModule],
  controllers: [ComponentsController],
  providers: [ComponentsService],
})
export class ComponentsModule {}
