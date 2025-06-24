<template>
  <div class="pa-3">
    <v-row>
      <v-col cols="12" md="9">
        <v-list>
          <v-list-item>
            <div class="d-flex justify-space-between align-center" style="width: 100%">
              <div class="d-flex flex-column align-start">
                <span class="text-h4 font-weight-medium">Task Coming up</span>
                <span class="grey--text font-weight-medium text-subtitle-1">
                  {{ formatCurrentMonth() }}
                </span>
              </div>
              <div>
                <v-btn color="primary" @click="showAddDialog = true">
                  <v-icon left>mdi-plus</v-icon>
                  ADD TASK
                </v-btn>
              </div>
            </div>
          </v-list-item>

          <v-list-item class="mt-5">
            <v-card class="rounded-lg pa-4" elevation="2" style="width: 100%">
              <v-row align="center" justify="center">
                <v-col cols="12" sm="3">
                  <v-select
                      v-model="filters.category"
                      outlined
                      label="Category"
                      :items="categories"
                      hide-details
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="3">
                  <v-select
                      v-model="filters.priority"
                      outlined
                      label="Priority"
                      :items="priorities"
                      hide-details
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="3">
                  <v-select
                      v-model="viewMode"
                      outlined
                      label="View Mode"
                      :items="viewModes"
                      hide-details
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="3">
                  <div class="d-flex">
                    <v-btn icon @click="previousMonth">
                      <v-icon>mdi-chevron-left</v-icon>
                    </v-btn>
                    <v-btn text @click="goToToday" class="mx-2">Today</v-btn>
                    <v-btn icon @click="nextMonth">
                      <v-icon>mdi-chevron-right</v-icon>
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-list-item>

          <v-list-item class="mt-4">
            <v-card class="pa-4" elevation="2" style="width: 100%; position: relative;">
              <div class="d-flex justify-center align-center mb-4">
                <v-btn icon @click="previousMonth">
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <span class="text-h5 font-weight-medium mx-4">
                  {{ formatCurrentMonth() }}
                </span>
                <v-btn icon @click="nextMonth">
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </div>

              <v-row no-gutters class="mb-2">
                <v-col v-for="day in daysOfWeek" :key="day" cols="12" sm class="text-center">
                  <span class="font-weight-medium grey--text">{{ day }}</span>
                </v-col>
              </v-row>

              <div class="calendar-grid">
                <v-row
                    v-for="(week, weekIndex) in calendarWeeks"
                    :key="weekIndex"
                    no-gutters
                    class="calendar-week"
                >
                  <v-col
                      v-for="(day, dayIndex) in week"
                      :key="dayIndex"
                      cols="12"
                      sm
                      class="calendar-day-col"
                  >
                    <v-card
                        :class="getDayCardClass(day)"
                        @click="selectDay(day)"
                        @mouseenter="handleDayHover(day, $event)"
                        @mouseleave="handleDayMouseLeave"
                        elevation="1"
                        height="120"
                    >
                      <div class="pa-2 d-flex flex-column" style="height: 100%">
                        <div class="d-flex justify-space-between align-center mb-1">
                          <span
                              :class="getDayNumberClass(day)"
                              class="font-weight-medium"
                          >
                            {{ day.date }}
                          </span>
                          <v-chip
                              v-if="getTasksForDay(day).length > 0"
                              :color="getTaskCountColor(getTasksForDay(day).length)"
                              text-color="white"
                              x-small
                          >
                            {{ getTasksForDay(day).length }}
                          </v-chip>
                        </div>

                        <div class="flex-grow-1 overflow-hidden">
                          <div
                              v-for="(task) in getTasksForDay(day).slice(0, 2)"
                              :key="task.id"
                              class="task-item mb-1"
                              @click.stop="editTask(task)"
                          >
                            <v-chip
                                :color="getPriorityColor(task.priority)"
                                text-color="white"
                                x-small
                                :class="{ 'task-completed-chip': task.completed }"
                            >
                              <v-icon
                                  v-if="task.completed"
                                  x-small
                                  left
                              >
                                mdi-check
                              </v-icon>
                              {{ task.title.length > 15 ? task.title.substring(0, 15) + '...' : task.title }}
                            </v-chip>
                          </div>

                          <div
                              v-if="getTasksForDay(day).length > 2"
                              class="text-caption grey--text text-center"
                          >
                            +{{ getTasksForDay(day).length - 2 }} more
                          </div>
                        </div>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </div>

              <!-- Hover Card -->
              <v-card
                  v-if="hoverCard.show"
                  class="hover-task-card elevation-8"
                  :style="hoverCard.style"
                  @mouseenter="handleHoverCardEnter"
                  @mouseleave="handleHoverCardLeave"
                  @click="selectDayFromHover"
              >
                <v-card-title class="py-2">
                  <v-icon color="primary" class="mr-2">mdi-calendar-today</v-icon>
                  <span class="text-subtitle-1">{{ formatHoverDate(hoverCard.day) }}</span>
                  <v-spacer></v-spacer>
                  <v-btn icon small @click.stop="hideHoverCard">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text class="pa-2" style="max-height: 300px; overflow-y: auto;">
                  <v-list dense>
                    <v-list-item
                        v-for="task in hoverCard.tasks"
                        :key="task.id"
                        class="px-2 py-1"
                        @click.stop="editTask(task)"
                    >
                      <v-list-item-avatar size="24" class="mr-2">
                        <v-icon
                            :color="task.completed ? 'success' : 'grey'"
                            small
                        >
                          {{ task.completed ? 'mdi-check-circle' : 'mdi-circle-outline' }}
                        </v-icon>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title
                            class="text-caption"
                            :class="{ 'text-decoration-line-through grey--text': task.completed }"
                        >
                          {{ task.title }}
                        </v-list-item-title>
                        <div class="d-flex mt-1">
                          <v-chip
                              :color="getPriorityColor(task.priority)"
                              text-color="white"
                              x-small
                              class="mr-1"
                          >
                            {{ task.priority }}
                          </v-chip>
                          <v-chip
                              outlined
                              :color="getCategoryColor(task.category)"
                              x-small
                          >
                            {{ task.category }}
                          </v-chip>
                        </div>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card-text>
                <v-card-actions class="pa-2">
                  <v-btn small color="primary" @click.stop="selectDayFromHover">
                    View All Tasks
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn small text @click.stop="hideHoverCard">
                    Close
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-card>
          </v-list-item>

          <v-list-item v-if="selectedDay" class="mt-4">
            <v-card class="pa-4 selected-day-card" style="width: 100%">
              <div class="d-flex align-center mb-3">
                <v-icon color="primary" class="mr-2">mdi-calendar-today</v-icon>
                <span class="text-h6">{{ formatSelectedDay() }}</span>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    small
                    @click="addTaskForSelectedDay"
                >
                  <v-icon left small>mdi-plus</v-icon>
                  Add Task
                </v-btn>
              </div>

              <div v-if="selectedDayTasks.length === 0" class="text-center pa-4">
                <v-icon size="48" color="grey lighten-2">mdi-calendar-blank</v-icon>
                <p class="grey--text mt-2">No tasks for this day</p>
              </div>

              <div v-else>
                <v-row class="mb-3">
                  <v-col cols="4">
                    <v-card class="pa-3 text-center" color="success lighten-5">
                      <span class="success--text font-weight-bold text-h6">
                        {{ selectedDayStats.completed }}
                      </span>
                      <div class="grey--text text-caption">Completed</div>
                    </v-card>
                  </v-col>
                  <v-col cols="4">
                    <v-card class="pa-3 text-center" color="warning lighten-5">
                      <span class="warning--text font-weight-bold text-h6">
                        {{ selectedDayStats.pending }}
                      </span>
                      <div class="grey--text text-caption">Pending</div>
                    </v-card>
                  </v-col>
                  <v-col cols="4">
                    <v-card class="pa-3 text-center" color="info lighten-5">
                      <span class="info--text font-weight-bold text-h6">
                        {{ selectedDayStats.progress }}%
                      </span>
                      <div class="grey--text text-caption">Progress</div>
                    </v-card>
                  </v-col>
                </v-row>

                <v-list>
                  <v-list-item
                      v-for="task in selectedDayTasks"
                      :key="task.id"
                      class="task-list-item"
                  >
                    <v-list-item-action>
                      <v-checkbox
                          v-model="task.completed"
                          @change="updateTaskCompletion(task.id, $event)"
                          color="primary"
                      />
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title
                          :class="{ 'text-decoration-line-through grey--text': task.completed }"
                      >
                        {{ task.title }}
                      </v-list-item-title>
                      <v-list-item-subtitle v-if="task.description">
                        {{ task.description }}
                      </v-list-item-subtitle>
                      <div class="d-flex mt-1">
                        <v-chip
                            :color="getPriorityColor(task.priority)"
                            text-color="white"
                            x-small
                            class="mr-2"
                        >
                          {{ task.priority }}
                        </v-chip>
                        <v-chip
                            outlined
                            :color="getCategoryColor(task.category)"
                            x-small
                        >
                          {{ task.category }}
                        </v-chip>
                      </div>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-menu bottom left>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn icon small v-bind="attrs" v-on="on">
                            <v-icon>mdi-dots-vertical</v-icon>
                          </v-btn>
                        </template>
                        <v-list>
                          <v-list-item @click="editTask(task)">
                            <v-list-item-icon>
                              <v-icon>mdi-pencil</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>Edit</v-list-item-title>
                          </v-list-item>
                          <v-list-item @click="rescheduleTask(task)">
                            <v-list-item-icon>
                              <v-icon>mdi-calendar-clock</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>Reschedule</v-list-item-title>
                          </v-list-item>
                          <v-list-item @click="deleteTask(task.id)">
                            <v-list-item-icon>
                              <v-icon color="red">mdi-delete</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>Delete</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </div>
            </v-card>
          </v-list-item>
        </v-list>
      </v-col>

      <v-col cols="12" md="3" class="hidden-sm-and-down">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex align-center mb-4">
            <v-icon color="primary" class="mr-2">mdi-chart-box</v-icon>
            <span class="font-weight-medium text-h6">Monthly Overview</span>
          </div>

          <v-row>
            <v-col cols="6">
              <v-card class="d-flex flex-column align-center justify-center pa-4 rounded-lg" color="success lighten-5">
                <span class="success--text font-weight-bold text-h4">{{ monthlyStats.completed }}</span>
                <span class="grey--text text-caption">Completed</span>
              </v-card>
            </v-col>
            <v-col cols="6">
              <v-card class="d-flex flex-column align-center justify-center pa-4 rounded-lg" color="warning lighten-5">
                <span class="warning--text font-weight-bold text-h4">{{ monthlyStats.pending }}</span>
                <span class="grey--text text-caption">Pending</span>
              </v-card>
            </v-col>
          </v-row>

          <div class="mt-4">
            <div class="d-flex align-center justify-space-between text-subtitle-2 blue-grey--text mb-2">
              <span>Monthly Progress</span>
              <span>{{ monthlyStats.progress }}%</span>
            </div>
            <v-progress-linear
                :value="monthlyStats.progress"
                rounded
                height="8"
                color="primary"
            ></v-progress-linear>
          </div>
        </v-card>

        <v-card class="pa-4 mt-4" elevation="2">
          <div class="d-flex align-center mb-4">
            <v-icon color="primary" class="mr-2">mdi-calendar-week</v-icon>
            <span class="font-weight-medium text-h6">Week Overview</span>
          </div>

          <div v-for="(week, index) in weeklyOverview" :key="index" class="mb-3">
            <div class="d-flex justify-space-between align-center mb-1">
              <span class="text-subtitle-2">{{ week.dateRange }}</span>
              <span class="text-caption grey--text">{{ week.tasks }} tasks</span>
            </div>
            <v-progress-linear
                :value="(week.tasks / weeklyOverview.reduce((max, w) => Math.max(max, w.tasks), 1)) * 100"
                :color="getWeekColor(week.tasks)"
                height="6"
                rounded
            ></v-progress-linear>
          </div>
        </v-card>

        <v-card class="pa-4 mt-4" elevation="2">
          <div class="d-flex align-center mb-4">
            <v-icon color="primary" class="mr-2">mdi-tag-multiple</v-icon>
            <span class="font-weight-medium text-h6">Categories</span>
          </div>

          <div class="d-flex flex-wrap">
            <v-chip
                v-for="category in categoryStats"
                :key="category.name"
                :color="getCategoryColor(category.name)"
                text-color="white"
                class="ma-1"
                small
                @click="filterByCategory(category.name)"
            >
              {{ category.name }} ({{ category.count }})
            </v-chip>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="showAddDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editingTask ? 'Edit Task' : 'Add New Task' }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="taskForm" v-model="formValid">
            <v-text-field
                v-model="taskForm.title"
                label="Task Title"
                :rules="[v => !!v || 'Title is required']"
                required
            ></v-text-field>

            <v-textarea
                v-model="taskForm.description"
                label="Description (Optional)"
                rows="3"
            ></v-textarea>

            <v-select
                v-model="taskForm.category"
                :items="categories.filter(c => c !== 'All')"
                label="Category"
                :rules="[v => !!v || 'Category is required']"
                required
            ></v-select>

            <v-select
                v-model="taskForm.priority"
                :items="priorities.filter(p => p !== 'All')"
                label="Priority"
                :rules="[v => !!v || 'Priority is required']"
                required
            ></v-select>

            <v-text-field
                v-model="taskForm.dueDate"
                label="Due Date"
                type="date"
                :rules="[v => !!v || 'Due date is required']"
                required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" @click="saveTask" :disabled="!formValid">
            {{ editingTask ? 'Update' : 'Add' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showRescheduleDialog" max-width="400px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Reschedule Task</span>
        </v-card-title>
        <v-card-text>
          <p class="mb-4">{{ reschedulingTask ? reschedulingTask.title : '' }}</p>
          <v-date-picker
              v-model="rescheduleDate"
              width="100%"
              color="primary"
          ></v-date-picker>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showRescheduleDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="confirmReschedule">
            Reschedule
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {  
  data() {
    return {
      currentDate: new Date(),
      selectedDay: null,
      viewMode: 'Month',
      hoverCard: {
        show: false,
        day: null,
        tasks: [],
        style: {},
        isHovering: false // Thêm flag để track hover state
      },
      hoverTimeout: null,
      hideTimeout: null, // Thêm timeout cho việc ẩn card
      
      daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      categories: ['All', 'Work', 'Personal', 'Health', 'Finance', 'Study'],
      priorities: ['All', 'High', 'Medium', 'Low'],
      viewModes: ['Month', 'Week', 'Day'],
      filters: {
        category: 'All',
        priority: 'All'
      },
      showAddDialog: false,
      showRescheduleDialog: false,
      editingTask: null,
      reschedulingTask: null,
      rescheduleDate: null,
      formValid: false,
      taskForm: {
        title: '',
        description: '',
        category: '',
        priority: '',
        dueDate: ''
      }
    }
  },
  computed: {
    ...mapGetters(["user_id","tasks"]),
    calendarWeeks() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startDay = firstDay.getDay();
      const weeks = [];
      let currentWeek = [];

      for (let i = 0; i < startDay; i++) {
        const prevDate = new Date(year, month, -(startDay - i - 1));
        currentWeek.push({
          date: prevDate.getDate(),
          fullDate: prevDate.toISOString().substr(0, 10),
          isCurrentMonth: false,
          isToday: false
        });
      }

      for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(year, month, day);
        const today = new Date();

        currentWeek.push({
          date: day,
          fullDate: date.toISOString().substr(0, 10),
          isCurrentMonth: true,
          isToday: date.toDateString() === today.toDateString()
        });

        if (currentWeek.length === 7) {
          weeks.push(currentWeek);
          currentWeek = [];
        }
      }

      if (currentWeek.length > 0) {
        const remainingDays = 7 - currentWeek.length;
        for (let i = 1; i <= remainingDays; i++) {
          const nextDate = new Date(year, month + 1, i);
          currentWeek.push({
            date: nextDate.getDate(),
            fullDate: nextDate.toISOString().substr(0, 10),
            isCurrentMonth: false,
            isToday: false
          });
        }
        weeks.push(currentWeek);
      }

      return weeks;
    },
    filteredTasks() {
      return this.tasks.filter(task => {
        const categoryMatch = this.filters.category === 'All' || task.category === this.filters.category;
        const priorityMatch = this.filters.priority === 'All' || task.priority === this.filters.priority;
        return categoryMatch && priorityMatch;
      });
    },
    selectedDayTasks() {
      if (!this.selectedDay) return [];
      return this.filteredTasks.filter(task => task.dueDate === this.selectedDay.fullDate);
    },
    selectedDayStats() {
      const tasks = this.selectedDayTasks;
      const completed = tasks.filter(task => task.completed).length;
      const pending = tasks.filter(task => !task.completed).length;
      const total = tasks.length;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

      return { completed, pending, total, progress };
    },
    monthlyStats() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();

      const monthlyTasks = this.filteredTasks.filter(task => {
        const taskDate = new Date(task.dueDate);
        return taskDate.getFullYear() === year && taskDate.getMonth() === month;
      });

      const completed = monthlyTasks.filter(task => task.completed).length;
      const pending = monthlyTasks.filter(task => !task.completed).length;
      const total = monthlyTasks.length;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

      return { completed, pending, total, progress };
    },
    weeklyOverview() {
      const weeks = [];

      for (let weekIndex = 0; weekIndex < this.calendarWeeks.length; weekIndex++) {
        const week = this.calendarWeeks[weekIndex];
        let taskCount = 0;
        let startDate = null;
        let endDate = null;

        week.forEach((day, dayIndex) => {
          if (day.isCurrentMonth) {
            const dayTasks = this.filteredTasks.filter(task => task.dueDate === day.fullDate);
            taskCount += dayTasks.length;
          }

          if (dayIndex === 0) {
            startDate = new Date(day.fullDate);
          }
          if (dayIndex === 6) {
            endDate = new Date(day.fullDate);
          }
        });

        const dateRange = `${startDate.getDate()}/${startDate.getMonth() + 1} - ${endDate.getDate()}/${endDate.getMonth() + 1}`;

        weeks.push({
          tasks: taskCount,
          dateRange: dateRange
        });
      }

      return weeks;
    },
    categoryStats() {
      const stats = [];
      const categoryCounts = {};

      this.filteredTasks.forEach(task => {
        if (!categoryCounts[task.category]) {
          categoryCounts[task.category] = 0;
        }
        categoryCounts[task.category]++;
      });

      Object.keys(categoryCounts).forEach(category => {
        stats.push({
          name: category,
          count: categoryCounts[category]
        });
      });

      return stats;
    }
  },
  methods: {
    getTodayDate() {
      return new Date().toISOString().substr(0, 10);
    },
    getTomorrowDate() {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().substr(0, 10);
    },
    getDateAfterDays(days) {
      const date = new Date();
      date.setDate(date.getDate() + days);
      return date.toISOString().substr(0, 10);
    },
    formatCurrentMonth() {
      return this.currentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      });
    },
    formatSelectedDay() {
      if (!this.selectedDay) return '';
      const date = new Date(this.selectedDay.fullDate);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    formatHoverDate(day) {
      if (!day) return '';
      const date = new Date(day.fullDate);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    },
    handleDayHover(day, event) {
      const tasks = this.getTasksForDay(day);

      if (tasks.length >= 1) {
        // Clear any existing timeouts
        clearTimeout(this.hoverTimeout);
        clearTimeout(this.hideTimeout);

        this.hoverTimeout = setTimeout(() => {
          const rect = event.target.getBoundingClientRect();
          const containerRect = event.target.closest('.calendar-grid').getBoundingClientRect();

          let left = rect.left - containerRect.left + rect.width + 10;
          let top = rect.top - containerRect.top;

          if (left + 300 > containerRect.width) {
            left = rect.left - containerRect.left - 310;
          }

          if (top + 200 > containerRect.height) {
            top = containerRect.height - 200;
          }

          this.hoverCard = {
            show: true,
            day: day,
            tasks: tasks,
            isHovering: false,
            style: {
              position: 'absolute',
              left: `${left}px`,
              top: `${top}px`,
              width: '300px',
              zIndex: 1000,
              pointerEvents: 'auto'
            }
          };
        }, 300);
      }
    },
    // Xử lý khi mouse leave khỏi calendar day
    handleDayMouseLeave() {
      clearTimeout(this.hoverTimeout);
      
      // Chỉ ẩn card nếu không đang hover vào card
      if (!this.hoverCard.isHovering) {
        this.hideTimeout = setTimeout(() => {
          if (!this.hoverCard.isHovering) {
            this.hoverCard.show = false;
          }
        }, 200);
      }
    },
    // Xử lý khi mouse enter vào hover card
    handleHoverCardEnter() {
      clearTimeout(this.hideTimeout);
      this.hoverCard.isHovering = true;
    },
    // Xử lý khi mouse leave khỏi hover card
    handleHoverCardLeave() {
      this.hoverCard.isHovering = false;
      this.hideTimeout = setTimeout(() => {
        this.hoverCard.show = false;
      }, 200);
    },
    hideHoverCard() {
      clearTimeout(this.hoverTimeout);
      clearTimeout(this.hideTimeout);
      this.hoverCard.show = false;
      this.hoverCard.isHovering = false;
    },
    selectDayFromHover() {
      this.selectedDay = this.hoverCard.day;
      this.hideHoverCard();
    },
    previousMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
      this.selectedDay = null;
      this.hideHoverCard();
    },
    nextMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
      this.selectedDay = null;
      this.hideHoverCard();
    },
    goToToday() {
      this.currentDate = new Date();
      this.selectedDay = null;
      this.hideHoverCard();
    },
    selectDay(day) {
      this.selectedDay = day;
      this.hideHoverCard();
    },
    getTasksForDay(day) {
      return this.filteredTasks.filter(task => task.dueDate === day.fullDate);
    },
    getDayCardClass(day) {
      const classes = ['calendar-day'];

      if (!day.isCurrentMonth) {
        classes.push('other-month');
      }

      if (day.isToday) {
        classes.push('today');
      }

      if (this.selectedDay && this.selectedDay.fullDate === day.fullDate) {
        classes.push('selected');
      }

      const tasks = this.getTasksForDay(day);
      if (tasks.length > 0) {
        classes.push('has-tasks');
      }

      return classes.join(' ');
    },
    getDayNumberClass(day) {
      const classes = [];

      if (!day.isCurrentMonth) {
        classes.push('grey--text');
      }

      if (day.isToday) {
        classes.push('primary--text');
      }

      return classes.join(' ');
    },
    getTaskCountColor(count) {
      if (count <= 2) return 'green';
      if (count <= 4) return 'orange';
      return 'red';
    },
    getWeekColor(taskCount) {
      if (taskCount <= 3) return 'green';
      if (taskCount <= 6) return 'orange';
      return 'red';
    },
    getCategoryColor(category) {
      const colors = {
        'Work': 'indigo',
        'Personal': 'teal',
        'Health': 'green',
        'Finance': 'blue',
        'Study': 'purple'
      };
      return colors[category] || 'grey';
    },
    getPriorityColor(priority) {
      const colors = {
        'High': 'red',
        'Medium': 'orange',
        'Low': 'green'
      };
      return colors[priority] || 'grey';
    },
    toggleTask(taskId) {
      const taskIndex = this.tasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        this.$set(this.tasks[taskIndex], 'completed', !this.tasks[taskIndex].completed);
      }
    },
    updateTaskCompletion(taskId, completed) {
      const taskIndex = this.tasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        this.$set(this.tasks[taskIndex], 'completed', completed);
      }
    },
    editTask(task) {
      this.editingTask = task;
      this.taskForm = {
        title: task.title,
        description: task.description || '',
        category: task.category,
        priority: task.priority,
        dueDate: task.dueDate || ''
      };
      this.showAddDialog = true;
      this.hideHoverCard();
    },
    rescheduleTask(task) {
      this.reschedulingTask = task;
      this.rescheduleDate = task.dueDate;
      this.showRescheduleDialog = true;
    },
    confirmReschedule() {
      if (this.reschedulingTask && this.rescheduleDate) {
        const taskIndex = this.tasks.findIndex(t => t.id === this.reschedulingTask.id);
        if (taskIndex !== -1) {
          this.$set(this.tasks[taskIndex], 'dueDate', this.rescheduleDate);
        }
      }
      this.showRescheduleDialog = false;
      this.reschedulingTask = null;
      this.rescheduleDate = null;
    },
    deleteTask(taskId) {
      this.tasks = this.tasks.filter(task => task.id !== taskId);
    },
    addTaskForSelectedDay() {
      this.taskForm.dueDate = this.selectedDay.fullDate;
      this.showAddDialog = true;
    },
    saveTask() {
      if (!this.formValid) return;

      if (this.editingTask) {
        Object.assign(this.editingTask, this.taskForm);
      } else {
        const newTask = {
          id: Date.now(),
          ...this.taskForm,
          completed: false
        };
        this.tasks.push(newTask);
      }

      this.closeDialog();
    },
    closeDialog() {
      this.showAddDialog = false;
      this.editingTask = null;
      this.taskForm = {
        title: '',
        description: '',
        category: '',
        priority: '',
        dueDate: this.selectedDay ? this.selectedDay.fullDate : this.getTodayDate()
      };
      if (this.$refs.taskForm) {
        this.$refs.taskForm.reset();
      }
    },
    filterByCategory(category) {
      this.filters.category = category;
    }
  }
}
</script>

