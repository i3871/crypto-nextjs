"use client";

import React from "react";

interface GoogleSheetEmbedProps {
    sheetUrl: string;
    height?: number;
}

export default function GoogleSheetEmbed({ sheetUrl, height = 800 }: GoogleSheetEmbedProps) {
    return (
        <div className="w-full">
            <iframe
                src={sheetUrl}
                width="100%"
                height={height}
                style={{ border: "none" }}
                allowFullScreen
            />
        </div>
    );
}