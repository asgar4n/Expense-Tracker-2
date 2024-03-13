fetchData();

function fetchData() {
  const storedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
  const expenseList = document.getElementById('expenseList');
  expenseList.innerHTML = "";

  storedExpenses.forEach(expense => {
    const expenseContainer = createExpenseElement(expense.amount, expense.description, expense.category, expense._id);
    expenseList.appendChild(expenseContainer);
  });
}

// Renamed the function from addStudent to addExpense
function addExpense() {
  const amount = document.getElementById('amount').value;
  const description = document.getElementById('description').value;
  const category = document.getElementById('category').value;
  const editExpenseId = document.getElementById('editExpenseId').value;

  if (amount && description && category) {
    const storedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];

    if (editExpenseId) {
      // Update the existing expense
      updateExpense(editExpenseId, amount, description, category, storedExpenses);
    } else {
      // Add a new expense
      const newExpense = { amount, description, category, _id: Date.now().toString() };
      storedExpenses.push(newExpense);
      localStorage.setItem('expenses', JSON.stringify(storedExpenses));

      const expenseContainer = createExpenseElement(amount, description, category, newExpense._id);
      document.getElementById('expenseList').appendChild(expenseContainer);
    }

    // Clear input fields and editExpenseId
    document.getElementById('amount').value = '';
    document.getElementById('description').value = '';
    document.getElementById('category').value = '';
    document.getElementById('editExpenseId').value = '';
  } else {
    alert('Please fill in all fields before adding an expense.');
  }
}

function editExpense(expenseId) {
  const storedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
  const foundExpense = storedExpenses.find(expense => expense._id === expenseId);

  if (foundExpense) {
    const { amount, description, category } = foundExpense;
    document.getElementById('amount').value = amount;
    document.getElementById('description').value = description;
    document.getElementById('category').value = category;

    // Set the edited expense ID
    document.getElementById('editExpenseId').value = expenseId;
  }
}

function deleteExpense(container, expenseId) {
  const storedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
  const updatedExpenses = storedExpenses.filter(expense => expense._id !== expenseId);
  localStorage.setItem('expenses', JSON.stringify(updatedExpenses));

  container.remove();
}

function updateExpense(expenseId, amount, description, category, storedExpenses) {
  const foundExpenseIndex = storedExpenses.findIndex(expense => expense._id === expenseId);

  if (foundExpenseIndex !== -1) {
    storedExpenses[foundExpenseIndex].amount = amount;
    storedExpenses[foundExpenseIndex].description = description;
    storedExpenses[foundExpenseIndex].category = category;

    localStorage.setItem('expenses', JSON.stringify(storedExpenses));

    // Update UI
    const expenseContainer = document.querySelector(`[data-expense-id="${expenseId}"]`);
    const expenseDetailsElement = expenseContainer.querySelector('.expense-details');
    expenseDetailsElement.textContent = `Amount: ${amount} - Description: ${description} - Category: ${category}`;
  }
}

function createExpenseElement(amount, description, category, expenseId) {
  const expenseContainer = document.createElement('div');
  expenseContainer.classList.add('expense-container');
  expenseContainer.setAttribute('data-expense-id', expenseId);

  const expenseDetailsElement = document.createElement('div');
  expenseDetailsElement.classList.add('expense-details');
  expenseDetailsElement.textContent = `Amount: ${amount} - Description: ${description} - Category: ${category}`;

  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('buttons-container');

  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.classList.add('btn', 'btn-primary', 'edit-btn', 'mr-2', 'mt-2', 'mb-2');
  editButton.onclick = function () {
    editExpense(expenseId);
  };

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.classList.add('btn', 'btn-danger', 'delete-btn', 'mt-2', 'mb-2');
  deleteButton.onclick = function () {
    deleteExpense(expenseContainer, expenseId);
  };

  buttonsContainer.appendChild(editButton);
  buttonsContainer.appendChild(deleteButton);

  expenseContainer.appendChild(expenseDetailsElement);
  expenseContainer.appendChild(buttonsContainer);

  return expenseContainer;
}
