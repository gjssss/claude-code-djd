export default eventHandler(async (event) => {
  const { name, email, password, avatar } = await readBody(event)

  const user = await useDrizzle().insert(tables.users).values({
    name,
    email,
    password,
    avatar,
    createdAt: new Date(),
  }).returning().get()

  return user
})
