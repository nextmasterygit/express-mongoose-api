# Node Mongoose Api

`node-mongoose-api` is a transformative package for working with Express and MongoDB, designed to simplify CRUD operations and data aggregation. With this package, you can perform complex queries and aggregations with minimal effort. The key feature of this project is its optimized aggregation function, which allows you to filter data, count totals, and achieve your desired results efficiently.

## Require Packages for this _node-mongoose-api_

```
"date-fns": "^3.6.0",
"date-fns-tz": "^3.1.3",
"express": "^4.19.2",
"formidable": "^3.5.1"
npm install date-fns date-fns-tz formidable
```

## Key Features

- Simplified Aggregations: Avoid writing lengthy aggregation pipelines. Easily filter data and perform counts using optimized aggregation functions.
- Common Utility Functions: Access a range of utility functions commonly used in projects.

## Tested

`This package has been tested with various scenarios.`
`[test-node-mongoose-api](https://github.com/nextmasterygit/test-node-mongoose-api) For practical examples clone this repo. This repository demonstrates the usage of node-mongoose-api for testing purposes.`

## How to Use

To use the node-mongoose-api package in your project, follow these steps:

## `Import the Package`

```
import { NodeMongooseApi, helpers, CustomParamsType, QueryType } from 'node-mongoose-api';
 const { createOp, updateOp, deleteOp, listAggregation, lookupUnwindStage,lookupStage  } = NodeMongooseApi(model);
const { handleAsync,handleAsyncSession,handleFormAsync,handleFormAsyncSession, ResponseJson, utility, message } = helpers;

```

### Import Your Model

```
import { Member } from '../model/member'; // Adjust the path as necessary
const model = Member;  // Replace with your model
const modelName = 'Member'; // Replace with your model name

```

### Initialize NodeMongooseApi

`Initialize the NodeMongooseApi class with your model:`

```
 const { createOp, updateOp, deleteOp, listAggregation, lookupUnwindStage,lookupStage  } = NodeMongooseApi(model);
```

### Create Operation

`To create a new document, use the createOp operation:`

```
 const data = req.body;
 const response = await createOp.create({ data });
```

### updateOp Operation

`You have several options for updating documents:`

- findByIdAndUpdate

```
 const { id } = req.params;
 const data = req.body;
 const response = await updateOp.findByIdAndUpdate({ id, data });
```

- updateMany

```
 const data = req.body;
 const { ids, ...updateData } = data;
 await updateOp.updateMany({ ids, data: updateData });
```

- updateManyFast
  _`updateManyFast`is a direct function for bulk updates. Ensure that the parameters match those sent from the client._

```
await updateOp.updateManyFast({ req, res });
```

### deleteOp Operation

`You can delete documents using the following methods:`

- deleteOne

```
 const { id } = req.params;
 await deleteOp.deleteOne({ id });
```

- deleteMany

```
 const ids = req.body.ids;
 await deleteOp.deleteMany({ ids });
```

- deleteManyFast  
  _`deleteManyFast` is a direct function for bulk deletions. Ensure that the parameters match those sent from the client._

```
 await deleteOp.deleteManyFast({ req, res });
```

### listAggregation

- This is the deep aggregation method\*

* simple

```
router.get('/list/:query?', list);
const result = await listAggregation({
    model,
    customParams= {
    projectionFields: {
      _id: 1,
      title: 1,
      category: 1,
      price:1,
      createdAt: 1,
      updatedAt: 1
    },
    },
    query: req.query
  });
   if (result) {
    const { data, total } = result;
    res.json...
  }
```

- filter

```
 const customParams: CustomParamsType = {
    projectionFields: {
      _id: 1,
      title: 1,
      category: 1,
      price:1,
      createdAt: 1,
      updatedAt: 1
    },
    searchTerms: ['_id', 'title'] //use for searchTerm Filter
    numericSearchTerms:['price'] //use for filter number fields
  };
const result = await listAggregation({
    model,
    customParams,
    query: req.query
  });
```

- params filter

