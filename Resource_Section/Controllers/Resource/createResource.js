
const { apiClient } = require('../../apiClient');
const {viewResource} = require('./viewResource');
async function createResource(name, metadata = null) {
  try {
    const encodedName = encodeURIComponent(name);
    const duplicateresource = await apiClient.get(`/resources?name[eq]=${encodedName}`);
    if (duplicateresource.id) {
      throw new Error("Already a resource exist with this resource_name");
    }
    const resource = await apiClient.post('resources', {
      "name": name,
      "metadata": metadata,
      "max_simultaneous_bookings": 1
    })
    console.log("Resource created successfully ", resource.data);
    return resource;
  }
  catch (err) {
    console.log("there is an error while creating the resource ", err.message ? err.message : err);
    throw err;
  }
}
module.exports = { createResource }