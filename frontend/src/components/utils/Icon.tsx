type IconProps = {
    icon: string | null;
    solid?: boolean;
    onClick?: React.MouseEventHandler;
    onMouseEnter?: React.MouseEventHandler;
    onMouseLeave?: React.MouseEventHandler;
    link?: string;
    padding?: boolean;
    className?: string;
};

function Icon({ icon, solid = true, onClick, onMouseEnter, onMouseLeave, link, padding = true, className }: IconProps) {
    const iconElement =
        icon === null ? (
            <></>
        ) : (
            <i
                className={`${solid ? "fa-solid" : "fa-regular"} ${icon} 
                            ${padding ? "" : "p-0"} ${className} ${onClick !== undefined ? "pointer" : ""}`}
                onClick={onClick}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            />
        );

    const linkElement =
        link === undefined ? (
            <>{iconElement}</>
        ) : (
            <a href={link} target="_blank" rel="noreferrer">
                {iconElement}
            </a>
        );

    return linkElement;
}

export default Icon;
