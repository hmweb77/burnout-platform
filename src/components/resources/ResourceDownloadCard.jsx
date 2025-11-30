"use client";

import { motion } from "framer-motion";
import { BookOpen, Headphones, GraduationCap, FileText, Download } from "lucide-react";

const typeIcons = {
  ebook: BookOpen,
  podcast: Headphones,
  course: GraduationCap,
  template: FileText,
};

const typeColors = {
  ebook: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  podcast: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  course: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  template: "bg-green-500/20 text-green-400 border-green-500/30",
};

export default function ResourceDownloadCard({ resource, onGetResource }) {
  const Icon = typeIcons[resource.type] || FileText;
  const colorClass = typeColors[resource.type] || typeColors.ebook;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 h-full flex flex-col"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
          <Icon className="h-3 w-3" />
          <span className="capitalize">{resource.type}</span>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-4 flex-grow">
        {resource.title}
      </h3>
      
      <button
        onClick={() => onGetResource(resource)}
        className="w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
      >
        <Download className="h-4 w-4" />
        Get Resource
      </button>
    </motion.div>
  );
}

