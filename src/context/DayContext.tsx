import React, { createContext, FC, ReactNode, useContext } from 'react';

interface DayContextState {
  date?: number;
}

const DayContext = createContext<DayContextState>({});

interface DayContextProviderProps {
  children?: ReactNode;
  date: number;
}
export const DayContextProvider: FC<DayContextProviderProps> = ({ date, children }) => (
  <DayContext.Provider value={{ date }}>{children}</DayContext.Provider>
);

export const useDayContext = () => useContext(DayContext);
