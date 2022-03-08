'use strict';

/**
 * cloud-provider router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::cloud-provider.cloud-provider');
