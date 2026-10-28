"use client";
import { createContext, useContext } from "react";
import { defaultSideNames } from "../domain/side-profile-names";
export const CustomerNamesContext = createContext(defaultSideNames);
export const useCustomerNames = () => useContext(CustomerNamesContext);
