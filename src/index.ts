import { updateControllerApi } from "./controller/update";
import { createControllerApi } from "./controller/create";

const ExpressMongooseApi = (modelName: string) => {
  const updateApi = new updateControllerApi(modelName);
  const createApi = new createControllerApi(modelName);
  return {
    updateApi,
    createApi,
  };
};

export { ExpressMongooseApi };
