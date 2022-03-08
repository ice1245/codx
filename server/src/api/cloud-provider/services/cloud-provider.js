'use strict';

/**
 * cloud-provider service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::cloud-provider.cloud-provider');
