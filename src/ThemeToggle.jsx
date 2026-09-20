import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

// Light or dark for the page content. The sidebar stays dark either way: it is
// the spine the content is set against, and keeping it fixed is what stops the
// light theme reading as a different application.
//
// Self-contained rather than lifted into the app, because the screens that need
// it are not all inside the same tree - sign-in, the check and account setup
// each return before the main shell is reached. Only one of them is ever on
// screen at a time, so there is nothing to keep in step.
const storageKey = "educationHub.contentTheme";

function stored() {
  try {
    return window.localStorage?.getItem(storageKey) ?? "dark";
  } catch {
    return "dark";
  }
}

export function ThemeToggle({ className = "" }) {
  const [theme, setTheme] = useState(stored);

  useEffect(() => {
    document.documentElement.dataset.contentTheme = theme;
    try {
      window.localStorage?.setItem(storageKey, theme);
    } catch {
      // A browser refusing storage is not a reason to refuse the choice.
    }
  }, [theme]);

  const dark = theme === "dark";
  return (
    <button
      className={`theme-toggle ${className}`.trim()}
      onClick={() => setTheme(dark ? "light" : "dark")}
      title={dark ? "Switch the page to a light background" : "Switch the page to a dark background"}
      type="button"
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
      <span>{dark ? "Light page" : "Dark page"}</span>
    </button>
  );
}
