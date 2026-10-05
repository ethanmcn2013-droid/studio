"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { HomeHeader } from "@/components/home/home-header";
import { HOME_THEME_COLOR, THEME_KEY, type HomeTheme } from "@/components/home/theme-color";

/** Uses the landing page's theme preference without loading its product demos. */
export function MarketingShell({ children, page }: { children: ReactNode; page: "about" | "pricing" }) {
  const root = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    let theme: string | null = new URLSearchParams(location.search).get("theme");
    try { theme ??= localStorage.getItem(THEME_KEY); } catch {}
    if (theme !== "light" && theme !== "dark") theme = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    element.dataset.theme = theme;
    element.classList.add("js");
  }, []);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const toggles = element.querySelectorAll<HTMLButtonElement>("[data-theme-toggle]");
    const menu = element.querySelector<HTMLDetailsElement>("details.menu");
    const nav = element.querySelector("#nav");
    const meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.prepend(meta);
    const paint = () => {
      const theme = element.dataset.theme as HomeTheme;
      const label = `Switch to ${theme === "dark" ? "light" : "dark"} theme`;
      meta.content = HOME_THEME_COLOR[theme];
      toggles.forEach(button => {
        if (button.id === "theme") button.setAttribute("aria-label", label);
        else button.textContent = label;
      });
    };
    const toggle = () => {
      element.dataset.theme = element.dataset.theme === "dark" ? "light" : "dark";
      try { localStorage.setItem(THEME_KEY, element.dataset.theme); } catch {}
      const url = new URL(location.href);
      url.searchParams.delete("theme");
      history.replaceState(history.state, "", url);
      paint();
    };
    const close = () => { if (menu) menu.open = false; };
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menu?.open) { close(); menu.querySelector("summary")?.focus(); }
    };
    const outside = (event: PointerEvent) => { if (menu?.open && !menu.contains(event.target as Node)) close(); };
    const blur = (event: FocusEvent) => { if (event.relatedTarget && !menu?.contains(event.relatedTarget as Node)) close(); };
    const scroll = () => nav?.classList.toggle("scrolled", window.scrollY > 8);
    const links = element.querySelectorAll(".menu-panel a");
    toggles.forEach(button => button.addEventListener("click", toggle));
    links.forEach(link => link.addEventListener("click", close));
    document.addEventListener("keydown", key);
    document.addEventListener("pointerdown", outside);
    menu?.addEventListener("focusout", blur);
    window.addEventListener("scroll", scroll, { passive: true });
    paint(); scroll();
    return () => {
      meta.remove();
      toggles.forEach(button => button.removeEventListener("click", toggle));
      links.forEach(link => link.removeEventListener("click", close));
      document.removeEventListener("keydown", key);
      document.removeEventListener("pointerdown", outside);
      menu?.removeEventListener("focusout", blur);
      window.removeEventListener("scroll", scroll);
    };
  }, []);
  return <div ref={root} className={`lp ${page}-page`} data-theme="dark" suppressHydrationWarning><HomeHeader page={page} />{children}</div>;
}
