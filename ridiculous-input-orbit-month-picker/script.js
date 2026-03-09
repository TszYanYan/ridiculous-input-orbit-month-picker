//1 orbit = 1 year
//Month changes as Earth orbits the Sun

const months = [
  "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];

const earth = document.getElementById("earth");
const readout = document.getElementById("readout");
const toggleBtn = document.getElementById("toggle-btn");
const lockBtn = document.getElementById("lock-btn");
const lockedText = document.getElementById("locked");
const monthInput = document.getElementById("birth-month");

let isRunning = true;

let angle = 0;

let targetSpeed = 0.08;
let currentSpeed = 0;

const now = new Date();
const endYear = now.getFullYear();
const endMonthIndex = now.getMonth();

const yearSpan = 60;
const baseYear = endYear - (yearSpan - 1);

let yearOffset = 0;

const a = 520 / 2;
const b = 320 / 2;

function normalizeAngle(theta) {
  const twoPi = Math.PI * 2;
  return ((theta % twoPi) + twoPi) % twoPi;
}

function angleToMonthIndex(theta) {
  const twoPi = Math.PI * 2;

  const phase = ((-theta % twoPi) + twoPi) % twoPi;
  const progress = phase / twoPi;

  return Math.floor(progress * 12) % 12;
}

function currentYear() {
  return baseYear + yearOffset;
}

function setNativeMonthValue(monthIndex, year) {
  const monthNumber = String(monthIndex + 1).padStart(2, "0");
  monthInput.value = `${year}-${monthNumber}`;
}

function resetTimeline() {
  yearOffset = 0;
  angle = 0;
}

function render() {
  
  const earthSize = 16;
  const earthRadius = earthSize / 2;

  const rx = a - earthRadius;
  const ry = b - earthRadius;

  const x = a + rx * Math.cos(angle);
  const y = b + ry * Math.sin(angle);

  earth.style.left = `${x}px`;
  earth.style.top = `${y}px`;

  const monthIndex = angleToMonthIndex(angle);
  const year = currentYear();

  readout.textContent = `${months[monthIndex]} ${year}`;
  setNativeMonthValue(monthIndex, year);
}

function tick() {
  if (isRunning) {
    currentSpeed += (targetSpeed - currentSpeed) * 0.06;
  } else {
    currentSpeed *= 0.88;
  }

  angle -= currentSpeed;

  if (angle <= -Math.PI * 2) {
    angle = 0;
    yearOffset += 1;
  }

  const monthIndex = angleToMonthIndex(angle);
  const year = currentYear();

  if (year > endYear || (year === endYear && monthIndex > endMonthIndex)) {
    resetTimeline();
  }

  render();
  requestAnimationFrame(tick);
}

toggleBtn.addEventListener("click", () => {
  isRunning = !isRunning;
  toggleBtn.textContent = isRunning ? "Pause orbit" : "Resume orbit";
  document.querySelector(".sun").classList.toggle("is-dimmed", !isRunning);
  
  if (isRunning) {
    document.querySelector(".readout").classList.remove("is-locked");
  }
});
lockBtn.addEventListener("click", () => {
  lockedText.textContent = `Locked: ${readout.textContent} (${monthInput.value})`;
  document.querySelector(".readout").classList.add("is-locked");
});

document.getElementById("birth-form").addEventListener("submit", (e) => {
  e.preventDefault();
  lockedText.textContent = `Submitted: ${monthInput.value}`;
});

tick();