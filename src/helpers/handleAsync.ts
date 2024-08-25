import formidable from "formidable";
import { handleError } from "./errorHandler";
import { Result } from "./responseHandler";
import mongoose, { SessionOption } from "mongoose";
import { Request, Response, NextFunction } from "express";
import { FnType, FnSessionType, FnFormidableType } from "../interface/types";

export const handleAsync = (
  fn: FnType,
  modelName?: string,
  customError?: string,
  status = 400
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.log(`error on =====${modelName}===`, error);
      if (customError) {
        return Result(res, status, customError);
      }
      handleError(res, error);
      next(error);
    }
  };
};

export const handleAsyncSession = (
  fn: FnSessionType,
  modelName: string,
  customError?: string,
  status = 400
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await fn(req, res, next, session);
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      console.log(`Error in ${modelName}:`, error);
      if (!res.headersSent) {
        if (customError) {
          Result(res, status, customError);
        } else {
          handleError(res, error);
        }
      }
      next(error);
    } finally {
      session.endSession();
    }
  };
};

export const handleFormAsyncSession = (
  fn: FnFormidableType,
  modelName: string,
  customError?: string,
  status = 400
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    let form = new formidable.IncomingForm();
    form.parse(req, async (err: any, fields: any, files: any) => {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        await fn(req, res, next, session, err, fields, files);
        await session.commitTransaction();
      } catch (error) {
        await session.abortTransaction();
        console.log(`Error in ${modelName}:`, error);
        if (customError) {
          Result(res, status, customError);
        } else {
          handleError(res, error);
          next(error);
        }
      } finally {
        session.endSession();
      }
    });
  };
};
