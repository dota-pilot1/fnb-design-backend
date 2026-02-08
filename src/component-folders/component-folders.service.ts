import { Injectable, Inject, BadRequestException } from '@nestjs/common'
import { eq, asc, and } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { DRIZZLE_DB } from '../db/drizzle.module'
import * as schema from '../db/schema'
import { CreateComponentFolderDto } from './dto/create-folder.dto'
import { UpdateComponentFolderDto, ReorderFoldersDto } from './dto/update-folder.dto'

@Injectable()
export class ComponentFoldersService {
  constructor(
    @Inject(DRIZZLE_DB) private db: NodePgDatabase<typeof schema>,
  ) {}

  async findAllWithComponents() {
    const folders = await this.db
      .select()
      .from(schema.componentFolders)
      .where(eq(schema.componentFolders.isActive, true))
      .orderBy(asc(schema.componentFolders.displayOrder))

    const components = await this.db
      .select()
      .from(schema.components)
      .where(eq(schema.components.isActive, true))
      .orderBy(asc(schema.components.displayOrder))

    // 트리 빌드
    const folderMap = new Map<string, any>()
    for (const folder of folders) {
      folderMap.set(folder.id, { ...folder, children: [], components: [] })
    }

    const roots: any[] = []
    for (const folder of folders) {
      const node = folderMap.get(folder.id)!
      if (folder.parentId && folderMap.has(folder.parentId)) {
        folderMap.get(folder.parentId)!.children.push(node)
      } else {
        roots.push(node)
      }
    }

    // 컴포넌트를 폴더에 매핑
    const uncategorized: any[] = []
    for (const comp of components) {
      if (comp.folderId && folderMap.has(comp.folderId)) {
        folderMap.get(comp.folderId)!.components.push(comp)
      } else {
        uncategorized.push(comp)
      }
    }

    return { folders: roots, uncategorized }
  }

  async create(dto: CreateComponentFolderDto) {
    // 2단계 제한: parentId가 있는 폴더의 하위에 폴더 생성 불가
    if (dto.parentId) {
      const parent = await this.db
        .select()
        .from(schema.componentFolders)
        .where(eq(schema.componentFolders.id, dto.parentId))
        .limit(1)
      if (parent.length && parent[0].parentId) {
        throw new BadRequestException('2단계까지만 폴더를 생성할 수 있습니다.')
      }
    }

    const [folder] = await this.db
      .insert(schema.componentFolders)
      .values({
        name: dto.name,
        parentId: dto.parentId || null,
        icon: dto.icon || null,
        displayOrder: dto.displayOrder ?? 0,
      })
      .returning()

    return folder
  }

  async update(id: string, dto: UpdateComponentFolderDto) {
    const values: Record<string, any> = { updatedAt: new Date() }
    if (dto.name !== undefined) values.name = dto.name
    if (dto.icon !== undefined) values.icon = dto.icon

    const [folder] = await this.db
      .update(schema.componentFolders)
      .set(values)
      .where(eq(schema.componentFolders.id, id))
      .returning()

    return folder
  }

  async reorder(dto: ReorderFoldersDto) {
    for (const item of dto.folders) {
      await this.db
        .update(schema.componentFolders)
        .set({ displayOrder: item.displayOrder, updatedAt: new Date() })
        .where(eq(schema.componentFolders.id, item.id))
    }
    return { success: true }
  }

  async remove(id: string) {
    // 하위 폴더도 비활성화
    const children = await this.db
      .select()
      .from(schema.componentFolders)
      .where(
        and(
          eq(schema.componentFolders.parentId, id),
          eq(schema.componentFolders.isActive, true),
        ),
      )

    for (const child of children) {
      await this.db
        .update(schema.componentFolders)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(schema.componentFolders.id, child.id))

      // 하위 폴더의 컴포넌트 → 미분류
      await this.db
        .update(schema.components)
        .set({ folderId: null, updatedAt: new Date() })
        .where(eq(schema.components.folderId, child.id))
    }

    // 본인 비활성화
    await this.db
      .update(schema.componentFolders)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(schema.componentFolders.id, id))

    // 본인 소속 컴포넌트 → 미분류
    await this.db
      .update(schema.components)
      .set({ folderId: null, updatedAt: new Date() })
      .where(eq(schema.components.folderId, id))

    return { success: true }
  }
}
