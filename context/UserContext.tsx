import React, { createContext, ReactNode, useContext, useState } from "react";

// -------------------- USER TYPE --------------------
export type User = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  employee_id: string | null;
};

// -------------------- CONTEXT --------------------
type UserContextType = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  clearUser: () => {},
});

// -------------------- PROVIDER --------------------
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>({
    id: "bd30325a-1bdf-4c2f-86ba-cb6760572540",
    full_name: "ICT Support Officer", // default user initially
    email: "ict@example.com",
    role: "support",
    employee_id: null,
  });

  const setUser = (userData: User) => {
    setUserState(userData);
  };

  const clearUser = () => {
    setUserState(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

// -------------------- HOOK --------------------
export const useUser = () => useContext(UserContext);
