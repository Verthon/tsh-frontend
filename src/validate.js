export const validateUserName = (username) => {
  const regex = new RegExp('^[a-zA-Z0-9_-]+([_-]?[a-z0-9_-])*$')
  return regex.test(username.toLowerCase())
}