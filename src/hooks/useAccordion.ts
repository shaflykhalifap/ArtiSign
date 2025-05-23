import { useState } from "react";

const useAccordion = (initialOpenIndex: number | null = null) => {
  const [openIndex, setOpenIndex] = useState<number | null>(initialOpenIndex);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const isItemOpen = (index: number) => openIndex === index;

  return {
    openIndex,
    toggleItem,
    isItemOpen,
  };
};

export default useAccordion;
