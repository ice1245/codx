module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '3f5289fd42c3eeb9e28956c6aca49377'),
  },
});
