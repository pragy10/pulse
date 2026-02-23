import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUser,
  FiCompass,
  FiSettings,
  FiBell,
  FiMessageSquare,
  FiChevronDown,
  FiPlus,
} from "react-icons/fi";

const BrowseCommunities = () => {
  const navigate = useNavigate();

  // SDG Data Mapping: Colors, Titles, and Numbers
  const sdgGoals = [
    { id: 1, title: "No Poverty", color: "bg-[#E5243B]" },
    { id: 2, title: "Zero Hunger", color: "bg-[#DDA63A]" },
    { id: 3, title: "Good Health", color: "bg-[#4C9F38]" },
    { id: 4, title: "Quality Education", color: "bg-[#C5192D]" },
    { id: 5, title: "Gender Equality", color: "bg-[#FF3A21]" },
    { id: 6, title: "Clean Water", color: "bg-[#26BDE2]" },
    { id: 7, title: "Affordable Energy", color: "bg-[#FCC30B]" },
    { id: 8, title: "Decent Work", color: "bg-[#A21942]" },
    { id: 9, title: "Industry & Innovation", color: "bg-[#FD6925]" },
    { id: 10, title: "Reduced Inequalities", color: "bg-[#DD1367]" },
    { id: 11, title: "Sustainable Cities", color: "bg-[#FD9D24]" },
    { id: 12, title: "Responsible Consumption", color: "bg-[#BF8B2E]" },
    { id: 13, title: "Climate Action", color: "bg-[#3F7E44]" },
    { id: 14, title: "Life Below Water", color: "bg-[#0A97D9]" },
    { id: 15, title: "Life on Land", color: "bg-[#56C02B]" },
    { id: 16, title: "Peace & Justice", color: "bg-[#00689D]" },
    { id: 17, title: "Partnerships", color: "bg-[#19486A]" },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      <h2 className="text-3xl font-extrabold text-[#4ADE80]">
        Browse Communities
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {sdgGoals.map((goal) => (
          <div
            key={goal.id}
            onClick={() => navigate(`/community/${goal.id}`)}
            className={`${goal.color} aspect-square rounded-lg p-4 flex flex-col justify-between cursor-pointer hover:scale-[1.03] hover:brightness-110 transition-all shadow-md group`}
          >
            <div className="flex justify-between items-start text-white">
              <span className="text-3xl font-black opacity-90">{goal.id}</span>
              <span className="text-[10px] font-bold uppercase text-right leading-tight max-w-[60%]">
                {goal.title}
              </span>
            </div>
            {/* Simplified Icon Placeholder - Replaces icons with Goal Number for clean look */}
            <div className="flex justify-center items-center flex-1">
              <div className="w-16 h-16 border-4 border-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold opacity-40">
                  SDG {goal.id}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowseCommunities;
