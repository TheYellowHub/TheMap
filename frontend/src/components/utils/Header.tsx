import { useEffect, useState } from "react";
import { Image, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { EventKey, SelectCallback } from "@restart/ui/esm/types";

import useAuth from "../../auth/useAuth";
import Icon from "./Icon";
import { Link } from "react-router-dom";
import useUser from "../../hooks/auth/useUsers";
import { useUserReviews } from "../../hooks/doctors/useReviews";

function Header() {
    const [selectedPage, setSelectedPage] = useState<EventKey>("");
    const [selectedSubMenu, setSelectedSubMenu] = useState<EventKey | null>(null);

    const { user, isAuthenticated, isAdmin, login, logout, deleteAccount } = useAuth();
    const { userInfo } = useUser(user);
    const userReviews = userInfo && useUserReviews(userInfo).data;

    type Link = {
        title: string;
        to: string;
        onClick?: React.MouseEventHandler;
        newWindow?: boolean;
        icon?: string;
    };

    type Title = {
        title: string;
        to: undefined;
    };

    type Separator = "Separator";

    type LinksGroup = {
        title: string;
        links: (Link | Title | Separator)[];
        icon?: string;
    };

    const [links, setLinks] = useState<(Link | LinksGroup)[]>([]);

    function getMenuItemContent(link: Link) {
        return (
            <>
                {link.icon && (
                    <div className="navbar-icon-border">
                        <Icon icon={link.icon} padding={false} solid={false} />
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
            {
                title: `${user?.email || user?.nickname}`,
                to: undefined,
            },
            {
                to: "/user/saved",
                title: `Saved Providers ${userInfo?.savedDoctors ? "(" + userInfo.savedDoctors?.length + ")" : ""}`,
                icon: "fa-bookmark",
            },
            {
                to: "/user/reviews",
                title: `My reviews ${userReviews !== undefined ? "(" + userReviews.length + ")" : ""}`,
                icon: "fa-star",
            },
            {
                to: "/",
                onClick: logout,
                title: "Log out",
                icon: "fa-power-off",
            },
            "Separator" as Separator,
            {
                to: "/",
                onClick: deleteAccount,
                title: "Delete account",
            },
        ],
    };

    const adminMenu = {
        title: "Admin",
        links: [
            {
                to: "/admin/doctors",
                title: "Doctors",
            },
            {
                to: "/admin/categories",
                title: "Categories",
            },
            {
                to: "/admin/specialities",
                title: "Specialities",
            },
            {
                to: "/admin/reviews",
                title: "Reviews",
            },
        ],
    };

    useEffect(() => {
        const newLinks: (Link | LinksGroup)[] = [...publicLinks];
        if (user && isAuthenticated) {
            newLinks.push(userMenu);
            if (isAdmin) {
                newLinks.push(adminMenu);
            }
        } else {
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
            <Nav.Link as={Link} to="http://theyellowhub.org/" target="_blank" className="no-padding">
                <Navbar.Brand>
                    <Image src={"/images/logo.svg"} className="logo" />
                </Navbar.Brand>
            </Nav.Link>
            
            <Navbar.Toggle aria-controls="navbarCollapse" />

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
                                    {dropdown.links.map((link, index) => 
                                        link === "Separator" 
                                        ? <div  key={`Separator-${index}`} className="d-flex justify-content-center"><img src="images/line.png" width="90%"/></div>
                                        : link.to === undefined
                                        ? <div className="dropdown-title med-grey">{link.title}</div>
                                        : (<NavDropdown.Item
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
