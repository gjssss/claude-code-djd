import { eq } from 'drizzle-orm'

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
    const uuid = getRouterParam(event, 'uuid')

    if (!uuid) {
      throw createError({
        statusCode: HTTP_STATUS.BAD_REQUEST,
        statusMessage: createErrorResponse(API_CODE.VALIDATION_ERROR, '缺少日志UUID').message,
      })
    }

    const log = await useDrizzle()
      .select()
      .from(tables.claudeLogs)
      .where(eq(tables.claudeLogs.uuid, uuid))
      .get()

    if (!log) {
      throw createError({
        statusCode: HTTP_STATUS.NOT_FOUND,
        statusMessage: createErrorResponse(API_CODE.NOT_FOUND, '日志不存在').message,
      })
    }

    // 转换数据格式
    const formattedLog = {
      ...log,
      messageContent: safeJsonParse(log.messageContent as string | null),
      messageUsage: safeJsonParse(log.messageUsage as string | null),
      toolUseResult: safeJsonParse(log.toolUseResult as string | null),
    }

    return createSuccessResponse(formattedLog, '获取日志详情成功')
  }
  catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      statusMessage: createErrorResponse(API_CODE.INTERNAL_ERROR, '获取日志详情失败').message,
    })
  }
})
