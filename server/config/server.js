module.exports = ({ env }) => {
  const server = {
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1337),
    url: env("BASE_URL", ''),
    NEKO_ROOMS_TRAEFIK_DOMAIN: env('NEKO_ROOMS_TRAEFIK_DOMAIN'),
    PROXY_TLS_RESOLVER: env('PROXY_TLS_RESOLVER'),
    API_TOKEN: env('API_TOKEN')
  }
  return server
}
