const {apiClient} = require("../../apiClient");

function associateResourcetoService(resource_id, service_id)
{
    try { 
        const response = apiClient.post(`/resources/${resource_id}/services/${service_id}`);
        return response;
    }   
    catch(err)
    {  
       throw err;
    }   
}

module.exports={associateResourcetoService};
