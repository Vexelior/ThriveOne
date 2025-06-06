<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useWorkTaskStore } from '../store/useWorkTaskStore'

const store = useWorkTaskStore();

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function handleModalShow() {
    updateCalendar();
}

async function updateCalendar() {
    console.log('Updating calendar...');
    initializeCalendar();
    renderCalendar();
}

function initializeCalendar() {
    renderMonths();
    setupYearNavigation();
    renderCalendar();
}

function renderMonths() {
    const monthsContainer = document.querySelector('.months');
    while (monthsContainer.firstChild) {
        monthsContainer.removeChild(monthsContainer.firstChild);
    }
    const allMonths = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    allMonths.forEach((month, i) => {
        const monthSpan = document.createElement('span');
        monthSpan.className = i === currentMonth ? 'each-month selected' : 'each-month';
        monthSpan.id = i + 1;
        monthSpan.textContent = month;
        monthsContainer.appendChild(monthSpan);
        monthSpan.addEventListener('click', () => {
            document.querySelector('.selected')?.classList.remove('selected');
            monthSpan.classList.add('selected');
            currentMonth = i;
            renderCalendar();
        });
    });
}

function setupYearNavigation() {
    document.querySelector('.triangle-right').addEventListener('click', () => {
        currentYear++;
        renderCalendar();
    });

    document.querySelector('.triangle-left').addEventListener('click', () => {
        currentYear--;
        renderCalendar();
    });
}

function renderCalendar() {
    const firstDay = new Date(currentYear, currentMonth).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const calendarBody = document.getElementById('calendar-body');
    const yearNum = document.getElementById('yearNum');
    calendarBody.innerHTML = '';
    yearNum.textContent = currentYear;

    let date = 1;
    for (let i = 0; i < 6; i++) {
        const weekRow = document.createElement('tr');
        for (let j = 0; j < 7; j++) {
            const dayCell = document.createElement('td');
            if (i === 0 && j < firstDay) {
                weekRow.appendChild(dayCell);
            } else if (date > daysInMonth) {
                break;
            } else {
                dayCell.textContent = date;
                dayCell.id = `${currentYear}${String(currentMonth + 1).padStart(2, '0')}${String(date).padStart(2, '0')}`;
                dayCell.className = 'dates';
                const today = new Date();
                if (date === today.getDate() && currentYear === today.getFullYear() && currentMonth === today.getMonth()) {
                    dayCell.classList.add('today');
                    updateTaskListSidebar(dayCell.id);
                }
                weekRow.appendChild(dayCell);
                date++;
            }
        }
        calendarBody.appendChild(weekRow);
    }

    updateTaskIcons();
    setupDayClickEvents();
}

function updateTaskIcons() {
    const dates = document.querySelectorAll('.dates');
    dates.forEach(dateCell => {
        const cellDate = dateCell.id;
        let taskCount = 0;
        store.workTasks.forEach(task => {
            const taskDate = new Date(task.dueDate);
            const formattedTaskDate = `${taskDate.getFullYear()}${String(taskDate.getMonth() + 1).padStart(2, '0')}${String(taskDate.getDate()).padStart(2, '0')}`;
            if (cellDate === formattedTaskDate) {
                taskCount++;
            }
        });
        if (taskCount > 0) {
            const icon = document.createElement('span');
            icon.classList.add('badge', 'bg-dark', 'ms-2', 'rounded-pill');
            icon.innerHTML = `${taskCount}`;
            icon.setAttribute('title', `${taskCount} task(s) on this date`);
            dateCell.appendChild(icon);
        }
    });
}

function setupDayClickEvents() {
    const calendarBody = document.getElementById('calendar-body');
    calendarBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('dates')) {
            document.querySelector('.selected-day')?.classList.remove('selected-day');
            e.target.classList.add('selected-day');
            updateTaskListSidebar(e.target.id);
        }
    });
}

function updateTaskListSidebar(selectedDate) {
    const taskListSidebar = document.getElementById('task-list-sidebar');
    taskListSidebar.innerHTML = '';
    let hasTasks = false;
    store.workTasks.forEach(task => {
        const taskDate = new Date(task.dueDate);
        const formattedTaskDate = `${taskDate.getFullYear()}${String(taskDate.getMonth() + 1).padStart(2, '0')}${String(taskDate.getDate()).padStart(2, '0')}`;
        if (formattedTaskDate === selectedDate) {
            const taskItem = document.createElement('li');
            taskItem.className = 'ms-3';
            taskItem.textContent = task.title;
            taskListSidebar.appendChild(taskItem);
            hasTasks = true;
        }
    });
    if (!hasTasks) {
        const noTaskItem = document.createElement('span');
        noTaskItem.textContent = 'No tasks due on this date';
        taskListSidebar.appendChild(noTaskItem);
    }
}

onMounted(() => {
    const modal = document.getElementById('calendar-modal');
    if (modal) {
        modal.addEventListener('shown.bs.modal', handleModalShow);
    }
});

onBeforeUnmount(() => {
    const modal = document.getElementById('calendar-modal');
    if (modal) {
        modal.removeEventListener('shown.bs.modal', handleModalShow);
    }
});

defineExpose({ updateCalendar });
</script>

<template>
    <input type="hidden" id="task-hidden-html" value="">
    <div class="modal fade" id="calendar-modal" tabindex="-1" aria-labelledby="calendar-modalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title" id="calendar-modalLabel">Calendar</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-lg-3">
                            <div class="card task-card">
                                <div class="card-body">
                                    <h5 class="card-title">Tasks</h5>
                                    <ul class="list-group" id="task-list-sidebar"></ul>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-9">
                            <div class="card calendar">
                                <div class="year-navigation-container">
                                    <div class="big-year text-center" id="yearNum"></div>
                                    <font-awesome-icon class="triangle-left" :icon="['fas', 'angle-left']" />
                                    <font-awesome-icon class="triangle-right" :icon="['fas', 'angle-right']" />
                                </div>
                                <div class="months"></div>
                                <hr class="month-line" />
                                <table class="calendar-table" id="calendar">
                                    <thead class="text-center">
                                        <tr>
                                            <th class="days-of-week">Sun</th>
                                            <th class="days-of-week">Mon</th>
                                            <th class="days-of-week">Tue</th>
                                            <th class="days-of-week">Wed</th>
                                            <th class="days-of-week">Thu</th>
                                            <th class="days-of-week">Fri</th>
                                            <th class="days-of-week">Sat</th>
                                        </tr>
                                    </thead>
                                    <tbody id="calendar-body"></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>
