# IBIZA I WAS HERE — Product & Technical Notes

_Last updated: 30 September 2026_

## Core idea

**IBIZA I WAS HERE** is a collective digital artwork built from **1,000,000 real memories of Ibiza**.

**ONE MILLION MEMORIES. ONE IMAGE OF IBIZA.**

- €1 = one memory = one equal place in the artwork.
- Every participant occupies exactly the same visual space.
- No premium positions, VIP placements or better locations.
- The artwork is complete when memory #1,000,000 is added, regardless of how long that takes.
- Memories can come from any year: the project is an organic visual archive of generations of Ibiza.
- Core secondary line: **Every memory finds its place.**
- Strategic principle: **1,000,000 is the artwork, not the forecast.**

## Participant journey

Target flow:

1. Add Your Memory.
2. Upload one photograph.
3. Add name and year.
4. The system prepares/reserves a position.
5. €1 payment via Revolut Business / Merchant API.
6. Payment confirmation.
7. The memory is published in its assigned place.
8. Participant receives a permanent Memory number and URL.
9. Opening that URL launches the artwork and travels to the exact memory.
10. A shareable social/passport asset can be generated later.

Payment integration is intentionally being left until the rest of the technological flow is proven.

## Artwork architecture

The artwork has **1,000 × 1,000 logical positions = 1,000,000 memories**.

The browser must never attempt to download one million individual photographs at once. The artwork is designed as a multiresolution / deep-zoom system:

- At distance: pre-rendered composite tiles.
- As the visitor zooms: progressively higher-resolution tiles.
- At memory level: the individual participant image can be loaded.
- OpenSeadragon is the current deep-zoom viewer.
- Each memory has a permanent normalized X/Y position plus grid coordinates.
- The current prototype has already demonstrated an image-anchored memory point that remains fixed through zoom and pan.

## Scale and cost

### Database

One million PostgreSQL/Supabase rows is a normal, manageable dataset. Each record contains lightweight metadata such as memory number, name, year, coordinates, image path, publication state and payment state. Database row count is not expected to be the main cost driver.

### Image storage

Photography is the important storage variable.

Illustrative scale:
- 1,000,000 originals averaging 5 MB = approximately 5 TB.
- 1,000,000 optimized retained images averaging 300 KB = approximately 300 GB.
- 1,000,000 optimized retained images averaging 500 KB = approximately 500 GB.

The upload pipeline should therefore create optimized derivatives. A later product/legal decision will determine whether full originals need to be retained after processing.

### Delivery / bandwidth

The public artwork should be served as deep-zoom composite tiles rather than as one million independent image requests. This makes visitor traffic proportional to what they actually view, not to the total number of memories in the artwork.

### Contacts / CRM

One million participants do **not** need to become one million paid CRM contacts. Participant identity/email can live with the project data where appropriate. A person should only enter a marketing platform when there is an actual marketing purpose and the appropriate consent/legal basis. This prevents unnecessary CRM cost as well as keeping participation separate from marketing.

## Current backend

A dedicated Supabase project exists in EU West for IBIZA I WAS HERE.

The initial `memories` model includes:
- UUID
- sequential Memory number
- public slug
- participant name
- memory year
- image path and dimensions
- dominant colour fields for future placement logic
- grid X/Y
- normalized X/Y
- payment status
- publication status
- payment provider/reference
- timestamps

Row Level Security is enabled. Public access is limited to published memories; anonymous writes are not enabled.

## Payment

Current decision: **Revolut**, not Stripe.

The €1 price is a conceptual part of the artwork and should not be increased merely to improve payment margin. Processing fees are treated as a cost of participation. At meaningful volume, commercial pricing can be negotiated with the payment provider.

## Founding presentation — key technical message

The project is not designed as a conventional website that somehow has to survive one million photographs. It is being architected from the beginning as **one enormous navigable image composed of one million independently addressable memories**.

