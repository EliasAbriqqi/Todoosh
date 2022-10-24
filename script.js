"use strict";

const inputTask = document.querySelector(".task-input");
const submitTask = document.querySelector(".task-input-btn");
const taskContainer = document.querySelector(".tasks-container");
const selectPopup = document.querySelector(".select-category-popup-wrapper");
const radioButtons = selectPopup.querySelectorAll(".select-category-input");
const selectCategoryBtn = document.querySelector(".select-category-btn");
const todoForm = document.querySelector(".todo-form");
const filterPopupBtn = document.querySelector(".filter-btn");
const filterPopup = document.querySelector(".filter-popup-wrapper");
const applyFilterBtn = document.querySelector(".apply-filter-btn");
const filterCheckboxes = document.querySelectorAll(".filter-category-input");
const filterColLeft = document.querySelector(".filter-col-left");
const filterRadioBtns = document.querySelectorAll(".filter-radio");

let tasks;
let statusBtns;
let userInput;
let filterApplied = false;

// State Array

const taskState = [];
let taskArray = [];

let selectedCategory;
let taskChecked = false;

// Functions

const taskMarkup = function (task) {
  const markup = `<li class="task" data-index=${taskState.indexOf(task)}>
<button class="task-status"></button>
<span class="task-category category-${task[0]}"></span>
<input type="text" class="task-text" value="${
    task[1]
  }" maxlength="16" size="16" readonly />
<div class="task-btns">
<button class="task-edit-btn"></button>
<button class="task-delete-btn"></button>
</div>
</li>`;

  taskContainer.insertAdjacentHTML("beforeend", markup);
};

let taskCounterMarkup = `<p class="uncompleted-tasks-counter-msg">You have <span class="task-counter">0</span> uncompleted tasks</p>`;
todoForm.insertAdjacentHTML("afterend", taskCounterMarkup);
const counterNumber = document.querySelector(".task-counter");

const taskCounter = function () {
  let count = 0;
  taskState.forEach((task) => {
    if (task[2] === false) count += 1;
  });
  return count;
};

const showSelectCatPopup = function (e) {
  e.preventDefault();

  if (inputTask.value) {
    inputTask.blur();
    selectPopup.classList.add("display-block");
    document.documentElement.classList.add("overflow-hidden");
  }
  userInput = inputTask.value.trim();
};

const pushTask = function () {
  taskArray = [];
  taskArray.push(selectedCategory, userInput, taskChecked);
  taskState.push(taskArray);
  console.log(taskState);
};

const renderTask = function () {
  taskContainer.innerHTML = "";

  taskState.forEach((task) => {
    taskMarkup(task);

    if (task[2] === true) {
      const item = document.querySelector(
        `[data-index="${taskState.indexOf(task)}"] .task-status`
      );
      item.classList.remove("task-status");
      item.classList.add("task-status-done");
    }
  });
};

const showTaskContent = function () {
  if (userInput === "") return;

  filterApplied = false;

  radioButtons.forEach((rbtn) => {
    if (rbtn.checked) {
      selectedCategory = rbtn.value;
    }
  });

  if (!selectedCategory) return;

  pushTask();
  renderTask();

  inputTask.value = "";
  removeSelectPopup();
  inputTask.blur();

  counterNumber.textContent = taskCounter();

  tasks = document.querySelectorAll(".task");
  statusBtns = document.querySelectorAll(".task-status");
};

const resetDataSet = function () {
  const item = document.querySelectorAll("[data-index]");

  taskState.forEach((task, i) => {
    item[i].setAttribute("data-index", i);
  });
};

const removeSelectPopup = function () {
  document.documentElement.classList.remove("overflow-hidden");
  selectPopup.classList.remove("display-block");
  inputTask.focus();
};

const removeFilterPopup = function () {
  document.documentElement.classList.remove("overflow-hidden");
  filterPopup.classList.remove("display-block");
};

const renderFiltered = function () {
  removeFilterPopup();
  taskContainer.innerHTML = "";
  filterApplied = true;

  const filterArray = [];
  for (let i = 1; i < filterCheckboxes.length; i++) {
    if (filterCheckboxes[i].checked) {
      filterArray.push(filterCheckboxes[i].value);
    }
  }

  filterRadioBtns.forEach((radio) => {
    if (radio.value === "all" && radio.checked) {
      filterArray.forEach((cat) => {
        taskState.forEach((task) => {
          if (task[0] === cat) {
            taskMarkup(task);

            if (task[2] === true) {
              const item = document.querySelector(
                `[data-index="${taskState.indexOf(task)}"] .task-status`
              );
              item.classList.remove("task-status");
              item.classList.add("task-status-done");
            }
          }
        });
      });
    }

    if (radio.value === "completed" && radio.checked) {
      filterArray.forEach((cat) => {
        taskState.forEach((task) => {
          if (task[0] === cat && task[2] === true) {
            taskMarkup(task);

            const item = document.querySelector(
              `[data-index="${taskState.indexOf(task)}"] .task-status`
            );
            item.classList.remove("task-status");
            item.classList.add("task-status-done");
          }
        });
      });
    }

    if (radio.value === "uncompleted" && radio.checked) {
      filterArray.forEach((cat) => {
        taskState.forEach((task) => {
          if (task[0] === cat && task[2] === false) {
            taskMarkup(task);
          }
        });
      });
    }
  });
};

