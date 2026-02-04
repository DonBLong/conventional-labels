import type { GetResponseDataTypeFromEndpointMethod } from "@octokit/types";
import type { EndPointMethods } from "./EndPointMethods";

export type ResponseData<Method extends keyof EndPointMethods> =
  GetResponseDataTypeFromEndpointMethod<EndPointMethods[Method]>;
