import { BASE_URL, API_KEY, BACKGROUNDS, ROMAN, CHINESSE, WOCABULARY } from './consts.js'

const html = document.querySelector("html");
const weatherCity = document.querySelector(".weather__city");
const weatherIcon = document.querySelector(".weather__icon");
const weatherText = document.querySelectorAll(".weather__text");
const center = document.querySelector(".center");
const clock = document.querySelector(".clock");
const secondHand = document.querySelector(".second-hand");
const minsHand = document.querySelector(".min-hand");
const hourHand = document.querySelector(".hour-hand");
const eClock = document.querySelector(".e-clock");
const settings = document.querySelector(".settings");
const chooseLang = document.querySelector(".settings__lang");
const advancedOpenBtn = document.querySelector(".advanced__open-btn");
const chooseBackground = document.querySelector(".settings__background");
const advancedContainer = document.querySelector(".advanced__container");
const chooseColor = document.querySelector(".settings__color");
const chooseNumbers = document.querySelector(".settings__numbers");
const chooseTimezone = document.querySelector(".settings__timezone");
const popup = document.querySelector(".popup");
const popupContainer = document.querySelector(".popup__container");
const settingsTitles = settings.querySelectorAll(".settings__text");
const options = settings.querySelectorAll("option");
const geo = navigator.geolocation;

let pos;
let lang = "en-US";
let advancedOpenBtnState = "close";
let timeZone = "location";
let geoPosition;
let timeShift = 0;

function getWeather(param) {
  const currentLang = lang.split("-")[0];
  let position;

  if (timeZone === "location") {
    position = `lat=${param.lat}&lon=${param.lon}`;
  } else {
    position = `q=${param}`;
  }
  const url = `${BASE_URL}${position}&appid=${API_KEY}&units=metric&lang=${currentLang}`;
  return fetch(url, {
    method: "GET",
  })
    .then((res) => {

      if (res.ok) {
        return res.json();
      }
    })
    .catch((e) => {
      return e;
    });
}

function getWeatherData() {
  Promise.resolve(getWeather(pos)).then((response) => {
    const { name, main, weather, wind } = response;
    const { temp, humidity } = main;
    const { description, icon } = weather[0];
    weatherCity.textContent = name;
    weatherIcon.src = `http://openweathermap.org/img/wn/${icon}.png`;
    weatherIcon.alt = description;
    weatherText[0].textContent = `${Math.round(temp)}℃  ${description}`;
    weatherText[1].textContent = `${WOCABULARY.weatherTranslate[0][lang]}  ${wind.speed} ${WOCABULARY.weatherTranslate[1][lang]}`;
    weatherText[2].textContent = `${WOCABULARY.weatherTranslate[2][lang]}  ${humidity}%`;
  });
}

if (geo) {
  geo.getCurrentPosition((position) => {
    geoPosition = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
    };
    pos = geoPosition;
    getWeatherData();
  });
}

for (let i = 1; i < 13; i++) {
  const timeContainer = document.createElement("div");
  timeContainer.className = "time-container";
  const time = document.createElement("h2");
  time.textContent = i;

  if (i < 7) {
    timeContainer.style = `transform: rotate(${i * 30}deg)`;
    time.style = `transform: rotate(${360 - i * 30}deg)`;
  } else {
    timeContainer.style = `transform: rotate(${i * 30 - 2}deg)`;
    time.style = `transform: rotate(${360 - (i * 30 - 2)}deg)`;
  }
  timeContainer.appendChild(time);
  center.appendChild(timeContainer);
}

const formatTime = (number) => {

  if (number < 10) {
    return `0${number}`;
  }
  return number;
};

function setTime() {
  const time = new Date( new Date().getTime() - timeShift * 3600 * 1000)
  const seconds = time.getSeconds();
  const secondsAngle = (seconds / 60) * 360 + 90;
  secondHand.style = `transform: rotate(${secondsAngle}deg)`;
  const mins = time.getMinutes();
  const minsAngle = (mins / 60) * 360 + (seconds / 60) * 6 + 90;
  minsHand.style = `transform: rotate(${minsAngle}deg)`;
  const hours = time.getHours()
  const hoursAngle = (hours / 12) * 360 + (mins / 60) * 30 + 90;
  hourHand.style = `transform: rotate(${hoursAngle}deg)`;
  const options = { weekday: "long", month: "long" };
  const stringDate = new Intl.DateTimeFormat(lang, options).format(time);
  const stringData = stringDate.split(" ");
  const day = stringData[0];
  const date = time.getDate();
  const month = stringData[1];
  const year = time.getFullYear()
  eClock.textContent = `${formatTime(hours)}:${formatTime(mins)}:${formatTime(
    seconds
  )} ${day}, ${date} ${month} ${year}`;
}

