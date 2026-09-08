# Dot Studio v2 film runtime

The original model, choreography, SVG renderer and player come from Studio's
`feat/dot-studio` commit `c2ee2fd8273cdeca58f18b04f4ba45606dc39984`.
The authored artwork palette is retained verbatim as data in `palette.json`;
it describes the film's pixels, not additional site UI colours. The model,
geometry and timing are unchanged. No authoring or export UI is imported.

The landing footer plays the complete 1,845-frame, 60fps film on a transparent
stage at 1.4× speed. Its original 30.75 seconds take 21.964 seconds per loop.
The renderer uses only numeric poses and the closed artwork palette.

Keep the 140-unit footer framing: at a 126px stage width Dot's resting body
is 90px across. Switching to the film export's 190-unit framing without
resizing the stage would make Dot smaller. Overflow stays visible for effects.
