# Translations

This is where internationalization (i18n) for our application resides. This document provides an overview and guidance on how to properly handle translations.

## Structure
* `i18n-type.d.ts`: This file defines the types for all the variables that need to be translated.

* `en.ts`: This file contains the primary (default) English implementation.

* `[language].ts`: These are language-specific files that define translations for each supported language (e.g., `fr.ts` for French).

## Translation Guidelines

1. **Implement All Variables**: Every language-specific file (like fr.ts) must implement all the variables defined in i18n-type.d.ts.

2. **Unknown Translations**: If a translation for a specific term is unknown, you should pass the English implementation to the transparent helper function, `translationNeeded`. For example:
```typescript
    timeRange: translationNeeded(en.analytics.timeRange)
```
3. **Using English Value**: If, for any reason, a specific language should retain the English value without needing a translation, it should be written as:
```typescript
    timeRange: en.analytics.timeRange // translation not needed.
```

Thank you for contributing to our internationalization efforts!
