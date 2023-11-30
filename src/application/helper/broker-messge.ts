import { MissingBrokerMessageParamError } from "../errors";

export const badRequestBrokerMessage = (error: Error) => ({ error })
export const serverErrorBrokerMessage = (error: Error) => ({ error })