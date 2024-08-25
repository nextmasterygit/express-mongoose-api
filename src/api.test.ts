import mongoose from "mongoose";
import { NodeMongooseApi } from ".";

// Define a test schema and model
const testSchema = new mongoose.Schema({
  name: String,
});

const TestModel = mongoose.model("TestModel", testSchema);

const { createApi, updateApi } = NodeMongooseApi(TestModel);

describe("API Controllers Tests", () => {
  beforeEach(async () => {
    // Clear the database before each test
    await TestModel.deleteMany({});
  });

  test("create should create a new document", async () => {
    const data = { name: "testing" };
    const createdDoc = await createApi.create({ data });
    expect(createdDoc).toBeDefined();
    expect(createdDoc.name).toBe("testing");
  });
  test("updateById should update an existing document", async () => {
    const data = { name: "testing" };
    const createdDoc = await createApi.create({ data });
    const updateData = { name: "updated" };
    const updatedDoc = await updateApi.findByIdAndUpdate({
      id: createdDoc._id,
      data: updateData,
    });

    expect(updatedDoc).toBeDefined();
    expect(updatedDoc.name).toBe("updated");
  });

  test("updateMany should update multiple documents", async () => {
    const docs = await TestModel.insertMany([
      { name: "one" },
      { name: "two" },
      { name: "three" },
    ]);
    const ids: string[] = docs.map((doc) => doc._id.toString()); // Ensure correct type
    const updateData = { name: "updated" };
    const result = await updateApi.updateMany({
      ids,
      data: updateData,
    });

    expect(result.modifiedCount).toBe(3);
    const updatedDocs = await TestModel.find({ _id: { $in: ids } });
    updatedDocs.forEach((doc) => {
      expect(doc.name).toBe("updated");
    });
  });
});
