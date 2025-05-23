import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

type TabType = "about" | "community" | "terms" | "privacy";

export const useActiveTab = (defaultTab: TabType = "about") => {
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/about/community") {
      setActiveTab("community");
    } else if (location.pathname === "/about/terms") {
      setActiveTab("terms");
    } else if (location.pathname === "/about/privacy") {
      setActiveTab("privacy");
    } else {
      setActiveTab("about");
    }
  }, [location.pathname]);

  return { activeTab, setActiveTab };
};
