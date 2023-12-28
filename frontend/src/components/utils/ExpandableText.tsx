import { useId, useState } from "react";

interface ExpandableTextProps {
    text: string;
    maxLength: number;
    maxRows: number;
    className?: string;
}

function getNthIndexOf(str: string, subStr: string, index: number) {
    return str.split(subStr, index).join(subStr).length;
}

function ExpandableText({ text, maxLength, maxRows, className }: ExpandableTextProps) {
    const [showAll, setShowAll] = useState(false);
    const space = "\u00A0\u00A0";
    const id = useId();

    return (
        <div className={`p-0 m-0 ${className}`} id={id}>
            {(showAll ? text : text.substring(0, getNthIndexOf(text, "\n", maxRows)).substring(0, maxLength)).replaceAll("\n", "\r\n")}
            {maxLength < text.length && (
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
