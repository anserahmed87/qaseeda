const couplets = [
  { image: "couplets/1-text.png", audio: "couplets/1-audio.mp3" },
  { image: "couplets/2-text.png", audio: "couplets/2-audio.mp3" },
  { image: "couplets/3-text.png", audio: "couplets/3-audio.mp3" },
  { image: "couplets/4-text.png", audio: "couplets/4-audio.mp3" },
  { image: "couplets/5-text.png", audio: "couplets/5-audio.mp3" }
];

const poemElement = document.querySelector("#poem");
const speedButton = document.querySelector("#speedButton");
const speedLabel = document.querySelector("#speedLabel");
const repeatButton = document.querySelector("#repeatButton");
const repeatLabel = document.querySelector("#repeatLabel");
const repeatCountInput = document.querySelector("#repeatCount");
const soundButton = document.querySelector("#soundButton");
const soundIcon = document.querySelector("#soundIcon");
const soundLabel = document.querySelector("#soundLabel");
const progressText = document.querySelector("#progressText");
const progressFill = document.querySelector("#progressFill");
const progressTrack = document.querySelector("[role='progressbar']");
const completion = document.querySelector("#completion");

let activeAudio = null;
let activeButton = null;
let soundEnabled = true;
let slowEnabled = false;
let repeatEnabled = false;
let repeatTimer = null;
let playbackId = 0;
const completed = new Set();

function renderCouplets() {
  poemElement.innerHTML = couplets.map((couplet, index) => `
    <button class="couplet" type="button" data-index="${index}" aria-label="Play couplet ${index + 1}">
      <span class="couplet__number">${index + 1}</span>
      <img class="couplet__image" src="${couplet.image}" alt="Arabic text for couplet ${index + 1}" />
      <span class="couplet__play" aria-hidden="true">▶</span>
      <span class="couplet__repetition" aria-live="polite"></span>
    </button>
  `).join("");

  poemElement.querySelectorAll(".couplet").forEach(button => {
    button.addEventListener("click", () => playCouplet(Number(button.dataset.index), button));
  });
}

function stopPlayback() {
  playbackId += 1;
  clearTimeout(repeatTimer);
  repeatTimer = null;
  window.speechSynthesis?.cancel();
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
  }
  if (activeButton) {
    activeButton.classList.remove("is-playing");
    activeButton.querySelector(".couplet__play").textContent = "▶";
    activeButton.querySelector(".couplet__repetition").textContent = "";
  }
  activeAudio = null;
  activeButton = null;
}

function markComplete(index, button) {
  completed.add(index);
  button.classList.add("is-complete");
  button.querySelector(".couplet__number").textContent = "✓";
  progressText.textContent = `${completed.size} of ${couplets.length} listened`;
  progressFill.style.width = `${completed.size / couplets.length * 100}%`;
  progressTrack.setAttribute("aria-valuenow", completed.size);
  completion.hidden = completed.size !== couplets.length;
}

function finishCouplet(index, button) {
  markComplete(index, button);
  if (activeButton === button) stopPlayback();
}

function playCouplet(index, button) {
  if (!soundEnabled) return;
  if (activeButton === button) {
    stopPlayback();
    return;
  }
  stopPlayback();
  const thisPlaybackId = playbackId;
  activeButton = button;
  button.classList.add("is-playing");
  button.querySelector(".couplet__play").textContent = "■";

  const clip = couplets[index];
  const recording = new Audio(clip.audio);
  recording.playbackRate = slowEnabled ? 0.75 : 1;
  recording.preservesPitch = true;
  const totalRuns = repeatEnabled ? getRepeatCount() : 1;
  let currentRun = 1;
  let runFinished = false;
  recording.preload = "auto";
  activeAudio = recording;

  function showRunStatus(waiting = false) {
    const status = button.querySelector(".couplet__repetition");
    if (totalRuns === 1) {
      status.textContent = "";
      return;
    }
    status.textContent = waiting
      ? `Tiny break… ${currentRun}/${totalRuns}`
      : `Playing ${currentRun} of ${totalRuns}`;
  }

  function playCurrentRun() {
    if (playbackId !== thisPlaybackId || activeAudio !== recording) return;
    runFinished = false;
    showRunStatus();
    recording.currentTime = 0;
    recording.play().catch(() => {
      alert("Tap the poem card again to play the sound.");
      stopPlayback();
    });
  }

  function completeRun() {
    if (runFinished || playbackId !== thisPlaybackId) return;
    runFinished = true;
    recording.pause();
    if (currentRun >= totalRuns) {
      finishCouplet(index, button);
      return;
    }
    showRunStatus(true);
    repeatTimer = setTimeout(() => {
      currentRun += 1;
      playCurrentRun();
    }, 2000);
  }

  recording.addEventListener("ended", completeRun);
  recording.addEventListener("error", () => {
    alert("Oops! The sound could not play. Please try again.");
    stopPlayback();
  }, { once: true });
  recording.addEventListener("loadedmetadata", () => {
    if (activeAudio !== recording) return;
    playCurrentRun();
  }, { once: true });
}

function getRepeatCount() {
  const value = Number.parseInt(repeatCountInput.value, 10);
  return Math.min(20, Math.max(2, Number.isFinite(value) ? value : 5));
}

speedButton.addEventListener("click", () => {
  slowEnabled = !slowEnabled;
  speedButton.setAttribute("aria-pressed", String(slowEnabled));
  speedButton.setAttribute("aria-label", slowEnabled ? "Turn slow and clear mode off" : "Turn slow and clear mode on");
  speedLabel.textContent = slowEnabled ? "Slow mode on ✓" : "Slow & clear";
  if (activeAudio) activeAudio.playbackRate = slowEnabled ? 0.75 : 1;
});

function updateRepeatLabel() {
  const count = getRepeatCount();
  repeatCountInput.value = count;
  repeatLabel.textContent = repeatEnabled ? `Repeat on ×${count}` : `Repeat ${count} times`;
}

repeatCountInput.addEventListener("change", updateRepeatLabel);

repeatButton.addEventListener("click", () => {
  repeatEnabled = !repeatEnabled;
  repeatButton.setAttribute("aria-pressed", String(repeatEnabled));
  repeatButton.setAttribute("aria-label", repeatEnabled ? "Turn repeat mode off" : "Turn repeat mode on");
  updateRepeatLabel();
});

soundButton.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  if (!soundEnabled) stopPlayback();
  soundButton.setAttribute("aria-pressed", String(soundEnabled));
  soundButton.setAttribute("aria-label", soundEnabled ? "Turn sound off" : "Turn sound on");
  soundIcon.textContent = soundEnabled ? "🔊" : "🔇";
  soundLabel.textContent = soundEnabled ? "Sound on" : "Sound off";
});

renderCouplets();
