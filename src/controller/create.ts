import mongoose, { Model } from "mongoose";
import { removeUndefined } from "../helpers/reuseFunction";

import { CreateApiType } from "../interface/create.types";

export class createControllerApi {
  private model: Model<any>;

  constructor(modelName: string) {
    this.model = mongoose.model(modelName);
  }
  async create({ data, options = {} }: CreateApiType) {
    removeUndefined(data);
    const api = new this.model(data);
    const response = await api.save(options);
    return response;
  }
}
