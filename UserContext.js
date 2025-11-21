import { createContext } from "react"

export const UserContext = createContext({
  isNewUser: false, setIsNewUser: () => {}, updateChat: false, setUpdateChat: () => {}
})