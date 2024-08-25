"use client";
import React, { createContext, useMemo } from "react";
import { useFetchAllNotes } from "@/data";

export const NotesContext = createContext(null);

export const NotesProvider = ({ children }) => {
  const { data, isLoading, isError, error } = useFetchAllNotes();

  const notesContext = useMemo(
    () => ({ data, isLoading, isError, error }),
    [data, isLoading, isError, error]
  );

  return (
    <NotesContext.Provider value={notesContext}>
      {children}
    </NotesContext.Provider>
  );
};
