import React from "react";
import { Home, Bot, BookOpen, Info, Languages } from "lucide-react";
import { NavLink } from "react-router-dom";

const ButtonSidebar = () => {
  const mainMenuItems = [
    { name: "beranda", icon: <Home size={28} />, path: "/" },
    {
      name: "terjemahan",
      icon: <Languages size={28} />,
      path: "/translate",
    },
    { name: "chatbot", icon: <Bot size={28} />, path: "/chatbot" },
  ];

  const bottomMenuItems = [
    { name: "artikel", icon: <BookOpen size={28} />, path: "/article" },
    { name: "tentang", icon: <Info size={28} />, path: "/about" },
  ];

  const renderNavLink = (
    item: { name: string; icon: React.ReactNode; path: string },
    index: number
  ) => (
    <NavLink
      to={item.path}
      key={index}
      className={({ isActive }) =>
        `flex flex-col items-center gap-3 px-4 py-2 rounded-lg transition hover:bg-gray-700 ${
          isActive ? "bg-white/80 text-black font-bold" : ""
        }`
      }
    >
      {item.icon}
      <span className="text-sm">{item.name}</span>
    </NavLink>
  );

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex flex-col space-y-3">
        {mainMenuItems.map(renderNavLink)}
      </div>

      <div className="flex flex-col space-y-3">
        {bottomMenuItems.map(renderNavLink)}
      </div>
    </div>
  );
};

export default ButtonSidebar;
