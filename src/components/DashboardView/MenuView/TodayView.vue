<template>
  <div class="pa-3">
    <v-row>
      <v-col cols="12" md="9">
        <v-list>
          <v-list-item>
            <div class="d-flex justify-space-between align-center" style="width: 100%">
              <div class="d-flex flex-column align-start">
                <span class="text-h4 font-weight-medium">Today's Tasks</span>
                <span class="grey--text font-weight-medium text-subtitle-1">
                  {{ formatDate(new Date()) }}
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
                <v-col cols="12" sm="4">
                  <v-select
                      v-model="filters.category"
                      outlined
                      label="Category"
                      :items="categories"
                      hide-details
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-select
                      v-model="filters.priority"
                      outlined
                      label="Priority"
                      :items="priorities"
                      hide-details
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-select
                      v-model="filters.sortBy"
                      outlined
                      label="Sort by"
                      :items="sortOptions"
                      hide-details
                  ></v-select>
                </v-col>
              </v-row>
            </v-card>
          </v-list-item>

          <div v-if="filteredTasks.length === 0" class="text-center pa-8">
            <v-icon size="64" color="grey lighten-2">mdi-clipboard-text-outline</v-icon>
            <p class="text-h6 grey--text mt-4">No tasks found for today</p>
            <p class="grey--text">Add a new task for today to get started!</p>
          </div>

          <v-list-item v-for="task in filteredTasks" :key="task.id" class="my-3">
            <v-card
                style="width: 100%"
                class="pa-4"
                :class="{ 'task-completed': task.completed }"
            >
              <v-row align="center">
                <v-col cols="auto">
                  <v-checkbox
                      :value="task.completed"
                      @click.stop="toggleTask(task.id)"
                      color="primary"
                  />
                </v-col>
                <v-col>
                  <div class="d-flex flex-column align-start">
                    <div class="title-task-card">
                      <span
                          class="text-subtitle-1 font-weight-medium"
                          :class="{ 'text-decoration-line-through grey--text': task.completed }"
                      >
                        {{ task.title }}
                      </span>
                      <v-chip
                          :color="getPriorityColor(task.priority)"
                          text-color="white"
                          x-small
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
                    <span class="grey--text text-caption mt-1" v-if="task.description">
                      {{ task.description }}
                    </span>
                    <span class="grey--text text-caption" v-if="task.dueDate">
                      Due: {{ formatDate(new Date(task.dueDate)) }}
                    </span>
                  </div>
                </v-col>
                <v-col cols="auto">
                  <v-menu bottom left>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon v-bind="attrs" v-on="on">
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
                      <v-list-item @click="deleteTask(task.id)">
                        <v-list-item-icon>
                          <v-icon color="red">mdi-delete</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Delete</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-col>
              </v-row>
            </v-card>
          </v-list-item>

          <v-list-item class="mt-5">
            <v-card class="pa-4 task-suggestions-card" style="width: 100%">
              <div class="d-flex align-center mb-3">
                <v-icon color="primary" class="mr-2">mdi-lightbulb-outline</v-icon>
                <span class="text-h6">Suggested Tasks</span>
              </div>
              <v-list>
                <v-list-item
                    v-for="(suggestion, i) in suggestedTasks"
                    :key="i"
                    @click="addSuggestedTask(suggestion)"
                    class="suggestion-item"
                >
                  <v-list-item-avatar>
                    <v-avatar color="grey lighten-3">
                      <v-icon :color="getCategoryColor(suggestion.category)">
                        {{ getCategoryIcon(suggestion.category) }}
                      </v-icon>
                    </v-avatar>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ suggestion.title }}</v-list-item-title>
                    <v-list-item-subtitle>{{ suggestion.category }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon small color="primary">
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card>
          </v-list-item>

          <v-list-item class="mt-4">
            <v-card class="pa-4 productivity-tips-card" style="width: 100%">
              <div class="d-flex align-center mb-3">
                <v-icon color="primary" class="mr-2">mdi-check-circle-outline</v-icon>
                <span class="text-h6">Productivity Tips</span>
              </div>
              <v-list>
                <v-list-item v-for="(tip, index) in productivityTips" :key="index">
                  <v-list-item-icon>
                    <v-icon color="primary">mdi-check-circle-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ tip.title }}</v-list-item-title>
                    <v-list-item-subtitle>{{ tip.subtitle }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-list-item>
        </v-list>
      </v-col>

      <v-col cols="12" md="3" class="hidden-sm-and-down">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex align-center mb-4">
            <v-icon color="primary" class="mr-2">mdi-chart-box</v-icon>
            <span class="font-weight-medium text-h6">Today's Summary</span>
          </div>

          <v-row>
            <v-col cols="6">
              <v-card class="d-flex flex-column align-center justify-center pa-4 rounded-lg" color="success lighten-5">
                <span class="success--text font-weight-bold text-h4">{{ todayCompletedTasks }}</span>
                <span class="grey--text text-caption">Completed</span>
              </v-card>
            </v-col>
            <v-col cols="6">
              <v-card class="d-flex flex-column align-center justify-center pa-4 rounded-lg" color="warning lighten-5">
                <span class="warning--text font-weight-bold text-h4">{{ todayPendingTasks }}</span>
                <span class="grey--text text-caption">Pending</span>
              </v-card>
            </v-col>
          </v-row>

          <div class="mt-4">
            <div class="d-flex align-center justify-space-between text-subtitle-2 blue-grey--text mb-2">
              <span>Today's Progress</span>
              <span>{{ todayProgressPercentage }}%</span>
            </div>
            <v-progress-linear
                :value="todayProgressPercentage"
                rounded
                height="8"
                color="primary"
            ></v-progress-linear>
          </div>
        </v-card>

        <v-card class="pa-4 mt-4" elevation="2">
          <div class="d-flex align-center mb-4">
            <v-icon color="primary" class="mr-2">mdi-calendar</v-icon>
            <span class="font-weight-medium text-h6">Calendar</span>
          </div>
          <v-date-picker
              v-model="selectedDate"
              width="100%"
              color="primary"
              @input="onDateChange"
          ></v-date-picker>

          <div class="mt-4" v-if="selectedDate">
            <v-divider class="mb-3"></v-divider>
            <div class="text-subtitle-2 font-weight-medium mb-3">
              Tasks for {{ formatSelectedDate }}
            </div>

            <v-row class="mb-3">
              <v-col cols="6">
                <v-card class="d-flex flex-column align-center justify-center pa-2 rounded" color="success lighten-5">
                  <span class="success--text font-weight-bold text-h6">{{ selectedDateStats.completed }}</span>
                  <span class="grey--text text-caption">Completed</span>
                </v-card>
              </v-col>
              <v-col cols="6">
                <v-card class="d-flex flex-column align-center justify-center pa-2 rounded" color="warning lighten-5">
                  <span class="warning--text font-weight-bold text-h6">{{ selectedDateStats.pending }}</span>
                  <span class="grey--text text-caption">Pending</span>
                </v-card>
              </v-col>
            </v-row>

            <div class="mb-3">
              <div class="d-flex align-center justify-space-between text-caption blue-grey--text mb-1">
                <span>Progress</span>
                <span>{{ selectedDateStats.progress }}%</span>
              </div>
              <v-progress-linear
                  :value="selectedDateStats.progress"
                  rounded
                  height="6"
                  color="primary"
              ></v-progress-linear>
            </div>

            <div v-if="tasksForSelectedDate.length > 0">
              <div class="text-caption grey--text mb-2">Tasks:</div>
              <v-list dense>
                <v-list-item
                    v-for="task in tasksForSelectedDate"
                    :key="task.id"
                    class="px-0"
                >
                  <v-list-item-icon class="mr-2">
                    <v-icon
                        small
                        :color="task.completed ? 'success' : 'grey'"
                    >
                      {{ task.completed ? 'mdi-check-circle' : 'mdi-circle-outline' }}
                    </v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title
                        class="text-caption"
                        :class="{ 'text-decoration-line-through grey--text': task.completed }"
                    >
                      {{ task.title }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </div>
            <div v-else class="text-caption grey--text text-center pa-2">
              No tasks for this date
            </div>
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
                label="Due Date (Optional)"
                type="date"
                :value="today"
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      tasks: [
        {
          id: 1,
          title: 'Complete project proposal',
          description: 'Finish the quarterly project proposal for client review',
          category: 'Work',
          priority: 'High',
          completed: false,
          dueDate: '2025-01-08'
        },
        {
          id: 2,
          title: 'Morning workout',
          description: '30 minutes cardio and strength training',
          category: 'Health',
          priority: 'Medium',
          completed: true,
          dueDate: '2025-01-08'
        },
        {
          id: 3,
          title: 'Read investment book',
          description: 'Continue reading "The Intelligent Investor"',
          category: 'Finance',
          priority: 'Low',
          completed: false,
          dueDate: '2025-01-08'
        },
        {
          id: 4,
          title: 'Team meeting',
          description: 'Weekly team sync meeting',
          category: 'Work',
          priority: 'High',
          completed: true,
          dueDate: '2025-01-08'
        },
        {
          id: 5,
          title: 'Buy groceries',
          description: 'Weekly grocery shopping',
          category: 'Personal',
          priority: 'Medium',
          completed: false,
          dueDate: '2025-01-08'
        }
      ],
      suggestedTasks: [
        { title: 'Update CV', category: 'Personal', priority: 'Medium' },
        { title: 'Check work email', category: 'Work', priority: 'High' },
        { title: 'Drink 2 liters of water', category: 'Health', priority: 'Medium' },
        { title: 'Check bank account', category: 'Finance', priority: 'Low' },
        { title: 'Read for 30 minutes', category: 'Study', priority: 'Medium' }
      ],

      productivityTips: [
        {
          title: "Prioritize Important Tasks",
          subtitle: "Focus on tasks that have the greatest impact on your goals"
        },
        {
          title: "Pomodoro Technique",
          subtitle: "Work focused for 25 minutes, then rest for 5 minutes"
        },
        {
          title: "2-Minute Rule",
          subtitle: "If a task takes less than 2 minutes, do it immediately"
        }
      ],

      categories: ['All', 'Work', 'Personal', 'Health', 'Finance', 'Study'],
      priorities: ['All', 'High', 'Medium', 'Low'],
      sortOptions: ['Due date', 'Priority', 'Alphabetical', 'Created date'],
      filters: {
        category: 'All',
        priority: 'All',
        sortBy: 'Due date'
      },
      selectedDate: new Date().toISOString().substr(0, 10),
      showAddDialog: false,
      editingTask: null,
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
    today() {
      return new Date().toISOString().substr(0, 10);
    },
    filteredTasks() {
      const today = this.today;

      let filtered = this.tasks.filter(task => {
        const categoryMatch = this.filters.category === 'All' || task.category === this.filters.category;
        const priorityMatch = this.filters.priority === 'All' || task.priority === this.filters.priority;
        const dateMatch = task.dueDate === today; // Only show tasks for today

        return categoryMatch && priorityMatch && dateMatch;
      });

      return filtered.sort((a, b) => {
        switch (this.filters.sortBy) {
          case 'Priority': {
            const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
          }
          case 'Alphabetical':
            return a.title.localeCompare(b.title);
          case 'Due date': {
            if (!a.dueDate && !b.dueDate) return 0;
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate) - new Date(b.dueDate);
          }
          case 'Created date':
            return b.id - a.id;
          default:
            return 0;
        }
      });
    },
    todayTasks() {
      return this.tasks.filter(task => task.dueDate === this.today);
    },
    todayCompletedTasks() {
      return this.todayTasks.filter(task => task.completed).length;
    },
    todayPendingTasks() {
      return this.todayTasks.filter(task => !task.completed).length;
    },
    todayProgressPercentage() {
      if (this.todayTasks.length === 0) return 0;
      return Math.round((this.todayCompletedTasks / this.todayTasks.length) * 100);
    },
    completedTasks() {
      return this.tasks.filter(task => task.completed).length;
    },
    pendingTasks() {
      return this.tasks.filter(task => !task.completed).length;
    },
    progressPercentage() {
      if (this.tasks.length === 0) return 0;
      return Math.round((this.completedTasks / this.tasks.length) * 100);
    },
    tasksForSelectedDate() {
      return this.tasks.filter(task => task.dueDate === this.selectedDate);
    },
    selectedDateStats() {
      const tasksForDate = this.tasksForSelectedDate;
      const completed = tasksForDate.filter(task => task.completed).length;
      const pending = tasksForDate.filter(task => !task.completed).length;
      const total = tasksForDate.length;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        completed,
        pending,
        total,
        progress
      };
    },
    formatSelectedDate() {
      if (!this.selectedDate) return '';
      return new Date(this.selectedDate).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      });
    }
  },
  methods: {
    formatDate(date) {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
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
    getCategoryIcon(category) {
      const icons = {
        'Work': 'mdi-briefcase',
        'Personal': 'mdi-account',
        'Health': 'mdi-heart',
        'Finance': 'mdi-currency-usd',
        'Study': 'mdi-book'
      };
      return icons[category] || 'mdi-tag';
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
    addSuggestedTask(suggestion) {
      const newTask = {
        id: Date.now(),
        title: suggestion.title,
        description: '',
        category: suggestion.category,
        priority: suggestion.priority,
        completed: false,
        dueDate: this.today // Set to today's date
      };
      this.tasks.push(newTask);
    },
    editTask(task) {
      this.editingTask = task;
      this.taskForm = {
        title: task.title,
        description: task.description || '',
        category: task.category,
        priority: task.priority,
        dueDate: task.dueDate || this.today
      };
      this.showAddDialog = true;
    },
    deleteTask(taskId) {
      this.tasks = this.tasks.filter(task => task.id !== taskId);
    },
    saveTask() {
      if (!this.formValid) return;

      // If no due date is set, default to today
      if (!this.taskForm.dueDate) {
        this.taskForm.dueDate = this.today;
      }

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
        dueDate: this.today
      };
      if (this.$refs.taskForm) {
        this.$refs.taskForm.reset();
      }
    },
    onDateChange(date) {
      this.selectedDate = date;
    }
  }
}
</script>

<style scoped>
.task-suggestions-card {
  background-color: rgba(103, 58, 183, 0.05);
  border-left: 4px solid rgba(103, 58, 183, 0.5);
}

.productivity-tips-card {
  background-color: rgba(33, 150, 243, 0.05);
  border-left: 4px solid rgba(33, 150, 243, 0.5);
}

.title-task-card {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.task-completed {
  opacity: 0.7;
}

.suggestion-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
  cursor: pointer;
}

.v-card {
  transition: none;
}
</style>