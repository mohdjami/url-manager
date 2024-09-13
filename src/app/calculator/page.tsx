"use client";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Calculator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const handleButtonClick = (value: string) => {
    if (value === "=") {
      calculateResult();
    } else if (value === "C") {
      clear();
    } else {
      setInput((prev) => prev + value);
    }
  };

  const calculateResult = () => {
    try {
      setResult(eval(input).toString()); // Be careful with eval
    } catch {
      setResult("Error");
    }
  };

  const clear = () => {
    setInput("");
    setResult("");
  };

  return (
    <div className="mt-10 min-h-screen flex flex-col items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-900">
          Simple Calculator
        </h1>
        <div className="mb-4">
          <input
            type="text"
            value={input}
            className="w-full p-2 text-xl border border-gray-300 rounded"
            readOnly
          />
        </div>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            "7",
            "8",
            "9",
            "/",
            "4",
            "5",
            "6",
            "*",
            "1",
            "2",
            "3",
            "-",
            "C",
            "0",

            "+",
          ].map((button) => (
            <Button
              key={button}
              onClick={() => {
                handleButtonClick(button);
              }}
              className="p-4 text-xl font-bold bg-blue-500 text-white hover:bg-blue-600"
            >
              {button}
            </Button>
          ))}
        </div>{" "}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="mt-4 bg-green-500 hover:bg-green-600">=</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure you want to submit?</DialogTitle>
              <DialogDescription>
                <Button
                  onClick={() => {
                    calculateResult();
                  }}
                  className="p-4 text-xl font-bold bg-blue-500 text-white hover:bg-blue-600"
                >
                  Calculate
                </Button>{" "}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <div className="text-xl font-bold text-right text-gray-800">
          {result}
        </div>
      </div>

      {/* Popup 1 */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-4 bg-green-500 hover:bg-green-600">
            Help Popup 1
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to submit?</DialogTitle>
            <DialogDescription>
              <Button>Yes</Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Popup 2 */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-4 bg-yellow-500 hover:bg-yellow-600">
            Info Popup 2
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Popup 2</DialogTitle>
            <DialogDescription>
              This is the second popup with more info.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Popup 3 */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-4 bg-red-500 hover:bg-red-600">
            Alert Popup 3
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Popup 3</DialogTitle>
            <DialogDescription>
              This is the third popup with an alert message.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
