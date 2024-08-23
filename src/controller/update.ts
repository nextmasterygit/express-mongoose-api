import mongoose, { Model } from "mongoose";
import { constants } from "../helpers/constants";
import { Result } from "../helpers/responseHandler";
import { removeUndefined } from "../helpers/reuseFunction";
import {
  FindByIdAndUpdateType,
  UpdateManyFastType,
  UpdateManyType,
} from "../interface/update.types";

export class updateControllerApi {
  private model: Model<any>;

  constructor(modelName: string) {
    this.model = mongoose.model(modelName);
  }

  async findByIdAndUpdate({ id, data, options = {} }: FindByIdAndUpdateType) {
    removeUndefined(data);
    const response = await this.model.findByIdAndUpdate(id, data, {
      new: true,
      ...options, // Spread the options object here
    });
    return response;
  }
  async updateMany({ ids, data, options = {} }: UpdateManyType) {
    removeUndefined(data);
    return await this.model.updateMany(
      { _id: { $in: ids } },
      data,
      { ...options, new: true } // Merge options with new:true
    );
  }
  async updateManyFast({ req, res }: UpdateManyFastType) {
    try {
      const data = req.body;
      const { ids, ...updateData } = data;
      if (!updateData) {
        return Result(res, 400, "No data Found For Update");
      }
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return Result(res, 400, "Not Found Ids");
      }
      const response = await this.model.updateMany(
        { _id: { $in: ids } },
        updateData,
        {
          new: true,
        }
      );
      return response;
    } catch (error) {
      console.log(this.model.modelName, error);
      Result(res, 400, constants.GET_ERROR);
    }
  }
}

// export const updateApi = async ({
//   model,
//   id,
//   data,
//   options = {},
// }: UpdateApiType) => {
//   removeUndefined(data);
//   const response = await model.findByIdAndUpdate(id, data, {
//     new: true,
//     ...options, // Spread the options object here
//   });
//   return response;
// };

// export const updateManyRecord = async ({
//   model,
//   ids,
//   data,
//   options = {},
// }: UpdateManyType) => {
//   removeUndefined(data);
//   return await model.updateMany(
//     { _id: { $in: ids } },
//     data,
//     { ...options, new: true } // Merge options with new:true
//   );
// };

// export const updateManyFast = async ({
//   req,
//   res,
//   model,
// }: UpdateManyFastType) => {
//   try {
//     const data = req.body;
//     const { ids, ...updateData } = data;
//     if (!updateData) {
//       return Result(res, 400, "No data Found For Update");
//     }
//     if (!ids || !Array.isArray(ids) || ids.length === 0) {
//       return Result(res, 400, "Not Found Ids");
//     }
//     const response = await model.updateMany({ _id: { $in: ids } }, updateData, {
//       new: true,
//     });
//     return response;
//   } catch (error) {
//     console.log(model.modelName, error);
//     Result(res, 400, constants.GET_ERROR);
//   }
// };
