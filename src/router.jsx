import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const RouterContext = createContext({
  pathname: "/",
  search: "",
  navigate: () => {},
});
const ParamsContext = createContext({});

function currentLocation() {
  return {
    pathname: window.location.pathname || "/",
    search: window.location.search || "",
  };
}

export function BrowserRouter({ children }) {
  const [location, setLocation] = useState(currentLocation);

  useEffect(() => {
    const update = () => setLocation(currentLocation());
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);

  function navigate(to, { replace = false } = {}) {
    const next = new URL(to, window.location.href);
    const nextPath = `${next.pathname}${next.search}${next.hash}`;
    if (replace) window.history.replaceState({}, "", nextPath);
    else window.history.pushState({}, "", nextPath);
    setLocation(currentLocation());
  }

  const value = useMemo(
    () => ({ ...location, navigate }),
    // navigate intentionally changes with location; consumers always receive the latest closure.
    [location],
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useLocation() {
  return useContext(RouterContext);
}

export function useParams() {
  return useContext(ParamsContext);
}

export function useSearchParams() {
  const location = useContext(RouterContext);
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);

  function setSearchParams(nextInit, options = {}) {
    const next =
      nextInit instanceof URLSearchParams
        ? nextInit
        : new URLSearchParams(typeof nextInit === "object" ? nextInit : String(nextInit));
    const query = next.toString();
    location.navigate(`${location.pathname}${query ? `?${query}` : ""}`, options);
  }

  return [params, setSearchParams];
}

function shouldHandleLink(event, target) {
  return (
    !event.defaultPrevented &&
    event.button === 0 &&
    !event.metaKey &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    (!target || target === "_self")
  );
}

export function Link({ to, children, onClick, target, ...props }) {
  const { navigate } = useContext(RouterContext);
  function activate(event) {
    onClick?.(event);
    if (!shouldHandleLink(event, target)) return;
    const destination = new URL(to, window.location.href);
    if (destination.origin !== window.location.origin) return;
    event.preventDefault();
    navigate(`${destination.pathname}${destination.search}${destination.hash}`);
  }
  return (
    <a href={to} target={target} onClick={activate} {...props}>
      {children}
    </a>
  );
}

export function NavLink({ to, className = "", children, ...props }) {
  const { pathname } = useContext(RouterContext);
  const active = to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(`${to}/`);
  return (
    <Link
      to={to}
      className={`${typeof className === "string" ? className : ""}${active ? " active" : ""}`.trim()}
      aria-current={active ? "page" : undefined}
      {...props}
    >
      {children}
    </Link>
  );
}

function matchPath(pattern, pathname) {
  if (pattern === "*") return { matched: true, params: {} };
  const patternParts = pattern.split("/").filter(Boolean);
  const pathParts = pathname.split("/").filter(Boolean);
  if (patternParts.length !== pathParts.length) return { matched: false, params: {} };

  const params = {};
  for (let index = 0; index < patternParts.length; index += 1) {
    const expected = patternParts[index];
    const actual = pathParts[index];
    if (expected.startsWith(":")) {
      params[expected.slice(1)] = decodeURIComponent(actual);
    } else if (expected !== actual) {
      return { matched: false, params: {} };
    }
  }
  return { matched: true, params };
}

export function Route() {
  return null;
}

export function Routes({ children }) {
  const { pathname } = useContext(RouterContext);
  const candidates = Children.toArray(children).filter(isValidElement);
  for (const candidate of candidates) {
    const result = matchPath(candidate.props.path, pathname);
    if (result.matched) {
      return (
        <ParamsContext.Provider value={result.params}>
          {candidate.props.element}
        </ParamsContext.Provider>
      );
    }
  }
  return null;
}

export function Navigate({ to, replace = false }) {
  const { navigate } = useContext(RouterContext);
  useEffect(() => {
    navigate(to, { replace });
  }, [navigate, replace, to]);
  return null;
}
