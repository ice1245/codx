module.exports = ({ env }) => {
  const server = {
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1337),
    url: env("BASE_URL", '')
  }
  console.log("SERVER CONF: ", server)
  return server
}
