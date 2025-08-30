import { desc, sql } from 'drizzle-orm'

export default eventHandler(async (_event) => {
  try {
    // 获取所有会话的统计信息
    const sessions = await useDrizzle()
      .select({
        sessionId: tables.claudeLogs.sessionId,
        messageCount: sql`count(*)`,
        userMessageCount: sql`count(case when type = 'user' then 1 end)`,
        assistantMessageCount: sql`count(case when type = 'assistant' then 1 end)`,
        systemMessageCount: sql`count(case when type = 'system' then 1 end)`,
        firstTimestamp: sql`min(timestamp)`,
        lastTimestamp: sql`max(timestamp)`,
        version: sql`max(version)`,
        cwd: sql`max(cwd)`,
        gitBranch: sql`max(git_branch)`,
      })
      .from(tables.claudeLogs)
      .groupBy(tables.claudeLogs.sessionId)
      .orderBy(desc(sql`max(timestamp)`))

    return createSuccessResponse(sessions, '获取会话列表成功')
  }
  catch {
    throw createError({
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      statusMessage: createErrorResponse(API_CODE.INTERNAL_ERROR, '获取会话列表失败').message,
    })
  }
})
