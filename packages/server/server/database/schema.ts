import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  avatar: text('avatar').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

export const claudeLogs = sqliteTable('claude_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uuid: text('uuid').notNull().unique(),
  parentUuid: text('parent_uuid'),
  sessionId: text('session_id').notNull(),
  type: text('type').notNull(), // 'user' | 'assistant' | 'system'
  userType: text('user_type'),
  cwd: text('cwd'),
  version: text('version'),
  gitBranch: text('git_branch'),
  requestId: text('request_id'),
  isSidechain: integer('is_sidechain', { mode: 'boolean' }).default(false),
  messageRole: text('message_role'),
  messageContent: text('message_content', { mode: 'json' }),
  messageId: text('message_id'),
  messageModel: text('message_model'),
  messageUsage: text('message_usage', { mode: 'json' }),
  messageStopReason: text('message_stop_reason'),
  messageStopSequence: text('message_stop_sequence'),
  toolUseResult: text('tool_use_result', { mode: 'json' }),
  timestamp: text('timestamp').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})
