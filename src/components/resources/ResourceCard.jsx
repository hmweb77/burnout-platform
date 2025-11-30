"use client";

import { motion } from "framer-motion";
import { ExternalLink, BookOpen, Video, Users, Smartphone } from "lucide-react";

const typeIcons = {
  app: Smartphone,
  article: BookOpen,
  video: Video,
  podcast: Video,
  community: Users,
};

const typeColors = {
  app: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  article: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  video: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  podcast: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  community: "bg-green-500/20 text-green-400 border-green-500/30",
};

export default function ResourceCard({ title, link, type, description }) {
  const Icon = typeIcons[type] || BookOpen;
  const colorClass = typeColors[type] || typeColors.article;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <motion.div 
        className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 h-full"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
            <Icon className="h-3 w-3" />
            <span className="capitalize">{type}</span>
          </div>
          <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        
        {description && (
          <p className="text-gray-400 text-sm leading-relaxed">
            {description}
          </p>
        )}
      </motion.div>
    </a>
  );
}

