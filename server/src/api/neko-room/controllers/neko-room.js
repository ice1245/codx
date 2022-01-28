'use strict';

/**
 *  neko-room controller
 */

const { createCoreController } = require('../../strapix')
const nekoRooms = require('../../../neko-rooms')

module.exports = createCoreController('api::neko-room.neko-room', ({ strapi }) => ({
  async create ({ request: { body }, state: { user } }) {
    const chat = await strapi.$api('chat').findOne(body.chat.id)
    const settings = {
      admin_pass: "td9o3",
      user_pass: "w2gzu",
      audio_bitrate: 128,
      audio_codec: "OPUS",
      audio_pipeline: "",
      broadcast_pipeline: "",
      control_protection: false,
      envs: {},
      implicit_control: false,
      max_connections: 10,
      mounts: [],
      name: "",
      neko_image: "m1k1o/neko:firefox",
      screen: "1280x720@30",
      video_bitrate: 3072,
      video_codec: "VP8",
      video_max_fps: 25,
      video_pipeline: ""
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
