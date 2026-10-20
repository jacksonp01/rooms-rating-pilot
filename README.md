# Room ratings: pilot

A pilot of a room-rating experiment in [jsPsych](https://www.jspsych.org/) 8.2.1. Participants see 80 rendered rooms, one at a time,
and rate each one for how curved or angular it looks and how much they like it (1-5, both questions on one screen).

**Run it:** <https://jacksonp01.github.io/rooms-rating-pilot/>

* Use a computer with a browser window of at least 1270 x 700 px (full screen recommended). It takes about 20 minutes.
* `?pid=N` in the URL sets the participant number, for example `.../rooms-rating-pilot/?pid=7`. Odd numbers see the curvature
  question first and even numbers see the liking question first. Without `pid` a random number is used.
* **Data:** nothing is sent anywhere. At the end the browser downloads `pNNN_responses.json` (all trials, responses and click times).

Design: 8 rooms x 10 images (room shape angular / curved x furniture angular / rounded x empty / furnished / furnished + other items;
the two empty images per room shape are shown once), each image once in random order, 2 practice images, 4 attention checks.
This is a pilot: no consent form or demographics yet, and the practice images are low-resolution drafts.

Files: `index.html` (the experiment), `room-rating-plugin.js` (the rating screen), `stimuli.json` (the image list), `stimuli/`
(1280 x 960 JPEG copies of the renders), `lib/` (jsPsych 8.2.1, MIT licence, copyright the jsPsych authors).
