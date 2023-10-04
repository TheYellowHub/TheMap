type IconProps = {
    icon: string | null;
    onClick?: React.MouseEventHandler;
};

function Icon({ icon, onClick }: IconProps) {
    return icon === null ? <></> : <i className={`fa-solid ${icon}`} onClick={onClick} />;
}

export default Icon;
