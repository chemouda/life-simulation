/**
 * Interactive form and chart events / logic.
 */
(function () {
  var yearEl = document.getElementById('year'),
    monthEl = document.getElementById('month'),
    dayEl = document.getElementById('day'),
    unitboxEl = document.getElementById('unitbox'),
    unitText = document.querySelector('.unitbox-label').textContent.toLowerCase(),
    items = document.querySelectorAll('.chart li'),
    itemCount,
    remainCount,
    COLOR = 'red',
    KEY = {
      UP: 38,
      DOWN: 40
    };

  // Set listeners
  unitboxEl.addEventListener('change', _handleUnitChange);
  yearEl.addEventListener('input', _handleDateChange);
  yearEl.addEventListener('keydown', _handleUpdown);
  yearEl.addEventListener('blur', _unhideValidationStyles);
  monthEl.addEventListener('change', _handleDateChange);
  monthEl.addEventListener('keydown', _handleUpdown);
  dayEl.addEventListener('input', _handleDateChange);
  dayEl.addEventListener('blur', _unhideValidationStyles);
  dayEl.addEventListener('keydown', _handleUpdown);

  // Ensure the month is unselected by default.
  monthEl.selectedIndex = -1;

  // Load default values
  _loadStoredValueOfDOB();

  // Event Handlers
  function _handleUnitChange(e) {
    window.location = '' + e.currentTarget.value + '.html';
  }

  function _handleDateChange(e) {

    // Save date of birth in local storage
    localStorage.setItem("DOB", JSON.stringify({
      month: monthEl.value,
      year: yearEl.value,
      day: dayEl.value
    }));

    if (_dateIsValid()) {
      itemCount = calculateElapsedTime();
      remainCount = calculateRemainedTime();
      _repaintItems(itemCount);
      _repaintItems2(itemCount, remainCount);
    } else {
      _repaintItems(0);
    }
  }

  function _handleUpdown(e) {
    var newNum;
    // A crossbrowser keycode option.
    thisKey = e.keyCode || e.which;
    if (e.target.checkValidity()) {
      if (thisKey === KEY.UP) {
        newNum = parseInt(e.target.value, 10);
        e.target.value = newNum += 1;
        // we call the date change function manually because the input event isn't
        // triggered by arrow keys, or by manually setting the value, as we've done.
        _handleDateChange();
      } else if (thisKey === KEY.DOWN) {
        newNum = parseInt(e.target.value, 10);
        e.target.value = newNum -= 1;
        _handleDateChange();
      }
    }
  }

  function _unhideValidationStyles(e) {
    e.target.classList.add('touched');
  }

  function calculateElapsedTime() {
    var currentDate = new Date(),
      dateOfBirth = _getDateOfBirth(),
      diff = currentDate.getTime() - dateOfBirth.getTime(),
      elapsedTime;

    switch (unitText) {
      case 'days':
        elapsedTime = Math.round(diff / (1000 * 60 * 60 * 24));
        break;
      case 'weeks':
        elapsedTime = Math.round(diff / (1000 * 60 * 60 * 24 * 7));
        break;
      case 'months':
        // Months are tricky, being variable length, so I opted for the average number
        // of days in a month as a close-enough approximation.
        elapsedTime = Math.round(diff / (1000 * 60 * 60 * 24 * 30.4375));
        break;
      case 'years':
        elapsedTime = Math.round(diff / (1000 * 60 * 60 * 24 * 365.25));
        break;
    }

    return elapsedTime || diff;
  }

  function calculateRemainedTime() {
    var currentDate = new Date(),
      dateOfRemain = _getDateOfRemain(),
      diff = dateOfRemain.getTime() - currentDate.getTime(),
      remainedTime;

    switch (unitText) {
      case 'days':
        remainedTime = Math.round(diff / (1000 * 60 * 60 * 24));
        break;
      case 'weeks':
        remainedTime = Math.round(diff / (1000 * 60 * 60 * 24 * 7));
        break;
      case 'months':
        // Months are tricky, being variable length, so I opted for the average number
        // of days in a month as a close-enough approximation.
        remainedTime = Math.round(diff / (1000 * 60 * 60 * 24 * 30.4375));
        break;
      case 'years':
        remainedTime = Math.round(diff / (1000 * 60 * 60 * 24 * 365.25));
        break;
    }

    return remainedTime || diff;
  }

  function _dateIsValid() {
    return monthEl.checkValidity() && dayEl.checkValidity() && yearEl.checkValidity();
  }

  function _getDateOfBirth() {
    return new Date(yearEl.value, monthEl.value, dayEl.value);
  }

  function _getDateOfRemain() {
    
    birthYear = _getDateOfBirth().getFullYear(),
    currentYear = new Date().getFullYear(),
    year = getRandomIntInclusive(currentYear, birthYear+80);
    month = getRandomIntInclusive(1, 12);
    day = getRandomIntInclusive(1, 28);

    //return new Date(2045, 5, 14);
    return new Date(year, month, day);
  }

  function _repaintItems(number) {
    for (var i = 0; i < items.length; i++) {
      if (i < number) {
        items[i].style.backgroundColor = 'red';
      } else {
        items[i].style.backgroundColor = '';
      }
    }
  }

  function _repaintItems2(number, remain) {
    for (var i = number; i < number + remain; i++) {
      if (i >= number) {
        items[i].style.backgroundColor = 'blue';
      } else {
        items[i].style.backgroundColor = '';
      }
    }
  }

  function _loadStoredValueOfDOB() {
    var DOB = JSON.parse(localStorage.getItem('DOB'));

    if (!DOB) {
      return;
    }

    if (DOB.month >= 0 && DOB.month < 12) {
      monthEl.value = DOB.month
    }

    if (DOB.year) {
      yearEl.value = DOB.year
    }

    if (DOB.day > 0 && DOB.day < 32) {
      dayEl.value = DOB.day
    }
    _handleDateChange();
  }

  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
  }

})();