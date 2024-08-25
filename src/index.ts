import { updateControllerApi } from './controller/update';
import { createControllerApi } from './controller/create';
import { Model } from 'mongoose';
import {
  handleAsync,
  handleAsyncSession,
  handleFormAsyncSession
} from './helpers/handleAsync';
import { Result } from './helpers/responseHandler';

import { ApiType, HelperType } from './interface/types';

const NodeMongooseApi = (model: Model<any>): ApiType => {
  const updateApi = new updateControllerApi(model);
  const createApi = new createControllerApi(model);
  return {
    updateApi,
    createApi
  };
};

const helpers: HelperType = {
  handleAsync,
  handleAsyncSession,
  handleFormAsyncSession,
  Result
};

export { NodeMongooseApi, helpers };
