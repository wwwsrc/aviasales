// import axios from "axios";
const formSearch = document.querySelector(".form-search"),
  inputCitiesFrom = document.querySelector(".input__cities-from"),
  dropdownCitiesFrom = document.querySelector(".dropdown__cities-from"),
  inputCitiesTo = document.querySelector(".input__cities-to"),
  dropdownCitiesTo = document.querySelector(".dropdown__cities-to"),
  inputDateDepart = document.querySelector(".input__date-depart"),
  cheapestTicket = document.getElementById("cheapest-ticket"),
  otherCheapTickets = document.getElementById("other-cheap-tickets");

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
  calendar = "http://min-prices.aviasales.ru/calendar_preload",
  MAX_COUNT = 12;

const getData = (url, callback, reject = console.error) => {
  const request = new XMLHttpRequest();
  request.open("GET", url);

  request.addEventListener("readystatechange", () => {
    if (request.readyState !== 4) return;
    if (request.status === 200) {
      callback(request.response);
    } else {
      reject(request.status);
    }
  });
  request.send();
};

const showCity = (input, list) => {
  list.textContent = "";
  if (input.value !== "") {
    const filterCity = city.filter(item => {
      const fixItem = item.name.toLowerCase();
      return fixItem.startsWith(input.value.toLowerCase());
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
const getNameCity = code => {
  const objCity = city.find(item => item.code === code);
  console.log(objCity.name);
  return objCity.name;
};
const getDate = date => {
  return new Date(date).toLocaleString("ru", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};
const getChanges = num => {
  if (num) {
    return num === 1 ? "с одной пересадкой" : "c двумя пересадками";
  } else {
    return "Без пересадок";
  }
};
const getLinkAviasales = data => {
  let link = "https//wwww.aviasales.ru/search/";
  link += data.origin;
  const date = new Date(data.depart_date);
  const day = date.getDate();
  link += day < 10 ? "0" + day : day;
  const month = date.getMonth() + 1;
  link += month < 10 ? "0" + month : month;
  link += data.destination;
  link += "1";
  console.log("object=>", link);
  return link;
};
const createCard = data => {
  const ticket = document.createElement("article");
  ticket.classList.add(".ticket");
  if (data) {
    deep = `
<h3 class="agent">${data.gate}</h3>
<div class="ticket__wrapper">
	<div class="left-side">
		<a href="${getLinkAviasales(
      data
    )}" target="_blank" class="button button__buy">Купить
			за ${data.value}₽</a>
	</div>
	<div class="right-side">
		<div class="block-left">
			<div class="city__from">Вылет из города
				<span class="city__name">${getNameCity(data.origin)}(${data.origin})</span>
			</div>
			<div class="date">${getDate(data.depart_date)}</div>
		</div>

		<div class="block-right">
			<div class="changes">${getChanges(data.number_of_changes)}</div>
			<div class="city__to">Город назначения:
				<span class="city__name">${getNameCity(data.destination)}(${
      data.destination
    })</span>
			</div>
		</div>
	</div>
    </div>`;
  } else {
    deep = "<h3>Билетов не нашлось</h3>";
  }
  ticket.insertAdjacentHTML("afterbegin", deep);
  console.log(ticket);
  return ticket;
};
const renderCheapDay = cheapTicket => {
  cheapestTicket.style.display = "block";
  cheapestTicket.innerHTML = "<h2>Самый дешевый билет на выбранную дату</h2>";

  const ticket = createCard(cheapTicket[0]);
  cheapestTicket.append(ticket);
  console.log("cheapTicket:", cheapTicket);
};
const renderCheapYear = cheapTickets => {
  otherCheapTickets.style.display = "block";
  otherCheapTickets.innerHTML = "<h2>Самые дешевые билеты на другие даты</h2>";
  cheapTickets.sort((a, b) => a.value - b.value);
  for (let i = 0; i < cheapTickets.length && i < MAX_COUNT; i++) {
    const ticket = createCard(cheapTickets[i]);
    otherCheapTickets.append(ticket);
  }
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
  renderCheapYear(cheapTicket);
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
    from: cityFrom,
    to: cityTo,
    when: inputDateDepart.value
  };
  if (formData.from && formData.to) {
    console.log(formData);
    const requestData = `?depart_date=${formData.when}&origin=${formData.from.code}&destination=${formData.to.code}&one_way=true&token=${API_KEY}`;
    console.log(requestData);

    getData(
      proxy + calendar + requestData,
      response => {
        //   console.log(response);
        renderCheap(response, formData.when);
      },
      error => {
        alert("В этом направление нет рейса");
        console.error("ошибка", error);
      }
    );
  } else {
    alert("Введите корректное название города");
  }
});

// вызовы функций
getData(proxy + citiesApi, data => {
  city = JSON.parse(data).filter(item => item.name);

  city.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    if (a.name < b.name) {
      return -1;
    }
    return 0;
  });
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
