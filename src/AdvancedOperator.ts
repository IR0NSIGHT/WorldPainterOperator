import { OperationInterface } from "./Operation/OperationInterface";
import { log } from "./log";

export function isOperation(
  operation: object
): operation is OperationInterface {
  const cast: OperationInterface = operation as OperationInterface;
  log(JSON.stringify(cast));
  return cast.name !== undefined;
}









