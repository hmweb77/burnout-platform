"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ResourceDownloadCard from "@/components/resources/ResourceDownloadCard";
import EmailFormModal from "@/components/resources/EmailFormModal";
import { sanityClient } from "@/lib/sanity";

export default function FreeResources() {
  const [selectedResource, setSelectedResource] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ebooks, setEbooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch resources from Sanity
  useEffect(() => {
    async function fetchResources() {
      try {
        const resources = await sanityClient.fetch(
          `*[_type == "resource"] {
            _id,
            name,
            price,
            description,
            "image": image.asset->url,
            "file": pdfFile.asset->url
          }`
        );

        // Map Sanity fields to match component expectations
        const mappedResources = resources.map((resource) => ({
          id: resource._id,
          type: "ebook", // Default to ebook as the component filters for ebooks
          title: resource.name,
          file: resource.file,
          price: resource.price,
          description: resource.description,
          image: resource.image,
        }));

        setEbooks(mappedResources);
      } catch (error) {
        console.error("Error fetching resources from Sanity:", error);
        setEbooks([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchResources();
  }, []);

  const handleGetResource = (resource) => {
    setSelectedResource(resource);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedResource(null);
  };

  if (isLoading) return null;
  if (ebooks.length === 0) return null;

  return (
    <section className="py-20 bg-gray-900" id="free-resources">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Free Resources
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Access our curated collection of free e-books to support your wellbeing journey.
          </p>
        </motion.div>

        {/* Ebooks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ebooks.map((ebook, index) => (
            <motion.div
              key={ebook.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ResourceDownloadCard
                resource={ebook}
                onGetResource={handleGetResource}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Email Form Modal */}
      {selectedResource && (
        <EmailFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          resource={selectedResource}
        />
      )}
    </section>
  );
}

