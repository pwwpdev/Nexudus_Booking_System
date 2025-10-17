const {createResource} = require( "../Controllers/Resource/createResource") ;


// this is to test whether the resource is getting created 
test('create resource',async ()=>{
    const resource = await createResource("rahul");
    expect(resource.data.id).toBeDefined();
});
