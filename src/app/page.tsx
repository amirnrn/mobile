"use client";

import { useEffect } from "react";
import MobileOS from "../core/os/MobileOs";
import { registerManifests } from "./manifestCollector";

export default function Home() {
    useEffect(() => {
        registerManifests();
    }, []);

    return <MobileOS />;
}
