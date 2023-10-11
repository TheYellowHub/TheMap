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

    function isGroup(link: Link | LinksGroup): link is LinksGroup {
        return (link as LinksGroup).links !== undefined;
    }

    // TODO: pre/post login links
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
            // TODO: only if logged in
            title: "My account",
            links: [
                {
                    to: "/user/notifications",
                    title: "Notifications",
                },
                {
                    to: "/user/profile",
                    title: "My profile",
                },
                {
                    to: "/user/addeddoctors",
                    title: "Doctors I added",
                },
                {
                    to: "/user/faviorite",
                    title: "Faviorite doctors",
                },
                {
                    to: "/user/reviews",
                    title: "My reviews",
                },
            ],
        },
        // {
        //     to: "logout",
        //     title: "Logout",
        // },
    ];

    return (
        <Navbar expand="lg" className="aboveAll header" collapseOnSelect>
            <Navbar.Toggle aria-controls="navbarCollapse" />
            <Nav.Link as={Link} to="http://theyellowhub.org/" target="_blank" className="no-padding">
                <Navbar.Brand>
                    <Image src={"/images/logo.svg"} className="logo" />
                </Navbar.Brand>
            </Nav.Link>

            {/* TODO: Login / Hello user / Logout */}
            {/* <Navbar.Text>
                <Icon icon="fa-user" />
                Hello user
            </Navbar.Text> */}

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
                                    to={link.to}
                                    target={link.to.includes("http") ? "_blank" : "_self"}
                                    onClick={(e) => {
                                        !link.to.includes("http") && setSelectedSubMenu(null);
                                        link.onClick && link.onClick(e);
                                    }}
                                    eventKey={link.to.includes("http") ? undefined : link.to}
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
    );
}

export default Header;
