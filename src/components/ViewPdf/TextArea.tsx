import React from "react";
import "./TextArea.css";

interface TextAreaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    textContent: string | number;
}

const TextArea: React.FC<TextAreaProps> = ({
    textContent,
    className,
    ...props
}) => {
    return (
        <textarea className={className} defaultValue={textContent} {...props} />
    );
};

export default TextArea;
