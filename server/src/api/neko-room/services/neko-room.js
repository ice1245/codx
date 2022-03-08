'use strict';

/**
 * neko-room service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::neko-room.neko-room');
