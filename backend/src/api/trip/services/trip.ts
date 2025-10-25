/**
 * trip service
 */

import type { Core } from '@strapi/strapi';

interface ServiceCategory {
  name: string;
  apiPath: string;
  required: boolean;
  enabled?: boolean;
  multiplyByDays: boolean;
}

interface CategoryPricing {
  [key: string]: number[];
}

interface CategoryCosts {
  [key: string]: number;
}

interface Combination {
  total: number;
  breakdown: CategoryCosts;
}

interface BudgetOption {
  type: string;
  totalBudget: number;
  avgBudgetPerPerson: number;
  breakdown: CategoryCosts;
}

export default ({ strapi }: { strapi: Core.Strapi }) => ({
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

    // Define service categories configuration
    // Easy to extend: just add new categories here
    const serviceCategories: ServiceCategory[] = [
      {
        name: 'stay',
        apiPath: 'api::stay.stay',
        required: true, // Always fetch stays
        multiplyByDays: true,
      },
      {
        name: 'restaurant',
        apiPath: 'api::restaurant.restaurant',
        required: false,
        enabled: includeRestaurant,
        multiplyByDays: true,
      },
      {
        name: 'vehicle',
        apiPath: 'api::vehicle.vehicle',
        required: false,
        enabled: includeVehicle,
        multiplyByDays: true,
      },
      // Future categories can be added here easily:
      // {
      //   name: 'tour',
      //   apiPath: 'api::tour.tour',
      //   required: false,
      //   enabled: includeTour,
      //   multiplyByDays: false,
      // },
    ];

    // Fetch and calculate costs for all categories
    const categoryPricing: CategoryPricing = {};

    for (const category of serviceCategories) {
      // Skip if not required and not enabled
      if (!category.required && !category.enabled) {
        categoryPricing[category.name] = [0];
        continue;
      }

      // Fetch items from Strapi
      const items = await strapi.entityService.findMany(category.apiPath as any, {
        status: 'published' as any,
        fields: ['pricing'],
      }) as any[];

      // Calculate costs
      const costs: number[] = items.map((item: any) =>
        category.multiplyByDays ? item.pricing * numberOfDays : item.pricing
      );

      // Get unique costs sorted
      const uniqueCosts: number[] = Array.from(new Set(costs)).sort((a: number, b: number) => a - b);
      categoryPricing[category.name] = uniqueCosts.length > 0 ? uniqueCosts : [0];
    }

    // Get min and max for each category
    const minCosts: CategoryCosts = {};
    const maxCosts: CategoryCosts = {};
    for (const category of serviceCategories) {
      const costs = categoryPricing[category.name];
      minCosts[category.name] = costs[0];
      maxCosts[category.name] = costs[costs.length - 1];
    }

    // Calculate total min and max budgets
    const minTotalBudget = Object.values(minCosts).reduce((sum: number, cost: number) => sum + cost, 0);
    const maxTotalBudget = Object.values(maxCosts).reduce((sum: number, cost: number) => sum + cost, 0);

    const minAvgPerPerson = totalPeople > 0 ? minTotalBudget / totalPeople : 0;
    const maxAvgPerPerson = totalPeople > 0 ? maxTotalBudget / totalPeople : 0;

    // Generate all possible combinations dynamically
    const generateCombinations = (categories: ServiceCategory[], categoryPricing: CategoryPricing): Combination[] => {
      const combinations: Combination[] = [];

      // Get all pricing options for each category
      const pricingArrays = categories.map(cat => categoryPricing[cat.name]);

      // Recursive function to generate all combinations
      const combine = (index: number, currentBreakdown: CategoryCosts): void => {
        if (index === categories.length) {
          const total = Object.values(currentBreakdown).reduce((sum: number, cost: number) => sum + cost, 0);
          combinations.push({ total, breakdown: { ...currentBreakdown } });
          return;
        }

        const category = categories[index];
        const prices = pricingArrays[index];

        for (const price of prices) {
          combine(index + 1, { ...currentBreakdown, [category.name]: price });
        }
      };

      combine(0, {});
      return combinations;
    };

    const allCombinations = generateCombinations(serviceCategories, categoryPricing);

    // Remove duplicates and sort by total
    const uniqueCombinations = Array.from(
      new Map(allCombinations.map(item => [item.total, item])).values()
    ).sort((a, b) => a.total - b.total);

    // Build budget options array
    const budgetOptions: BudgetOption[] = [];

    // Calculate how many middle options to show
    // Show more options if there are more unique combinations
    const totalCombinations = uniqueCombinations.length;
    let maxMiddleOptions = 4; // Default: show up to 4 middle options

    if (totalCombinations <= 3) {
      maxMiddleOptions = totalCombinations - 2; // Show all if only a few
    } else if (totalCombinations <= 6) {
      maxMiddleOptions = 2;
    } else if (totalCombinations <= 10) {
      maxMiddleOptions = 3;
    }
    // For 10+ combinations, show 4 middle options

    // 1. Minimum option (first combination)
    if (uniqueCombinations.length > 0) {
      const minCombo = uniqueCombinations[0];
      const minAvg = totalPeople > 0 ? minCombo.total / totalPeople : 0;

      budgetOptions.push({
        type: "minimum",
        totalBudget: parseFloat(minCombo.total.toFixed(2)),
        avgBudgetPerPerson: parseFloat(minAvg.toFixed(2)),
        breakdown: Object.fromEntries(
          Object.entries(minCombo.breakdown).map(([key, val]: [string, any]) => [key, parseFloat(val.toFixed(2))])
        ),
      });
    }

    // 2. Middle options (evenly distributed)
    const middleOptions = uniqueCombinations.slice(1, -1);
    const numMiddleToShow = Math.min(maxMiddleOptions, middleOptions.length);

    if (numMiddleToShow > 0) {
      // Evenly distribute middle options across the range
      const step = middleOptions.length / numMiddleToShow;

      for (let i = 0; i < numMiddleToShow; i++) {
        const index = Math.floor(i * step);
        const combo = middleOptions[index];
        const avgPerPerson = totalPeople > 0 ? combo.total / totalPeople : 0;

        budgetOptions.push({
          type: "standard",
          totalBudget: parseFloat(combo.total.toFixed(2)),
          avgBudgetPerPerson: parseFloat(avgPerPerson.toFixed(2)),
          breakdown: Object.fromEntries(
            Object.entries(combo.breakdown).map(([key, val]: [string, any]) => [key, parseFloat(val.toFixed(2))])
          ),
        });
      }
    }

    // 3. Maximum option (last combination)
    if (uniqueCombinations.length > 1) {
      const maxCombo = uniqueCombinations[uniqueCombinations.length - 1];
      const maxAvg = totalPeople > 0 ? maxCombo.total / totalPeople : 0;

      budgetOptions.push({
        type: "maximum",
        totalBudget: parseFloat(maxCombo.total.toFixed(2)),
        avgBudgetPerPerson: parseFloat(maxAvg.toFixed(2)),
        breakdown: Object.fromEntries(
          Object.entries(maxCombo.breakdown).map(([key, val]: [string, any]) => [key, parseFloat(val.toFixed(2))])
        ),
      });
    }

    return budgetOptions;
  },
});
