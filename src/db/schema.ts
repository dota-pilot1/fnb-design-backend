import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ─── 컴포넌트 갤러리 ───

export const componentFolders = pgTable('component_folders', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  parentId: uuid('parent_id'),
  displayOrder: integer('display_order').default(0).notNull(),
  icon: text('icon'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const components = pgTable('components', {
  id: uuid('id').defaultRandom().primaryKey(),
  folderId: uuid('folder_id'),
  title: text('title').notNull(),
  description: text('description'),
  code: text('code').notNull(),
  previewCode: text('preview_code'),
  dependencies: text('dependencies'),
  displayOrder: integer('display_order').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdBy: uuid('created_by'),
  updatedBy: uuid('updated_by'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});