function hideLangs() {
  chooseLang.children[0].classList.remove("settings__lang-flag_second");
}

function toggleAdvanced() {
  advancedContainer.classList.toggle("hidden");

  if (advancedOpenBtnState === "open") {
    advancedOpenBtnState = "close";
  } else {
    advancedOpenBtnState = "open";
  }
  advancedOpenBtn.textContent =
  WOCABULARY.advanced_openButton[advancedOpenBtnState][lang];
}

function changeLang(e) {
  lang = e.target.id;
  const target = Array.from(chooseLang.children).find(
    (item) => item.id === e.target.id
  );
  hideLangs();
  chooseLang.appendChild(target);
  settingsTitles.forEach((item, index) => {
    item.textContent = WOCABULARY.main_settings[index][lang];
  });
  options.forEach((item, index) => {
    item.textContent = WOCABULARY.advanced_settings[index][lang];
  });
  advancedOpenBtn.textContent =
  WOCABULARY.advanced_openButton[advancedOpenBtnState][lang];
  getWeatherData();
}

function changeColor(e) {
  clock.style = `border-color: ${e.target.value}`;
}

function changeNumbers(e) {
  for (let i = 0; i < 12; i++) {

    if (e.target.value === "roman") {
      center.children[i].firstChild.textContent = ROMAN[i];
      center.children[i].classList.add("time-container_roman-shift");
      center.children[i].classList.remove("time-container_chinesse-shift");
    }

    if (e.target.value === "chinesse") {
      center.children[i].firstChild.textContent = CHINESSE[i];
      center.children[i].classList.add("time-container_chinesse");
      center.children[i].classList.remove("time-container_roman-shift");
    }

    if (e.target.value === "arabic") {
      center.children[i].firstChild.textContent = i + 1;
      center.children[i].classList.remove("time-container_roman-shift");
      center.children[i].classList.remove("time-container_chinesse-shift");
    }
  }
}

function changeTimezone(e) {
  const today = new Date();

  if (e.target.value === "geo") {
    pos = geoPosition;
    timeZone = "location";
    timeShift = 0
  } else {
    pos = e.target.value;
    timeZone = "current city";

    if(e.target.value === 'london') {
      timeShift = -(today.getTimezoneOffset()/60 + 1)
    }

    if(e.target.value === 'new york') {
      timeShift = -(today.getTimezoneOffset()/60 - 4)
    }

    if(e.target.value === 'tokio') {
      timeShift = -(today.getTimezoneOffset()/60 + 9)
    }
  }
  getWeatherData();
}

function togglePopup() {
  popup.classList.toggle("popup_opened");
}

function changeBackground(e) {

  if (!e.target.classList.contains("popup__image")) {
    return;
  }
  const container = Array.from(popupContainer.children);
  container.forEach((item) => item.classList.remove("popup__image_selected"));
  e.target.classList.add("popup__image_selected");
  let index;
  container.forEach((item, ind) => {

    if (item.classList.contains("popup__image_selected")) {
      index = ind;
    }
  });
  chooseBackground.src = BACKGROUNDS[index]
    .split(" ")[1]
    .replace("url(", "")
    .replace(")", "");
  html.style = `background: ${BACKGROUNDS[index]}; background-size: cover;`;

  if (index === 0 || index === 2 || index === 4 || index === 7) {
    minsHand.classList.add("hand_gold");
    hourHand.classList.add("hand_gold");
    center.classList.add("hand_gold");
  } else {
    minsHand.classList.remove("hand_gold");
    hourHand.classList.remove("hand_gold");
    center.classList.remove("hand_gold");
  }
  togglePopup();
}

function popupHiddenEscape(evt) {

  if (evt.key === "Escape") {
    popup.classList.remove("popup_opened");
  }
}

function popupHiddenOverlay(evt) {

  if (evt.target.classList.contains("popup")) {
    togglePopup();
  }
}

setInterval(setTime, 1000);

setTime();

chooseLang.addEventListener("mouseover", () => {
  chooseLang.children[0].classList.add("settings__lang-flag_second");
});
chooseLang.addEventListener("mouseout", hideLangs);
chooseLang.addEventListener("click", changeLang);
advancedOpenBtn.addEventListener("click", toggleAdvanced);
chooseColor.addEventListener("input", changeColor);
chooseNumbers.addEventListener("input", changeNumbers);
chooseTimezone.addEventListener("input", changeTimezone);
chooseBackground.addEventListener("click", togglePopup);
popupContainer.addEventListener("click", changeBackground);
document.addEventListener("keydown", popupHiddenEscape);
document.addEventListener("click", popupHiddenOverlay);
