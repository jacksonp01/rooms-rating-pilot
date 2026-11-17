# Room ratings: pilot

A pilot of a room-rating experiment in [jsPsych](https://www.jspsych.org/) 8.2.1. Participants see 80 rendered rooms and rate them in
two blocks: first how curved or angular each room looks, then (same 80 rooms, new order) how much they like it and how much they would
want to go in (approach). Ratings are 0-100 sliders.

**Run it:** <https://jacksonp01.github.io/rooms-rating-pilot/>

* Desktop or laptop only (phones and tablets are refused). Full screen recommended.
* At the start, hold a bank card to the screen to calibrate its size; each image is then shown at 20 x 15 cm. The image stays on
  screen and the questions fade in beside it after 3 s.
* `?pid=N` in the URL sets the participant number, for example `.../rooms-rating-pilot/?pid=7`; odd numbers see liking above approach.
  Without `pid` a random number is used. `?test=1` shows the questions after 0.1 s (for checking the page; flagged in the data).
* **Data:** nothing is sent anywhere. At the end the browser downloads `pNNN_responses.json` (all trials, slider positions, click times).

Design: 8 rooms x 10 images (room shape angular / curved x furniture angular / rounded x empty / furnished / furnished + other items;
the two empty images per room shape are shown once), 2 practice images and 2 attention checks per block, design expertise at the end.
This is a pilot: no consent form or demographics yet, and the practice images are low-resolution drafts.

Files: `index.html` (the experiment), `room-rating-plugin.js` (calibration and rating screens), `stimuli.json` (the image list),
`stimuli/` (1280 x 960 JPEG copies of the renders), `lib/` (jsPsych 8.2.1, MIT licence, copyright the jsPsych authors).
