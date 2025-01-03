"use client";

import { User } from "@/lib/db/schema";
import { Selectable } from "kysely";
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { use } from "react";

type UserContextType = {
  user: Selectable<User> | null;
  setUser: (user: Selectable<User> | null) => void;
};

const UserContext = createContext<UserContextType | null>(null);

export function useUser(): UserContextType {
  let context = useContext(UserContext);
  if (context === null) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export function UserProvider({
  children,
  userPromise,
}: {
  children: ReactNode;
  userPromise: Promise<Selectable<User> | null>;
}) {
  let initialUser = use(userPromise);
  let [user, setUser] = useState<Selectable<User> | null>(initialUser);

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}
