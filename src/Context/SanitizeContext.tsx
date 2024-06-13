import React, { createContext, ReactNode, useContext } from "react";
import { sanitizeHTML } from "../Utils/sanitize";

const SanitizeContext = createContext<typeof sanitizeHTML | undefined>(
  undefined
);

export const SanitizeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <SanitizeContext.Provider value={sanitizeHTML}>
      {children}
    </SanitizeContext.Provider>
  );
};

export const useSanitize = (): typeof sanitizeHTML => {
  const context = useContext(SanitizeContext);
  if (context === undefined) {
    throw new Error("useSanitize must be used within a SanitizeProvider");
  }
  return context;
};
