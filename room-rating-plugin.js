// jsPsych plugin: one room image (left) and two 1-5 ratings (right), on one screen.
var jsPsychRoomRating = (function (jspsych) {
  'use strict';
  const info = {
    name: 'room-rating',
    version: '1.0.0',
    parameters: {
      image: { type: jspsych.ParameterType.STRING, default: undefined },
      curv_first: { type: jspsych.ParameterType.BOOL, default: true },
      q_curv: { type: jspsych.ParameterType.STRING, default: '' },
      q_like: { type: jspsych.ParameterType.STRING, default: '' },
      labels_curv: { type: jspsych.ParameterType.STRING, default: [], array: true },
      labels_like: { type: jspsych.ParameterType.STRING, default: [], array: true },
      practice: { type: jspsych.ParameterType.BOOL, default: false }
    },
    data: {
      curvature: { type: jspsych.ParameterType.INT },
      liking: { type: jspsych.ParameterType.INT },
      rt_curvature: { type: jspsych.ParameterType.INT },
      rt_liking: { type: jspsych.ParameterType.INT },
      rt: { type: jspsych.ParameterType.INT },
      changes: { type: jspsych.ParameterType.INT }
    }
  };
  class RoomRatingPlugin {
    constructor(jsPsych) { this.jsPsych = jsPsych; }
    trial(el, trial) {
      const qs = [
        { key: 'curvature', text: trial.q_curv, labels: trial.labels_curv },
        { key: 'liking', text: trial.q_like, labels: trial.labels_like }
      ];
      if (!trial.curv_first) qs.reverse();
      const block = q => `<div class="q" data-key="${q.key}"><p>${q.text}</p>
        <div class="scale">${[1, 2, 3, 4, 5].map(v => `<button type="button" data-v="${v}">${v}</button>`).join('')}</div>
        <div class="ends"><span>1 = ${q.labels[0]}</span><span>5 = ${q.labels[1]}</span></div></div>`;
      el.innerHTML = `<div class="rr"><img src="${trial.image}" alt="">
        <div class="panel">${trial.practice ? '<div class="practice-tag">Practice</div>' : ''}${qs.map(block).join('')}
        <button class="next" disabled>Next</button></div></div>`;
      const resp = {}, rt = {};
      let changes = 0;
      let tShown = performance.now();
      const next = el.querySelector('.next');
      const img = el.querySelector('img');
      if (!img.complete) img.addEventListener('load', () => { tShown = performance.now(); });
      el.querySelectorAll('.q').forEach(qe => {
        qe.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
          const key = qe.dataset.key;
          if (key in resp) changes++;
          resp[key] = +b.dataset.v;
          rt[key] = Math.round(performance.now() - tShown);
          qe.querySelectorAll('button').forEach(x => x.classList.toggle('sel', x === b));
          next.disabled = !(('curvature' in resp) && ('liking' in resp));
        }));
      });
      next.addEventListener('click', () => {
        const total = Math.round(performance.now() - tShown);
        el.innerHTML = '';
        this.jsPsych.finishTrial({
          curvature: resp.curvature, liking: resp.liking,
          rt_curvature: rt.curvature, rt_liking: rt.liking, rt: total, changes
        });
      });
    }
  }
  RoomRatingPlugin.info = info;
  return RoomRatingPlugin;
})(jsPsychModule);
