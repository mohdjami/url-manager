"use client";
import { useTheme } from "next-themes";
import { Icons } from "./Icons";
import { Button } from "./ui/button";
import { useState } from "react";

export function Mode() {
  const [mode, setMode] = useState("dark");
  const { setTheme } = useTheme();
  return (
    <div>
      {mode === "light" ? (
        <Button
          onClick={() => {
            setTheme("dark");
            setMode("dark");
          }}
          variant="link"
        >
          <Icons.moon className="w-6 h-6 text-black" />
        </Button>
      ) : (
        <Button
          onClick={() => {
            setTheme("light");
            setMode("light");
          }}
          variant="link"
        >
          <Icons.sun className="w-6 h-6 dark:text-white" />
        </Button>
      )}

      {/* <button>Light</button>
      <button onClick={() => setTheme("dark")}>Dark</button>
      <button onClick={() => setTheme("system")}>System</button> */}
    </div>
  );
}
