import React from "react";

const UserProfile: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">User Profile Page</h1>
      <p>This content is loaded lazily when you visit this route.</p>
    </div>
  );
};

export default UserProfile;


/**
 Lazy loading helps reduce initial bundle size, improving load time and user experience, 
 especially for pages or components that aren't immediately visible.
 */
