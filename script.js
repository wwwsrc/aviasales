// import axios from "axios";
const formSearch = document.querySelector(".form-search"),
  inputCitiesFrom = document.querySelector(".input__cities-from"),
  dropdownCitiesFrom = document.querySelector(".dropdown__cities-from"),
  inputCitiesTo = document.querySelector(".input__cities-to"),
  dropdownCitiesTo = document.querySelector(".dropdown__cities-to"),
  inputDateDepart = document.querySelector(".input__date-depart");

// const city = [];
// const citiesApi = "/dataBase/cities.json";
// city = JSON.parse(citiesApi);
// console.log(city);
// city = citiesApi.filter(item => {
//   return true;
// });
// console.log(city);
// использование прокси и фетч в ответе приходит массив промис
// proxy = "https://cors-anywhere.herokuapp.com/";
// fetch(`${proxy}http://api.travelpayouts.com/data/ru/cities.json`)
//   .then(response => {
//     return response.json();
//   })
//   .then(data => {
//     console.log(data);
//     data.filter(item => {
//       // console.log(item.name);
//       return item;
//     });
//   })
//   .then(console.log(item));
// console.log(city);
// };
let city = [];
const citiesApi = "http://api.travelpayouts.com/data/ru/cities.json",
  proxy = "https://cors-anywhere.herokuapp.com/",
  API_KEY = "73f03c16964beb1f83a82528d69d2408",
  calendar = "http://min-prices.aviasales.ru/calendar_preload";

const getData = (url, callback) => {
  const request = new XMLHttpRequest();
  request.open("GET", url);

  request.addEventListener("readystatechange", () => {
    if (request.readyState !== 4) return;
    if (request.status === 200) {
      callback(request.response);
    } else {
      console.error(request.status);
    }
  });
  request.send();
};

const showCity = (input, list) => {
  list.textContent = "";
  if (input.value !== "") {
    const filterCity = city.filter(item => {
      const fixItem = item.name.toLowerCase();
      return fixItem.includes(input.value.toLowerCase());
    });
    filterCity.forEach(item => {
      const li = document.createElement("li");
      li.classList.add("dropdown__city");
      li.textContent = item.name;
      list.append(li);
      //   console.log(filterCity, li);
    });
  }
};
const handlerSelectCity = (event, input, list) => {
  const target = event.target;
  if (target.tagName.toLowerCase() === "li") {
    input.value = target.textContent;
    list.textContent = "";
  }
};
const renderCheapDay = () => {
  console.log("cheapTicket:", cheapTicket);
};
const renderCheapYear = () => {
  console.log("cheapTickets", cheapTickets);
};
const renderCheap = (data, date) => {
  const cheapTicket = JSON.parse(data).best_prices;
  const cheapTicketDay = cheapTicket.filter(item => {
    return item.depart_date === date;
  });
  console.log("cheapTicket :", cheapTicket);
  console.log("cheapTicketDay :", cheapTicketDay);
  renderCheapDay(cheapTicketDay);
  renderCheapYear(cheapTicketDay);
};
//обработчики событый
inputCitiesFrom.addEventListener("input", () =>
  showCity(inputCitiesFrom, dropdownCitiesFrom)
);
inputCitiesTo.addEventListener("input", () => {
  showCity(inputCitiesTo, dropdownCitiesTo);
});
console.log(inputCitiesTo);
dropdownCitiesFrom.addEventListener("click", event => {
  handlerSelectCity(event, inputCitiesFrom, dropdownCitiesFrom);
});
dropdownCitiesTo.addEventListener("click", event => {
  handlerSelectCity(event, inputCitiesTo, dropdownCitiesTo);
});

formSearch.addEventListener("submit", event => {
  event.preventDefault();
  const cityFrom = city.find(item => inputCitiesFrom.value === item.name);
  const cityTo = city.find(item => inputCitiesTo.value === item.name);
  const formData = {
    from: cityFrom.code,
    to: cityTo.code,
    when: inputDateDepart.value
  };
  console.log(formData);
  const requestData = `?depart_date=${formData.when}&origin=${formData.from}&destination=${formData.to}&one_way=true&token=${API_KEY}`;
  console.log(requestData);

  getData(proxy + calendar + requestData, response => {
    console.log(response);
    renderCheap(response, formData.when);
  });
});

// вызовы функций
getData(proxy + citiesApi, data => {
  city = JSON.parse(data).filter(item => item.name);
  console.log(city);
});

// getData(
//   proxy +
//     calendar +
//     "?depart_date=2020-05-25&origin=SVX&destination=KGD&one_way=true&token=" +
//     API_KEY,
//   data => {
//     const cheapTicket = JSON.parse(data).best.prices.filter(
//       item => item.depart_date === "2020-05-29"
//     );
//     console.log(cheapTicket);
//   }
// );
