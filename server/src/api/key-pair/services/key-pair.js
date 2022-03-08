'use strict';

/**
 * key-pair service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::key-pair.key-pair');
