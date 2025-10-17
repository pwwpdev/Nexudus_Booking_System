const { createRecurringSchedule } = require("../Controllers/RecurringSchedule/createRecurringSchedule");
const { createResource } = require("../Controllers/Resource/createResource");
const { createService } = require("../Controllers/Service/createService");
const { associateResourcetoService } = require("../Controllers/Association/associateResourcetoService");
const { createLocation } = require("../Controllers/Location/createLocation");
const { createRecurringScheduleBlock } = require("../Controllers/RecurringSchedule/createRecurringScheduleBlock");
const { validateRates } = require("../Controllers/Resource/validateRates");

async function Limitations({
  price,
  defined_timings,
  max_duration,
  min_duration,
  duration_interval,
  resource_name,
  start_date,
  photo_url,
  capacity,
  resource_details,
  email_confirmation,
  resource_plans,
  category,
  location_id,
  metadata = {},
  rates = []
}) {
  // Print all input parameters
  console.log("=== LIMITATIONS FUNCTION INPUT PARAMETERS ===");
  console.log("price:", price);
  console.log("defined_timings:", JSON.stringify(defined_timings, null, 2));
  console.log("max_duration:", max_duration);
  console.log("min_duration:", min_duration);
  console.log("duration_interval:", duration_interval);
  console.log("resource_name:", resource_name);
  console.log("start_date:", start_date);
  console.log("photo_url:", photo_url);
  console.log("capacity:", capacity);
  console.log("resource_details:", JSON.stringify(resource_details, null, 2));
  console.log("email_confirmation:", email_confirmation);
  console.log("resource_plans:", JSON.stringify(resource_plans, null, 2));
  console.log("category:", category);
  console.log("location_id:", location_id);
  console.log("metadata:", JSON.stringify(metadata, null, 2));
  console.log("rates:", JSON.stringify(rates, null, 2));
  console.log("===============================================");

  // Validate rates if provided
  if (rates && rates.length > 0) {
    console.log("Validating rates...");
    const rateValidation = validateRates(rates);
    if (!rateValidation.isValid) {
      console.error("Rate validation failed:", rateValidation.errors);
      throw new Error(`Rate validation failed: ${rateValidation.errors.join(', ')}`);
    }
    console.log("Rates validation passed. Validated rates:", JSON.stringify(rateValidation.validatedRates, null, 2));
    rates = rateValidation.validatedRates;
  } else {
    console.log("No rates provided or rates array is empty");
  }

  // Create a location (optional, can also use location_id if passed)
  console.log("Creating location...");
  const location = await createLocation("Hong-Kong");
  console.log("Location created:", location.data);

  try {
    console.log("Building metadata object...");
    metadata = {
      ...metadata,
      capacity: capacity,
      resource_plans: resource_plans,
      category: category,
      email_confirmation: email_confirmation,
      resource_details: resource_details,
      photo_url: photo_url,
      rates: rates
    };
    console.log("Final metadata:", JSON.stringify(metadata, null, 2));
  } catch (err) {
    console.error("Error building metadata:", err);
    throw err;
  }

  // Create resource
  console.log("Creating resource with name:", resource_name);
  const resource = await createResource(resource_name, metadata);
  console.log("Resource created:", resource.data);

  const requestObject = {
    resource_id: resource.data.id,
    location_id: location.data.id,
    start_date: start_date,
  };

  // Create recurring schedule
  const recurring_Schedule = await createRecurringSchedule(requestObject);

  // Create service
  let service;
  try {
    service = await createService({
      price: price,
      name: resource_name,
      max_duration: max_duration,
      min_duration: min_duration,
      duration_step: duration_interval
    });
  } catch (err) {
    console.error("Error creating service:", err.message);
  }

  // Associate resource with service
  try {
    await associateResourcetoService(resource.data.id, service.data.id);
  } catch (err) {
    console.error("Error associating resource to service:", err.message);
  }

  // Prepare schedule creation request


  // Create weekly schedule blocks
  for (const dayBlock of defined_timings) {
    createRecurringScheduleBlock(
      resource.data.id,
      recurring_Schedule.data.id,
      dayBlock.weekday,
      dayBlock.start_time,
      dayBlock.end_time
    );
  }

  return resource.data.id;
}

module.exports = { Limitations };