```
  ***
   searchTerm="abc"

  /product/list?searchTerm=abc
  ***
  ***
  columnFilters=[{"id":"_id","value":["66cd4955ea80fe74a77a983b","66cc324a48a26ecb9a52bc19"]},{"id":"title","value":"abc"}]

  product/list?columnFilters=[{"id":"_id","value":["66cd4955ea80fe74a77a983b","66cc324a48a26ecb9a52bc19"]},{"id":"fullName","value":"testing3"}]

   columnFilters=[{"id":"category.name","value":["cat1","66cc324a48a26ecb9a52bc19"]},{"id":"title","value":"abc"}]
  ***
```

- lookup

```
  const lookup = [
    ...lookupUnwindStage('categories', 'category', '_id', 'category'),
    ...lookupUnwindStage('members', 'publishby', '_id', 'publishby')
  ];
   const customParams: CustomParamsType = {
    lookup,
    projectionFields,
       searchTerms: ['_id', 'title','category.name']
        numericSearchTerms:['price']
  };
```

- \_ids

```
const result = await listAggregation({
    model,
    customParams,
    query: req.query
    ids: ['66cd4955ea80fe74a77a983b']
  });

```

# Helper Functions

`This package provides helper functions for handling asynchronous operations, processing form data, and performing utility tasks. Below is an overview of each helper function and its usage within this package.`

`const { handleAsync,handleAsyncSession,handleFormAsync,handleFormAsyncSession, ResponseJson, utility, message } = helpers;`

1. ResponseJson
   `The ResponseJson function standardizes the format of JSON responses. It takes in parameters to set the HTTP status code, message, and optionally, the data, total count, and any custom properties.`

```
 ResponseJson(res, 200, "customMessage", data,total,);
```

2. Handling Asynchronous Operations

- handleAsync
  `Used to handle asynchronous requests with error management. The function automatically catches errors and logs them.`

```
export const create = handleAsync(async (req,res,next) => {
  const data = req.body;
  utility.removeUndefined(data);
  const response = await createOp.create({ data });
  ResponseJson(res, 200, message.INSERT_SUCCESS, response);
}, modelName);
```

- handleAsyncSession
  `For handling MongoDB transactions with sessions. It ensures operations are performed within a single transaction context.`

```
export const createSession = handleAsyncSession(async (req, res, next, session) => {
  let data = req.body;
  const userData = { fullName: 'session test', phone: '1234' };
  await userModel.createOp.create({ data: userData, options: { session } }); //user collection
  const response = await createOp.create({ data, options: { session } }); //product collection
  ResponseJson(res, 200, message.INSERT_SUCCESS, response);
}, modelName);
```

3. Formidable Package Integration

- handleFormAsync

```
export const create = handleFormAsync(
  async (req: Request, res: Response, next, err, fields, files) => {
   console.log(fields,files)
  },
  modelName
);
```

- handleFormAsyncSession

```
export const create = handleFormAsyncSession(
  async (req: Request, res: Response, next,session, err, fields, files) => {
   console.log(fields,files)
  },
  modelName
);
```

4. Utility Functions

- removeUndefined

```
 const data = {
      name: "John",
      age: undefined,
      address: null,
      email: "",
      phone: "123-456-7890",
      unknown: "undefined",
    };
    const expected = {
      name: "John",
      phone: "123-456-7890",
    };
    Utility.removeUndefined(data);
    expect(data).toEqual(expected);

```

- capitalizeFirstLetter

```
    const input = "example";
    const result = Utility.capitalizeFirstLetter(input);
     expect(result).toBe("Example");
```

- capitalizeCamelSpace

```
    const input = "exampleCamelCaseString";
    const result = Utility.capitalizeCamelSpace(input);
    expect(result).toBe("Example Camel Case String");
```

- isAllSameinArray

```
    const dataArray = [1, 1, 1];
    const result = Utility.isAllSameinArray(dataArray, 1);
     expect(result).toBe(true);
```

- trimNameLower

```
    const input = "   Hello   world!   This is    a test.  ";
    const result = Utility.trimNameLower(input);
    expect(result).toBe("hello world! this is a test.");
```

- pickObj

```
   const obj = {
      title: "Test",
      description: "Description",
      date: "2024-08-27",
    };
    const keys = ["title", "date"];
    const result = Utility.pickObj(obj, keys);
    expect(result).toEqual({ title: "Test", date: "2024-08-27" });
```

- extractArrayItems

```
 const data = { a: ["texta"], b: ["textb"] };
    const result = Utility.extractArrayItems(data);
    expect(result).toEqual({ a: "texta", b: "textb" });
```
