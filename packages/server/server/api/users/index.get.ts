export default eventHandler(async () => {
  try {
    const users = await useDrizzle().select().from(tables.users).all()

    return createSuccessResponse(users, '获取用户列表成功')
  }
  catch {
    throw createError({
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      statusMessage: createErrorResponse(API_CODE.INTERNAL_ERROR, '获取用户列表失败').message,
    })
  }
})
