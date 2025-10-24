# Trip Craft API

Custom API endpoint for calculating trip budgets based on user preferences.

## Endpoint

```
GET /api/trip/craft
```

## Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `startDate` | string | Yes | Start date of the trip (ISO format) |
| `numberOfDays` | number | Yes | Number of days for the trip |
| `adults` | number | Yes | Number of adults (must be >= 0) |
| `children` | number | No | Number of children (defaults to 0) |
| `includeRestaurant` | boolean | No | Include restaurant costs (defaults to false) |
| `includeVehicle` | boolean | No | Include vehicle rental costs (defaults to false) |

## Example Request

```bash
GET /api/trip/craft?startDate=2024-01-15&numberOfDays=5&adults=2&children=1&includeRestaurant=true&includeVehicle=true
```

## Response Format

```json
{
  "data": [
    {
      "type": "minimum",
      "totalBudget": 1500.00,
      "avgBudgetPerPerson": 500.00,
      "breakdown": {
        "stay": 750.00,
        "restaurant": 450.00,
        "vehicle": 300.00
      }
    },
    {
      "type": "maximum",
      "totalBudget": 4500.00,
      "avgBudgetPerPerson": 1500.00,
      "breakdown": {
        "stay": 2500.00,
        "restaurant": 1200.00,
        "vehicle": 800.00
      }
    }
  ],
  "meta": {
    "query": {
      "startDate": "2024-01-15",
      "numberOfDays": 5,
      "adults": 2,
      "children": 1,
      "includeRestaurant": true,
      "includeVehicle": true
    }
  }
}
```

## Calculation Logic

### Stay Costs
- Calculated as: `stay pricing * numberOfDays`
- Returns min and max based on all available stays

### Restaurant Costs
- Calculated as: `restaurant pricing * numberOfDays`
- Only included if `includeRestaurant=true`

### Vehicle Costs
- Calculated as: `vehicle pricing * numberOfDays`
- Only included if `includeVehicle=true`

### Total Budget
- Minimum: Sum of minimum costs from each category
- Maximum: Sum of maximum costs from each category

### Average Per Person
- Calculated as: `totalBudget / (adults + children)`

## Error Responses

### 400 Bad Request
- Missing required parameters
- Invalid parameter values (negative numbers, zero people)

### 500 Internal Server Error
- Database query errors
- Calculation errors
