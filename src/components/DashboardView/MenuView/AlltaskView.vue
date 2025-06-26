<template>
  <div class="pa-4">
    <!-- Header -->
    <v-row>
      <v-col cols="12" md="9">
        <v-card class="pa-4 mb-4" elevation="0">
          <div class="d-flex justify-space-between align-center">
            <div>
              <h1 class="text-h4 font-weight-medium mb-2">All Tasks</h1>
              <p class="grey--text text-subtitle-1 mb-0">
                Manage and organize all your tasks
              </p>
            </div>
            <v-btn color="primary" @click="showAddDialog = true">
              <v-icon left>mdi-plus</v-icon>
              ADD TASK
            </v-btn>
          </div>
        </v-card>

        <!-- Filters -->
        <v-card class="pa-4 mb-4" elevation="2">
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <v-text-field
                  v-model="searchQuery"
                  outlined
                  label="Search tasks..."
                  prepend-inner-icon="mdi-magnify"
                  hide-details
                  clearable
                  dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="2">
              <v-select
                  v-model="filters.status"
                  outlined
                  label="Status"
                  :items="statusOptions"
                  hide-details
                  dense
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="2">
              <v-select
                  v-model="filters.priority"
                  outlined
                  label="Priority"
                  :items="priorities"
                  hide-details
                  dense
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="2">
              <v-select
                  v-model="filters.category"
                  outlined
                  label="Category"
                  :items="categories"
                  hide-details
                  dense
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="2">
              <v-select
                  v-model="filters.dateRange"
                  outlined
                  label="Date Range"
                  :items="dateRangeOptions"
                  hide-details
                  dense
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="1">
              <v-btn
                  color="grey"
                  outlined
                  @click="clearAllFilters"
                  title="Clear all filters"
                  block
              >
                <v-icon>mdi-filter-off</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card>

        <!-- Tasks List -->
        <v-card class="pa-4" elevation="2">
          <div class="d-flex justify-space-between align-center mb-4">
            <div class="d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-format-list-bulleted</v-icon>
              <span class="text-h6">Tasks ({{ filteredTasks.length }})</span>
            </div>
            <div class="d-flex align-center">
              <v-select
                  v-model="sortBy"
                  outlined
                  dense
                  label="Sort by"
                  :items="sortOptions"
                  hide-details
                  style="max-width: 200px;"
                  class="mr-2"
              ></v-select>
              <v-btn
                  icon
                  @click="toggleSortOrder"
                  title="Toggle sort order"
              >
                <v-icon>{{ sortOrder === 'asc' ? 'mdi-sort-ascending' : 'mdi-sort-descending' }}</v-icon>
              </v-btn>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredTasks.length === 0" class="text-center pa-8">
            <v-icon size="64" color="grey lighten-2">mdi-clipboard-text-outline</v-icon>
            <p class="text-h6 grey--text mt-4">No tasks found</p>
            <p class="grey--text">Try adjusting your filters or add a new task!</p>
          </div>

          <!-- Tasks Grid - REDESIGNED CARDS -->
          <v-row v-else>
            <v-col
                v-for="task in paginatedTasks"
                :key="task.id"
                cols="12"
                sm="6"
                md="4"
                lg="3"
            >
              <v-card
                  class="task-card"
                  :class="getTaskCardClass(task)"
                  :style="getCardStyle(task)"
                  elevation="3"
                  @click="selectTask(task)"
              >
                <!-- Status Bar -->
                <div class="task-status-bar" :class="getStatusBarClass(task)"></div>

                <!-- Card Header -->
                <div class="task-header pa-3 d-flex align-center">
                  <v-checkbox
                      :input-value="task.completed"
                      @change="updateTaskCompletion(task.id, $event)"
                      @click.stop
                      color="success"
                      hide-details
                      class="ma-0 pa-0"
                  />

                  <!-- Priority Indicator -->
                  <div class="priority-dot ml-2" :class="getPriorityDotClass(task.priority)"></div>

                  <v-spacer></v-spacer>

                  <v-menu bottom left>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                          icon
                          x-small
                          v-bind="attrs"
                          v-on="on"
                          @click.stop
                          class="menu-btn"
                      >
                        <v-icon small>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list dense>
                      <v-list-item @click="editTask(task)">
                        <v-list-item-icon class="mr-2">
                          <v-icon small>mdi-pencil</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Edit</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="duplicateTask(task)">
                        <v-list-item-icon class="mr-2">
                          <v-icon small>mdi-content-copy</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Duplicate</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="deleteTask(task.id)">
                        <v-list-item-icon class="mr-2">
                          <v-icon small color="error">mdi-delete</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title class="error--text">Delete</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>

                <v-divider></v-divider>

                <!-- Card Content -->
                <div class="task-content pa-3">
                  <h3
                      class="task-title text-subtitle-1 font-weight-medium mb-2"
                      :class="{ 'completed-text': task.completed }"
                  >
                    {{ task.title }}
                  </h3>

                  <p
                      v-if="task.description"
                      class="task-description text-caption grey--text mb-3"
                      :class="{ 'completed-text': task.completed }"
                  >
                    {{ truncateText(task.description, 80) }}
                  </p>

                  <!-- Tags Section -->
                  <div class="tags-section mb-3">
                    <v-chip
                        :color="getPriorityColor(task.priority)"
                        text-color="white"
                        x-small
                        class="mr-1 mb-1 chip-modern"
                    >
                      <v-icon left x-small>{{ getPriorityIcon(task.priority) }}</v-icon>
                      {{ task.priority }}
                    </v-chip>
                    <v-chip
                        :color="getCategoryColor(task.category)"

                        x-small
                        class="mr-1 mb-1 chip-modern"
                        outlined
                    >
                      <v-icon left x-small>{{ getCategoryIcon(task.category) }}</v-icon>
                      {{ task.category }}
                    </v-chip>
                  </div>
                </div>

                <v-divider></v-divider>

                <!-- Card Footer -->
                <div class="task-footer pa-3 d-flex justify-space-between align-center">
                  <div class="d-flex align-center">
                    <v-icon x-small class="mr-1 date-icon">mdi-calendar-outline</v-icon>
                    <span class="text-caption" :class="getDateTextClass(task)">
                      {{ formatTaskDate(task.dueDate) }}
                    </span>
                  </div>

                  <div class="status-badges">
                    <v-chip
                        v-if="isOverdue(task)"
                        color="error"
                        text-color="white"
                        x-small
                        class="status-chip"
                    >
                      <v-icon left x-small>mdi-alert-circle</v-icon>
                      Overdue
                    </v-chip>
                    <v-chip
                        v-else-if="isDueToday(task)"
                        color="warning"
                        text-color="white"
                        x-small
                        class="status-chip"
                    >
                      <v-icon left x-small>mdi-clock-alert-outline</v-icon>
                      Today
                    </v-chip>
                  </div>
                </div>

                <!-- Progress Bar -->
                <v-progress-linear
                    v-if="task.completed"
                    color="success"
                    value="100"
                    height="3"
                ></v-progress-linear>
                <v-progress-linear
                    v-else-if="isOverdue(task)"
                    color="error"
                    value="100"
                    height="3"
                ></v-progress-linear>
                <v-progress-linear
                    v-else-if="isDueToday(task)"
                    color="warning"
                    value="100"
                    height="3"
                ></v-progress-linear>
              </v-card>
            </v-col>
          </v-row>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="d-flex justify-center mt-4">
            <v-pagination
                v-model="currentPage"
                :length="totalPages"
                :total-visible="7"
                color="primary"
            ></v-pagination>
          </div>
        </v-card>
      </v-col>

      <!-- Sidebar -->
      <v-col cols="12" md="3" class="hidden-sm-and-down">
        <!-- Statistics -->
        <v-card class="pa-4 mb-4" elevation="2">
          <div class="d-flex align-center mb-4">
            <v-icon color="primary" class="mr-2">mdi-chart-donut</v-icon>
            <span class="font-weight-medium text-h6">Task Statistics</span>
          </div>

          <v-row class="mb-4">
            <v-col cols="6">
              <v-card class="pa-3 text-center" color="success lighten-5">
                <span class="success--text font-weight-bold text-h4">{{ taskStats.completed }}</span>
                <div class="grey--text text-caption">Completed</div>
              </v-card>
            </v-col>
            <v-col cols="6">
              <v-card class="pa-3 text-center" color="warning lighten-5">
                <span class="warning--text font-weight-bold text-h4">{{ taskStats.pending }}</span>
                <div class="grey--text text-caption">Pending</div>
              </v-card>
            </v-col>
          </v-row>

          <v-row class="mb-4">
            <v-col cols="6">
              <v-card class="pa-3 text-center" color="error lighten-5">
                <span class="error--text font-weight-bold text-h4">{{ taskStats.overdue }}</span>
                <div class="grey--text text-caption">Overdue</div>
              </v-card>
            </v-col>
            <v-col cols="6">
              <v-card class="pa-3 text-center" color="info lighten-5">
                <span class="info--text font-weight-bold text-h4">{{ taskStats.dueToday }}</span>
                <div class="grey--text text-caption">Due Today</div>
              </v-card>
            </v-col>
          </v-row>

          <div class="mb-4">
            <div class="d-flex align-center justify-space-between text-subtitle-2 blue-grey--text mb-2">
              <span>Overall Progress</span>
              <span>{{ taskStats.progress }}%</span>
            </div>
            <v-progress-linear
                :value="taskStats.progress"
                rounded
                height="8"
                color="primary"
            ></v-progress-linear>
          </div>
        </v-card>

        <!-- Quick Filters -->
        <v-card class="pa-4 mb-4" elevation="2">
          <div class="d-flex align-center mb-4">
            <v-icon color="primary" class="mr-2">mdi-filter-variant</v-icon>
            <span class="font-weight-medium text-h6">Quick Filters</span>
          </div>

          <div class="mb-3">
            <v-btn
                block
                :color="filters.status === 'Important' ? 'red' : 'grey lighten-3'"
                :text="filters.status !== 'Important'"
                @click="applyQuickFilter('status', 'Important')"
                class="mb-2"
            >
              <v-icon left>mdi-star</v-icon>
              Important Tasks
            </v-btn>

            <v-btn
                block
                :color="filters.status === 'Completed' ? 'success' : 'grey lighten-3'"
                :text="filters.status !== 'Completed'"
                @click="applyQuickFilter('status', 'Completed')"
                class="mb-2"
            >
              <v-icon left>mdi-check-circle</v-icon>
              Completed Tasks
            </v-btn>

            <v-btn
                block
                :color="filters.status === 'Pending' ? 'warning' : 'grey lighten-3'"
                :text="filters.status !== 'Pending'"
                @click="applyQuickFilter('status', 'Pending')"
                class="mb-2"
            >
              <v-icon left>mdi-clock-outline</v-icon>
              Pending Tasks
            </v-btn>

            <v-btn
                block
                :color="filters.status === 'Overdue' ? 'error' : 'grey lighten-3'"
                :text="filters.status !== 'Overdue'"
                @click="applyQuickFilter('status', 'Overdue')"
                class="mb-2"
            >
              <v-icon left>mdi-alert-circle</v-icon>
              Overdue Tasks
            </v-btn>
          </div>
        </v-card>

        <!-- Categories -->
        <v-card class="pa-4" elevation="2">
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
                @click="applyQuickFilter('category', category.name)"
            >
              {{ category.name }} ({{ category.count }})
            </v-chip>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add/Edit Dialog -->
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
                :rules="titleRules"
                required
                outlined
            ></v-text-field>

            <v-textarea
                v-model="taskForm.description"
                label="Description (Optional)"
                rows="3"
                outlined
            ></v-textarea>

            <v-select
                v-model="taskForm.category"
                :items="categorySelectOptions"
                label="Category"
                :rules="categoryRules"
                required
                outlined
            ></v-select>

            <v-select
                v-model="taskForm.priority"
                :items="prioritySelectOptions"
                label="Priority"
                :rules="priorityRules"
                required
                outlined
            ></v-select>

            <v-text-field
                v-model="taskForm.dueDate"
                label="Due Date"
                type="date"
                :rules="dueDateRules"
                required
                outlined
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

    <!-- Task Detail Dialog -->
    <v-dialog v-model="showTaskDetail" max-width="600px">
      <v-card v-if="selectedTask">
        <v-card-title class="d-flex justify-space-between align-center">
          <span>{{ selectedTask.title }}</span>
          <v-btn icon @click="showTaskDetail = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div class="mb-3">
            <strong>Description:</strong>
            <p class="mt-1">{{ selectedTask.description || 'No description provided' }}</p>
          </div>
          <div class="mb-3">
            <strong>Category:</strong>
            <v-chip :color="getCategoryColor(selectedTask.category)" text-color="white" small class="ml-2">
              {{ selectedTask.category }}
            </v-chip>
          </div>
          <div class="mb-3">
            <strong>Priority:</strong>
            <v-chip :color="getPriorityColor(selectedTask.priority)" text-color="white" small class="ml-2">
              {{ selectedTask.priority }}
            </v-chip>
          </div>
          <div class="mb-3">
            <strong>Due Date:</strong>
            <span class="ml-2">{{ formatTaskDate(selectedTask.dueDate) }}</span>
          </div>
          <div class="mb-3">
            <strong>Status:</strong>
            <v-chip
                :color="selectedTask.completed ? 'success' : 'warning'"
                text-color="white"
                small
                class="ml-2"
            >
              {{ selectedTask.completed ? 'Completed' : 'Pending' }}
            </v-chip>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="editTask(selectedTask)">
            <v-icon left>mdi-pencil</v-icon>
            Edit
          </v-btn>
          <v-btn
              :color="selectedTask.completed ? 'warning' : 'success'"
              @click="toggleTaskCompletion(selectedTask)"
          >
            <v-icon left>{{ selectedTask.completed ? 'mdi-undo' : 'mdi-check' }}</v-icon>
            {{ selectedTask.completed ? 'Mark Incomplete' : 'Mark Complete' }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="deleteTask(selectedTask.id)">
            <v-icon left>mdi-delete</v-icon>
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: 'TasksTab',
  data() {
    return {
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 12,
      sortBy: 'Due Date',
      sortOrder: 'asc',
      selectedTask: null,
      showTaskDetail: false,
      showAddDialog: false,
      editingTask: null,
      formValid: false,
      categories: ['All', 'Work', 'Personal', 'Health', 'Finance', 'Study'],
      priorities: ['All', 'High', 'Medium', 'Low'],
      statusOptions: [
        'All',
        'Completed',
        'Pending',
        'Overdue',
        'Important',
        'Due Today',
        'Due This Week'
      ],
      dateRangeOptions: [
        'All Time',
        'Today',
        'This Week',
        'This Month',
        'Next 7 Days',
        'Next 30 Days',
        'Overdue'
      ],
      sortOptions: [
        'Due Date',
        'Priority',
        'Title',
        'Category',
        'Created Date',
        'Status'
      ],
      filters: {
        status: 'All',
        priority: 'All',
        category: 'All',
        dateRange: 'All Time'
      },
      taskForm: {
        title: '',
        description: '',
        category: '',
        priority: '',
        dueDate: ''
      },
      titleRules: [
        v => !!v || 'Title is required'
      ],
      categoryRules: [
        v => !!v || 'Category is required'
      ],
      priorityRules: [
        v => !!v || 'Priority is required'
      ],
      dueDateRules: [
        v => !!v || 'Due date is required'
      ]
    }
  },
  computed: {
    ...mapGetters(["user_id","tasks"]),
    categorySelectOptions() {
      return this.categories.filter(c => c !== 'All')
    },
    prioritySelectOptions() {
      return this.priorities.filter(p => p !== 'All')
    },
    filteredTasks() {
      let filtered = this.tasks.filter(task => {
        const searchMatch = !this.searchQuery ||
            task.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(this.searchQuery.toLowerCase())

        const statusMatch = this.getStatusMatch(task)
        const priorityMatch = this.filters.priority === 'All' || task.priority === this.filters.priority
        const categoryMatch = this.filters.category === 'All' || task.category === this.filters.category
        const dateMatch = this.getDateMatch(task)

        return searchMatch && statusMatch && priorityMatch && categoryMatch && dateMatch
      })

      return this.sortTasks(filtered)
    },
    paginatedTasks() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredTasks.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.filteredTasks.length / this.itemsPerPage)
    },
    taskStats() {
      const completed = this.tasks.filter(task => task.completed).length
      const pending = this.tasks.filter(task => !task.completed).length
      const overdue = this.tasks.filter(task => this.isOverdue(task)).length
      const dueToday = this.tasks.filter(task => this.isDueToday(task)).length
      const total = this.tasks.length
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0

      return { completed, pending, overdue, dueToday, total, progress }
    },
    categoryStats() {
      const stats = []
      const categoryCounts = {}

      this.tasks.forEach(task => {
        if (!categoryCounts[task.category]) {
          categoryCounts[task.category] = 0
        }
        categoryCounts[task.category]++
      })

      Object.keys(categoryCounts).forEach(category => {
        stats.push({
          name: category,
          count: categoryCounts[category]
        })
      })

      return stats
    }
  },

  methods: {   
    truncateText(text, length = 80) {
      return text && text.length > length ? text.substring(0, length) + '...' : text
    },
    getCardStyle(task) {
      if (task.completed) {
        return { borderTop: '4px solid #4CAF50' }
      } else if (this.isOverdue(task)) {
        return { borderTop: '4px solid #F44336' }
      } else if (this.isDueToday(task)) {
        return { borderTop: '4px solid #FF9800' }
      }
      return { borderTop: '4px solid #E0E0E0' }
    },
    getStatusBarClass(task) {
      if (task.completed) return 'status-completed'
      if (this.isOverdue(task)) return 'status-overdue'
      if (this.isDueToday(task)) return 'status-due-today'
      return 'status-normal'
    },
    getPriorityDotClass(priority) {
      const classes = {
        'High': 'priority-dot-high',
        'Medium': 'priority-dot-medium',
        'Low': 'priority-dot-low'
      }
      return classes[priority] || 'priority-dot-low'
    },
    getDateTextClass(task) {
      if (this.isOverdue(task)) return 'error--text font-weight-medium'
      if (this.isDueToday(task)) return 'warning--text font-weight-medium'
      return 'grey--text'
    },
    getTodayDate() {
      return  new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10)
    },
    getTomorrowDate() {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      return tomorrow.toISOString().substr(0, 10)
    },
    getDateAfterDays(days) {
      const date = new Date()
      date.setDate(date.getDate() + days)
      return date.toISOString().substr(0, 10)
    },
    formatTaskDate(dateStr) {
      const date = new Date(dateStr)
      const today = new Date()
      const tomorrow = new Date()
      tomorrow.setDate(today.getDate() + 1)

      if (dateStr === today.toISOString().substr(0, 10)) {
        return 'Today'
      } else if (dateStr === tomorrow.toISOString().substr(0, 10)) {
        return 'Tomorrow'
      } else {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      }
    },
    isOverdue(task) {
      if (task.completed) return false
      const today =  new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10)
      return task.dueDate < today
    },
    isDueToday(task) {
      if (task.completed) return false
      const today =  new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10)
      return task.dueDate === today
    },
    isDueThisWeek(task) {
      const today = new Date()
      const taskDate = new Date(task.dueDate)
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - today.getDay())
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)

      return taskDate >= startOfWeek && taskDate <= endOfWeek
    },
    getStatusMatch(task) {
      switch (this.filters.status) {
        case 'All':
          return true
        case 'Completed':
          return task.completed
        case 'Pending':
          return !task.completed
        case 'Overdue':
          return this.isOverdue(task)
        case 'Important':
          return task.priority === 'High'
        case 'Due Today':
          return this.isDueToday(task)
        case 'Due This Week':
          return this.isDueThisWeek(task)
        default:
          return true
      }
    },
    getDateMatch(task) {
      const today = new Date()
      const taskDate = new Date(task.dueDate)

      switch (this.filters.dateRange) {
        case 'All Time':
          return true
        case 'Today':
          return task.dueDate === today.toISOString().substr(0, 10)
        case 'This Week':
          return this.isDueThisWeek(task)
        case 'This Month':
          return taskDate.getMonth() === today.getMonth() && taskDate.getFullYear() === today.getFullYear()
        case 'Next 7 Days': {
          const next7Days = new Date()
          next7Days.setDate(today.getDate() + 7)
          return taskDate >= today && taskDate <= next7Days
        }
        case 'Next 30 Days': {
          const next30Days = new Date()
          next30Days.setDate(today.getDate() + 30)
          return taskDate >= today && taskDate <= next30Days
        }
        case 'Overdue':
          return this.isOverdue(task)
        default:
          return true
      }
    },
    sortTasks(tasks) {
      return tasks.sort((a, b) => {
        let comparison = 0

        switch (this.sortBy) {
          case 'Due Date':
            comparison = new Date(a.dueDate) - new Date(b.dueDate)
            break
          case 'Priority': {
            const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 }
            comparison = priorityOrder[b.priority] - priorityOrder[a.priority]
            break
          }
          case 'Title':
            comparison = a.title.localeCompare(b.title)
            break
          case 'Category':
            comparison = a.category.localeCompare(b.category)
            break
          case 'Created Date':
            comparison = new Date(a.createdAt) - new Date(b.createdAt)
            break
          case 'Status':
            comparison = a.completed - b.completed
            break
          default:
            comparison = 0
        }

        return this.sortOrder === 'asc' ? comparison : -comparison
      })
    },
    toggleSortOrder() {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
    },
    clearAllFilters() {
      this.searchQuery = ''
      this.filters = {
        status: 'All',
        priority: 'All',
        category: 'All',
        dateRange: 'All Time'
      }
      this.currentPage = 1
    },
    applyQuickFilter(filterType, value) {
      if (this.filters[filterType] === value) {
        this.filters[filterType] = 'All'
      } else {
        this.filters[filterType] = value
      }
      this.currentPage = 1
    },
    getTaskCardClass(task) {
      const classes = ['task-card-modern']

      if (task.completed) {
        classes.push('task-completed')
      } else if (this.isOverdue(task)) {
        classes.push('task-overdue')
      } else if (this.isDueToday(task)) {
        classes.push('task-due-today')
      }

      return classes.join(' ')
    },
    selectTask(task) {
      this.selectedTask = task
      this.showTaskDetail = true
    },
    toggleTaskCompletion(task) {
      this.updateTaskCompletion(task.id, !task.completed)
      this.showTaskDetail = false
    },
    updateTaskCompletion(taskId, completed) {
      const taskIndex = this.tasks.findIndex(t => t.id === taskId)
      if (taskIndex !== -1) {
        this.$set(this.tasks[taskIndex], 'completed', completed)
      }
    },
    editTask(task) {
      this.editingTask = task
      this.taskForm = {
        title: task.title,
        description: task.description || '',
        category: task.category,
        priority: task.priority,
        dueDate: task.dueDate || ''
      }
      this.showAddDialog = true
      this.showTaskDetail = false
    },
    duplicateTask(task) {
      const newTask = {
        id: Date.now(),
        title: `${task.title} (Copy)`,
        description: task.description,
        category: task.category,
        priority: task.priority,
        completed: false,
        dueDate: task.dueDate,
        createdAt:  new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10)
      }
      this.tasks.push(newTask)
    },
    deleteTask(taskId) {
      this.tasks = this.tasks.filter(task => task.id !== taskId)
      this.showTaskDetail = false
    },
    saveTask() {
      if (!this.formValid) return

      if (this.editingTask) {
        Object.assign(this.editingTask, this.taskForm)
      } else {
        const newTask = {
          id: Date.now(),
          ...this.taskForm,
          completed: false,
          createdAt:  new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10)
        }
        this.tasks.push(newTask)
      }

      this.closeDialog()
    },
    closeDialog() {
      this.showAddDialog = false
      this.editingTask = null
      this.taskForm = {
        title: '',
        description: '',
        category: '',
        priority: '',
        dueDate: this.getTodayDate()
      }
      if (this.$refs.taskForm) {
        this.$refs.taskForm.reset()
      }
    },
    getCategoryColor(category) {
      const colors = {
        'Work': 'indigo',
        'Personal': 'teal',
        'Health': 'green',
        'Finance': 'blue',
        'Study': 'purple'
      }
      return colors[category] || 'grey'
    },
    getCategoryIcon(category) {
      const icons = {
        'Work': 'mdi-briefcase',
        'Personal': 'mdi-account',
        'Health': 'mdi-heart',
        'Finance': 'mdi-currency-usd',
        'Study': 'mdi-book'
      }
      return icons[category] || 'mdi-tag'
    },
    getPriorityColor(priority) {
      const colors = {
        'High': 'red',
        'Medium': 'orange',
        'Low': 'green'
      }
      return colors[priority] || 'grey'
    },
    getPriorityIcon(priority) {
      const icons = {
        'High': 'mdi-arrow-up',
        'Medium': 'mdi-minus',
        'Low': 'mdi-arrow-down'
      }
      return icons[priority] || 'mdi-minus'
    }
  }
}
</script>

