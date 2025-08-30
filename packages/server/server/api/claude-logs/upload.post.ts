import type { ClaudeLogInsert } from '../../utils/drizzle'

export default eventHandler(async (event) => {
  try {
    const form = await readMultipartFormData(event)

    if (!form || form.length === 0) {
      throw createError({
        statusCode: HTTP_STATUS.BAD_REQUEST,
        statusMessage: createErrorResponse(API_CODE.VALIDATION_ERROR, '缺少上传文件').message,
      })
    }

    const file = form.find(item => item.name === 'file')

    if (!file || !file.data) {
      throw createError({
        statusCode: HTTP_STATUS.BAD_REQUEST,
        statusMessage: createErrorResponse(API_CODE.VALIDATION_ERROR, '上传文件不能为空').message,
      })
    }

    const filename = file.filename || ''
    if (!filename.endsWith('.jsonl')) {
      throw createError({
        statusCode: HTTP_STATUS.BAD_REQUEST,
        statusMessage: createErrorResponse(API_CODE.VALIDATION_ERROR, '文件格式必须为 .jsonl').message,
      })
    }

    const content = file.data.toString('utf-8')
    const lines = content.trim().split('\n').filter(line => line.trim())

    const logs: ClaudeLogInsert[] = []
    const errors: Array<{ line: number, error: string }> = []

    for (let i = 0; i < lines.length; i++) {
      try {
        const line = lines[i]
        if (!line)
          continue
        const logData = JSON.parse(line)

        // 验证必需字段
        if (!logData.uuid || !logData.sessionId || !logData.type || !logData.timestamp) {
          errors.push({
            line: i + 1,
            error: '缺少必需字段：uuid, sessionId, type, timestamp',
          })
          continue
        }

        // 解析并转换日志数据
        const log: ClaudeLogInsert = {
          uuid: logData.uuid,
          parentUuid: logData.parentUuid || null,
          sessionId: logData.sessionId,
          type: logData.type,
          userType: logData.userType || null,
          cwd: logData.cwd || null,
          version: logData.version || null,
          gitBranch: logData.gitBranch || null,
          requestId: logData.requestId || null,
          isSidechain: logData.isSidechain || false,
          messageRole: logData.message?.role || null,
          messageContent: logData.message ? JSON.stringify(logData.message.content) : null,
          messageId: logData.message?.id || null,
          messageModel: logData.message?.model || null,
          messageUsage: logData.message?.usage ? JSON.stringify(logData.message.usage) : null,
          messageStopReason: logData.message?.stop_reason || null,
          messageStopSequence: logData.message?.stop_sequence || null,
          toolUseResult: logData.toolUseResult ? JSON.stringify(logData.toolUseResult) : null,
          timestamp: logData.timestamp,
          createdAt: new Date(),
        }

        logs.push(log)
      }
      catch (parseError) {
        errors.push({
          line: i + 1,
          error: `JSON 解析错误: ${(parseError as Error).message}`,
        })
      }
    }

    if (errors.length > 0) {
      return createErrorResponse(API_CODE.VALIDATION_ERROR, `文件解析失败，共 ${errors.length} 行错误`)
    }

    // 批量插入数据库
    let insertedCount = 0
    for (const log of logs) {
      try {
        await useDrizzle().insert(tables.claudeLogs).values(log).onConflictDoNothing()
        insertedCount++
      }
      catch (dbError) {
        console.error('数据库插入错误:', dbError)
      }
    }

    return createSuccessResponse({
      totalLines: lines.length,
      parsedLogs: logs.length,
      insertedCount,
      errors: errors.length,
      filename,
    }, `成功上传日志文件，插入 ${insertedCount} 条记录`)
  }
  catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      statusMessage: createErrorResponse(API_CODE.INTERNAL_ERROR, '上传文件失败').message,
    })
  }
})
