'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

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

const displayMovements = function(acc , sort = false){
  containerMovements.innerHTML = '' ;

  const movs = sort ? acc.movements.slice().sort((a , b) => a>b) : acc.movements 

  movs.forEach(function(mov , i){

    const type = mov > 0 ? 'deposit' : 'withdrawal' ;

    const date = new Date(acc.movementsDates[i])
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const displayDate = `${day}/${month+1}/${year}`;

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
      <div class="movements__date">${displayDate} </div>
      <div class="movements__value">Rs.${mov > 0 ? mov.toFixed(2) : -mov.toFixed(2)}</div}>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin' , html)
  })
}

const calcDisplayBalance = function(accounts)
{
  accounts.balance = accounts.movements.reduce((acc , cur) => acc+cur , 0);
  labelBalance.textContent = `Rs.${accounts.balance}`
}

const createUserNames = function(accs)
{
    accs.forEach(function(acc){
      acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');

    });
}

createUserNames(accounts);

const updateUI = function(acc)
{
  displayMovements(acc)

  calcDisplayBalance(acc)

  calcDisplaySummary(acc)
}

const calcDisplaySummary = function(accounts)
{
  const incomes = accounts.movements.filter(mov => mov>0).reduce((acc , mov) => acc+mov , 0);
  labelSumIn.textContent = `Rs.${incomes.toFixed(2)}`

  const outcomes = accounts.movements.filter(mov => mov<0).reduce((acc , mov) => acc+mov , 0);
  labelSumOut.textContent = `Rs.${-outcomes.toFixed(2)}`
  
  const interest = accounts.movements.filter(mov => mov>0).map(deposit => deposit*accounts.interestRate/100).filter(int => int>=1).reduce((acc , int) => acc + int , 0);
  labelSumInterest.textContent = `Rs.${interest.toFixed(2)}`;

}

let currentAccount ;

btnLogin.addEventListener('click' , function(event){
  //Prevent form from submitting
  event.preventDefault()
  
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value)
  console.log(currentAccount);

  if(currentAccount?.pin === Number(inputLoginPin.value))
  {
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner}`

    containerApp.style.opacity = 100 ;

    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();
    const second = now.getSeconds()
    const hour = now.getHours()
    const min = now.getMinutes()
    labelDate.textContent = `${day}/${month+1}/${year} , ${hour}:${min}:${second}`;

    //Clear input feilds
    inputLoginUsername.value = ''
    inputLoginPin.value = ''
    inputLoginPin.blur()

    updateUI(currentAccount);
  }

  else 
  {
    labelWelcome.textContent = `Wrong Credentials`
    containerApp.style.opacity = 0
  }
})

btnTransfer.addEventListener('click' , function(event){
  event.preventDefault()

  const amount = Number(inputTransferAmount.value)
  const receiverAccount = accounts.find(acc => acc.username === inputTransferTo.value)
  
  inputTransferAmount.value = inputTransferTo.value = ''

  if(amount > 0 && currentAccount.balance >= amount && receiverAccount.username !== currentAccount.username && receiverAccount)
  { 
    //Doing transfer
    currentAccount.movements.push(-amount)
    receiverAccount.movements.push(amount)

    currentAccount.movementsDates.push(new Date().toISOString())
    receiverAccount.movementsDates.push(new Date().toISOString())

    updateUI(currentAccount)
  }

})

btnLoan.addEventListener('click' , function(event){
  event.preventDefault()

  const amount = Number(inputLoanAmount.value) ;

  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount*0.1))
  {
    //Adding movements
    currentAccount.movements.push(amount)
    currentAccount.movementsDates.push(new Date().toISOString())

    updateUI(currentAccount)
  }
  else 
  {
    labelWelcome.textContent = `Sorry Loan can't be given because your deposits are less`
  }
  inputLoanAmount.value = ''
})

btnClose.addEventListener('click' , function(event){
  event.preventDefault()  
  
  if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin)
  {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username)

    //Delete Account
    accounts.splice(index , 1)
    containerApp.style.opacity = 0
    console.log('deleted')
  }
  else 
  {
    labelWelcome.textContent = `Wrong Credentials`
  }

  inputCloseUsername.value = inputClosePin.value = '';
})

let sorted = false;

btnSort.addEventListener('click' , function(event){
  event.preventDefault()

  displayMovements(currentAccount , !sorted)
  sorted = !sorted
})

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