// Event Listeners

submitTask.addEventListener("click", showSelectCatPopup);
selectCategoryBtn.addEventListener("click", showTaskContent);
window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && selectPopup.classList.contains("display-block")) {
    removeSelectPopup();
    return;
  }
  if (e.key === "Enter" && selectPopup.classList.contains("display-block")) {
    showTaskContent();
    return;
  }

  if (e.key === "Escape" && filterPopup.classList.contains("display-block")) {
    removeFilterPopup();
    return;
  }

  if (e.key === "Enter" && filterPopup.classList.contains("display-block")) {
    renderFiltered();
    return;
  }
});

selectPopup.addEventListener("click", function (e) {
  if (e.target.classList.contains("gray-veil")) {
    removeSelectPopup();
  }
});

filterPopup.addEventListener("click", function (e) {
  if (e.target.classList.contains("gray-veil")) {
    removeFilterPopup();
  }
});

taskContainer.addEventListener("click", (e) => {
  if (
    !e.target.classList.contains("task-status") &&
    !e.target.classList.contains("task-status-done") &&
    !e.target.classList.contains("task-edit-btn") &&
    !e.target.classList.contains("task-save-btn") &&
    !e.target.classList.contains("task-delete-btn")
  ) {
    return;
  }
  const taskIndex = e.target.closest(".task").getAttribute("data-index");
  const inputText = e.target.closest(".task").querySelector(".task-text");

  if (e.target.classList.contains("task-status")) {
    e.target.classList.remove("task-status");
    e.target.classList.add("task-status-done");
    taskState[taskIndex][2] = true;
    counterNumber.textContent = taskCounter();

    return;
  }

  if (e.target.classList.contains("task-status-done")) {
    e.target.classList.remove("task-status-done");
    e.target.classList.add("task-status");
    taskState[taskIndex][2] = false;
    counterNumber.textContent = taskCounter();

    return;
  }

  if (e.target.classList.contains("task-edit-btn")) {
    e.target.classList.add("task-save-btn");
    e.target.classList.remove("task-edit-btn");
    inputText.removeAttribute("readonly");
    inputText.selectionStart = inputText.selectionEnd = inputText.value.length;
    inputText.focus();

    window.addEventListener("keydown", function (ev) {
      if (e.target.classList.contains("task-save-btn") && ev.key === "Enter") {
        e.target.classList.add("task-edit-btn");
        e.target.classList.remove("task-save-btn");
        inputText.blur();
        inputText.setAttribute("readonly", "readonly");
        taskState[taskIndex][1] = inputText.value;
      }
    });

    return;
  }

  if (e.target.classList.contains("task-save-btn")) {
    e.target.classList.add("task-edit-btn");
    e.target.classList.remove("task-save-btn");
    inputText.blur();
    inputText.setAttribute("readonly", "readonly");
    taskState[taskIndex][1] = inputText.value;

    return;
  }

  if (e.target.classList.contains("task-delete-btn")) {
    e.target.closest(".task").remove();
    taskState.splice(taskIndex, 1);
    console.log(taskIndex);
    console.log(taskState);
    counterNumber.textContent = taskCounter();

    if (filterApplied === false) {
      resetDataSet();
    } else {
      renderFiltered();
    }

    return;
  }
});

filterPopupBtn.addEventListener("click", (e) => {
  e.preventDefault();

  filterPopup.classList.add("display-block");
  document.documentElement.classList.add("overflow-hidden");
  filterPopupBtn.blur();

  filterColLeft.addEventListener("click", function (e) {
    if (!e.target.classList.contains("filter-category-input")) return;

    if (
      filterCheckboxes[0].checked === false &&
      e.target === filterCheckboxes[0]
    ) {
      filterCheckboxes.forEach((checkbox) => {
        checkbox.disabled = false;
        checkbox.checked = false;
      });
    }

    if (filterCheckboxes[0].checked === true) {
      filterCheckboxes.forEach((checkbox) => {
        checkbox.disabled = true;
        checkbox.checked = true;
        filterCheckboxes[0].disabled = false;
      });
    }
  });
});

applyFilterBtn.addEventListener("click", renderFiltered);