<style scoped>
/* Modern Task Card Styles */
.task-card {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.task-card-modern:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
}

.task-status-bar {
  height: 4px;
  width: 100%;
}

.status-completed {
  background: linear-gradient(90deg, #4CAF50, #66BB6A);
}

.status-overdue {
  background: linear-gradient(90deg, #F44336, #EF5350);
}

.status-due-today {
  background: linear-gradient(90deg, #FF9800, #FFB74D);
}

.status-normal {
  background: linear-gradient(90deg, #E0E0E0, #EEEEEE);
}

.task-header {
  background-color: rgba(0, 0, 0, 0.02);
}

.priority-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.priority-dot-high {
  background-color: #F44336;
  box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.2);
}

.priority-dot-medium {
  background-color: #FF9800;
  box-shadow: 0 0 0 2px rgba(255, 152, 0, 0.2);
}

.priority-dot-low {
  background-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.task-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.task-title {
  line-height: 1.4;
  min-height: 2.8em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.task-description {
  line-height: 1.4;
  min-height: 2.8em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.completed-text {
  text-decoration: line-through;
  opacity: 0.6;
}

.tags-section {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.chip-modern {
  border-radius: 16px !important;
  font-weight: 500;
}

.task-footer {
  background-color: rgba(0, 0, 0, 0.02);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.date-icon {
  color: #9E9E9E;
}

.status-chip {
  border-radius: 12px !important;
  font-weight: 500;
}

.menu-btn {
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.task-card:hover .menu-btn {
  opacity: 1;
}

.task-completed {
  background-color: rgba(76, 175, 80, 0.05);
}

.task-overdue {
  background-color: rgba(244, 67, 54, 0.05);
}

.task-due-today {
  background-color: rgba(255, 152, 0, 0.05);
}

/* Animation for task completion */
.task-card {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
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