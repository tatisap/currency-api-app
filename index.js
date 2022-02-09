async function getDataByDate(date) {

  const url = `https://www.nbrb.by/api/exrates/rates?ondate=${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}&periodicity=0`;
  const res = await fetch(url);
  const data = await res.json();
  console.log(data);

  addCurrency(data);
}

function addCurrency(data) {
  const abbrCells = document.querySelectorAll('.currency-abbr-cell');
  const currencyRow = document.querySelector('.currency-value-row');

  currencyRow.innerHTML = '';

  for (let cell of abbrCells) {
    let currencyRateCell = document.createElement('td');
    currencyRateCell.classList.add('currency-value-cell');
    currencyRateCell.textContent = getCurrencyRate(data, cell);
    currencyRow.append(currencyRateCell);
  }
}

function getCurrencyRate(data, cell) {
  for (let obj of data) {
    if ( cell.textContent.includes(obj.Cur_Abbreviation) ) {
      let value = String(obj.Cur_OfficialRate);
      return getValidFormat(value);
    }
  }
}

function getValidFormat(value) {
  let indexOfPoint = value.indexOf('.');
  if (indexOfPoint === -1) return value += ',0000';
  let partBeforePoint = value.slice(0, indexOfPoint);
  let partAfterPoint = value.slice(indexOfPoint + 1);
  switch (partAfterPoint.length) {
    case 1: partAfterPoint += '000';
      break;
    case 2: partAfterPoint += '00';
      break;
    case 3: partAfterPoint += '0';
      break;
  }
  return partBeforePoint + ',' + partAfterPoint;
}

let now = new Date();
const dateField = document.querySelector('.date-field');
dateField.value = `${now.getFullYear()}-${( (now.getMonth() + 1) < 10) ? `0${now.getMonth() + 1}` : now.getMonth() + 1}-${(now.getDate() < 10) ? `0${now.getDate()}` : now.getDate()}`;
getDataByDate(now);

const form = document.querySelector('.form');
form.addEventListener('submit', (event) => {
  event.preventDefault();

  let date = new Date(event.target.date.value);

  getDataByDate(date);
});