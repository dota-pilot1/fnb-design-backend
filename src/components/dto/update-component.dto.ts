export class UpdateComponentDto {
  title?: string
  description?: string
  code?: string
  previewCode?: string
  dependencies?: string
  displayOrder?: number
}

export class MoveComponentDto {
  folderId: string | null
}
