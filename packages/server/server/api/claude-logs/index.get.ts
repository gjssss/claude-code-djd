import { and, desc, eq, isNotNull, isNull, like, sql } from 'drizzle-orm'

function safeJsonParse(jsonString: string | null | undefined): any {
  if (!jsonString)
    return null
  try {
    return JSON.parse(jsonString)
  }
  catch {
    return jsonString
  }
}

export default eventHandler(async (event) => {
  try {
    const query = getQuery(event)

    // 分页参数
    const page = Math.max(1, Number(query.page) || 1)
    const pageSize = Math.min(100, Math.max(1, Number(query.pageSize) || 20))
    const offset = (page - 1) * pageSize

    // 筛选条件
    const sessionId = query.sessionId as string
    const type = query.type as string // 'user' | 'assistant' | 'system'
    const search = query.search as string // 搜索消息内容
    const parentUuid = query.parentUuid as string
    const hasParent = query.hasParent // 'true' | 'false' | undefined

    // 构建查询条件
    const conditions = []

    if (sessionId) {
      conditions.push(eq(tables.claudeLogs.sessionId, sessionId))
    }

    if (type) {
      conditions.push(eq(tables.claudeLogs.type, type))
    }

    if (search) {
      conditions.push(like(tables.claudeLogs.messageContent, `%${search}%`))
    }

    if (parentUuid) {
      conditions.push(eq(tables.claudeLogs.parentUuid, parentUuid))
    }

    if (hasParent === 'true') {
      conditions.push(isNotNull(tables.claudeLogs.parentUuid))
    }
    else if (hasParent === 'false') {
      conditions.push(isNull(tables.claudeLogs.parentUuid))
    }

    const whereCondition = conditions.length > 0 ? and(...conditions) : undefined

    // 查询总数
    const countResult = await useDrizzle()
      .select({ count: sql<number>`count(*)` })
      .from(tables.claudeLogs)
      .where(whereCondition)

    const count = countResult[0]?.count ?? 0

    // 查询数据
    const logs = await useDrizzle()
      .select()
      .from(tables.claudeLogs)
      .where(whereCondition)
      .orderBy(desc(tables.claudeLogs.timestamp))
      .limit(pageSize)
      .offset(offset)

    // 转换数据格式
    const formattedLogs = logs.map(log => ({
      ...log,
      messageContent: safeJsonParse(log.messageContent as string | null),
      messageUsage: safeJsonParse(log.messageUsage as string | null),
      toolUseResult: safeJsonParse(log.toolUseResult as string | null),
    }))

    return createPaginationResponse(
      formattedLogs,
      count,
      page,
      pageSize,
      '查询日志成功',
    )
  }
  catch {
    throw createError({
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      statusMessage: createErrorResponse(API_CODE.INTERNAL_ERROR, '查询日志失败').message,
    })
  }
})
