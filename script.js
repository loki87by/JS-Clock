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
const baseUrl = "https://api.openweathermap.org/data/2.5/weather?";
const apiKey = "b91d3843eaeb709975d89c9061d73042";
const backgrounds = [
  "#410606 url(http://ru.wallfon.com/walls/others/in-red.jpg)",
  "#db8814 url(https://beautypic.ru/uploads/posts/2011-06/thumbs/1307444066_beautypic-ru-5.jpg)",
  "#0b2810 url(https://storge.pic2.me/c/1360x800/633/54da50e4335f0.jpg)",
  "#018ded url(https://unsplash.it/1500/1000?image=881&blur=5)",
  "#000000 url(https://astro-obzor.ru/wp-content/uploads/2016/04/Purple1920x1080.jpg)",
  "#301b03 url(https://klike.net/uploads/posts/2019-11/1572946222_4.jpg)",
  "#393837 url(https://72tv.ru/uploads/posts/2018-08/medium/1534144472_zakat-rabochiy-stol.jpg)",
  "#000000 url(http://fanoboi.com/black-white/15/city-wallpaper-1366x768.jpg)",
  "#dbf3ff url(https://xn--80aahvkuapc1be.xn--p1ai/800/600/https/ferma-biz.ru/wp-content/uploads/2017/05/sneg-oboi-zima-winter-Favim.ru-4795775.jpeg)",
];
const roman = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
];
const chinesse = [
  "一",
  "二",
  "三",
  "四",
  "五",
  "六",
  "七",
  "八",
  "九",
  "十",
  "十一",
  "十二",
];
const wocabulary = {
  main_settings: [
    { "en-US": "Watchface:", "ru-RU": "Циферблат:" },
    { "en-US": "Choose color", "ru-RU": "Выберите цвет" },
    { "en-US": "Choose family of numbers", "ru-RU": "Выберите семейство цифр" },
    { "en-US": "Select time zone", "ru-RU": "Выберите часовой пояс" },
    { "en-US": "Choose language", "ru-RU": "Выберите язык" },
    { "en-US": "Select background", "ru-RU": "Выберите фон" },
  ],
  advanced_openButton: {
    close: {
      "en-US": "Open advanced settings:",
      "ru-RU": "Открыть дополнительные настройки",
    },
    open: {
      "en-US": "Close advanced settings",
      "ru-RU": "Закрыть дополнительные настройки",
    },
  },
  advanced_settings: [
    { "en-US": "Arabic", "ru-RU": "Арабские" },
    { "en-US": "Roman", "ru-RU": "Римские" },
    { "en-US": "Chinesse hieroglyphs", "ru-RU": "Китайские иероглифы" },
    { "en-US": "Your location", "ru-RU": "Ваше местоположение" },
    { "en-US": "London", "ru-RU": "Лондон" },
    { "en-US": "New York", "ru-RU": "Нью Йорк" },
    { "en-US": "Tokio", "ru-RU": "Токио" },
  ],
  weatherTranslate: [
    { "en-US": "Wind speed", "ru-RU": "Скорость ветра" },
    { "en-US": "m/s", "ru-RU": "м/с" },
    { "en-US": "Humidity", "ru-RU": "Влажность" },
  ],
};

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
  const url = `${baseUrl}${position}&appid=${apiKey}&units=metric&lang=${currentLang}`;
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
    weatherText[1].textContent = `${wocabulary.weatherTranslate[0][lang]}  ${wind.speed} ${wocabulary.weatherTranslate[1][lang]}`;
    weatherText[2].textContent = `${wocabulary.weatherTranslate[2][lang]}  ${humidity}%`;
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
    wocabulary.advanced_openButton[advancedOpenBtnState][lang];
}

function changeLang(e) {
  lang = e.target.id;
  const target = Array.from(chooseLang.children).find(
    (item) => item.id === e.target.id
  );
  hideLangs();
  chooseLang.appendChild(target);
  settingsTitles.forEach((item, index) => {
    item.textContent = wocabulary.main_settings[index][lang];
  });
  options.forEach((item, index) => {
    item.textContent = wocabulary.advanced_settings[index][lang];
  });
  advancedOpenBtn.textContent =
    wocabulary.advanced_openButton[advancedOpenBtnState][lang];
  getWeatherData();
}

function changeColor(e) {
  clock.style = `border-color: ${e.target.value}`;
}

function changeNumbers(e) {
  for (let i = 0; i < 12; i++) {
    if (e.target.value === "roman") {
      center.children[i].firstChild.textContent = roman[i];
      center.children[i].classList.add("time-container_roman-shift");
      center.children[i].classList.remove("time-container_chinesse-shift");
    }
    if (e.target.value === "chinesse") {
      center.children[i].firstChild.textContent = chinesse[i];
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
  chooseBackground.src = backgrounds[index]
    .split(" ")[1]
    .replace("url(", "")
    .replace(")", "");
  html.style = `background: ${backgrounds[index]}; background-size: cover;`;
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
