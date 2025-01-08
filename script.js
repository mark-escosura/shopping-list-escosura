/**
 * First step is to implement the add items to list feature
 *
 * we want to capture the form submission event
 * retrieve input value
 * create a new list item
 * append the new item to the list
 * clear the input field after submit
 *
 */

// Save items to LocalStorage
function saveToLocalStorage(items) {
  localStorage.setItem('shoppingList', JSON.stringify(items));
}

// Get items from LocalStorage
function getFromLocalStorage() {
  const items = localStorage.getItem('shoppingList');
  return items ? JSON.parse(items) : [];
}

const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
let isEditing = false; // Flag to track edit mode
let itemToEdit = null; // Reference to the item being edited

// Add Item
itemForm.addEventListener('submit', addItem);
function addItem(e) {
  e.preventDefault();

  const newItem = itemInput.value.trim();

  // Case where theres no item;
  if (newItem == '') return;

  if (isEditing) {
    // Update the item's text
    itemToEdit.firstChild.textContent = newItem;

    const items = getFromLocalStorage();
    const index = Array.from(itemList.children).indexOf(itemToEdit);
    items[index] = newItem;
    saveToLocalStorage(items);

    // Reset edit mode
    isEditing = false;
    itemToEdit = null;
    itemInput.value = '';
    const submitButton = itemForm.querySelector('button[type="submit"]');
    submitButton.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  } else {
    const li = document.createElement('li');
    li.textContent = newItem;

    // Add the remove button to the list item
    const removeButton = document.createElement('button');
    removeButton.className = 'remove-item btn-link text-red';
    removeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    li.appendChild(removeButton);

    itemList.appendChild(li);

    const items = getFromLocalStorage();
    items.push(newItem);
    saveToLocalStorage(items);
    itemInput.value = '';
  }
}

// Remove Item
itemList.addEventListener('click', removeItem);
function removeItem(e) {
  if (e.target.closest('.remove-item')) {
    const listItem = e.target.closest('.remove-item').parentElement;

    // Update LocalStorage
    const items = getFromLocalStorage();
    const index = Array.from(itemList.children).indexOf(listItem);
    items.splice(index, 1);
    saveToLocalStorage(items);

    // Remove the list item
    listItem.remove();

    if (isEditing && listItem === itemToEdit) {
      isEditing = false;
      itemToEdit = null;
      itemInput.value = '';
      const submitButton = itemForm.querySelector('button[type="submit"]');
      submitButton.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    }
  }
}

// Remove ALL Items
const clearButton = document.getElementById('clear');
clearButton.addEventListener('click', removeAllItems);
function removeAllItems() {
  itemList.innerHTML = '';
  saveToLocalStorage([]);

  if (isEditing) {
    isEditing = false;
    itemToEdit = null;
    itemInput.value = '';
    const submitButton = itemForm.querySelector('button[type="submit"]');
    submitButton.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  }
}

// Filter Items
const filterInput = document.getElementById('filter');
filterInput.addEventListener('input', filterItems);
function filterItems(e) {
  const filteredText = e.target.value.toLowerCase();
  const items = itemList.querySelectorAll('li');

  items.forEach((item) => {
    const itemText = item.textContent.toLowerCase();

    if (itemText.includes(filteredText)) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
}

// Edit Items
itemList.addEventListener('click', editItem);
function editItem(e) {
  if (e.target.closest('li') && !e.target.closest('.remove-item')) {
    // Get the clicked <li>
    const listItem = e.target.closest('li');

    // Set the input field to the item's current text
    itemInput.value = listItem.firstChild.textContent.trim();

    // Set edit mode
    isEditing = true;
    itemToEdit = listItem;

    // Update the submit button text
    const submitButton = itemForm.querySelector('button[type="submit"]');
    submitButton.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  }
}

// Load Items on Page Load
document.addEventListener('DOMContentLoaded', () => {
  const items = getFromLocalStorage();
  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;

    const removeButton = document.createElement('button');
    removeButton.className = 'remove-item btn-link text-red';
    removeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    li.appendChild(removeButton);

    itemList.appendChild(li);
  });
});
