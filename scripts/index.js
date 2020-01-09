const dropZone = document.getElementById('list');
const items = Array.from(document.querySelectorAll('.item'));
const submit = document.querySelector('.submit');
const result = document.querySelector('.result');
let adjacentItem = '';
let prevAdjacentItem;
let selectedItem = '';

const handleDragStart = e => {
  e.dataTransfer.effectAllowed = 'move';
  selectedItem = document.getElementById(e.target.id);
  if (selectedItem.classList.contains('drop')) {
    selectedItem.classList.remove('drop');
  }
};

const handleDragOver = e => {
  e.preventDefault();

  if (items.includes(document.getElementById(e.target.id))) {
    adjacentItem = document.getElementById(e.target.id);

    if (adjacentItem != prevAdjacentItem && prevAdjacentItem != undefined) {
      resetStyles(prevAdjacentItem);
    }

    if (
      adjacentItem != null &&
      adjacentItem != selectedItem &&
      items.includes(adjacentItem)
    ) {
      adjacentItem.style.marginTop = '4rem';
      adjacentItem.style.transition = '1.2s';
    }

    prevAdjacentItem = adjacentItem;
  }
};

const handleDragLeave = e => {
  resetStyles(adjacentItem);
};

const handleDrop = e => {
  e.preventDefault();

  if (adjacentItem != 'null' && items.includes(adjacentItem)) {
    dropZone.insertBefore(selectedItem, adjacentItem);
    selectedItem.classList.add('drop');

    resetStyles(adjacentItem);
  }
  updateRank();
};

const handleClick = e => {
  e.preventDefault();
  removeError();

  const selectedValue = document.querySelector(
    'input[name = "flavor"]:checked'
  );
  if (selectedValue == null) {
    displayError();
  }
  while (result.firstChild) {
    result.removeChild(result.firstChild);
  }
  updateRank();

  localStorage.setItem('selectedValue', selectedValue.value);
  updateResult();
};

const updateResult = () => {
  const paragraph = document.createElement('p');
  paragraph.textContent = `You had ${localStorage.getItem(
    'selectedValue'
  )} ice cream most recently. Your ice cream preferences are as follows:`;
  result.appendChild(paragraph);
  localStorage
    .getItem('listItems')
    .split(',')
    .forEach((item, index) => {
      let listItem = document.createElement('li');

      let content = document.createTextNode(index + 1 + '- ' + item);
      listItem.appendChild(content);

      result.appendChild(listItem);
    });
};

const updateRank = () => {
  const sortedItems = Array.from(dropZone.children);
  localStorage.setItem(
    'listItems',
    sortedItems.map(item => item.textContent)
  );

  console.log(localStorage.getItem('listItems'));
};

const resetStyles = item => {
  item.style.marginTop = 0;
  item.style.transition = '1.8s';
};

const displayError = () => {
  let errorMsg = document.getElementById('error');
  errorMsg.textContent = 'Please select a flavor';
};
const removeError = () => {
  let errorMsg = document.getElementById('error');
  errorMsg.textContent = '';
};

items.forEach(item => {
  item.addEventListener('dragstart', handleDragStart);
});

dropZone.addEventListener('dragover', handleDragOver);
dropZone.addEventListener('dragleave', handleDragLeave);
dropZone.addEventListener('drop', handleDrop);

submit.addEventListener('click', handleClick);
