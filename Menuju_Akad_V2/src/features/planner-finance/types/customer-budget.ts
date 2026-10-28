import type { z } from "zod";
import type { customerBudgetSchema } from "../domain/customer-budget-schema";

export type CustomerBudget = z.infer<typeof customerBudgetSchema>;
export type BudgetPriority = NonNullable<CustomerBudget["priority"]>;
