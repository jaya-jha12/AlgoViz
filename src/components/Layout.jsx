import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Code2 } from 'lucide-react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl('PatternMatching')} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Pattern Match Visualizer</h1>
                <p className="text-xs text-gray-500">KMP & Boyer-Moore Algorithms</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <a
                href="https://en.wikipedia.org/wiki/String-searching_algorithm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main>{children}</main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center text-sm text-gray-600">
            <p>Educational tool for learning pattern matching algorithms</p>
            <p className="mt-2 text-xs text-gray-500">
              Built with React, Tailwind CSS, and comprehensive algorithm visualizations
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}