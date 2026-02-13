# Nothingness - GitHub Copilot Instructions
This is a modern flashcard application built with Next.js. Consult the relevant rule files in `.cursor/rules/` when working in their domains.

## Rules Index
| Rule File | When to consult |
|---|---|
| architecture-centralized-routes.mdc | Apply when defining, refactoring, or scaling app routing to keep routes centralized and consistent. |
| architecture-data-handling.mdc | Apply when designing data flow, fetching, caching, and handling loading/error states in features. |
| architecture-database-drizzle.mdc | Apply when modeling schemas, writing queries, or running migrations using Drizzle ORM. |
| architecture-shadcn-ui.mdc | Apply when adding or customizing shadcn/ui components, styling, theming, or accessibility. |
| architecture-source-organisation.mdc | Apply when creating, moving, or naming files and folders to maintain the project structure. |
| documentation-management.mdc | Apply when writing, updating, or organizing documentation, ADRs, and guidelines. |
| language-internationalization.mdc | Apply when adding translatable strings, locales, or formatting messages for multiple languages. |
| language-preference.mdc | Apply when detecting, storing, or switching the user’s language preference with fallbacks. |
| security-authentication-authorization.mdc | Apply when implementing auth flows, roles/permissions, and protecting routes or APIs. |
| seo-sitemap-robots.mdc | Apply when configuring SEO metadata, generating sitemaps, or setting robots.txt rules. |
| ui-navigation-icons.mdc | Apply when designing navigation structure or selecting and using icons with proper naming and accessibility. |

## Agent Behavior
1. **Context efficiency**: Don't load all rules—consult only those relevant to the current task
2. **Run validation**: Always run `flutter analyze` after Dart changes
3. **Reference docs**: Point to existing documentation rather than re-explaining