import React, { useEffect, useRef } from "react";
import LottieView from "lottie-react-native";

export default function AnimationWithImperativeApi() {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    animationRef.current?.play();

    // Or set a specific startFrame and endFrame with:
    animationRef.current?.play(30, 120);
  }, []);

  return (
    <LottieView
      ref={animationRef}
      source={{
        uri: "https://th.bing.com/th/id/OIP.DXi-IO1zd9_je9x1go-HqAHaKk?w=185&h=264&c=7&r=0&o=5&pid=1.7",
      }}
      style={{width: "100%", height: "100%"}}
      autoPlay
      loop
    />
  );
}