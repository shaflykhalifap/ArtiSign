import ButtonSidebar from "./ButtonSidebar";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside
      className="
      /* Mobile/Smartphone: Bottom navigation horizontal - tidak ada sidebar kiri */
      fixed bottom-0 left-0 right-0 w-full h-auto flex flex-row justify-around py-4 z-50 bg-[#292A2C] text-gray-30
      /* Tablet: Tetap bottom navigation - tidak ada sidebar kiri */
      sm:fixed sm:bottom-0 sm:left-0 sm:right-0 sm:w-full sm:h-auto sm:flex sm:flex-row sm:justify-around sm:py-4 sm:z-50
      md:fixed md:bottom-0 md:left-0 md:right-0 md:w-full md:h-auto md:flex md:flex-row md:justify-around md:py-4 md:z-50
      /* Desktop: Sidebar vertikal di kiri */
      lg:fixed lg:w-44 lg:h-screen lg:flex lg:flex-col lg:py-8
    "
    >
      {/* Logo - hanya tampil di desktop */}
      <div className="hidden lg:flex lg:justify-center lg:mb-8">
        <NavLink
          to="/"
          className="flex items-center justify-center p-2 rounded-lg transition-colors"
        >
          <img
            src="/assets/img/logo-arti-sign.svg"
            alt="ArtiSign Logo - Kembali ke Beranda"
            className="h-16 w-auto"
          />
        </NavLink>
      </div>

      <nav
        className="
        /* Mobile/Tablet: Full width bottom navigation */
        flex flex-1 w-full justify-around
        /* Desktop: Layout vertikal dengan flex-1 */
        lg:flex lg:flex-col lg:flex-1 lg:w-full lg:px-4
      "
      >
        <ButtonSidebar />
      </nav>
    </aside>
  );
};

export default Sidebar;
