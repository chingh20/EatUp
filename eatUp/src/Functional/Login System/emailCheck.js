export function emailCheck(email) {
  const re = /\S+@\S+\.\S+/
  if (!email) return "Email can't be empty!"
  if (!re.test(email)) return 'Invalid email address!'
  return ''
}