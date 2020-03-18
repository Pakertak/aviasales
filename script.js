
const   formSearch = document.querySelector('.form-search'),
        inputCitiesFrom = document.querySelector('.input__cities-from'),
        dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
        inputCitiesTo = document.querySelector('.input__cities-to'),
        dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
        inputDateDepart = document.querySelector('.input__date-depart');

const city = ['Минск', 'Москва', 'Киев', 'Ростов-на-дону',
 'Самара','Канберра', 'Вена', 'Баку', 'Тирана', 'Алжир', 
 'Луанда', ' Андорра-ла-Велья', ' Сент-Джонс', ' Буэнос-Айрес',
 'Ереван','Кабул', 'Нассау', 'Дакка', 'Уагадугу'];

const showCity = (input, list) => {
    list.textContent = ' ';

    if (input.value !== '') {
 
            const filterCity = city.filter((item)=>{
            const fixItem = item.toLowerCase();
            return fixItem.indexOf(input.value.toLowerCase())===0;
        })
        filterCity.forEach((item) =>{
            const li = document.createElement('li');
            li.classList.add('dropdown__city');
            li.textContent = item;
            list.append(li);
        })
    }
};

const write = (event, input_CitiesFrom, dropdown_CitiesFrom) => {
    const target = event.target;
    if(target.tagName.toLowerCase() === 'li'){
        input_CitiesFrom.value = target.textContent;
        dropdown_CitiesFrom.textContent = ' ';
    }
}

inputCitiesFrom.addEventListener('input', () => {
    showCity(inputCitiesFrom, dropdownCitiesFrom)
});

dropdownCitiesFrom.addEventListener('click', (event) => {
    write(event, inputCitiesFrom, dropdownCitiesFrom);
})

inputCitiesTo.addEventListener('input', () => {
    showCity(inputCitiesTo, dropdownCitiesTo)
});

dropdownCitiesTo.addEventListener('click', (event) => {
    write(event, inputCitiesTo, dropdownCitiesTo);
})