That distinction is what makes the scale technically and economically manageable.


## Partner-ready status — 30 September 2026

The current MVP journey is working end to end on desktop and mobile:

**ADD YOUR MEMORY → photo → name + year → FIND MY PLACE → €1 transition → ADD MY MEMORY → creation/confirmation → automatic flight to assigned position → Memory card → PASSPORT / SHARE → individual Memory URL.**

Current payment remains a demo transition: the €1 screen is final UX structure, but no charge is made yet. Revolut will be inserted at this exact point without redesigning the journey.

Validated in real use:
- Published memories load into the artwork and increment the live counter.
- Individual Memory URLs open the artwork and travel directly to the correct memory, including on iPhone.
- Passport generates a real 1080 × 1350 JPEG suitable for social posting.
- Passport sharing has been tested from mobile and the resulting asset has been published successfully to Instagram.
- SHARE uses the individual Memory URL.
- Mobile navigation includes OVERVIEW, ABOUT and FIND MY MEMORY.
- On mobile, the first interaction with the artwork dismisses the Overview so the image can be explored cleanly.
- ABOUT and FAQ are implemented below the artwork.
- Mobile QA has covered artwork exploration, navigation, direct Memory links, forms and the sharing journey.

### Freeze point before creative direction

The functional/product base is now sufficiently complete for partner presentation. Avoid further visual direction changes until Javi, proposed Creative Director for campaign and final look and feel, has reviewed the project.

The current master photograph is provisional. Andrés Iglesias is expected to create the final Master Image. The architecture must allow that image to be swapped without changing the product logic.

The red TEST MEMORY marker is intentionally retained for the partner demo because it teaches the interaction. It must be removed before public launch once real discovery mechanisms and sufficient memories exist.

### Final partner-ready cleanup

Before presenting, only perform a controlled cleanup:
- Use one stable preview URL so partners are not accidentally shown historical Vercel deployments.
- Recheck desktop once after the mobile-only responsive work.
- Remove visible laboratory language such as DEMO MODE or Prototype interaction where inappropriate for the presentation.
- Keep TEST MEMORY for the partner demo as noted above.
- Do not introduce further aesthetic redesign before creative review.

## Required before public launch

These items are deliberately **not blockers for the partner presentation**, but must be resolved before a real public launch:

1. **Revolut payment.** Connect Revolut Business / Merchant API to the existing €1 transition and publish a memory only after the required payment confirmation flow.
2. **Tax and invoicing.** Confirm the fiscal treatment of the €1 participation, VAT/OSS implications for international buyers, invoicing requirements and the minimum customer data that must be collected.
3. **Legal framework.** Finalise Terms, Privacy, participant photo rights/licence, consent to publication and a removal/takedown process.
4. **Final Master Image.** Replace the temporary external Unsplash image with Andrés Iglesias's final artwork and host the production asset under infrastructure controlled by the project rather than relying on a third-party image URL.
5. **Final placement algorithm.** Replace temporary sequential placement with the intended colour/light/visual matching system while preserving equal-sized positions for every participant.
6. **Production image pipeline and deep zoom.** Build optimized derivatives and composite multiresolution tiles so the browser never attempts to render hundreds of thousands of individual photographs simultaneously.
7. **Production domain.** Connect ibizaiwashere.com and ensure every individual Memory URL lives under that stable domain.
8. **Social metadata.** Add appropriate Open Graph/social preview metadata so Memory links shared through messaging and social platforms have a deliberate preview.
9. **Post-purchase delivery.** Define the receipt/email experience after participation, including confirmation, individual Memory URL and access to the Passport.
10. **Launch seeding.** Launch with a meaningful first body of authentic Ibiza memories contributed by real people connected to the island. Do not fake participant volume.

### Launch principle

The artwork should not manufacture participation to make the counter look larger. Early seeding should consist of genuine memories. The project grows publicly from real participation, while **1,000,000 remains the artwork, not the forecast**.
