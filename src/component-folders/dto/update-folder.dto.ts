export class UpdateComponentFolderDto {
  name?: string
  icon?: string
}

export class ReorderFoldersDto {
  folders: { id: string; displayOrder: number }[]
}
