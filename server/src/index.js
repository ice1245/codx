'use strict';
const session = require("koa-session2")
const ioManager = require('./io')

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    strapi.io = new ioManager(strapi)
    strapi.server.use(session({
      secret: "grant",
    }))
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    // https://docs.strapi.io/developer-docs/latest/development/backend-customization/models.html#hook-event-object
    strapi.db.lifecycles.subscribe({
      models: ['plugin::users-permissions.user'],
      async beforeCreate(event) {
        const { data } = event.params;
        if (!data.avatar) {
          data.avatar = `https://avatars.dicebear.com/api/adventurer/${data.username}.svg`
        }
      },
    });
  },
};
