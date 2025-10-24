/**
 * trip service
 */

export default () => ({
  async calculateBudget(params: {
    startDate: string;
    numberOfDays: number;
    adults: number;
    children: number;
    includeRestaurant: boolean;
    includeVehicle: boolean;
  }) {
    const {
      numberOfDays,
      adults,
      children,
      includeRestaurant,
      includeVehicle,
    } = params;
    const totalPeople = adults + children;

    strapi.log.info('=== Trip Service Debug ===');
    strapi.log.info(`Input params: ${JSON.stringify(params)}`);

    // Fetch all stays, restaurants, and vehicles
    // Try to fetch all data first to check if any exists
    const allStays = await strapi.entityService.findMany("api::stay.stay", {
      fields: ["pricing", "publishedAt", "name"],
    });
    strapi.log.info(`Total stays in database: ${allStays.length}`);
    strapi.log.info(`All stays data: ${JSON.stringify(allStays)}`);

    // In Strapi 5, we need to use status: 'published' in the filters
    const stays = await strapi.entityService.findMany("api::stay.stay", {
      status: 'published',
      fields: ["pricing"],
    });
    strapi.log.info(`Published stays: ${stays.length}`);
    strapi.log.info(`Published stays data: ${JSON.stringify(stays)}`);

    const restaurants = includeRestaurant
      ? await strapi.entityService.findMany("api::restaurant.restaurant", {
          status: 'published',
          fields: ["pricing"],
        })
      : [];

    const vehicles = includeVehicle
      ? await strapi.entityService.findMany("api::vehicle.vehicle", {
          status: 'published',
          fields: ["pricing"],
        })
      : [];

    strapi.log.info(`Fetched stays: ${stays.length} items - ${JSON.stringify(stays)}`);
    strapi.log.info(`Fetched restaurants: ${restaurants.length} items - ${JSON.stringify(restaurants)}`);
    strapi.log.info(`Fetched vehicles: ${vehicles.length} items - ${JSON.stringify(vehicles)}`);

    // Calculate stay costs (per night * number of days)
    const stayCosts = stays.map((stay: any) => stay.pricing * numberOfDays);
    const minStayCost = stayCosts.length > 0 ? Math.min(...stayCosts) : 0;
    const maxStayCost = stayCosts.length > 0 ? Math.max(...stayCosts) : 0;

    // Calculate restaurant costs (pricing * number of days)
    let minRestaurantCost = 0;
    let maxRestaurantCost = 0;
    if (includeRestaurant && restaurants.length > 0) {
      const restaurantCosts = restaurants.map(
        (r: any) => r.pricing * numberOfDays
      );
      minRestaurantCost = Math.min(...restaurantCosts);
      maxRestaurantCost = Math.max(...restaurantCosts);
    }

    // Calculate vehicle costs (per day * number of days)
    let minVehicleCost = 0;
    let maxVehicleCost = 0;
    if (includeVehicle && vehicles.length > 0) {
      const vehiclePrices = vehicles.map((v: any) => v.pricing);
      minVehicleCost = Math.min(...vehiclePrices) * numberOfDays;
      maxVehicleCost = Math.max(...vehiclePrices) * numberOfDays;
    }

    // Calculate total budgets
    const minTotalBudget = minStayCost + minRestaurantCost + minVehicleCost;
    const maxTotalBudget = maxStayCost + maxRestaurantCost + maxVehicleCost;

    // Calculate average per person
    const minAvgPerPerson = totalPeople > 0 ? minTotalBudget / totalPeople : 0;
    const maxAvgPerPerson = totalPeople > 0 ? maxTotalBudget / totalPeople : 0;

    strapi.log.info('Calculated costs:');
    strapi.log.info(`- Min stay cost: ${minStayCost}`);
    strapi.log.info(`- Max stay cost: ${maxStayCost}`);
    strapi.log.info(`- Min restaurant cost: ${minRestaurantCost}`);
    strapi.log.info(`- Max restaurant cost: ${maxRestaurantCost}`);
    strapi.log.info(`- Min vehicle cost: ${minVehicleCost}`);
    strapi.log.info(`- Max vehicle cost: ${maxVehicleCost}`);
    strapi.log.info(`- Min total budget: ${minTotalBudget}`);
    strapi.log.info(`- Max total budget: ${maxTotalBudget}`);

    return [
      {
        type: "minimum",
        totalBudget: parseFloat(minTotalBudget.toFixed(2)),
        avgBudgetPerPerson: parseFloat(minAvgPerPerson.toFixed(2)),
        breakdown: {
          stay: parseFloat(minStayCost.toFixed(2)),
          restaurant: parseFloat(minRestaurantCost.toFixed(2)),
          vehicle: parseFloat(minVehicleCost.toFixed(2)),
        },
      },
      {
        type: "maximum",
        totalBudget: parseFloat(maxTotalBudget.toFixed(2)),
        avgBudgetPerPerson: parseFloat(maxAvgPerPerson.toFixed(2)),
        breakdown: {
          stay: parseFloat(maxStayCost.toFixed(2)),
          restaurant: parseFloat(maxRestaurantCost.toFixed(2)),
          vehicle: parseFloat(maxVehicleCost.toFixed(2)),
        },
      },
    ];
  },
});
