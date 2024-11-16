import Image from "next/image";
import React from "react";

function Statistics() {
   
  return (
    <div className="container mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      
        <div className="p-4 text-justify">
       <h1 className="sm:text-5xl text-3xl font-bold text-center mb-8 sm:mb-24">How It Works</h1>
       <p className="text-lg leading-9 mb-4">
          Begin by matching with a world-class coach, tailored to your personal
          and professional goals. Engage in one-on-one sessions and access an
          extensive learning library, complemented by a network of specialists for
          unique challenges.
          Track your progress with regular assessments, enjoying the flexibility
          and convenience of our platform. Experience a holistic approach to
          growth, focusing on both achieving goals and promoting overall
          well-being, empowering you to pursue new challenges and opportunities.
        </p>
        </div>
      <Image src="/aleluia.png" width={900} height={400} />
    </div>
  );
}

export default Statistics;

