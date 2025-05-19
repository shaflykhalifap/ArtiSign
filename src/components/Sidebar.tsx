import ButtonSidebar from "./ButtonSidebar";

// Static sidebar component

const Sidebar = () => {
  return (
    <aside className="w-44 h-screen bg-[#292A2C] text-white/80 flex flex-col items-center py-8 space-y-2">
      <div className="mb-8">
        <img
          src="../assets/img/logo-arti-sign.svg"
          alt="Logo"
          className="h-16"
        />
      </div>

      <nav className="flex-1 flex w-full px-4 justify-center">
        <ButtonSidebar></ButtonSidebar>
      </nav>
    </aside>
  );
};

export default Sidebar;
