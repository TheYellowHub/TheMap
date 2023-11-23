import { useEffect, useState } from "react";
import { Image, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { EventKey, SelectCallback } from "@restart/ui/esm/types";

import useAuth from "../../auth/useAuth";
import config from "../../config.json";
import Icon from "./Icon";
import { Link } from "react-router-dom";

function Header() {
    const { user, isAuthenticated, isAdmin, login, logout } = useAuth();

    const [selectedPage, setSelectedPage] = useState<EventKey>("");
    const [selectedSubMenu, setSelectedSubMenu] = useState<EventKey | null>(null);

    type Link = {
        title: string;
        to: string;
        onClick?: React.MouseEventHandler;
        newWindow?: boolean;
        icon?: string;
    };

    type LinksGroup = {
        title: string;
        links: Link[];
        icon?: string;
    };

    const [links, setLinks] = useState<(Link | LinksGroup)[]>([]);

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

    function isExternalLink(link: Link): boolean {
        return link.to.includes("http");
    }

    const publicLinks = [
        {
            to: "",
            title: "Specialists Map",
        },
        {
            to: "https://www.theyellowhub.org/blog",
            title: "Blog",
            newWindow: true,
        },
    ];

    const userMenu = {
        title: "My account",
        links: [
            // TODO
            // {
            //     to: "/user/profile",
            //     title: (user?.nickname && capitalizeFirstLetter(user.nickname)) || "My account",
            //     icon: "fa-user",
            // },
            {
                to: "/user/saved",
                title: "Saved",
                icon: "fa-bookmark",
            },
            {
                to: "/",
                onClick: logout,
                title: "Log out",
                icon: "fa-power-off",
            },
            // {
            //     to: "/user/notifications",
            //     title: "Notifications",
            // },
            // {
            //     to: "/user/addeddoctors",
            //     title: "Doctors I added",
            // },
            // {
            //     to: "/user/reviews",
            //     title: "My reviews",
            // },
        ],
    };

    const adminMenu = {
        title: "Admin",
        links: [
            {
                to: "/doctors/doctors",
                title: "Doctors",
            },
            {
                to: "/doctors/categories",
                title: "Categories",
            },
            {
                to: "/doctors/specialities",
                title: "Specialities",
            },
            // TODO
            // {
            //     to: "/usage",
            //     title: "Usage statictics",
            // },
        ],
    };

    useEffect(() => {
        const newLinks: (Link | LinksGroup)[] = [...publicLinks];
        if (user && isAuthenticated) {
            newLinks.push(userMenu);
            if (isAdmin) {
                newLinks.push(adminMenu);
            }
        } else if (config.auth0.enabled) {
            newLinks.push({
                to: "/user/login",
                onClick: login,
                title: "Login",
            });
        }
        setLinks(newLinks);
    }, [user, isAuthenticated, isAdmin]);

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
                                            target={isExternalLink(link) ? "_blank" : "_self"}
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
                                    target={isExternalLink(link) ? "_blank" : "_self"}
                                    onClick={(e) => {
                                        !isExternalLink(link) && setSelectedSubMenu(null);
                                        link.onClick && link.onClick(e);
                                    }}
                                    eventKey={isExternalLink(link) ? undefined : link.to}
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
