import { NextFunction, Request, Response } from 'express';
import { createControllerApi } from '../controller/create';
import { updateControllerApi } from '../controller/update';
import { ClientSession } from 'mongoose';

export type FnType = (req: Request, res: Response, next?: NextFunction) => Promise<void>;
export type FnSessionType = (
  req: Request,
  res: Response,
  next: NextFunction,
  session: ClientSession //transaction
) => Promise<void>;

export type FnFormidableType = (
  req: Request,
  res: Response,
  next: NextFunction,
  session: ClientSession, //transaction
  err: any,
  fields: any[],
  files: string[]
) => Promise<void>;

export interface ApiType {
  updateApi: updateControllerApi;
  createApi: createControllerApi;
}

export interface HelperType {
  handleAsync: (
    fn: FnType,
    modelName?: string,
    customError?: string,
    status?: number
  ) => (req: Request, res: Response, next: NextFunction) => void;

  handleAsyncSession: (
    fn: FnSessionType,
    modelName: string,
    customError?: string,
    status?: number
  ) => (req: Request, res: Response, next: NextFunction) => void;

  handleFormAsyncSession: (
    fn: FnFormidableType,
    modelName: string,
    customError?: string,
    status?: number
  ) => (req: Request, res: Response, next: NextFunction) => void;
  Result: (
    res: Response,
    code: number,
    message: string,
    data?: [],
    total?: number,
    custom?: {}
  ) => void;
}
