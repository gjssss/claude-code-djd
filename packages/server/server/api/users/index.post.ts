export default eventHandler(async (event) => {
  try {
    const { name, email, password, avatar } = await readBody(event)

    if (!name || !email || !password) {
      throw createError({
        statusCode: HTTP_STATUS.BAD_REQUEST,
        statusMessage: createErrorResponse(API_CODE.VALIDATION_ERROR, '缺少必需参数').message,
      })
    }

    const user = await useDrizzle().insert(tables.users).values({
      name,
      email,
      password,
      avatar,
      createdAt: new Date(),
    }).returning().get()

    return createSuccessResponse(user, '创建用户成功')
  }
  catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      statusMessage: createErrorResponse(API_CODE.INTERNAL_ERROR, '创建用户失败').message,
    })
  }
})
