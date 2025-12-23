// context/UserContext.tsx
import React, { createContext, ReactNode, useContext, useState } from "react";

// -------------------- USER TYPE --------------------
export type User = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  employee_id: string;
};

// -------------------- CONTEXT --------------------
type UserContextType = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void; // optional helper to logout
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  clearUser: () => {},
});

// -------------------- PROVIDER --------------------
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);

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
