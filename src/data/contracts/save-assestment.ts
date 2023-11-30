import { CompletedTaskModel } from "../model/completed-task-model";

export interface SaveAssestment {
  save (data: CompletedTaskModel): Promise<null>
}