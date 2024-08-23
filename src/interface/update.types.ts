import { Request, Response } from "express";
import { Model, Document } from "mongoose";

export interface FindByIdAndUpdateType {
  model: Model<Document>;
  id: string;
  data: object;
  options?: Record<string, any>;
}
export interface UpdateManyType {
  model: Model<Document>;
  ids: string[];
  data: object;
  options?: Record<string, any>;
}

export interface UpdateManyFastType {
  req: Request;
  res: Response;
  model: Model<Document>;
}
