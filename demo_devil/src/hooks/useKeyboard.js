import { useRef, useEffect } from "react";

export default function useKeyboard() {
  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    const keyMap = {
      KeyW: "forward",
      ArrowUp: "forward",
      KeyS: "backward",
      ArrowDown: "backward",
      KeyA: "left",
      ArrowLeft: "left",
      KeyD: "right",
      ArrowRight: "right",
    };
    const handleDown = (e) => {
      const action = keyMap[e.code];
      if (action) keys.current[action] = true;
    };
    const handleUp = (e) => {
      const action = keyMap[e.code];
      if (action) keys.current[action] = false;
    };
    window.addEventListener("keydown", handleDown);
    window.addEventListener("keyup", handleUp);
    return () => {
      window.removeEventListener("keydown", handleDown);
      window.removeEventListener("keyup", handleUp);
    };
  }, []);

  return keys;
}
