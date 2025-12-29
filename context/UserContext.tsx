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

  // Debug: log the children type to help diagnose raw text render issues
  try {
    // Avoid logging huge objects in production; only log the type/count
    // eslint-disable-next-line no-console
    console.log('UserProvider children type:', typeof children, 'count:', React.Children.count(children));
  } catch (e) {
    // ignore
  }

  return (
    <UserContext.Provider value={{ user, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

// -------------------- HOOK --------------------
export const useUser = () => useContext(UserContext);
