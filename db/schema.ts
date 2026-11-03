import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const inquiries = sqliteTable('inquiries', {
 id: integer('id').primaryKey({ autoIncrement: true }),
 name: text('name').notNull(), email: text('email').notNull(), phone: text('phone').notNull().default(''),
 company: text('company').notNull(), companySize: text('company_size').notNull(), department: text('department').notNull(),
 message: text('message').notNull(), createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});
