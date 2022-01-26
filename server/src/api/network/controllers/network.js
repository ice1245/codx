'use strict';

/**
 *  network controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const { NETWORK_SERVICE } = require('../../constants')

module.exports = createCoreController(NETWORK_SERVICE);
