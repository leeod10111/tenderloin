// src/components/FileUpload.js
import React from "react";

export const FileUpload = ({ onFileUpload }) => {
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const metadata = {
                title: file.name.split(".")[0], // Use file name as the title
                parent: "Custom", // Default group to "Custom"
                loopEnd: "00:16", // Default loop end
                startColor: "rgb(157, 4, 4)", // Default start color
                stopColor: "rgb(157, 4, 4 / 50%)", // Default stop color
            };
            onFileUpload(file, metadata);
        }
    };

    return (
        <div>
            <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
            />
        </div>
    );
};
