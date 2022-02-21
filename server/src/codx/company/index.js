module.exports = strapi => {
  const codx = this
  return {
    async companies ({ id }, { populate = {} } = {}) {
      return strapi.$query('company').findMany({
        filters: {
          $or: [
            { users: [id] },
            { admins: [id] }
            ]
          }
        },
        populate
      )
    }
  }
}