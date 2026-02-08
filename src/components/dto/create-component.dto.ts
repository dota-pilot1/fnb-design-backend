export class CreateComponentDto {
  folderId?: string
  title: string
  description?: string
  code: string
  previewCode?: string
  dependencies?: string
  displayOrder?: number
}
