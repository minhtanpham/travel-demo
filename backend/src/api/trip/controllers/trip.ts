/**
 * trip controller
 */

export default {
  async craft(ctx) {
    try {
      const {
        startDate,
        numberOfDays,
        adults,
        children,
        includeRestaurant,
        includeVehicle,
      } = ctx.query;

      // Validate required parameters
      if (!startDate || !numberOfDays || !adults) {
        return ctx.badRequest('Missing required parameters: startDate, numberOfDays, adults');
      }

      // Parse and validate parameters
      const params = {
        startDate: startDate as string,
        numberOfDays: parseInt(numberOfDays as string, 10),
        adults: parseInt(adults as string, 10),
        children: parseInt((children as string) || '0', 10),
        includeRestaurant: includeRestaurant === 'true',
        includeVehicle: includeVehicle === 'true',
      };

      // Validate numeric values
      if (params.numberOfDays <= 0 || params.adults < 0 || params.children < 0) {
        return ctx.badRequest('Invalid parameter values');
      }

      if (params.adults === 0 && params.children === 0) {
        return ctx.badRequest('At least one adult or child is required');
      }

      // Call service to calculate budget
      const budgetData = await strapi.service('api::trip.trip').calculateBudget(params);

      return ctx.send({
        data: budgetData,
        meta: {
          query: params,
        },
      });
    } catch (error) {
      strapi.log.error('Error in trip craft controller:', error);
      ctx.throw(500, error);
    }
  },
};
