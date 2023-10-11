import { useState } from "react";
import { Image, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { EventKey, SelectCallback } from "@restart/ui/esm/types";

import Icon from "./Icon";
import { Link } from "react-router-dom";

function Header() {
    // TODO: useAuth

    const [selectedPage, setSelectedPage] = useState<EventKey | null>(null);
    const [selectedSubMenu, setSelectedSubMenu] = useState<EventKey | null>(null);

    type Link = {
        to: string;
        title: string;
        icon?: string;
        onClick?: React.MouseEventHandler;
        newWindow?: boolean;
        // requiredPermission?: Permission; // TODO
    };

    type LinksGroup = {
        title: string;
        icon?: string;
        links: Link[];
    };

    function getMenuItemContent(link: Link) {
        return (
            <>
                {link.icon && (
                    <div className="navbar-icon-border">
                        <Icon icon={link.icon} />
                    </div>
                )}
                {link.title}
            </>
        );
    }

    function isGroup(link: Link | LinksGroup): link is LinksGroup {
        return (link as LinksGroup).links !== undefined;
    }

    const links: (Link | LinksGroup)[] = [
        {
            to: "",
            title: "Specialists Map",
        },
        {
            to: "https://www.theyellowhub.org/blog",
            title: "Blog",
            newWindow: true,
        },
        {
            // TODO: only if admin
            title: "Admin",
            links: [
                {
                    to: "/doctors/doctors",
                    title: "Doctors",
                },
                {
                    to: "/doctors/categories",
                    title: "Doctor categories",
                },
                {
                    to: "/doctors/specialities",
                    title: "Doctor specialities",
                },
                {
                    to: "/usage",
                    title: "Usage statictics",
                },
            ],
        },
        {
            // TODO: only if logged in. If not - login link.
            title: "My account",
            links: [
                {
                    to: "/user/profile",
                    title: "My profile", // TODO: replace with user name
                    icon: "fa-user",
                },
                {
                    to: "/user/saved",
                    title: "Saved",
                    icon: "fa-bookmark",
                },
                {
                    to: "logout",
                    title: "Log out",
                    icon: "fa-power-off",
                },
                {
                    to: "/user/notifications",
                    title: "Notifications",
                },
                {
                    to: "/user/addeddoctors",
                    title: "Doctors I added",
                },
                {
                    to: "/user/reviews",
                    title: "My reviews",
                },
            ],
        },
    ];

    return (
        <Navbar expand="lg" className="aboveAll header" collapseOnSelect>
            <Navbar.Toggle aria-controls="navbarCollapse" />
            <Nav.Link as={Link} to="http://theyellowhub.org/" target="_blank" className="no-padding">
                <Navbar.Brand>
                    <Image src={"/images/logo.svg"} className="logo" />
                </Navbar.Brand>
            </Nav.Link>

            <Navbar.Collapse id="navbarCollapse">
                <Nav activeKey={selectedPage as EventKey} onSelect={setSelectedPage as SelectCallback}>
                    {links.map((link: LinksGroup | Link) => {
                        if (isGroup(link)) {
                            const dropdown = link;
                            return (
                                <NavDropdown
                                    key={dropdown.title}
                                    active={selectedSubMenu === dropdown.title}
                                    title={
                                        <>
                                            {dropdown.icon && <Icon icon={dropdown.icon} />}
                                            {dropdown.title}
                                        </>
                                    }
                                >
                                    {dropdown.links.map((link) => (
                                        <NavDropdown.Item
                                            className="d-flex"
                                            key={link.to}
                                            as={Link}
                                            to={link.to}
                                            target={link.to.includes("http") ? "_blank" : "_self"}
                                            onClick={(e) => {
                                                setSelectedSubMenu(dropdown.title);
                                                link.onClick && link.onClick(e);
                                            }}
                                            eventKey={link.to}
                                        >
                                            {getMenuItemContent(link)}
                                        </NavDropdown.Item>
                                    ))}
                                </NavDropdown>
                            );
                        } else {
                            return (
                                <Nav.Link
                                    key={link.to}
                                    as={Link}
                                    to={link.to}
                                    target={link.to.includes("http") ? "_blank" : "_self"}
                                    onClick={(e) => {
                                        !link.to.includes("http") && setSelectedSubMenu(null);
                                        link.onClick && link.onClick(e);
                                    }}
                                    eventKey={link.to.includes("http") ? undefined : link.to}
                                >
                                    {getMenuItemContent(link)}
                                </Nav.Link>
                            );
                        }
                    })}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Header;
