'use strict';

class AccountCl {
  movements = [];
  interestRate = 1.2;
  currency = 'EUR';
  locale = navigator.language;
  constructor(owner, pin) {
    (this.owner = owner), (this.pin = pin);
  }
}

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [
    [200, '2022-01-05T21:31:17.178Z'],
    [455.23, '2022-01-12T07:42:02.383Z'],
    [-306.5, '2022-01-25T09:15:04.904Z'],
    [25000, '2022-03-20T10:17:24.185Z'],
    [-642.21, '2022-04-06T14:11:59.604Z'],
    [-133.9, '2022-04-07T17:01:17.194Z'],
    [79.97, '2022-07-02T23:36:17.929Z'],
    [1300, '2022-07-28T10:51:36.790Z'],
    [-30, '2022-08-24T10:51:36.790Z'],
    [2000, '2022-08-27T10:51:36.790Z'],
    [-1800, '2022-08-28T10:51:36.790Z'],
  ],
  interestRate: 1.2,
  pin: 1111,
  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [
    [5000, '2022-01-01T13:15:33.035Z'],
    [3400, '2022-02-09T09:48:16.867Z'],
    [-150, '2022-02-25T06:04:23.907Z'],
    [-790, '2022-05-05T14:18:46.235Z'],
    [-3210, '2022-05-07T16:33:06.386Z'],
    [-1000, '2022-05-19T14:43:26.374Z'],
    [8500, '2022-07-01T18:49:59.371Z'],
    [-30, '2022-07-26T12:01:20.894Z'],
    [830, '2022-08-24T10:51:36.790Z'],
    [-199.99, '2022-08-27T10:51:36.790Z'],
    [20.56, '2022-08-28T10:51:36.790Z'],
  ],
  interestRate: 1.5,
  pin: 2222,
  currency: 'USD',
  locale: 'en-US',
};

//

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const fNameInserted = document.querySelector('.input__first-name');
const lNameInserted = document.querySelector('.input__last-name');
const pinInserted = document.querySelector('.input__pin');

const createAccount = function (firstName, lastName, pin) {
  const ownerName = `${firstName} ${lastName}`;
  accounts.push(new AccountCl(ownerName));
};

//Display Date
const displayDate = (date, locale, options = '') => {
  return new Intl.DateTimeFormat(locale, options).format(new Date(date));
};

//Intl currency
const displayLocaleCurr = (mon, locale, curr) =>
  new Intl.NumberFormat(locale, { style: 'currency', currency: curr }).format(
    mon
  );

// Functions
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a[0] - b[0])
    : acc.movements;

  movs.forEach((mov, i) => {
    const daysPassed = (date1, date2) =>
      Math.abs(date1 - date2) / (1000 * 60 * 60 * 24);
    const whenMovement = Math.round(daysPassed(new Date(), new Date(mov[1])));

    const type = mov[0] < 0 ? 'withdrawal' : 'deposit';

    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1}
     ${type}</div>
     <div class="movements__date">${
       whenMovement <= 1
         ? 'Today'
         : whenMovement <= 2
         ? 'Yesterday'
         : whenMovement <= 7
         ? whenMovement + ' days ago'
         : displayDate(mov[1], acc.locale)
     }</div>
          <div class="movements__value">${displayLocaleCurr(
            mov[0],
            acc.locale,
            acc.currency
          )}</div>
        </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements
    .map(mov => mov[0])
    .reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${displayLocaleCurr(
    acc.balance,
    acc.locale,
    acc.currency
  )}`;
};

const calcDisplaySummary = function (movements) {
  labelSumIn.textContent = `${displayLocaleCurr(
    movements
      .map(mov => mov[0])
      .filter(mov => mov > 0)
      .reduce((acc, mov) => acc + mov, 0),
    currentAccount.locale,
    currentAccount.currency
  )}`;

  labelSumOut.textContent = `${displayLocaleCurr(
    Math.abs(
      movements
        .map(mov => mov[0])
        .filter(mov => mov < 0)
        .reduce((acc, mov) => acc + mov, 0)
    ),
    currentAccount.locale,
    currentAccount.currency
  )}`;

  labelSumInterest.textContent = `${displayLocaleCurr(
    movements
      .map(mov => mov[0])
      .filter(mov => mov > 0)
      .map(deposit => (deposit * currentAccount.interestRate) / 100)
      .filter(int => int > 1)
      .reduce((acc, int) => acc + int),
    currentAccount.locale,
    currentAccount.currency
  )}`;
};

const createUsernames = function (accounts) {
  accounts.forEach(account => {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(letters => letters[0])
      .join('');
  });
};

createUsernames(accounts);

const updateUI = function (currentAccount) {
  displayMovements(currentAccount);
  calcDisplayBalance(currentAccount);
  calcDisplaySummary(currentAccount.movements);
};

let currentAccount, timer;

//FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 1;

//Event handlers

btnLogin.addEventListener('click', e => {
  //Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value.trim()
  );

  if (currentAccount?.pin == inputLoginPin.value.trim()) {
    //Logged in, Display welcome message and UI
    labelWelcome.textContent = `Welcome, ${currentAccount.owner.split(' ')[0]}`;
    updateUI(currentAccount);
    containerApp.style.opacity = 1;

    //Clearing input fields
    inputLoginUsername.value = inputLoginPin.value = '';

    //Adding date
    labelDate.textContent = displayDate(new Date(), currentAccount.locale, {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });

    //Start LogOut timer

    if (timer) {
      clearInterval(timer);
    }
    timer = startLogOutTimer();
  } else {
    console.log('incorrect');
  }
});

btnTransfer.addEventListener('click', e => {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value.trim());
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value.trim()
  );

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    currentAccount.username !== receiverAcc?.username &&
    receiverAcc
  ) {
    currentAccount.movements.push([-amount, new Date().toJSON()]);
    receiverAcc.movements.push([amount, new Date().toJSON()]);
    updateUI(currentAccount);

    //Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }

  inputTransferTo.value = inputTransferAmount.value = '';
});

btnLoan.addEventListener('click', e => {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.map(mov => mov[0]).some(mov => mov >= 0.1 * amount)
  ) {
    setTimeout(() => {
      currentAccount.movements.push([amount, new Date().toJSON()]);
      updateUI(currentAccount);

      //Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 1500);
  }

  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', e => {
  e.preventDefault();

  if (
    inputCloseUsername.value.trim() === currentAccount.username &&
    inputClosePin.value.trim() == currentAccount.pin
  ) {
    const index = accounts.findIndex(acc => acc === currentAccount);

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;

    labelWelcome.textContent = `Log in to get started`;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();

  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

const startLogOutTimer = () => {
  let time = 300;
  const timer = setInterval(() => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    time--;
    if (time === -1) {
      clearInterval(timer);

      //Logout
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Log in to get started`;
    }
  }, 1000);

  return timer;
};

('use strict');
