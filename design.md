# Portfolio design system

## Direction

Centered editorial minimalism: generous white space, compact confident type, quiet dividers, and direct language. Center the page sections. The compact top navigation is the single glass-like surface: a translucent white pill with a centered wordmark, controls at either end, a fine edge, blur, and a soft shadow. Avoid ornamental graphics, gradients, colored badges, and decorative motion.

## Brand colors

| Token | Value | Use |
| --- | --- | --- |
| `--black` | `#111111` | Primary text, dark contact section, focus outlines |
| `--white` | `#FFFFFF` | Main page background and text on black |
| `--gray-050` | `#F7F7F7` | Soft neutral surface for the selected work section |
| `--gray-200` | `#DEDEDE` | Fine rules and quiet separators |
| `--gray-500` | `#747474` | Secondary text, labels, and subtle details on light surfaces |
| `--gray-700` | `#444444` | Paragraph copy requiring stronger contrast |
| `--gray-muted-on-dark` | `#A8A8A8` | Secondary text on the dark contact section |
| `--gray-light-on-dark` | `#C2C2C2` | Supporting copy on the dark contact section |

Use black and white as the dominant pair. Gray values are supporting neutrals only; do not introduce chromatic accents. Keep small text readable and use black for important information.

## Typography

- **DM Sans** for navigation, body copy, labels, and project details.
- **Instrument Serif** for occasional italic emphasis in large display headings.
- Keep headlines moderate in scale and lightly weighted, with tight tracking. Use uppercase sparingly for small section labels.

## Layout and interaction

- Use a consistent responsive page gutter and a maximum content width of `1440px`.
- Center section content and separate it with space and thin neutral rules instead of cards.
- Keep the navigation bar compact and rounded, with centered branding and navigation controls at its left and right edges.
- Omit diagonal arrow icons. Use plain text links and subtle underline feedback for linked projects.
- Use restrained transitions for links only. Preserve visible keyboard focus and honor `prefers-reduced-motion`.
- Keep the layout responsive, readable, and usable without animation or client-side JavaScript.
