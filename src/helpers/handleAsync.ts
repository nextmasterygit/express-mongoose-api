const formidable = require("formidable");
const { handleError } = require("./errorHandler");
const { result } = require("./responseHandler");
const mongoose = require("mongoose");
import { SessionOption } from "mongoose";
import { Request, Response, NextFunction } from "express";

type fnType = (
  req: Request,
  res: Response,
  next?: NextFunction,
  session?: SessionOption
) => void;

type fnFormidableType = (
  req: Request,
  res: Response,
  next: NextFunction,
  session: SessionOption,
  err: any,
  fields: [],
  files: []
) => void;

export const handleAsync = (
  fn: fnType,
  modelName?: string,
  customError?: object,
  status = 400
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.log(`error on =====${modelName}===`, error);
      if (customError) {
        return result(res, status, customError);
      }
      handleError(res, error);
      next(error);
    }
  };
};

export const handleAsyncSession = (
  fn: fnType,
  modelName: string,
  customError: object,
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
          result(res, status, customError);
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
  fn: fnFormidableType,
  modelName: string,
  customError: string,
  status = 400
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    let form = new formidable.IncomingForm();
    form.parse(req, async (err: any, fields: [], files: []) => {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        await fn(req, res, next, session, err, fields, files);
        await session.commitTransaction();
      } catch (error) {
        await session.abortTransaction();
        console.log(`Error in ${modelName}:`, error);
        if (customError) {
          result(res, status, customError);
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
