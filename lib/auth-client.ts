// Client-side authentication utilities

export const getToken = () => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

export const setToken = (token: string) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('token', token)
}

export const removeToken = () => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('token')
}

export const getUser = () => {
  if (typeof window === 'undefined') return null
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}

export const setUser = (user: any) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('user', JSON.stringify(user))
}

export const removeUser = () => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('user')
}

export const logout = () => {
  removeToken()
  removeUser()
  window.location.href = '/'
}

