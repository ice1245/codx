const axios = require('axios')
const cloudConfig = require('../cloud-config')
const v4 = require('uuid').v4

module.exports = ({ token: API_TOKEN, apiUrl }) => {
  // https://docs.hetzner.cloud/
  const api = axios.create({
    baseURL: apiUrl,
  });
  const headers = {
    headers: {
      "Authorization": "Bearer " + API_TOKEN
    }
  }
  
  const processError = error => {
    if (error.response) {
      const { response: { statusText, data, config: { url } } } = error
      console.log("hetzner error", {
        url,
        statusText,
        data
      })
    } else {
      console.log("hetzner", "error", { API_TOKEN, apiUrl, error })
    }
    throw error
  }

  const get = path => {
    return api.get(path, headers).catch(processError)
  }
  const post = (path, data) => {
    return api.post(path, data, headers).catch(processError)
  }
  const _delete = (path) => {
    return api.delete(path, headers).catch(processError)
  }

  return {
    async createRoom ({ room }) {
      const config = Object.assign({
        "automount": false,
        "firewalls": [],
        "image": "ubuntu-20.04",
        "labels": {},
        "location": "nbg1",
        "name": null,
        "networks": [],
        "placement_group": 21430,
        "server_type": "cx11",
        "ssh_keys": [],
        "start_after_create": true,
        "user_data": cloudConfig['codx-room'](room),
        "volumes": [],
        "root_password": `${v4()}`.slice(0, 4)
      }, room)
      const { data } = await post('/servers', config)
      return {
        config,
        data
      }
    },
    async deleteRoom({ data: { server: { id } } }) {
      const { data } = await _delete('/servers/' + id)
      return data
    }
  }
}