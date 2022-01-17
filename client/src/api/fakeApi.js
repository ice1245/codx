const user = {
  id: "0000-0000",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  username: "test"
}
export default {
  post (url) {
    if (url === "api/auth/local") {
      return Promise.resolve({
        data: {
          user: {},
          jwt: "000-0000-0000-0000"
        }
      })
    }
  },
  get (url) {
    if (url.endsWith("auth")) {
      return Promise.resolve({
        data: {
          user,
          jwt: "000-0000-0000-0000"
        }
      })
    }
  }
}