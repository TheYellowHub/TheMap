type IconProps = {
    icon: string | null;
    solid?: boolean;
    onClick?: React.MouseEventHandler;
    link?: string;
    padding?: boolean;
};

function Icon({
    icon,
    solid = true,
    onClick,
    link,
    padding = true,
}: IconProps) {
    const iconElement =
        icon === null ? (
            <></>
        ) : (
            <i
                className={`${solid ? "fa-solid" : "fa-regular"} ${icon} 
                            ${padding ? "" : "p-0"}`}
                onClick={onClick}
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
