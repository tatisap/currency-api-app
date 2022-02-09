async function getData() {
  const url = 'https://www.nbrb.by/api/exrates/rates?ondate=2022-2-9&periodicity=0';
  const res = await fetch(url);
  const data = await res.json();
  console.log(data);

  addCurrency(data);
}
getData();

function addCurrency(data) {
  const abbrCells = document.querySelectorAll('.currency-abbr-cell');
  const currencyRow = document.querySelector('.currency-value-row');

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