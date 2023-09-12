import store from '../store/index'
const Store = store()

export default function authHeader () {
  const token = Store.getters['auth/authGetter'].token
  const isUserLoggedIn = Store.getters['auth/authGetter'].isUserLoggedIn
  if (token && isUserLoggedIn) {
    return {
      headers: {
        'authorization': token
      }
    }
  } else {
    return {
      headers: {
        'authorization': null
      }
    }
  }
}
