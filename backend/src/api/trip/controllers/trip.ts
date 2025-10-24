/**
 * trip controller
 */

export default {
  async craft(ctx) {
    try {
      strapi.log.info('=== Trip Craft Controller ===');
      strapi.log.info(`Received query params: ${JSON.stringify(ctx.query)}`);

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
        strapi.log.warn('Missing required parameters');
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

      strapi.log.info(`Parsed params: ${JSON.stringify(params)}`);

      // Validate numeric values
      if (params.numberOfDays <= 0 || params.adults < 0 || params.children < 0) {
        return ctx.badRequest('Invalid parameter values');
      }

      if (params.adults === 0 && params.children === 0) {
        return ctx.badRequest('At least one adult or child is required');
      }

      // Call service to calculate budget
      strapi.log.info('Calling calculateBudget service...');
      const budgetData = await strapi.service('api::trip.trip').calculateBudget(params);

      strapi.log.info('Budget calculation complete. Returning response...');
      strapi.log.info(`Response data: ${JSON.stringify(budgetData)}`);

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
