# Remove the 45MW Brownfield Site and fill the marketplace

## 1. Delete the 45MW Brownfield Site
- Delete the listing "45MW Brownfield Site" (near 53.80, -112.90, Alberta).
- Also delete everything connected to it: photos, watchlist saves, documents, NDA requests, LOIs, conversations and messages, due diligence items, reviews, contact messages and portfolio entries.
- Keep the S19J Pro listing.
- No app code needs to change. The word "Brownfield" in the create-listing form is just a site-type option, not this listing.

## 2. Add 6 demo seller companies
Made-up but realistic company names, for example Prairie Power Assets (Calgary), Northern Grid Land Co. (Edmonton), Lone Star Powered Land (Dallas), Permian Energy Sites (Midland), HashFleet Equipment (Houston) and Maple Mining Supply (Calgary).
- Each one gets its own seller profile. Accounts are pre-verified and use random passwords, so nobody can sign in as them.

## 3. Add 24 realistic listings in Alberta and Texas

**12 sites for sale:**
- 5–150 MW, spread across Alberta (Grande Prairie, Drumheller, Medicine Hat, Lethbridge, Fox Creek, Red Deer) and Texas (Abilene, Odessa, Pecos, Sweetwater, Corsicana, Rockdale).
- Mix of greenfield land, powered land, sites next to a substation, sites with a transformer already on site, behind-the-meter gas sites and wind-adjacent sites.
- Each has acreage, voltage, distance to the substation, utility (AESO/ERCOT area), price and a detailed description.
- Prices fall in current market ranges, roughly $150k–$500k per MW depending on energization status.

**12 equipment listings:**
- Miners: Antminer S21, S21 Pro, S19k Pro, S19 XP, T21, Whatsminer M60S, M50S and Avalon A1466. Each has hash rate, price per TH, condition, quantity, year and shipping terms.
- Infrastructure: transformers (2.5 MVA and 5 MVA), immersion cooling tanks and a natural gas generator set.

Existing stock photos for each category will be attached where the marketplace shows images. All listings are active and dated across the last few weeks, so browsing feels natural.

## Technical details
- Delete child rows by listing_id across all 11 related tables, then the listing, using data SQL (no schema change).
- Create demo users with direct inserts into auth.users (confirmed email, random bcrypt password), plus matching voltmarket_profiles with role seller and a seller_type.
- Insert 24 rows into voltmarket_listings using the existing columns: listing_type (site_sale or equipment), power_capacity_mw, square_footage (holds acres), equipment_type/brand/model/condition, th_specification, price_per_th, quantity, shipping_terms and location. The exact column list is confirmed before inserting.
- Finally, confirm the browse page shows 25 listings and the old listing's page returns not found.
