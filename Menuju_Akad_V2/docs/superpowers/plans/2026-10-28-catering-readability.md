# Catering readability refresh

The user deferred sidebar restructuring and requested a focused visual cleanup of saved catering menus and calculation inputs. They supplied a cutlery-pattern image and permitted adapting it as SVG in the project's green palette, with a soft matte grain texture. Customer-facing Buffet wording should become Prasmanan.

## Implementation

- Recreated the supplied visual direction as a small repeating SVG of cutlery silhouettes in sage greens, with a subtle SVG turbulence grain. Pattern remains behind opaque readable menu cards.
- Saved menus now separate category, dish/package name, vendor, portions, pricing basis and total. The combined total has its own block. Long package contents and notes expand using native accessible details controls; edit/delete retain their existing callbacks.
- Calculation inputs now follow three labeled steps: guest count, guest reserve and serving distribution. Explanations define prasmanan and gubukan, while the result explicitly separates base guests, reserve and total. Existing automatic guest quotas, manual inputs, calculation formulas and saved pricing modes remain in use.
- Replaced visible Buffet wording in the active customer page, catalog categories and legacy catering preview. Internal enum/property identifiers stay compatible with saved records.
- Sidebar organization is unchanged. No existing customer records were edited; browser checks used isolated guest contexts and local trial fixtures.

## Validation

- Five existing catering calculator/menu unit tests passed; TypeScript and scoped ESLint passed.
- Browser verification on the running local application passed for 1440, 768, 375 and 320 pixel layouts, with no horizontal overflow. Verified mixed pricing totals, manual/automatic guest input, expandable package details, edit dialog, Prasmanan category and empty state.
- Desktop and mobile screenshots were inspected. Temporary scripts and screenshots remain in ignored .review-tmp.

## Color refinement

The user requested matching the cutlery pattern to the Estimasi tamu flower ornament and replacing warm tinted inner blocks with white. Cutlery now uses the same #087f5b green and 0.28 opacity as the flower, with the outer panel using the summary card's subtle background. Total cost, empty state, note, menu cards and menu totals use the white surface token; borders and supporting text use existing project tokens. Browser computed-style checks confirmed matching background/opacity, white total/empty/note blocks and no horizontal overflow at 375 pixels. Formatting passed and the mobile screenshot was inspected.
