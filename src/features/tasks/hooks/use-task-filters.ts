import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

import { CoTypes, TaskStatus } from "../types";

export const useTaskFilters = () => {
  return useQueryStates({
    departmentId: parseAsString,
    status: parseAsStringEnum(Object.values(TaskStatus)),
    search: parseAsString,
    dueDate: parseAsString,
    coType: parseAsStringEnum(Object.values(CoTypes)),
    coName: parseAsString,
    receivedThrough: parseAsString,
  });
};
