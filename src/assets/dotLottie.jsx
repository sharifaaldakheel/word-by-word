import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import animationUrl from "./brain thinking.lottie?url";


const DotLottie = () => {
  return (
    <DotLottieReact
      src={animationUrl}
      loop
      autoplay
      style={{ width: "100%", maxWidth: "480px", height: "auto" }}
    />
  );
};

export default DotLottie;
