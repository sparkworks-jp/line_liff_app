import React from "react";
import { useDrag } from "@use-gesture/react";

const GestureComponent = () => {
    const bind = useDrag(({ direction: [xDir], tap }) => {
      console.log("手势事件触发:", { xDir, tap });
      if (tap) console.log("Tapped!");
      if (xDir > 0) console.log("Swiped Right");
      else if (xDir < 0) console.log("Swiped Left");
    });
  
    return (
      <div
        {...bind()}
        style={{
          width: "100%",
          height: "100px",
          backgroundColor: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Swipe Me!
      </div>
    );
  };
  

export default GestureComponent;
