export const validateUserName = (username) => {
  const regex = new RegExp('^[a-z0-9_-]+([_-]?[a-z0-9_-])*$')
  return regex.test(username)
}