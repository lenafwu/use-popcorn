import { useEffect } from "react";

export function useKey(keyCode, callback) {
  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.code.toLowerCase() === keyCode.toLowerCase()) {
        callback?.();
      }
    });

    return () => {
      document.removeEventListener("keydown", (e) => {
        if (e.code === keyCode) {
          callback?.();
        }
      });
    };
  }, [keyCode, callback]);
}
