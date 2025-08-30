import process from 'node:process'
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'

import * as schema from '../database/schema'

export { and, eq, or, sql } from 'drizzle-orm'

export const tables = schema
export function useDrizzle() {
  return drizzle(createClient({ url: process.env.DATABASE_URL! }), { schema })
}

export type User = typeof schema.users.$inferSelect
export type ClaudeLog = typeof schema.claudeLogs.$inferSelect
export type ClaudeLogInsert = typeof schema.claudeLogs.$inferInsert
