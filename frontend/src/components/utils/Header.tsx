import { useState } from "react";
import { Container, Image, Nav, NavDropdown, Navbar } from "react-bootstrap";
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
        icon?: string;
        onClick?: React.MouseEventHandler;
        // requiredPermission?: Permission; // TODO
    };

    type LinksGroup = {
        title: string;
        icon?: string;
        links: Link[];
    };

    function isGroup(link: Link | LinksGroup): link is LinksGroup {
        return (link as LinksGroup).links !== undefined;
    }

    // TODO: pre/post login links
    const links: (Link | LinksGroup)[] = [
        {
            to: "",
            title: "The Map",
            icon: "fa-map-location-dot",
        },
        {
            title: "Personal zone",
            icon: "fa-user",
            links: [
                {
                    to: "user/notifications",
                    title: "Notifications",
                },
                {
                    to: "user/profile",
                    title: "My profile",
                },
                {
                    to: "user/addeddoctors",
                    title: "Doctors I added",
                },
                {
                    to: "user/faviorite",
                    title: "Faviorite doctors",
                },
                {
                    to: "user/reviews",
                    title: "My reviews",
                },
            ],
        },
        {
            title: "admin",
            icon: "fa-gear",
            links: [
                {
                    to: "doctors/doctors",
                    title: "Doctors",
                },
                {
                    to: "doctors/categories",
                    title: "Doctor categories",
                },
                {
                    to: "doctors/specialities",
                    title: "Doctor specialities",
                },
                {
                    to: "usage",
                    title: "Usage statictics",
                },
            ],
        },
        {
            to: "logout",
            title: "Logout",
            icon: "fa-door-open",
        },
    ];

    return (
        <header>
            <Navbar expand="lg" className="bg-light bg-body-tertiary" collapseOnSelect>
                <Navbar.Toggle aria-controls="navbarCollapse" />
                <Nav.Link as={Link} to="/" className="no-padding" eventKey="home" onClick={() => setSelectedPage(null)}>
                    <Navbar.Brand>
                        <Image src={logoUrl} className="logo" />
                        {appName}
                    </Navbar.Brand>
                </Nav.Link>
                <Navbar.Text>
                    <Icon icon="fa-user" />
                    Hellooooo user{/* TODO: Login / Hello user / Logout */}
                </Navbar.Text>
                <Navbar.Collapse id="navbarCollapse">
                    <Nav activeKey={selectedPage as EventKey} onSelect={setSelectedPage as SelectCallback}>
                        {links.map((link: LinksGroup | Link) => {
                            if (isGroup(link)) {
                                return (
                                    <NavDropdown
                                        key={link.title}
                                        title={
                                            <>
                                                {link.icon && <Icon icon={link.icon} />}
                                                {link.title}
                                            </>
                                        }
                                    >
                                        {link.links.map((link) => (
                                            <NavDropdown.Item
                                                key={link.to}
                                                as={Link}
                                                to={`/${link.to}`}
                                                onClick={link.onClick}
                                                eventKey={link.to}
                                            >
                                                {link.icon && <Icon icon={link.icon} />}
                                                {link.title}
                                            </NavDropdown.Item>
                                        ))}
                                    </NavDropdown>
                                );
                            } else {
                                return (
                                    <Nav.Link
                                        key={link.to}
                                        as={Link}
                                        to={`/${link.to}`}
                                        onClick={link.onClick}
                                        eventKey={link.to}
                                    >
                                        {link.icon && <Icon icon={link.icon} />}
                                        {link.title}
                                    </Nav.Link>
                                );
                            }
                        })}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </header>
    );
}

export default Header;
