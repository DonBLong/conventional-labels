import type { GetResponseTypeFromEndpointMethod } from "@octokit/types";
import type { EndPointMethods } from "./EndPointMethods";

export type ResponseStatusCode<Method extends keyof EndPointMethods> =
  GetResponseTypeFromEndpointMethod<EndPointMethods[Method]>["status"];
