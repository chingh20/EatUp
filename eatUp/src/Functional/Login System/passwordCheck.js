export function passwordCheck(password) {
  if (!password) return "Password can't be empty!"
  if (password.length < 8) return 'Password must be at least 8 characters long!'
  return ''
}