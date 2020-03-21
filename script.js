
const   formSearch = document.querySelector('.form-search'),
        inputCitiesFrom = document.querySelector('.input__cities-from'),
        dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
        inputCitiesTo = document.querySelector('.input__cities-to'),
        dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
        inputDateDepart = document.querySelector('.input__date-depart'),
        cheapestTicket = document.getElementById('cheapest-ticket'),
        otherCheapTickets = document.getElementById('other-cheap-tickets'),
        alertMessage = document.getElementById('alert-message');


const   CITY_API = 'http://api.travelpayouts.com/data/ru/cities.json',                  
        PROXY = 'https://cors-anywhere.herokuapp.com/',
        API_KEY = '3efbf4619c6d9e677188521e5a53e3b0',
        CALENDAR = 'http://min-prices.aviasales.ru/calendar_preload',
        MAX_COUNT = 10;
        

let city = [];

//-----------------Functions------------------//
// получение данных
const getData = (url, callback, reject = console.error) => {
    const request = new XMLHttpRequest();

    request.open('GET', url);

    request.addEventListener('readystatechange', () => {
        if(request.readyState !== 4) return;

        if(request.status === 200){
            callback(request.response);
        } else {
            reject(request.status);
        }
    });
        request.send();
};

//выпадающий список

const showCity = (input, list) => {
    list.textContent = ' ';

    if (input.value !== '') {

            const filterCity = city.filter((item)=>{
                if(item.name){
                    const fixItem = item.name.toLowerCase();
                    return fixItem.startsWith(input.value.toLowerCase());
                }

        });


        filterCity.forEach((item) =>{

            const li = document.createElement('li');
            li.classList.add('dropdown__city');
            li.textContent = item.name;
            list.append(li);

        });
    }
};

// вывод после выбора города из списка

const selectCity = (event, input_CitiesFrom, dropdown_CitiesFrom) => {
    const target = event.target;
    if(target.tagName.toLowerCase() === 'li'){
        input_CitiesFrom.value = target.textContent;
        dropdown_CitiesFrom.textContent = ' ';
    }
};

const getNameCity = (code) => {
    const objCity = city.find(item => item.code === code);
    return objCity.name;
};

const getDate = (date) => {
    return new Date(date).toLocaleString('ru', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};
 
const getChanges = (num) => {
    if(num){
        return num === 1 ? 'С одной пересадкой' : 'С двумя пересадками';
    } else {
        return 'Без пересадок';
    }
};

//https://www.aviasales.ru/search/SVX2905KGD1

const getLinkAviasales = (data) => {
    let link = 'https://www.aviasales.ru/search/';

    link += data.origin;

    const date = new Date(data.depart_date);

    const day = date.getDate();

    link += day< 10 ? '0' + day : day;

    const month = date.getMonth();

    link += month < 10 ? '0' + month : month;

    link += data.destination;

    link += '1';

    return link;
};

const createCard = (data) => {
    const ticket =  document.createElement('article');
    ticket.classList.add('ticket');

    let deep = '';

    if(data){
        deep = `
        <h3 class="agent">${data.gate}</h3>
        <div class="ticket__wrapper">
            <div class="left-side">
                <a href="${getLinkAviasales(data)}" target="_blank" class="button button__buy">Купить
                    за ${data.value}₽</a>
            </div>
            <div class="right-side">
                <div class="block-left">
                    <div class="city__from">Вылет из города
                        <span class="city__name">${getNameCity(data.origin)}</span>
                    </div>
                    <div class="date">${getDate(data.depart_date)}</div>
                </div>

                <div class="block-right">
                    <div class="changes">${getChanges(data.number_of_changes)}</div>
                    <div class="city__to">Город назначения:
                        <span class="city__name">${getNameCity(data.destination)}</span>
                    </div>
                </div>
            </div>
        </div>    
        `;
    } else {
        deep = '<h3>К сожалению на текущую дату билетов не нашлось!</h3>';
    }
    ticket.insertAdjacentHTML('afterbegin', deep);

    return ticket;
};

const renderCheap = (data, date) => {

    const renderCheapDay = cheapTicket => {
        cheapestTicket.style.display = 'block';
        cheapestTicket.innerHTML = '<h2>Самый дешевый билет на выбранную дату</h2>';

        const ticket = createCard(cheapTicket[0]);
        cheapestTicket.append(ticket);
    };

    const renderCheapYear = cheapTickets => {
        otherCheapTickets.style.display = 'block';
        otherCheapTickets.innerHTML = '<h2>Самые дешевые билеты на другие даты</h2>';
        
        cheapTickets.sort((a,b) => {
            if(a.value > b.value){
                return 1;
            }
            if(a.value < b.value){
                return -1;
            }
            return 0;
        });
        
        for (let i = 0; i < cheapTickets.length && i < MAX_COUNT; i++){
            const ticket = createCard(cheapTickets[i]);
            otherCheapTickets.append(ticket);
        }
    };

    const cheapTicketYear = JSON.parse(data).best_prices;
    const cheapTicketDay = cheapTicketYear.filter(item => item.depart_date === date);

    renderCheapDay(cheapTicketDay);
    renderCheapYear(cheapTicketYear);

} 

document.querySelector('body').addEventListener('click', () => {
    document.querySelectorAll('.dropdown').forEach(item => item.textContent = '');
});


inputCitiesFrom.addEventListener('input', () => {
    showCity(inputCitiesFrom, dropdownCitiesFrom)
});

dropdownCitiesFrom.addEventListener('click', (event) => {
    selectCity(event, inputCitiesFrom, dropdownCitiesFrom);
});


inputCitiesTo.addEventListener('input', () => {
    showCity(inputCitiesTo, dropdownCitiesTo)
});

dropdownCitiesTo.addEventListener('click', (event) => {
    selectCity(event, inputCitiesTo, dropdownCitiesTo);
});

formSearch.addEventListener('submit', (event) => {
    event.preventDefault();

    alertMessage.textContent = '';
    const formData = {

        from: city.find(item => inputCitiesFrom.value === item.name ),
        to: city.find(item => inputCitiesTo.value === item.name ),
        when: inputDateDepart.value, 

    };

    if(formData.from && formData.to){
        const requestData = `?depart_date=${formData.when}&origin=${formData.from.code}`
        + `&destination=${formData.to.code}&one_way=true`;

            //response - ответ от сервера
        getData(CALENDAR + requestData, (response) => {
            renderCheap(response, formData.when);
        }, (error) => {
            alertMessage.innerHTML = '<h2>В этом направлении нет рейсов.</h2>';
        });
    } else {
        alertMessage.innerHTML = '<h2>Введите корректное название города!</h2>';
        cheapestTicket.textContent = '';
        otherCheapTickets.textContent = '';
    }
});

getData(PROXY + CITY_API, (data) => {
   city = JSON.parse(data).filter(item => item.name);

   city.sort((a, b) => { 
        if(a.name > b.name){
            return 1;
        }
        
        if(a.name < b.name){
            return -1;
        }

        return 0;
    });
}, (error) => {
    alertMessage.innerHTML = '<h2>В этом направлении нет рейсов.</h2>';
    console.log('Ошибка: ', error);
});

