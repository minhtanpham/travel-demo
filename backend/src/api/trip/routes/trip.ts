/**
 * trip router
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/trip/craft',
      handler: 'trip.craft',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
