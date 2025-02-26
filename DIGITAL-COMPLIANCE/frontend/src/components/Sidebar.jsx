import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ links = [] }) => {
  return (
    // <aside className="bg-gray-200 w-64 h-full fixed">
    //   <ul className="p-4">
    //     {links.length > 0 ? (
    //       links.map((link) => (
    //         <li key={link.path} className="mb-4">
    //           <NavLink
    //             to={link.path}
    //             className={({ isActive }) =>
    //               isActive
    //                 ? "text-blue-500 font-bold"
    //                 : "text-gray-700 hover:text-blue-500"
    //             }
    //           >
    //             {link.name}
    //           </NavLink>
    //         </li>
    //       ))
    //     ) : (
    //       <li className="text-gray-500">No links available</li>
    //     )}
    //   </ul>
    // </aside>
    <div></div>
  );
};

export default Sidebar;
