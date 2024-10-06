export default defineNuxtRouteMiddleware((to, from) => {
  const hasEnPrefix = (path: string) =>
    path.startsWith("/en") || path === "/en"; // Handles `/en` and `/en/`

  const toPathWithoutPrefix = to.fullPath.replace("/en", "");
  const fromPathWithoutPrefix = from.fullPath.replace("/en", "") || "/"; // Handles `/en` and `/en/`

  const fromPathWithoutHash = fromPathWithoutPrefix.split("#")[0];

  // Handle the case where `/en/` and `/` are treated as the same root language change
  const isSamePathWithoutLanguage = toPathWithoutPrefix === fromPathWithoutHash;

  // 1. If going from `/path` to `/en/path` or `/en/path` to `/path`, we're changing the language
  if (isSamePathWithoutLanguage) {
    if (!hasEnPrefix(to.path)) {
      // console.log('Switching to non-English version');
    } else {
      // console.log('Switching to English version');
    }
    return; // No need for a redirect as the language change happens
  }

  // 2. If the base path differs (e.g., /en/drivers → /events), but keep the language
  if (hasEnPrefix(from.path) && !hasEnPrefix(to.path)) {
    const newPathWithPrefix = `/en${toPathWithoutPrefix}`;
    // console.log('Changing site section, keeping English version');
    return navigateTo(newPathWithPrefix); // Redirect to `/en` version of the new path
  }

  if (!hasEnPrefix(from.path) && hasEnPrefix(to.path)) {
    // We're coming from a non-English path to an English path
    // console.log('Switching to English');
    return; // The user is already going to the correct path, no action needed
  }

  // console.log('Changing site section without changing the language');
});
