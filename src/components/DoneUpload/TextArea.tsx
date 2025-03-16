import React from "react";
import "./TextArea.css";

interface TextAreaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    textContent?: string | number;
    placeHolder?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
    textContent,
    className,
    placeHolder,
    ...props
}) => {
    return (
        <textarea
            className={className}
            placeholder={placeHolder}
            defaultValue={textContent}
            {...props}
        />
    );
};

export default TextArea;
