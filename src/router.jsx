import { forwardRef } from "react";
import { flushSync } from "react-dom";
import {
  BrowserRouter,
  Link as RouterLink,
  NavLink as RouterNavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useResolvedPath,
  useSearchParams,
} from "react-router";

let activeViewTransition = null;

function reducedMotionRequested() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

export function runViewTransition(update, { kind = "route" } = {}) {
  if (!document.startViewTransition || reducedMotionRequested()) {
    update();
    return null;
  }

  activeViewTransition?.skipTransition?.();
  document.documentElement.dataset.transitionKind = kind;
  document.documentElement.classList.add("is-transitioning");

  const transition = document.startViewTransition(() => {
    flushSync(update);
  });
  activeViewTransition = transition;
  transition.ready.catch(() => {});

  transition.finished
    .catch(() => {})
    .finally(() => {
      if (activeViewTransition === transition) {
        activeViewTransition = null;
        document.documentElement.classList.remove("is-transitioning");
        delete document.documentElement.dataset.transitionKind;
      }
    });

  return transition;
}

function useTransitionClick({
  to,
  onClick,
  target,
  replace,
  state,
  preventScrollReset,
  relative,
  reloadDocument,
  download,
  viewTransition,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const resolved = useResolvedPath(to);

  return (event) => {
    onClick?.(event);

    const isPlainNavigation = !event.defaultPrevented
      && event.button === 0
      && !event.metaKey
      && !event.altKey
      && !event.ctrlKey
      && !event.shiftKey
      && (!target || target === "_self")
      && !reloadDocument
      && download == null;

    if (!isPlainNavigation || !viewTransition) return;

    const sameDestination = !replace
      && state == null
      && resolved.pathname === location.pathname
      && resolved.search === location.search
      && resolved.hash === location.hash;
    if (sameDestination) return;

    event.preventDefault();
    runViewTransition(() => {
      navigate(to, {
        replace,
        state,
        preventScrollReset,
        relative,
        flushSync: true,
      });
    });
  };
}

export const Link = forwardRef(function Link(
  {
    to,
    onClick,
    target,
    replace,
    state,
    preventScrollReset,
    relative,
    reloadDocument,
    download,
    viewTransition = true,
    ...props
  },
  ref,
) {
  const transitionClick = useTransitionClick({
    to,
    onClick,
    target,
    replace,
    state,
    preventScrollReset,
    relative,
    reloadDocument,
    download,
    viewTransition,
  });

  return (
    <RouterLink
      ref={ref}
      to={to}
      onClick={transitionClick}
      target={target}
      replace={replace}
      state={state}
      preventScrollReset={preventScrollReset}
      relative={relative}
      reloadDocument={reloadDocument}
      download={download}
      {...props}
    />
  );
});

export const NavLink = forwardRef(function NavLink(
  {
    to,
    onClick,
    target,
    replace,
    state,
    preventScrollReset,
    relative,
    reloadDocument,
    download,
    className = "",
    viewTransition = true,
    ...props
  },
  ref,
) {
  const transitionClick = useTransitionClick({
    to,
    onClick,
    target,
    replace,
    state,
    preventScrollReset,
    relative,
    reloadDocument,
    download,
    viewTransition,
  });

  return (
    <RouterNavLink
      ref={ref}
      to={to}
      onClick={transitionClick}
      target={target}
      replace={replace}
      state={state}
      preventScrollReset={preventScrollReset}
      relative={relative}
      reloadDocument={reloadDocument}
      download={download}
      className={(state) => {
        const baseClassName = typeof className === "function" ? className(state) : className;
        return [baseClassName, state.isActive ? "active" : ""].filter(Boolean).join(" ");
      }}
      {...props}
    />
  );
});

export {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
  useSearchParams,
};
