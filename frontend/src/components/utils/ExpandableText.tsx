import { useId, useState } from "react";

interface ExpandableTextProps {
    text: string;
    initialLength: number;
    className?: string;
}

function ExpandableText({ text, initialLength, className }: ExpandableTextProps) {
    const [showAll, setShowAll] = useState(false);
    const space = "\u00A0\u00A0";
    const id = useId();

    return (
        <div className={`p-0 m-0 ${className}`} id={id}>
            {showAll ? text : text.substring(0, initialLength)}
            {initialLength < text.length && (
                <>
                    {space + "..." + space}
                    <a
                        onClick={() => {
                            setShowAll(!showAll);
                            document.getElementById(id)?.scrollIntoView();
                        }}
                    >
                        {showAll ? "See less" : "See more"}
                    </a>
                </>
            )}
        </div>
    );
}

export default ExpandableText;
