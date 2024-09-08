import React from "react";
import "./TextArea.css";

interface TextAreaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    textContent: string | number;
}

const TextArea: React.FC<TextAreaProps> = ({ textContent, ...props }) => {
    return (
        <textarea className="textarea" defaultValue={textContent} {...props} />
    );
};

export default TextArea;
