export default eventHandler(async () => {
  const todos = await useDrizzle().select().from(tables.users).all()

  return todos
})
