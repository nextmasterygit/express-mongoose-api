import { Request, Response } from "express";
import { ObjectId } from "mongoose";

export interface FindByIdAndUpdateType {
  id: string | ObjectId;
  data: object;
  options?: Record<string, any>;
}
export interface UpdateManyType {
  ids: (string | ObjectId)[];
  data: object;
  options?: Record<string, any>;
}

export interface UpdateManyFastType {
  req: Request;
  res: Response;
}
