import { useFetch } from "@/api/useFetch";


class Strapi {
  token = null
  get headers () {
    const { token } = this
    return {
      "Authorization": "Bearer " + token
    }
  }
  me (token) {
    this.token = token
    const { headers } = this
    return token ? useFetch.get("api/users/me", { headers }) : null
  }

  async login (payload) {
    return useFetch
      .post("api/auth/local", payload)
  }

  async register (payload) {
    return useFetch
      .post("api/auth/local/register", payload)
  }

  async createChat (chatSettings) {
    const { headers } = this
    return useFetch.post("api/chats", chatSettings, { headers })
  }

  async loadChat (id) {
    const { headers } = this
    return useFetch.get(`api/chats/${id}?populate=admins,guests`, { headers })
  }

  async sendMessage(chatMessage) {
    const { headers } = this
    return useFetch.post("api/chat-messages", chatMessage, { headers })
  }
}

export default new Strapi()
