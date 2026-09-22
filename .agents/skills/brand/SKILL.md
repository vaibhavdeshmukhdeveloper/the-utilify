---
name: brand
description: Brand voice, visual identity, messaging frameworks, asset management, brand consistency. Activate for branded content, tone of voice, marketing assets, brand compliance, style guides.
argument-hint: "[update|review|create] [args]"
metadata:
  author: claudekit
  version: "1.0.0"
---

# Brand

Brand identity, voice, messaging, asset management, and consistency frameworks.

## When to Use

- Brand voice definition and content tone guidance
- Visual identity standards and style guide development
- Messaging framework creation
- Brand consistency review and audit
- Asset organization, naming, and approval
- Color palette management and typography specs

## Quick Start

> **Note:** Scripts for this skill are located in `.agents/skills/brand/scripts/`. Run from repository root as shown below or cd into `.agents/skills/brand`. The primary application tokens for The Utilify are defined in `src/app/globals.css`.

**Inject brand context into prompts:**
```bash
node .agents/skills/brand/scripts/inject-brand-context.cjs
node .agents/skills/brand/scripts/inject-brand-context.cjs --json
```

**Validate an asset:**
```bash
node .agents/skills/brand/scripts/validate-asset.cjs <asset-path>
```

**Extract/compare colors:**
```bash
node .agents/skills/brand/scripts/extract-colors.cjs --palette
node .agents/skills/brand/scripts/extract-colors.cjs <image-path>
```

## Brand Sync Workflow

```bash
# 1. Edit brand guidelines or template in .agents/skills/brand/templates/
# 2. Sync to design tokens
node .agents/skills/brand/scripts/sync-brand-to-tokens.cjs
# 3. Verify
node .agents/skills/brand/scripts/inject-brand-context.cjs --json
```

**Files synced:**
- Brand Guidelines → Source of truth
- `assets/design-tokens.json` → Token definitions
- `src/app/globals.css` / `assets/design-tokens.css` → CSS variables

## Subcommands

| Subcommand | Description | Reference |
|------------|-------------|-----------|
| `update` | Update brand identity and sync to all design systems | `references/update.md` |

## References

| Topic | File |
|-------|------|
| Voice Framework | `references/voice-framework.md` |
| Visual Identity | `references/visual-identity.md` |
| Messaging | `references/messaging-framework.md` |
| Consistency | `references/consistency-checklist.md` |
| Guidelines Template | `references/brand-guideline-template.md` |
| Asset Organization | `references/asset-organization.md` |
| Color Management | `references/color-palette-management.md` |
| Typography | `references/typography-specifications.md` |
| Logo Usage | `references/logo-usage-rules.md` |
| Approval Checklist | `references/approval-checklist.md` |

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/inject-brand-context.cjs` | Extract brand context for prompt injection |
| `scripts/sync-brand-to-tokens.cjs` | Sync brand-guidelines.md → design-tokens.json/css |
| `scripts/validate-asset.cjs` | Validate asset naming, size, format |
| `scripts/extract-colors.cjs` | Extract and compare colors against palette |

## Templates

| Template | Purpose |
|----------|---------|
| `templates/brand-guidelines-starter.md` | Complete starter template for new brands |

## Routing

1. Parse subcommand from `$ARGUMENTS` (first word)
2. Load corresponding `references/{subcommand}.md`
3. Execute with remaining arguments
