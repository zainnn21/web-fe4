import React from "react";

interface CategoryProps {
  children: React.ReactNode;
  variant?: string;
  To?: string;
}
const Category = ({ children, variant = "", To = "" }: CategoryProps) => {
  return (
    <a
      href={To}
      className={`font-medium text-base leading-[140%] tracking-[0.2px] text-[#333333AD] hidden md:block cursor-pointer hover:text-[#3ECF4C] ${variant}`}
    >
      {children}
    </a>
  );
};

export default Category;
