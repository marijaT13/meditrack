"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Animation() {
   
  return (
    
<div className="w-[400px] h-[400px] sm:w-[200px] sm:h-[200px] md:w-[300px] md:h-[300px]">
    
    <DotLottieReact
      src="https://lottie.host/791bc26d-5603-4a4a-8ce1-c5f18eddbed0/jBo1neZTR7.lottie"
      loop
      autoplay
      style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}