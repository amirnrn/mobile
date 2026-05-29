import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/assets/globals.css";
import ProviderWrapper from "@/shared/provider/Provider";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`h-full`}>
            <body className="min-h-full flex justify-center items-center">
                <ProviderWrapper>{children}</ProviderWrapper>
            </body>
        </html>
    );
}
