"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ResourceDownloadCard from "@/components/resources/ResourceDownloadCard";
import EmailFormModal from "@/components/resources/EmailFormModal";
import resourcesData from "@/data/resources.json";

// Group resources by type for display
const groupResourcesByType = (resources) => {
  const grouped = {
    ebook: [],
    podcast: [],
    course: [],
    template: [],
  };

  resources.forEach((resource) => {
    if (grouped[resource.type]) {
      grouped[resource.type].push(resource);
    }
  });

  return grouped;
};

const typeLabels = {
  ebook: "E-Books",
  podcast: "Podcasts",
  course: "Courses",
  template: "Templates",
};

const typeColors = {
  ebook: "from-blue-500 to-cyan-500",
  podcast: "from-violet-500 to-purple-500",
  course: "from-purple-500 to-pink-500",
  template: "from-green-500 to-teal-500",
};

export default function ResourcesPage() {
  const [selectedResource, setSelectedResource] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const groupedResources = groupResourcesByType(resourcesData);

  const handleGetResource = (resource) => {
    setSelectedResource(resource);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedResource(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Free Resources
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Access our curated collection of e-books, podcasts, courses, and templates to support your wellbeing journey.
          </p>
        </motion.div>

        {/* Resources Sections */}
        <div className="space-y-16">
          {Object.entries(groupedResources).map(([type, resources], index) => {
            if (resources.length === 0) return null;

            return (
              <motion.section
                key={type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="scroll-mt-8"
                id={type}
              >
                {/* Section Header */}
                <div className="mb-6">
                  <div className={`inline-block p-3 bg-gradient-to-br ${typeColors[type]} rounded-xl shadow-lg mb-4`}>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                      {typeLabels[type]}
                    </h2>
                  </div>
                  <p className="text-gray-400">
                    {resources.length} {resources.length === 1 ? "resource" : "resources"} available
                  </p>
                </div>

                {/* Resources Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resources.map((resource, resourceIndex) => (
                    <motion.div
                      key={resource.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 + resourceIndex * 0.05 }}
                    >
                      <ResourceDownloadCard
                        resource={resource}
                        onGetResource={handleGetResource}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            );
          })}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400 text-sm">
              <strong className="text-white">Note:</strong> These resources are provided for informational purposes only. 
              We regularly update this list, so check back for new additions. If you have suggestions for resources to add, 
              please reach out to us.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Email Form Modal */}
      {selectedResource && (
        <EmailFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          resource={selectedResource}
        />
      )}
    </div>
  );
}

