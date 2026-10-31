/* Every number that decides how Dot moves, in one place, with its unit and
   the reason for it. Speeds are in px/s at the page's own scale; rates are
   per second, so they do not depend on the frame rate.

   Ported from Dot Engine 4 (ethan-mcnamara.com src/js/dot/tuning.mjs). The
   values are the canon's, unchanged. Holding and throwing, and the Faces 2
   numbers, are left out: the footer Dot is never picked up and never melts. */

export const TUNING = {
  // Time.
  hz: 120,                  // simulation steps per second: fine enough for a 144 Hz screen to interpolate
  maxSteps: 30,             // steps per frame before the clock gives up: a quarter of a second of catch-up

  // The world.
  gravity: 2600,            // px/s²: a hop of 1.4 radii takes about a third of a second, which reads as light
  airDrag: 0.15,            // 1/s: horizontal speed lost in the air, barely; throws carry
  floorFriction: 7,         // 1/s: a slide on the floor stops within a body width
  rollFriction: 1.1,        // 1/s: a roll keeps going, so rolling off in a huff crosses the stage
  rollSettle: 30,           // px/s: below this a roll stops and Dot rocks upright

  // Landing.
  softLanding: 90,          // px/s: slower than this, no squash and no sound
  bounceAbove: 420,         // px/s: faster than this, Dot bounces instead of stopping
  bounceKeep: 0.3,          // share of the landing speed kept in the bounce
  bounceSlide: 0.7,         // share of horizontal speed kept through a bounce
  stopSlide: 0.5,           // share kept when a landing stops Dot
  puffsAbove: 900,          // px/s: dust puffs on landings harder than this
  morePuffsAbove: 1800,     // px/s: and a second pair above this
  dizzyAbove: 1500,         // px/s: a drop this hard leaves Dot seeing stars, once per fall
  squashPerSpeed: 1 / 105,  // stretch velocity lost per px/s of landing speed
  wobblePerSpeed: 1 / 2600, // wobble added per px/s of landing speed

  // Walls.
  wallBounceAbove: 120,     // px/s: slower than this, a wall just stops Dot
  wallKeep: 0.45,           // share of speed kept off a wall
  wallSquash: 1 / 220,      // stretch velocity per px/s into a wall
  wallWobble: 1 / 1400,     // wobble per px/s into a wall

  // The body.
  stretchRange: [0.55, 1.6] as const, // how far the body may squash or stretch
  airStretch: 1 / 4200,     // stretch per px/s of speed in the air
  airStretchMax: 0.2,       // a smear, capped so fast throws stay readable
  breathRate: [0.28, 0.35] as const, // breaths per second at no energy, plus this much at full energy
  sleepBreath: 0.22,        // breaths per second asleep
  breathDepth: 0.014,       // stretch amplitude awake
  sleepBreathDepth: 0.03,   // and asleep
  wobbleRate: 9,            // rad/s: how fast the wobble ripples round the body
  leanGround: 0.05,         // degrees of lean per px/s on the floor
  leanAir: 0.012,           // and in the air
  leanMax: [14, 18] as const, // degrees, on the floor and in the air
  faceFollow: 0.6,          // share of the body's squash the face rides

  // Pokes.
  pokeSquash: [2.8, 0.5, 5] as const, // stretch kick: base, per repeat poke, cap
  pokeWobble: 0.9,
  pokeLean: 160,            // lean velocity, degrees/s, away from the poke
  pokeShove: 90,            // px/s: a side poke nudges Dot along the floor
  pokeMemory: 2,            // s: pokes closer together than this count as one run

  // Eyes.
  blinkEvery: [1.6, 3.8] as const, // s: gap between blinks, minimum plus random range
  doubleBlink: 0.18,        // chance a blink is doubled
  glanceEvery: [0.7, 2.2] as const, // s: idle glances
  glanceCentre: 0.45,       // chance an idle glance returns to centre

  // Marks.
  markSpeed: 170,           // px/s: sparkles and hearts leave Dot this fast
  zedSpeed: 60,             // px/s: z's drift up slowly
  puffSpeed: 40,
  markGravity: 420,         // px/s²: marks arc down
  heavyMarks: 2.4,          // sweat drops and spare dots fall this much faster
  markBounce: 0.25,         // share of a falling mark's speed kept when it lands
} as const;
