const { createCoreController: $createCoreController } = require('@strapi/strapi').factories;
const { createCoreService: $createCoreService } = require('@strapi/strapi').factories;

function injectApi (params) {
  const { strapi } = params
  strapi.$api = id => {
    const strapiServices = Object.keys(strapi.services)
    const sid = strapiServices.filter(s => s.endsWith(id))[0]
    const service = strapi.services[sid]
    if (!service) {
      throw new Error("STRAPIX: Service not found <" + id + "> " + " sid < " + sid + "> " + strapiServices)
    }
    return service
  }
  strapi.$query = id => {
    const strapiServices = Object.keys(strapi.services)
    // console.log("strapiServices", strapiServices)
    const sid = strapiServices.filter(s => s.endsWith(id))[0]
    return {
      findMany: (...params) => strapi.entityService.findMany(...[sid, ...params]),
      findOne: (...params) => strapi.entityService.findOne(...[sid, ...params]),
      create: (...params) => strapi.entityService.create(...[sid, ...params]),
      update: (...params) => strapi.entityService.update(...[sid, ...params]),
      delete: (...params) => strapi.entityService.delete(...[sid, ...params])
    }
  }
  return params
}

function createCoreController (id, cfg) {
  return $createCoreController(id, params => {
    return cfg(injectApi(params))
  })
}

function createCoreService (id, cfg) {
  return $createCoreService(id, params => {
    return cfg(injectApi(params))
  })
}

module.exports = {
  createCoreController,
  createCoreService
}