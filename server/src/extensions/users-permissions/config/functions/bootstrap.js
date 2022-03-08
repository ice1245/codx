strapi.db.lifecycles.subscribe({
  models: ['plugin::users-permissions.user'],
  async afterCreate(event) {
    // afterCreate lifeclcyle
  },
  async beforeCreate(event) {
    // beforeCreate lifeclcyle
  },
});