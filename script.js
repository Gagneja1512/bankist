'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

const displayMovements = function(movements , sort = false){
  containerMovements.innerHTML = '' ;

  const movs = sort ? movements.slice().sort((a , b) => a>b) : movements 

  movs.forEach(function(mov , i){

    const type = mov > 0 ? 'deposit' : 'withdrawal' ;

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
      <div class="movements__value">Rs.${mov > 0 ? mov : -mov}</div}>
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
  displayMovements(acc.movements)

  calcDisplayBalance(acc)

  calcDisplaySummary(acc)
}

const calcDisplaySummary = function(accounts)
{
  const incomes = accounts.movements.filter(mov => mov>0).reduce((acc , mov) => acc+mov , 0);
  labelSumIn.textContent = `Rs.${incomes}`

  const outcomes = accounts.movements.filter(mov => mov<0).reduce((acc , mov) => acc+mov , 0);
  labelSumOut.textContent = `Rs.${-outcomes}`
  
  const interest = accounts.movements.filter(mov => mov>0).map(deposit => deposit*accounts.interestRate/100).filter(int => int>=1).reduce((acc , int) => acc + int , 0);
  labelSumInterest.textContent = `Rs.${interest}`;

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

  displayMovements(currentAccount.movements , !sorted)
  sorted = !sorted
})

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

