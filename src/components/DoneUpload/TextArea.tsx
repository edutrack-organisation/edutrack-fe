/**
 * @file TextArea.tsx
 * @description A reusable textarea component with custom styling
 * Features:
 * - Custom styling through CSS file
 * - Extends native textarea HTML attributes
 * - Supports default text content and placeholder
 * - Preserves all standard textarea functionality
 */

import React from "react";
import "./TextArea.css";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    textContent?: string | number;
    placeHolder?: string;
}

const TextArea: React.FC<TextAreaProps> = ({ textContent, className, placeHolder, ...props }) => {
    return <textarea className={className} placeholder={placeHolder} defaultValue={textContent} {...props} />;
};

export default TextArea;
