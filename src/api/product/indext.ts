import instance from "src/api/axios";
import { HTTP_METHOD } from "src/const/http-method";

export const getProducts = async (vendor: string) => {
  return await instance({
    url: vendor,
    method: HTTP_METHOD.GET,
  });
};
