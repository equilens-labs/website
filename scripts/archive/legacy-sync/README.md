# Legacy Synchronisation Scripts

These scripts supported earlier navigation and theme experiments. They are
retained for historical reference but are **not** used in the current build
pipeline.

## Archived utilities

| Script | Purpose | Notes |
| --- | --- | --- |
| `sync_nav.py` | Hard-coded HTML injection for the primary navigation | Superseded by `scripts/content/sync_nav_ssot.py` |
| `sync_nav_appline.py` | Tailwind/“appline” theme variant of the nav sync | Theme migration was abandoned |
| `ensure_dark_theme.py` | Post-process helper that injected the dark theme bundle | Relied on the deprecated appline assets |
| `inject_theme_head.py` | Added appline CSS/JS to page heads during theming tests | Not referenced by current workflows |

## Current approach

The live site relies on the JSON single source of truth (SSOT) scripts:

```bash
python3 scripts/content/sync_nav_ssot.py
python3 scripts/content/sync_footer_ssot.py
```

Only these SSOT scripts should be used for future navigation or footer changes.
