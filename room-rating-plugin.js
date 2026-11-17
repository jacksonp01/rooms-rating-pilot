// jsPsych plugins for the room-rating experiment (PRESPEC_experiment_rooms.md 4.3, revision 2026-11-16 b).
// jsPsychRoomRating: one room image at a fixed size that stays on screen for the whole trial; the question panel beside it fades in
//   after reveal_ms. Each question is a 0-100 slider with labelled ends, no starting handle (the handle appears where the participant
//   first clicks) and no number shown.
// jsPsychCardCalibration: the participant matches an on-screen box to a bank card (85.6 mm wide) -> pixels per cm.
var jsPsychRoomRating = (function (jspsych) {
  'use strict';
  const info = {
    name: 'room-rating',
    version: '3.0.0',
    parameters: {
      image: { type: jspsych.ParameterType.STRING, default: undefined },
      img_w: { type: jspsych.ParameterType.INT, default: 760 },       // display size in px (20 x 15 cm after calibration)
      img_h: { type: jspsych.ParameterType.INT, default: 570 },
      reveal_ms: { type: jspsych.ParameterType.INT, default: 3000 },  // the questions fade in after this; the image stays
      fade_ms: { type: jspsych.ParameterType.INT, default: 600 },
      // [{key, text, labels: [low, high]}], shown in this order
      questions: { type: jspsych.ParameterType.COMPLEX, default: [], array: true },
      practice: { type: jspsych.ParameterType.BOOL, default: false }
    },
    data: {
      responses: { type: jspsych.ParameterType.OBJECT },
      rt: { type: jspsych.ParameterType.INT },
      reveal_ms_actual: { type: jspsych.ParameterType.INT },
      changes: { type: jspsych.ParameterType.INT }
    }
  };
  class RoomRatingPlugin {
    constructor(jsPsych) { this.jsPsych = jsPsych; }
    trial(el, trial) {
      const tag = trial.practice ? '<div class="practice-tag">Practice</div>' : '';
      const block = q => `<div class="q" data-key="${q.key}"><p>${q.text}</p>
        <input type="range" class="vas untouched" min="0" max="100" step="1" value="50" aria-label="${q.text}">
        <div class="ends"><span>${q.labels[0]}</span><span>${q.labels[1]}</span></div></div>`;
      el.innerHTML = `<div class="rr">
        <img src="${trial.image}" alt="" style="width:${trial.img_w}px;height:${trial.img_h}px">
        <div class="panel" style="opacity:0;pointer-events:none;transition:opacity ${trial.fade_ms}ms">${tag}
          ${trial.questions.map(block).join('')}<button class="next" disabled>Next</button></div></div>`;
      const img = el.querySelector('img'), panel = el.querySelector('.panel'), next = el.querySelector('.next');
      const resp = {}, rt = {}, first = {}; let changes = 0, tAsk = null, tImg = null;

      const reveal = () => {
        tAsk = performance.now(); panel.style.opacity = '1'; panel.style.pointerEvents = 'auto';
      };
      const start = () => {
        tImg = performance.now();
        this.jsPsych.pluginAPI.setTimeout(reveal, trial.reveal_ms);
      };
      if (img.complete) start(); else img.addEventListener('load', start, { once: true });

      el.querySelectorAll('.q').forEach(qe => {
        const key = qe.dataset.key, s = qe.querySelector('input');
        const record = () => {
          if (tAsk === null) return;
          if (key in resp && resp[key] !== +s.value) changes++;
          resp[key] = +s.value; rt[key] = Math.round(performance.now() - tAsk);
          if (!(key in first)) first[key] = +s.value;
          s.classList.remove('untouched');
          next.disabled = !trial.questions.every(q => q.key in resp);
        };
        // pointerdown marks the slider as answered even when the click lands exactly on its hidden starting value
        s.addEventListener('pointerdown', () => setTimeout(record, 0));
        s.addEventListener('input', record);
        s.addEventListener('change', record);
        s.addEventListener('keydown', e => e.preventDefault());       // mouse / trackpad only, so every answer is a placed handle
      });

      next.addEventListener('click', () => {
        const data = { responses: resp, rt: Math.round(performance.now() - tAsk), reveal_ms_actual: Math.round(tAsk - tImg), changes,
                       question_order: trial.questions.map(q => q.key).join(',') };
        trial.questions.forEach(q => { data[q.key] = resp[q.key]; data['rt_' + q.key] = rt[q.key]; data['first_' + q.key] = first[q.key]; });
        el.innerHTML = '';
        this.jsPsych.finishTrial(data);
      });
    }
  }
  RoomRatingPlugin.info = info;
  return RoomRatingPlugin;
})(jsPsychModule);

var jsPsychCardCalibration = (function (jspsych) {
  'use strict';
  const info = {
    name: 'card-calibration',
    version: '1.0.0',
    parameters: { card_mm: { type: jspsych.ParameterType.FLOAT, default: 85.6 } },
    data: { px_per_cm: { type: jspsych.ParameterType.FLOAT }, box_px: { type: jspsych.ParameterType.INT } }
  };
  class CardCalibration {
    constructor(jsPsych) { this.jsPsych = jsPsych; }
    trial(el, trial) {
      const ratio = 53.98 / 85.6;
      el.innerHTML = `<div class="txt"><h2>Screen size</h2>
        <p>Hold a bank card (or any card of that size, such as a driving licence) flat against the screen over the box below,
        and move the slider until the box is exactly as wide as the card.</p></div>
        <div style="margin:24px auto"><div id="card" style="margin:0 auto;border:2px solid #2b5fa8;border-radius:10px;background:#e6eef8"></div></div>
        <input id="sl" type="range" min="150" max="900" value="320" style="width:520px">
        <p><button class="next" id="ok">The box matches the card</button></p>`;
      const card = el.querySelector('#card'), sl = el.querySelector('#sl');
      const draw = () => { card.style.width = sl.value + 'px'; card.style.height = Math.round(sl.value * ratio) + 'px'; };
      sl.addEventListener('input', draw); draw();
      el.querySelector('#ok').addEventListener('click', () => {
        const w = +sl.value; el.innerHTML = '';
        this.jsPsych.finishTrial({ box_px: w, px_per_cm: w / (trial.card_mm / 10) });
      });
    }
  }
  CardCalibration.info = info;
  return CardCalibration;
})(jsPsychModule);
