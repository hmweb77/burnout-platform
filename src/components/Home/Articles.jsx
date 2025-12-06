"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { sanityClient } from "@/lib/sanity";

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch blogs from Sanity
  useEffect(() => {
    async function fetchBlogs() {
      try {
        const blogs = await sanityClient.fetch(
          `*[_type == "blog"] | order(publishedAt desc) {
            _id,
            title,
            description,
            "image": coverImage.asset->url,
            "slug": slug.current,
            publishedAt
          }`
        );

        // Map Sanity fields to match component expectations
        const mappedArticles = blogs.map((blog) => ({
          id: blog._id,
          title: blog.title || "",
          excerpt: blog.description || "",
          category: "Article", // Default category as it doesn't exist in schema
          date: blog.publishedAt || new Date().toISOString(),
          readTime: "5 min read", // Default read time as it's not in schema
          image: blog.image || "",
          slug: blog.slug || "",
        }));

        setArticles(mappedArticles);
      } catch (error) {
        console.error("Error fetching blogs from Sanity:", error);
        setArticles([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBlogs();
  }, []);
  return (
    <section className="py-20 bg-gray-800">
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
            Latest Articles
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Explore our collection of articles on burnout, wellness, and personal growth
          </p>
        </motion.div>

        {/* Articles Grid */}
        {isLoading ? (
          <div className="text-center text-gray-400 py-12">Loading articles...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 group"
            >
              {/* Article Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    <BookOpen className="h-3 w-3" />
                    {article.category}
                  </span>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-6">
                <div className="flex items-center gap-3 text-sm text-gray-400 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>

                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {article.title}
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                  {article.excerpt}
                </p>

                <Link
                  href={article.slug ? `/blog/${article.slug}` : "#"}
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors"
                >
                  Read More
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
            ))}
          </div>
        )}

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            href="#"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium"
          >
            View All Articles
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

