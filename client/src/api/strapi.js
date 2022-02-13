import { useFetch } from "@/api/useFetch"


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
      .post("api/auth/local/register", { ...payload, username: payload.identifier, password: 'disabled' })
  }

  async createChat (chatSettings) {
    const { headers } = this
    return useFetch.post("api/chats", chatSettings, { headers })
  }

  async deleteChat (chat) {
    const { headers } = this
    return useFetch.delete("api/chats/" + chat.id, { headers })
  }

  async loadChat (id) {
    const { headers } = this
    return useFetch.get(`api/chats/${id}?populate=admins,guests`, { headers })
  }

  async sendMessage(chatMessage) {
    const { headers } = this
    return useFetch.post("api/chat-messages", chatMessage, { headers })
  }

  async chatAddUser({ chat, user }) {
    const { headers } = this
    return useFetch.put("api/chats/" + chat.id, { guest: user }, { headers })
  }

  async createClinic ({ chat, settings }) {
    const { headers } = this
    return useFetch.post("api/neko-rooms", { chat, settings }, { headers })
  }

  async deleteClinic({ id }) {
    const { headers } = this
    return useFetch.delete("api/neko-rooms/" + id, { headers })
  }

  async findClinics () {
    const { headers } = this
    return useFetch.get("api/neko-rooms", { headers })
  }

  async search (query = { name: "*" }) {
    const { headers } = this
    const search = Object.keys(query).map(k => `${k}=${query[k]}`).join("&")
    return useFetch.get(`api/clinic-templates?${search}`, { headers })
  }

  async createChanne (channel) {
    const { headers } = this
    return useFetch.post("api/channels", channel, { headers })
  }
}

export default new Strapi()
