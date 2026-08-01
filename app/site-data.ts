export type Service = {
  slug: string;
  eyebrow: string;
  title: string;
  shortTitle: string;
  summary: string;
  description: string;
  image: string;
  imageAlt: string;
  highlights: string[];
  outcomes: { label: string; detail: string }[];
};

export const company = {
  name: "American Snow & Ice Solutions",
  phone: "(610) 760-0600",
  phoneHref: "tel:+16107600600",
  email: "info@americansnowandice.com",
  emailHref: "mailto:info@americansnowandice.com",
  address: "4531 Lehigh Drive, Walnutport, PA 18088",
};

export const services: Service[] = [
  {
    slug: "commercial-plowing",
    eyebrow: "01 / Heavy operations",
    title: "Commercial snow plowing",
    shortTitle: "Plowing",
    summary: "Modern equipment, roving supervisors, and property-specific routing built for demanding commercial sites.",
    description:
      "American Snow & Ice Solutions pairs advanced plowing equipment with an operating plan built around your entrances, loading zones, traffic patterns, and opening times. Roving snow supervisors remain available throughout every winter event so emerging issues can be addressed quickly.",
    image: "/media/operations/commercial-plowing.jpg",
    imageAlt: "Commercial snow equipment staged for a winter event",
    highlights: ["Extended-wing and V-plows", "Containment plows and loaders", "Roving snow supervisors", "Priority-based site routing"],
    outcomes: [
      { label: "Faster clearance", detail: "Equipment is matched to the scale and movement patterns of each property." },
      { label: "Cleaner surfaces", detail: "Modern containment plows help reduce hardpack and residual snow." },
      { label: "Direct response", detail: "Clients can reach a snow supervisor when conditions change." },
    ],
  },
  {
    slug: "deicing-salting",
    eyebrow: "02 / Surface safety",
    title: "De-icing & salting",
    shortTitle: "De-icing",
    summary: "Temperature-aware pre-treatment, in-event applications, and post-storm service for safer surfaces.",
    description:
      "Ice control begins before accumulation. We select products for the expected temperature, pre-treat parking areas and walks, monitor conditions during the event, and perform a final treatment after the storm to reduce bonding, hardpack, and slip exposure.",
    image: "/media/operations/deicing.jpg",
    imageAlt: "Commercial de-icing material being loaded for application",
    highlights: ["12–24 hour pre-treatment window", "Temperature-matched materials", "In-event monitoring", "Post-event treatment"],
    outcomes: [
      { label: "Early defense", detail: "Pre-treatment helps prevent snow and ice from bonding to pavement." },
      { label: "Safer access", detail: "Entrances, walks, lots, and service areas stay central to the plan." },
      { label: "Material records", detail: "Applications can be documented as part of the event record." },
    ],
  },
  {
    slug: "sidewalks-walkways",
    eyebrow: "03 / Pedestrian zones",
    title: "Sidewalks & walkways",
    shortTitle: "Sidewalks",
    summary: "Specialized compact equipment and trained crews keep pedestrian routes open and dependable.",
    description:
      "Sidewalk service is a specialized operation, not an afterthought. Dedicated compact machines cover more ground consistently, while crews focus on entries, ramps, stairs, crossings, and other high-priority pedestrian zones.",
    image: "/media/operations/sidewalks.jpg",
    imageAlt: "Crew clearing a commercial sidewalk after snowfall",
    highlights: ["Dedicated sidewalk equipment", "Entrances and ADA routes", "Stairs, ramps, and crossings", "Coordinated de-icer application"],
    outcomes: [
      { label: "Consistent coverage", detail: "Purpose-built equipment reduces reliance on large hand-shoveling crews." },
      { label: "Open pathways", detail: "Critical pedestrian routes are prioritized in the site plan." },
      { label: "Coordinated service", detail: "Walkway work stays aligned with parking-lot operations." },
    ],
  },
  {
    slug: "weather-reporting",
    eyebrow: "04 / Decision intelligence",
    title: "Weather reporting",
    shortTitle: "Weather reporting",
    summary: "Professional forecasting, certified event records, and real-time field documentation inform every move.",
    description:
      "We combine forecast intelligence from The Weather Pros, certified post-event reporting, and field updates through Yeti Snow Management. The result is a clearer operating picture before, during, and after each winter event.",
    image: "/media/operations/night-operations.jpg",
    imageAlt: "Snow loader operating at night during winter response",
    highlights: ["Pre-storm forecast intelligence", "Live field observations", "Geo-fenced service records", "Post-event reporting"],
    outcomes: [
      { label: "Better timing", detail: "Forecast updates guide mobilization and treatment decisions." },
      { label: "Site visibility", detail: "Teams record conditions, temperatures, activity, and completion status." },
      { label: "Event documentation", detail: "Clients receive a more complete record of what happened and when." },
    ],
  },
  {
    slug: "risk-management",
    eyebrow: "05 / Operational continuity",
    title: "Winter risk management",
    shortTitle: "Risk management",
    summary: "A property-specific plan aligned to your people, traffic, operating hours, and highest-consequence areas.",
    description:
      "Every property has different winter pressures. A warehouse must keep trucks moving, a retail center must open safely, and an office campus must protect employee access. We identify those priorities before pricing and build a response plan around them.",
    image: "/media/operations/risk-management.jpg",
    imageAlt: "Commercial plow truck clearing snow during an active storm",
    highlights: ["Pre-season property review", "Priority-zone planning", "Client communication protocol", "Before-and-after documentation"],
    outcomes: [
      { label: "Fewer surprises", detail: "Site risks and service priorities are discussed before the first event." },
      { label: "Business continuity", detail: "The plan is aligned to deliveries, shifts, openings, and traffic flow." },
      { label: "Stronger records", detail: "Weather and service documentation support post-event review." },
    ],
  },
];

export const serviceAreas = [
  "Allentown", "Bethlehem", "Easton", "Nazareth", "Northampton", "Walnutport", "Whitehall", "Center Valley",
  "Fogelsville", "Macungie", "Emmaus", "Coopersburg", "Quakertown", "Kutztown", "Reading", "Pottstown",
  "Palmerton", "Lehighton", "Hazleton", "Jim Thorpe", "Bangor", "Wind Gap", "New Tripoli", "Orefield",
  "Eastern Pennsylvania", "Western New Jersey", "Southern New York", "Northern Delaware",
];

export const propertyTypes = [
  "Industrial & warehouse",
  "Retail & shopping centers",
  "Medical & healthcare",
  "Office & corporate campuses",
  "Multi-site portfolios",
  "Distribution & logistics",
];
