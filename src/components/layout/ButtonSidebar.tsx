import React from "react";
import { Home, BookOpen, Info, Languages } from "lucide-react";
import { NavLink } from "react-router-dom";

const ButtonSidebar = () => {
  const mainMenuItems = [
    { name: "beranda", icon: <Home size={28} />, path: "/" },
    {
      name: "terjemahan",
      icon: <Languages size={28} />,
      path: "/translate",
    },
    // { name: "chatbot", icon: <Bot size={28} />, path: "/chatbot" },
  ];

  const bottomMenuItems = [
    { name: "artikel", icon: <BookOpen size={28} />, path: "/article" },
    { name: "tentang", icon: <Info size={28} />, path: "/about" },
  ];

  // Gabungkan semua menu items untuk layout horizontal di mobile/tablet
  const allMenuItems = [...mainMenuItems, ...bottomMenuItems];

  const renderNavLink = (
    item: { name: string; icon: React.ReactNode; path: string },
    index: number
  ) => (
    <NavLink
      to={item.path}
      key={index}
      className={({ isActive }) =>
        `flex flex-col items-center transition
         /* Mobile/Smartphone: Default style */
         gap-1 px-2 py-3 flex-1 text-center hover:bg-transparent hover:text-white
         /* Tablet: Sama seperti mobile */
         sm:gap-1 sm:px-2 sm:py-3 sm:flex-1 sm:text-center sm:hover:bg-transparent sm:hover:text-white
         md:gap-1 md:px-2 md:py-3 md:flex-1 md:text-center md:hover:bg-transparent md:hover:text-white
         /* Desktop: Style dengan background dan width penuh */
         lg:gap-3 lg:px-4 lg:py-2 lg:w-full lg:rounded-lg lg:hover:bg-gray-700
         ${
           isActive
             ? "text-white font-bold lg:bg-white/80 lg:text-black lg:font-bold"
             : "text-gray-400"
         }`
      }
    >
      <div className="scale-75 lg:scale-100">{item.icon}</div>
      <span className="text-xs lg:text-sm">{item.name}</span>
    </NavLink>
  );

  return (
    <div
      className="
      /* Mobile/Smartphone: Layout horizontal */
      flex flex-row h-auto w-full justify-around items-center
      /* Tablet: Tetap horizontal */
      sm:flex sm:flex-row sm:h-auto sm:w-full sm:justify-around sm:items-center
      md:flex md:flex-row md:h-auto md:w-full md:justify-around md:items-center
      /* Desktop: Layout vertikal dengan justify-between */
      lg:flex lg:flex-col lg:h-full lg:justify-between
    "
    >
      {/* Desktop: Menu atas */}
      <div className="hidden lg:flex lg:flex-col lg:space-y-3 lg:w-full">
        {mainMenuItems.map(renderNavLink)}
      </div>

      {/* Desktop: Menu bawah */}
      <div className="hidden lg:flex lg:flex-col lg:space-y-3 lg:w-full">
        {bottomMenuItems.map(renderNavLink)}
      </div>

      {/* Mobile & Tablet: Semua menu dalam satu baris */}
      <div className="flex w-full justify-around lg:hidden">
        {allMenuItems.map(renderNavLink)}
      </div>
    </div>
  );
};

export default ButtonSidebar;
