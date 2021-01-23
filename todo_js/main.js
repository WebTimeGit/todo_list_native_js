let btnIn = document.querySelector('.todo_btn'),
    clearAll = document.querySelector('.clear_todo'),
    todoUl = document.querySelector('.todo_body'),
    input = document.querySelector('.todo_in'),
    filterHidden,
    mainArray;

input.value = ''; // reset default value

// update local storage function
const updateLocalStorage = () => {
    localStorage.setItem('todo', JSON.stringify(mainArray));
}

if (!localStorage.todo) {
    mainArray = [];
} else {
    mainArray = JSON.parse(localStorage.getItem('todo'));
    addMessage();
}

// create our object
function eventPush() {
    let todoObject = {
        messages: input.value,
        important: false,
        performed: false,
        hidden: false
    };

    mainArray.push(todoObject);
    addMessage();
    updateLocalStorage();
    input.value = '';
}

// click on Enter
input.addEventListener('keydown', function (e) {
    if (!input.value || input.value.trim() === '') {
        return input.value = '';
    } else if (e.keyCode === 13) eventPush();
});

// default click on mouse
btnIn.addEventListener('click', function () {
    if (!input.value || input.value.trim() === '') {
        return input.value = '';
    }
    eventPush()
});

// create and integrate our content in mainArray
function addMessage() {

    if (mainArray.length === 0) {
        todoUl.innerHTML = '';
    } else {
        hiddenArray();
        importantFilterArray();
        completeFilterArray();
    }
    let message = '';
    mainArray.forEach(function (item, i) {
        message +=
            `<li class="liItem ${item.important ? 'important' : ''} ${item.performed ? 'complete' : ''} ${item.hidden ? 'hidden' : ''}">
                <label For="item_${i}" class="labelItem">
                    <i>${item.performed ? 'Done' : 'Not done'}</i>
                    ${!item.hidden ? item.messages : '****'}
                </label>
                <input type="checkbox" id="item_${i}" class="remove_input">
                <span>
                    <button type="button" class="btnHidden">hidden</button>
                    <button type="button" class="btnImportant">!</button>
                    <button type="button" class="delTask">X</button>
                </span>
             </li>`;
        todoUl.innerHTML = message;
    });
    updateLocalStorage();
    mainEventClick()
    closeTask();
}

//filter mainArray for searching import items or performed items and sort them in array
function completeFilterArray() {
    let completeArray = mainArray.length && mainArray.filter(item => item.performed === true);
    let notCompleteArray = mainArray.length && mainArray.filter(item => item.performed === false);
    mainArray = [...notCompleteArray, ...completeArray];
}

function hiddenArray() {
    filterHidden = mainArray.length && mainArray.filter(item => item.hidden === true);
    updateLocalStorage();
}

function importantFilterArray() {
    let importantArray = mainArray.length && mainArray.filter(item => item.important === true);
    let notImportantArray = mainArray.length && mainArray.filter(item => item.important === false);
    mainArray = [...importantArray, ...notImportantArray];
}

function closeTask() {
    let btnDel = todoUl.querySelectorAll('.delTask');
    for (let i = 0; i < btnDel.length; i++) {
        btnDel[i].addEventListener('click', function () {
            if (mainArray[i].hidden === true) return;
            mainArray.splice(i, 1);
            addMessage();
            updateLocalStorage();
        })
    }
}

// main function to add event on click important and click performed and hidden
function mainEventClick() {
    let allLi = todoUl.querySelectorAll('.liItem');
    todoUl.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });
    for (let i = 0; i < allLi.length; i++) {
        let important = allLi[i].querySelector('.btnImportant');
        let arrayLabel = allLi[i].querySelector('.labelItem');
        let btnHidden = allLi[i].querySelector('.btnHidden');

        important.addEventListener('click', function () {
            if (mainArray[i].hidden === true) return;
            if (mainArray[i].performed === true) {
                mainArray[i].performed = false
            }
            mainArray[i].important = !mainArray[i].important;
            updateLocalStorage();
            addMessage();
        });

        arrayLabel.addEventListener('click', function () {
            if (mainArray[i].hidden === true) return;
            if (mainArray[i].important === true) {
                mainArray[i].important = false
            }
            mainArray[i].performed = !mainArray[i].performed;
            updateLocalStorage();
            addMessage();
        });

        btnHidden.addEventListener('contextmenu', function (event) {
            if (event.ctrlKey || event.metaKey) {
                mainArray[i].hidden = !mainArray[i].hidden;
                updateLocalStorage();
                addMessage();
            }
        });
    }
}

// clear all
clearAll.addEventListener('click', function () {

    localStorage.clear();
    todoUl.innerHTML = '';
    mainArray = [...filterHidden];
    updateLocalStorage();
    addMessage();
})