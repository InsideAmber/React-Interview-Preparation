import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { Sparkles, ArrowRight } from "lucide-react";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sparkles size={32} className="text-cyan-400 animate-pulse" />
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to <span className="text-cyan-400">ReactifyPro</span>
          </h1>
        </div>

        <p className="text-lg text-gray-300 mb-8">
          Your complete learning playground to master ReactJS, hooks, performance optimization, and modern frontend architecture.🚀
        </p>

        <Link
          to={ROUTES.USER_PROFILE}
          className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-medium px-6 py-3 rounded-full transition shadow-lg"
        >
          Explore Lazy Loading Demo <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};

export default Home;
