import { useState } from "react";
import { Image, Nav, Navbar } from "react-bootstrap";
import { EventKey, SelectCallback } from "@restart/ui/esm/types";

import config from "../../config.json";
import logo from "../../ribbon.svg";
import Icon from "./Icon";
import { Link } from "react-router-dom";

function Header() {
    // TODO: useAuth

    const [selectedPage, setSelectedPage] = useState<EventKey | null>(null);

    const appName = "The Yellow Hub Map";
    const logoUrl = config.app.logoUrl ? config.app.logoUrl : logo;

    type Link = {
        to: string;
        title: string;
        icon: string;
        onClick?: React.MouseEventHandler;
        // requiredPermission?: Permission; // TODO
    };

    // TODO: pre/post login links
    const links: Link[] = [
        {
            // TODO: delete
            to: "dev",
            title: "DEV",
            icon: "fa-smile",
        },
        {
            to: "",
            title: "The Map",
            icon: "fa-duotone fa-map-location",
        },
        {
            to: "doctors/doctors",
            title: "admin -> Doctors", // TODO: admin submenu
            icon: "fa-user-doctor",
        },
        {
            to: "doctors/categories",
            title: "admin -> Doctor categories", // TODO: admin submenu
            icon: "fa-gear",
        },
        {
            to: "doctors/specialities",
            title: "admin -> Doctor specialities", // TODO: admin submenu
            icon: "fa-gear",
        },
        // admin -> Usage stats
        // Login / Logout
        // Notifications
        // My profile
    ];

    return (
        <header>
            <Navbar expand={false} className="bg-light bg-body-tertiary" collapseOnSelect>
                <Navbar.Toggle aria-controls="navbarCollapse" />
                <Nav.Link as={Link} to="/" className="no-padding" eventKey="home" onClick={() => setSelectedPage(null)}>
                    <Navbar.Brand>
                        <Image src={logoUrl} className="logo" />
                        {appName}
                    </Navbar.Brand>
                </Nav.Link>
                <Navbar.Text>
                    <Icon icon="fa-user" />
                    Hello user{/* TODO: Login / Hello user / Logout */}
                </Navbar.Text>
                <Navbar.Collapse id="navbarCollapse">
                    <Nav
                        className="ml-auto"
                        activeKey={selectedPage as EventKey}
                        onSelect={setSelectedPage as SelectCallback}
                    >
                        <>
                            {links.map((link) => (
                                <Nav.Link
                                    key={link.to}
                                    as={Link}
                                    to={`/${link.to}`}
                                    onClick={link.onClick}
                                    eventKey={link.to}
                                >
                                    <Icon icon={link.icon} />
                                    {link.title}
                                </Nav.Link>
                            ))}
                        </>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </header>
    );
}

export default Header;