<style scoped>
.calendar-grid {
  min-height: 600px;
}

.calendar-week {
  margin-bottom: 4px;
}

.calendar-day-col {
  padding: 2px;
}

.calendar-day {
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.calendar-day:hover {
  transform: translateY(-1px);
}

.calendar-day.today {
  border-color: #1976d2;
  background-color: rgba(25, 118, 210, 0.1);
}

.calendar-day.selected {
  border-color: #1976d2;
  background-color: rgba(25, 118, 210, 0.2);
}

.calendar-day.other-month {
  opacity: 0.5;
}

.calendar-day.has-tasks {
  background-color: rgba(76, 175, 80, 0.05);
}

.task-item {
  cursor: pointer;
}

.task-item:hover {
  opacity: 0.8;
}

.task-completed-chip {
  opacity: 0.7;
  text-decoration: line-through;
}

.selected-day-card {
  background-color: rgba(25, 118, 210, 0.05);
  border-left: 4px solid #1976d2;
}

.task-list-item {
  border-radius: 8px;
  margin-bottom: 8px;
  background-color: rgba(0, 0, 0, 0.02);
}

.task-list-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.hover-task-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.1);
  max-width: 300px;
  animation: fadeInUp 0.2s ease-out;
  cursor: pointer;
}

.hover-task-card:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
