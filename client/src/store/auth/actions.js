export function setToken ({ commit }, token) {
  if (!token) {
    return
  }
  const now = new Date()
  const expirationDate = new Date(now.getTime() + 30 * 24 * 3600 * 1000)
  localStorage.setItem('token', token)
  localStorage.setItem('expirationDate', expirationDate)
  commit('setToken', token)
}

export function setUser ({ commit }, user) {
  commit('setUser', user)
  localStorage.setItem('user', JSON.stringify(user))
}

export function setBaseUrl ({ commit }, baseURL) {
  commit('setBaseUrl', baseURL)
}

export function updateUserInfo ({ commit }, data) {
  const user = JSON.parse(localStorage.getItem('user'))
  if (data.name) {
    user.name = data.name
  }
  if (data.avatar) {
    user.avatar = data.avatar
  }
  localStorage.setItem('user', JSON.stringify(user))
  commit('setUser', user)
}

export function tryAutoLogin ({ commit }) {
  const token = localStorage.getItem('token')
  if (!token) {
    return
  }
  const expirationDate = localStorage.getItem('expirationDate')
  const now = new Date()
  const time = new Date(now.getTime())
  if (time <= expirationDate) {
    return
  }
  const user = JSON.parse(localStorage.getItem('user'))
  commit('setToken', token)
  commit('setUser', user)
}

export function logout ({ commit }) {
  commit('clearAuth')
  localStorage.removeItem('expirationDate')
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}
