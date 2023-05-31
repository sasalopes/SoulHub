import { useContext } from "react";
import { DarkModeContext } from "../../contexts/DarkModeContext";
import { GetPosts } from "../GetPosts/GetPosts";


export function Home() {
  const resultado = useContext(DarkModeContext);
  const darkMode = resultado.darkMode;


  return (
    <div className={darkMode ? "bg-dark text-white" : "bg-white text-dark"}>
      <GetPosts />
    </div>
  );
}




