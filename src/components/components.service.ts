import { Injectable, Inject } from '@nestjs/common'
import { eq, asc } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { DRIZZLE_DB } from '../db/drizzle.module'
import * as schema from '../db/schema'
import { CreateComponentDto } from './dto/create-component.dto'
import { UpdateComponentDto, MoveComponentDto } from './dto/update-component.dto'

@Injectable()
export class ComponentsService {
  constructor(
    @Inject(DRIZZLE_DB) private db: NodePgDatabase<typeof schema>,
  ) {}

  async findOne(id: string) {
    const [component] = await this.db
      .select()
      .from(schema.components)
      .where(eq(schema.components.id, id))
      .limit(1)

    return component || null
  }

  async findByFolder(folderId: string) {
    return this.db
      .select()
      .from(schema.components)
      .where(eq(schema.components.folderId, folderId))
      .orderBy(asc(schema.components.displayOrder))
  }

  async create(dto: CreateComponentDto) {
    const [component] = await this.db
      .insert(schema.components)
      .values({
        folderId: dto.folderId || null,
        title: dto.title,
        description: dto.description || null,
        code: dto.code,
        previewCode: dto.previewCode || null,
        dependencies: dto.dependencies || null,
        displayOrder: dto.displayOrder ?? 0,
      })
      .returning()

    return component
  }

  async update(id: string, dto: UpdateComponentDto) {
    const values: Record<string, any> = { updatedAt: new Date() }
    if (dto.title !== undefined) values.title = dto.title
    if (dto.description !== undefined) values.description = dto.description
    if (dto.code !== undefined) values.code = dto.code
    if (dto.previewCode !== undefined) values.previewCode = dto.previewCode
    if (dto.dependencies !== undefined) values.dependencies = dto.dependencies
    if (dto.displayOrder !== undefined) values.displayOrder = dto.displayOrder

    const [component] = await this.db
      .update(schema.components)
      .set(values)
      .where(eq(schema.components.id, id))
      .returning()

    return component
  }

  async moveToFolder(id: string, dto: MoveComponentDto) {
    const [component] = await this.db
      .update(schema.components)
      .set({ folderId: dto.folderId, updatedAt: new Date() })
      .where(eq(schema.components.id, id))
      .returning()

    return component
  }

  async remove(id: string) {
    await this.db
      .update(schema.components)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(schema.components.id, id))

    return { success: true }
  }
}
