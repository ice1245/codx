module.exports = ({ env }) => {
  const server = {
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1337),
    url: env("BASE_URL", ''),
    NEKO_ROOMS_TRAEFIK_DOMAIN: env('NEKO_ROOMS_TRAEFIK_DOMAIN')
  }
  console.log("SERVER CONF: ", server)
  return server
}
