import { Model, Document } from "mongoose";

export interface CreateApiType {
  model: Model<Document>;
  data: object;
  options?: Record<string, any>;
}
