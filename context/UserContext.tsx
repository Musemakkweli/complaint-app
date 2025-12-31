import React, { createContext, ReactNode, useContext, useState } from "react";

// -------------------- USER TYPE --------------------
export type User = {
  id: string;
  full_name: string; // original field
  email: string;
  role: string;
  employee_id: string | null;

  // Additional optional profile fields
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  about?: string;
  avatar?: string;
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
    full_name: "ICT Support Officer",
    email: "ict@example.com",
    role: "support",
    employee_id: null,
    phone: "+250 788 000 000",
    address: "Kigali, Rwanda",
    city: "Kigali",
    country: "Rwanda",
    about: "ICT Support Officer at EUCL",
    avatar: `https://ui-avatars.com/api/?name=ICT+Support+Officer&background=7c3aed&color=fff&size=512`,
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
