const {apiClient} = require('../../apiClient');

async function createLocation(name) {
  try {
    const location = await apiClient.post('locations', {
      "name": name,
      "time_zone": "America/New_York",
      "resource_selection_strategy": "randomize"
    });
    return location;
  } catch (err) {
    console.log("There is an error while creating the location ", err.message ? err.message : err);
    throw err;
  }
}

module.exports = { createLocation };
