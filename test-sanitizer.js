// Test the sanitize-payload function
const { sanitizeVehiclePayload } = require('./app/lib/sanitize-payload.ts');

const testPayload = {
  make: "68c49393596bc2a84a5428ee",
  model: "68dcd891975ecf1f66b0e1b0",
  year: 2021,
  internal: {
    stockNumber: "STK-123", // This should be removed
    acquisitionDate: "2025-10-01T00:00:00.000Z",
    acquisitionCost: 30000,
    someNullField: null, // This should be removed
    someUndefinedField: undefined // This should be removed
  },
  pricing: {
    listPrice: 17999,
    nullValue: null // This should be removed
  }
};

console.log("Original payload:");
console.log(JSON.stringify(testPayload, null, 2));

const sanitized = sanitizeVehiclePayload(testPayload);

console.log("\nSanitized payload:");
console.log(JSON.stringify(sanitized, null, 2));

console.log("\nVerification:");
console.log("- stockNumber removed:", !sanitized.internal.stockNumber);
console.log("- null values removed:", !sanitized.internal.someNullField && !sanitized.pricing.nullValue);
console.log("- undefined values removed:", !sanitized.internal.someUndefinedField);
console.log("- valid values preserved:", sanitized.internal.acquisitionDate && sanitized.internal.acquisitionCost);
