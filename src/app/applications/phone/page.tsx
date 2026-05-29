"use client";

import { ApplicationConfig } from "@/config/application.config";
import { useState } from "react";

const dialKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

const Phone = () => {
    const [number, setNumber] = useState("");

    const handlePress = (digit: string) => {
        setNumber((prev) => prev + digit);
    };

    const handleDelete = () => {
        setNumber((prev) => prev.slice(0, -1));
    };

    const handleCall = () => {
        if (!number) return;
    };

    const formatNumber = (num: string) => {
        // simple grouping (optional)
        return num.replace(/(.{3})/g, "$1 ").trim();
    };

    return (
        <div
            className="flex flex-col h-full bg-black text-white p-4"
            style={{ borderRadius: `${ApplicationConfig.appRadius}px` }}
        >
            {/* Display */}
            <div className="flex-1 flex items-center justify-center">
                <span className="text-3xl tracking-widest">
                    {number ? formatNumber(number) : "Enter number"}
                </span>
            </div>

            {/* Dial Pad */}
            <div className="grid grid-cols-3 gap-4">
                {dialKeys.map((key) => (
                    <button
                        key={key}
                        onClick={() => handlePress(key)}
                        className="bg-neutral-800 hover:bg-neutral-700 active:scale-95 transition rounded-full h-16 text-xl"
                    >
                        {key}
                    </button>
                ))}
            </div>

            {/* Actions */}
            <div className="flex justify-between mt-6 px-4">
                <button
                    onClick={handleDelete}
                    className="bg-neutral-700 px-6 py-3 rounded-full"
                >
                    ⌫
                </button>

                <button
                    onClick={handleCall}
                    className="bg-green-500 px-8 py-3 rounded-full font-semibold"
                >
                    Call
                </button>
            </div>
        </div>
    );
};

export default Phone;
