'use strict';

/**
 *  neko-room controller
 */

const { createCoreController } = require('../../strapix')
const nekoRooms = require('../../../neko-rooms')

module.exports = createCoreController('api::neko-room.neko-room', ({ strapi }) => ({
  async create ({ request: { body }, state: { user } }) {
    let { chat = {}, settings: roomSettings } = body
    chat = chat.id ? await strapi.$api('chat').findOne(chat.id) : null
    const { repository, folder } = roomSettings
    const settings = {
      admin_pass: "td9o3",
      user_pass: "w2gzu",
      audio_bitrate: 128,
      audio_codec: "OPUS",
      audio_pipeline: "",
      broadcast_pipeline: "",
      control_protection: false,
      envs: {},
      implicit_control: true,
      max_connections: 10,
      mounts: [],
      name: "",
      neko_image: "codx/room:latest",
      screen: "1280x720@30",
      video_bitrate: 3072,
      video_codec: "VP8",
      video_max_fps: 25,
      video_pipeline: "",
      envs: {
        GIT_REPO_PROJECT: repository,
        GIT_REPO_FOLDER: folder,
        ...user.envs
      }
    }
    const room = await nekoRooms.create(settings)
    return await strapi.$api('neko-room').create({ data: {
      chat,
      settings,
      room
    }})
  },
  async find ({ state: { user }}) {
    return await strapi.$query('neko-room').findMany({
      filters: {
        chat: {
          $or: [
            { admins: user },
            { guests: user }
          ]
        }
      }
    })
  }
}));
