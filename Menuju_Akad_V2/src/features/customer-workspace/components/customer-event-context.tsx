"use client";
import { createContext, useContext } from "react";
export type CustomerEvent = "wedding" | "engagement";
export const CustomerEventContext = createContext<CustomerEvent>("wedding");
export const useCustomerEvent = () => useContext(CustomerEventContext);
