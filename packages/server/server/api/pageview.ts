import { createSuccessResponse } from '../utils/response'

const startAt = Date.now()
let count = 0

export default defineEventHandler(() => {
  return createSuccessResponse({
    pageview: count++,
    startAt,
  })
})
