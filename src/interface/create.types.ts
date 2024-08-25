import { Model, Document } from "mongoose";

export interface CreateApiType {
  data: object;
  options?: Record<string, any>;
}
