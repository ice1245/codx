'use strict';

/**
 *  network controller
 */

 const { createCoreController } = require('../../strapix')

module.exports = createCoreController('api::network.network', ({ strapi }) => {
  const codx = require('../../../codx')(strapi)
  return {
    async update ({ state: { user }, request: { body: { addFriend, addCompany } } }) {
      if (addFriend) {
        const { id, friends } = await codx.user.network(user)
        const { id: friendId } = await codx.user.findUserByName(addFriend)
        friends.push(friendId)
        const data = {
          friends
        }
        console.log("network", { user, id, addFriend, friendId, data })
        return strapi.$api('network').update(id, { data })
      }
      if (addCompany) {
        const { id, users = [] } = await strapi.$api('company').findMany({ filters: { name: addCompany }, populate: { users: true }})[0]
        users.push(user)
        return strapi.$api('company').update(id, { data: { users} })
      }
    }
  }
});
