export function setToken (state, token) {
  state.token = token
  if (token) {
    state.isUserLoggedIn = true
  } else {
    state.isUserLoggedIn = false
  }
}

export function setUser (state, user) {
  state.user = user
}

export function setBaseUrl (state, baseURL) {
  state.baseURL = baseURL
}

export function clearAuth (state) {
  state.token = null
  state.user = null
  state.isUserLoggedIn = false
  state.isAdmin = false
}
