import Typewriter from 'typewriter-effect';
import { Link, useMatch, useResolvedPath } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="nav">
            <Link to="/" className="site-title">
                <Typewriter
                    options={{
                        strings: "GeoExplorer.",
                        autoStart: true,
                        loop: false,
                        cursor: '_',
                    }}
                />
            </Link>
            <ul>
                <CustomLink to="/about">About</CustomLink>
            </ul>
        </nav>
    );
}

function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname, end: true });

    return (
        <li className={isActive ? "active" : ""}>
            <Link to={to} {...props}>
                {children}
            </Link>
        </li>
    );
}
