```vue type="vue" project="Modern TodoList" file="TodoApp.vue"
[v0-no-op-code-block-prefix]<template>
  <v-app :theme="theme">
    <v-navigation-drawer
        v-model="drawer"
        app
        class="elevation-4"
    >
      <v-list-item class="my-4">
        <v-list-item-avatar size="40">
          <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="text-h6">Nguyễn Văn A</v-list-item-title>
          <v-list-item-subtitle>Premium User</v-list-item-subtitle>
        </v-list-item-content>
        <v-btn icon @click.stop="drawer = !drawer">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
          dense
          nav
      >
        <v-list-item
            v-for="item in menuItems"
            :key="item.title"
            :to="item.to"
            link
            :class="{ 'primary--text': currentView === item.title.toLowerCase() }"
            @click="currentView = item.title.toLowerCase()"
        >
          <v-list-item-icon>
            <v-icon :color="currentView === item.title.toLowerCase() ? 'primary' : ''">{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>

          <v-chip
              v-if="item.count"
              small
              :color="item.color"
              text-color="white"
              class="ml-2"
          >
            {{ item.count }}
          </v-chip>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-4">
          <v-divider class="mb-4"></v-divider>
          <v-list-item link @click="toggleTheme">
            <v-list-item-icon>
              <v-icon>{{ theme === 'light' ? 'mdi-weather-night' : 'mdi-white-balance-sunny' }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ theme === 'light' ? 'Dark Mode' : 'Light Mode' }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-cog</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Settings</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar
        app
        elevate-on-scroll
        :color="theme === 'light' ? 'white' : ''"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-h5 font-weight-bold primary--text">
        <span class="hidden-sm-and-down">TaskFlow</span>
        <v-icon large color="primary" class="hidden-md-and-up">mdi-check-decagram</v-icon>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Search tasks..."
          hide-details
          filled
          rounded
          dense
          class="mx-4 hidden-sm-and-down search-field"
          style="max-width: 300px"
      ></v-text-field>

      <v-btn icon class="hidden-md-and-up">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-bell</v-icon>
        <v-badge
            color="error"
            content="3"
            offset-x="10"
            offset-y="10"
            dot
        ></v-badge>
      </v-btn>

      <v-menu
          left
          bottom
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              icon
              v-bind="attrs"
              v-on="on"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
              v-for="(item, i) in dropdownItems"
              :key="i"
              @click="() => {}"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container fluid class="fill-height">
        <v-row>
          <v-col cols="12" md="8">
            <!-- Header Section -->
            <div class="d-flex align-center justify-space-between mb-6">
              <div>
                <h1 class="text-h4 font-weight-bold">{{ viewTitle }}</h1>
                <p class="text-subtitle-1 grey--text">{{ new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
              </div>
              <v-btn
                  color="primary"
                  dark
                  rounded
                  elevation="2"
                  @click="dialog = true"
              >
                <v-icon left>mdi-plus</v-icon>
                Add Task
              </v-btn>
            </div>

            <!-- Task Filters -->
            <v-card class="mb-6 rounded-lg" elevation="2">
              <v-card-text>
                <v-row align="center">
                  <v-col cols="12" sm="3">
                    <v-select
                        v-model="filterCategory"
                        :items="categories"
                        label="Category"
                        outlined
                        dense
                        hide-details
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="3">
                    <v-select
                        v-model="filterPriority"
                        :items="priorities"
                        label="Priority"
                        outlined
                        dense
                        hide-details
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="3">
                    <v-select
                        v-model="sortBy"
                        :items="sortOptions"
                        label="Sort by"
                        outlined
                        dense
                        hide-details
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="3">
                    <v-select
                        v-model="groupBy"
                        :items="groupOptions"
                        label="Group by"
                        outlined
                        dense
                        hide-details
                    ></v-select>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Tasks List -->
            <div class="tasks-container">
              <!-- Grouped Tasks View -->
              <template v-if="groupBy !== 'none' && filteredTasks.length > 0">
                <div v-for="(group, groupName) in groupedTasks" :key="groupName" class="mb-6">
                  <div class="d-flex align-center mb-2">
                    <h3 class="text-subtitle-1 font-weight-bold">
                      {{ formatGroupTitle(groupName) }}
                    </h3>
                    <v-chip small class="ml-2" :color="getGroupColor(groupName)" text-color="white">
                      {{ group.length }}
                    </v-chip>
                    <v-spacer></v-spacer>
                    <v-btn small text color="primary" @click="toggleGroupCollapse(groupName)">
                      <v-icon small>{{ isGroupCollapsed(groupName) ? 'mdi-chevron-down' : 'mdi-chevron-up' }}</v-icon>
                      {{ isGroupCollapsed(groupName) ? 'Expand' : 'Collapse' }}
                    </v-btn>
                  </div>

                  <v-expand-transition>
                    <div v-show="!isGroupCollapsed(groupName)">
                      <v-slide-y-transition group>
                        <v-card
                            v-for="task in group"
                            :key="task.id"
                            class="mb-3 task-card rounded-lg"
                            :class="{ 'completed-task': task.completed }"
                            elevation="2"
                        >
                          <v-card-text class="py-4">
                            <v-row align="center" no-gutters>
                              <v-col cols="auto" class="mr-3">
                                <v-checkbox
                                    v-model="task.completed"
                                    color="primary"
                                    hide-details
                                    class="ma-0 pa-0"
                                ></v-checkbox>
                              </v-col>
                              <v-col>
                                <div class="d-flex flex-column">
                                  <div class="d-flex align-center">
                                    <span
                                        class="text-subtitle-1 font-weight-medium"
                                        :class="{ 'text-decoration-line-through': task.completed }"
                                    >
                                      {{ task.title }}
                                    </span>
                                    <v-chip
                                        x-small
                                        :color="getPriorityColor(task.priority)"
                                        text-color="white"
                                        class="ml-2"
                                    >
                                      {{ task.priority }}
                                    </v-chip>
                                    <v-chip
                                        x-small
                                        color="primary"
                                        outlined
                                        class="ml-2"
                                    >
                                      {{ task.category }}
                                    </v-chip>
                                  </div>
                                  <span
                                      class="text-caption grey--text mt-1"
                                      :class="{ 'text-decoration-line-through': task.completed }"
                                  >
                                    {{ task.description }}
                                  </span>
                                </div>
                              </v-col>
                              <v-col cols="auto">
                                <div class="d-flex align-center">
                                  <v-chip
                                      small
                                      :color="isOverdue(task.dueDate) ? 'error' : 'grey lighten-3'"
                                      :text-color="isOverdue(task.dueDate) ? 'white' : ''"
                                      class="mr-2"
                                  >
                                    <v-icon left small>mdi-calendar</v-icon>
                                    {{ formatDate(task.dueDate) }}
                                  </v-chip>
                                  <v-menu
                                      left
                                      bottom
                                  >
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-btn
                                          icon
                                          small
                                          v-bind="attrs"
                                          v-on="on"
                                      >
                                        <v-icon>mdi-dots-vertical</v-icon>
                                      </v-btn>
                                    </template>

                                    <v-list dense>
                                      <v-list-item @click="editTask(task)">
                                        <v-list-item-icon>
                                          <v-icon>mdi-pencil</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-title>Edit</v-list-item-title>
                                      </v-list-item>
                                      <v-list-item @click="deleteTask(task.id)">
                                        <v-list-item-icon>
                                          <v-icon>mdi-delete</v-icon>
                                        </v-list-item-icon>
                                        <v-list-item-title>Delete</v-list-item-title>
                                      </v-list-item>
                                    </v-list>
                                  </v-menu>
                                </div>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-slide-y-transition>
                    </div>
                  </v-expand-transition>
                </div>
              </template>

              <!-- Regular Tasks View -->
              <template v-else-if="filteredTasks.length > 0">
                <v-slide-y-transition group>
                  <v-card
                      v-for="task in filteredTasks"
                      :key="task.id"
                      class="mb-4 task-card rounded-lg"
                      :class="{ 'completed-task': task.completed }"
                      elevation="2"
                  >
                    <v-card-text class="py-4">
                      <v-row align="center" no-gutters>
                        <v-col cols="auto" class="mr-3">
                          <v-checkbox
                              v-model="task.completed"
                              color="primary"
                              hide-details
                              class="ma-0 pa-0"
                          ></v-checkbox>
                        </v-col>
                        <v-col>
                          <div class="d-flex flex-column">
                            <div class="d-flex align-center">
                              <span
                                  class="text-subtitle-1 font-weight-medium"
                                  :class="{ 'text-decoration-line-through': task.completed }"
                              >
                                {{ task.title }}
                              </span>
                              <v-chip
                                  x-small
                                  :color="getPriorityColor(task.priority)"
                                  text-color="white"
                                  class="ml-2"
                              >
                                {{ task.priority }}
                              </v-chip>
                              <v-chip
                                  x-small
                                  color="primary"
                                  outlined
                                  class="ml-2"
                              >
                                {{ task.category }}
                              </v-chip>
                            </div>
                            <span
                                class="text-caption grey--text mt-1"
                                :class="{ 'text-decoration-line-through': task.completed }"
                            >
                              {{ task.description }}
                            </span>
                          </div>
                        </v-col>
                        <v-col cols="auto">
                          <div class="d-flex align-center">
                            <v-chip
                                small
                                :color="isOverdue(task.dueDate) ? 'error' : 'grey lighten-3'"
                                :text-color="isOverdue(task.dueDate) ? 'white' : ''"
                                class="mr-2"
                            >
                              <v-icon left small>mdi-calendar</v-icon>
                              {{ formatDate(task.dueDate) }}
                            </v-chip>
                            <v-menu
                                left
                                bottom
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                    icon
                                    small
                                    v-bind="attrs"
                                    v-on="on"
                                >
                                  <v-icon>mdi-dots-vertical</v-icon>
                                </v-btn>
                              </template>

                              <v-list dense>
                                <v-list-item @click="editTask(task)">
                                  <v-list-item-icon>
                                    <v-icon>mdi-pencil</v-icon>
                                  </v-list-item-icon>
                                  <v-list-item-title>Edit</v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="deleteTask(task.id)">
                                  <v-list-item-icon>
                                    <v-icon>mdi-delete</v-icon>
                                  </v-list-item-icon>
                                  <v-list-item-title>Delete</v-list-item-title>
                                </v-list-item>
                              </v-list>
                            </v-menu>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-slide-y-transition>
              </template>

              <!-- Empty State -->
              <v-card v-if="filteredTasks.length === 0" class="text-center pa-6 rounded-lg" elevation="0">
                <v-img
                    src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
                    height="200"
                    contain
                ></v-img>
                <v-card-title class="justify-center">No tasks found</v-card-title>
                <v-card-subtitle>Try changing your filters or add a new task</v-card-subtitle>
                <v-btn color="primary" text @click="dialog = true">Add a new task</v-btn>
              </v-card>

              <!-- Task Analytics for Few Tasks -->
              <template v-if="filteredTasks.length > 0 && filteredTasks.length < 5">
                <!-- Task Analytics -->
                <v-card class="mt-8 rounded-lg" elevation="1">
                  <v-card-title>
                    <v-icon left color="primary">mdi-chart-timeline-variant</v-icon>
                    Task Analytics
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12">
                        <div class="d-flex justify-space-between align-center mb-2">
                          <div class="text-subtitle-2">Task Completion Trend</div>
                          <v-chip small color="primary" outlined>This Week</v-chip>
                        </div>
                        <v-sheet height="150" class="d-flex align-center justify-center">
                          <!-- Giả lập biểu đồ bằng CSS -->
                          <div class="chart-container">
                            <div v-for="(bar, i) in weeklyData" :key="i" class="chart-bar"
                                 :style="{ height: `${bar.value}%`, backgroundColor: bar.color }">
                              <div class="chart-value">{{ bar.value }}%</div>
                            </div>
                          </div>
                        </v-sheet>
                        <div class="d-flex justify-space-between mt-2">
                          <div v-for="(day, i) in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :key="i"
                               class="text-caption text-center" style="width: 14.28%">
                            {{ day }}
                          </div>
                        </div>
                      </v-col>

                      <v-col cols="12" class="mt-4">
                        <div class="text-subtitle-2 mb-2">Task Distribution</div>
                        <v-row>
                          <v-col cols="6" v-for="(stat, i) in taskStats" :key="i">
                            <v-card outlined class="pa-3">
                              <div class="d-flex align-center">
                                <v-avatar size="36" :color="stat.color" class="white--text mr-3">
                                  <v-icon dark>{{ stat.icon }}</v-icon>
                                </v-avatar>
                                <div>
                                  <div class="text-body-2">{{ stat.title }}</div>
                                  <div class="text-h6">{{ stat.value }}</div>
                                </div>
                              </div>
                            </v-card>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>

                <!-- Suggested Tasks -->
                <v-card class="mt-4 rounded-lg task-suggestions-card" elevation="1">
                  <v-card-title>
                    <v-icon left color="primary">mdi-lightbulb-outline</v-icon>
                    Suggested Tasks
                  </v-card-title>
                  <v-card-text>
                    <v-list>
                      <v-list-item v-for="(suggestion, i) in suggestedTasks" :key="i" @click="addSuggestedTask(suggestion)">
                        <v-list-item-avatar>
                          <v-avatar color="grey lighten-3">
                            <v-icon :color="getCategoryColor(suggestion.category)">{{ getCategoryIcon(suggestion.category) }}</v-icon>
                          </v-avatar>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title>{{ suggestion.title }}</v-list-item-title>
                          <v-list-item-subtitle>{{ suggestion.category }}</v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-btn icon small>
                            <v-icon color="primary">mdi-plus</v-icon>
                          </v-btn>
                        </v-list-item-action>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>

                <!-- Productivity Tips -->
                <v-card class="mt-4 rounded-lg productivity-tips-card" elevation="1">
                  <v-card-title class="pb-0">
                    <v-icon left color="info">mdi-lightbulb</v-icon>
                    Productivity Tips
                  </v-card-title>
                  <v-card-text>
                    <v-list two-line>
                      <v-list-item v-for="(tip, i) in productivityTips" :key="i">
                        <v-list-item-icon>
                          <v-icon color="info">mdi-check-circle-outline</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>{{ tip.title }}</v-list-item-title>
                          <v-list-item-subtitle>{{ tip.description }}</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </template>
            </div>
          </v-col>

          <v-col cols="12" md="4" class="hidden-sm-and-down">
            <!-- Summary Card -->
            <v-card class="mb-6 rounded-lg" elevation="2">
              <v-card-title>
                <v-icon left color="primary">mdi-chart-box</v-icon>
                Summary
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="6">
                    <v-card class="rounded-lg" outlined>
                      <v-card-text class="text-center">
                        <div class="text-h4 font-weight-bold primary--text">{{ completedTasksCount }}</div>
                        <div class="text-caption grey--text">Completed</div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="6">
                    <v-card class="rounded-lg" outlined>
                      <v-card-text class="text-center">
                        <div class="text-h4 font-weight-bold error--text">{{ pendingTasksCount }}</div>
                        <div class="text-caption grey--text">Pending</div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>

                <div class="mt-4">
                  <div class="d-flex justify-space-between align-center mb-1">
                    <span class="text-body-2">Progress</span>
                    <span class="text-body-2">{{ progressPercentage }}%</span>
                  </div>
                  <v-progress-linear
                      :value="progressPercentage"
                      color="primary"
                      height="10"
                      rounded
                  ></v-progress-linear>
                </div>
              </v-card-text>
            </v-card>

            <!-- Calendar Card -->
            <v-card class="mb-6 rounded-lg" elevation="2">
              <v-card-title>
                <v-icon left color="primary">mdi-calendar</v-icon>
                Calendar
              </v-card-title>
              <v-card-text>
                <v-date-picker
                    v-model="selectedDate"
                    full-width
                    class="mt-2"
                    :events="taskDueDates"
                    event-color="primary"
                ></v-date-picker>
              </v-card-text>
            </v-card>

            <!-- Category Distribution -->
            <v-card class="rounded-lg" elevation="2">
              <v-card-title>
                <v-icon left color="primary">mdi-tag-multiple</v-icon>
                Categories
              </v-card-title>
              <v-card-text>
                <v-chip-group column>
                  <v-chip
                      v-for="(count, category) in categoryDistribution"
                      :key="category"
                      :color="getCategoryColor(category)"
                      text-color="white"
                      class="mr-2 mb-2"
                  >
                    {{ category }} ({{ count }})
                  </v-chip>
                </v-chip-group>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Add/Edit Task Dialog -->
    <v-dialog
        v-model="dialog"
        max-width="600px"
    >
      <v-card class="rounded-lg">
        <v-card-title>
          <span class="text-h5">{{ editedIndex === -1 ? 'New Task' : 'Edit Task' }}</span>
          <v-spacer></v-spacer>
          <v-btn
              icon
              @click="closeDialog"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                    v-model="editedItem.title"
                    label="Task title*"
                    required
                    outlined
                    dense
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                    v-model="editedItem.description"
                    label="Description"
                    outlined
                    auto-grow
                    rows="3"
                    row-height="15"
                    dense
                ></v-textarea>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                    v-model="editedItem.category"
                    :items="categories.filter(c => c !== 'All')"
                    label="Category*"
                    required
                    outlined
                    dense
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                    v-model="editedItem.priority"
                    :items="priorities.filter(p => p !== 'All')"
                    label="Priority*"
                    required
                    outlined
                    dense
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-menu
                    ref="dateMenu"
                    v-model="dateMenu"
                    :close-on-content-click="false"
                    :return-value.sync="editedItem.dueDate"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="editedItem.dueDate"
                        label="Due date"
                        prepend-icon="mdi-calendar"
                        readonly
                        outlined
                        dense
                        v-bind="attrs"
                        v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                      v-model="editedItem.dueDate"
                      no-title
                      scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                        text
                        color="primary"
                        @click="dateMenu = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                        text
                        color="primary"
                        @click="$refs.dateMenu.save(editedItem.dueDate)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="grey darken-1"
              text
              @click="closeDialog"
          >
            Cancel
          </v-btn>
          <v-btn
              color="primary"
              @click="saveTask"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for notifications -->
    <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        :timeout="snackbar.timeout"
        bottom
        centered
    >
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn
            text
            v-bind="attrs"
            @click="snackbar.show = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Floating Action Button for Mobile -->
    <v-btn
        fab
        large
        color="primary"
        fixed
        right
        bottom
        class="mb-6 mr-6 hidden-md-and-up"
        @click="dialog = true"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-app>
</template>

<script>
export default {
  name: 'TodoApp',

  data: () => ({
    theme: 'light',
    drawer: null,
    currentView: 'today',
    search: '',
    dialog: false,
    dateMenu: false,
    selectedDate:  new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
    groupCollapsed: {},

    // Filters
    filterCategory: 'All',
    filterPriority: 'All',
    sortBy: 'dueDate',
    groupBy: 'none',

    // Snackbar
    snackbar: {
      show: false,
      text: '',
      color: 'success',
      timeout: 3000
    },

    // Edit dialog
    editedIndex: -1,
    editedItem: {
      id: '',
      title: '',
      description: '',
      category: '',
      priority: 'Medium',
      dueDate:  new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
      completed: false
    },
    defaultItem: {
      id: '',
      title: '',
      description: '',
      category: '',
      priority: 'Medium',
      dueDate:  new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
      completed: false
    },

    // Menu items
    menuItems: [
      { title: 'Today', icon: 'mdi-calendar-today', to: '/today', count: 5, color: 'primary' },
      { title: 'Upcoming', icon: 'mdi-calendar-arrow-right', to: '/upcoming', count: 8, color: 'info' },
      { title: 'Important', icon: 'mdi-star', to: '/important', count: 3, color: 'warning' },
      { title: 'Completed', icon: 'mdi-check-circle', to: '/completed' },
      { title: 'All Tasks', icon: 'mdi-format-list-bulleted', to: '/all' },
    ],

    dropdownItems: [
      { title: 'Export Tasks', icon: 'mdi-export' },
      { title: 'Import Tasks', icon: 'mdi-import' },
      { title: 'Print', icon: 'mdi-printer' },
      { title: 'Help', icon: 'mdi-help-circle' }
    ],

    // Task data
    tasks: [
      {
        id: '1',
        title: 'Complete project proposal',
        description: 'Finish the draft and send it to the client for review',
        category: 'Work',
        priority: 'High',
        dueDate: '2025-04-05',
        completed: false
      },
      {
        id: '2',
        title: 'Buy groceries',
        description: 'Milk, eggs, bread, fruits, and vegetables',
        category: 'Personal',
        priority: 'Medium',
        dueDate: '2025-04-04',
        completed: true
      },
      {
        id: '3',
        title: 'Schedule dentist appointment',
        description: 'Call Dr. Nguyen for a check-up',
        category: 'Health',
        priority: 'Medium',
        dueDate: '2025-04-10',
        completed: false
      },
      {
        id: '4',
        title: 'Pay electricity bill',
        description: 'Due by the end of the week',
        category: 'Finance',
        priority: 'High',
        dueDate: '2025-04-07',
        completed: false
      },
      {
        id: '5',
        title: 'Call mom',
        description: 'Ask about the family reunion',
        category: 'Personal',
        priority: 'Low',
        dueDate: '2025-04-04',
        completed: false
      },
      {
        id: '6',
        title: 'Prepare presentation',
        description: 'For the team meeting on Friday',
        category: 'Work',
        priority: 'High',
        dueDate: '2025-04-06',
        completed: false
      },
      {
        id: '7',
        title: 'Go for a run',
        description: '5km around the park',
        category: 'Health',
        priority: 'Medium',
        dueDate: '2025-04-04',
        completed: true
      },
      {
        id: '8',
        title: 'Read book chapter',
        description: 'Chapter 5 of "Atomic Habits"',
        category: 'Personal',
        priority: 'Low',
        dueDate: '2025-04-08',
        completed: false
      }
    ],

    // Options
    categories: ['All', 'Work', 'Personal', 'Health', 'Finance', 'Study'],
    priorities: ['All', 'High', 'Medium', 'Low'],
    sortOptions: [
      { text: 'Due Date', value: 'dueDate' },
      { text: 'Priority', value: 'priority' },
      { text: 'Alphabetical', value: 'title' }
    ],
    groupOptions: [
      { text: 'No Grouping', value: 'none' },
      { text: 'Due Date', value: 'dueDate' },
      { text: 'Category', value: 'category' },
      { text: 'Priority', value: 'priority' }
    ],

    // Analytics data
    weeklyData: [
      { day: 'Mon', value: 65, color: '#4CAF50' },
      { day: 'Tue', value: 40, color: '#2196F3' },
      { day: 'Wed', value: 85, color: '#9C27B0' },
      { day: 'Thu', value: 30, color: '#FF9800' },
      { day: 'Fri', value: 50, color: '#F44336' },
      { day: 'Sat', value: 20, color: '#607D8B' },
      { day: 'Sun', value: 10, color: '#795548' }
    ],
    taskStats: [
      { title: 'Đúng hạn', value: '85%', icon: 'mdi-clock-check-outline', color: 'success' },
      { title: 'Quá hạn', value: '15%', icon: 'mdi-clock-alert-outline', color: 'error' },
      { title: 'Hiệu suất', value: '72%', icon: 'mdi-lightning-bolt', color: 'warning' },
      { title: 'Thời gian TB', value: '2.5h', icon: 'mdi-timer-outline', color: 'info' }
    ],

    // Suggested tasks
    suggestedTasks: [
      { title: 'Cập nhật CV', category: 'Personal', priority: 'Medium' },
      { title: 'Kiểm tra email công việc', category: 'Work', priority: 'High' },
      { title: 'Uống 2 lít nước', category: 'Health', priority: 'Medium' },
      { title: 'Kiểm tra tài khoản ngân hàng', category: 'Finance', priority: 'Low' },
      { title: 'Đọc sách 30 phút', category: 'Study', priority: 'Medium' }
    ],

    // Productivity tips
    productivityTips: [
      {
        title: 'Ưu tiên công việc quan trọng',
        description: 'Tập trung vào các công việc có tác động lớn nhất đến mục tiêu của bạn'
      },
      {
        title: 'Phương pháp Pomodoro',
        description: 'Làm việc tập trung trong 25 phút, sau đó nghỉ ngơi 5 phút'
      },
      {
        title: 'Quy tắc 2 phút',
        description: 'Nếu một công việc mất ít hơn 2 phút, hãy làm ngay lập tức'
      }
    ]
  }),

  computed: {
    viewTitle() {
      switch (this.currentView) {
        case 'today':
          return 'Today\'s Tasks';
        case 'upcoming':
          return 'Upcoming Tasks';
        case 'important':
          return 'Important Tasks';
        case 'completed':
          return 'Completed Tasks';
        case 'all tasks':
          return 'All Tasks';
        default:
          return 'Tasks';
      }
    },

    filteredTasks() {
      let filtered = [...this.tasks];

      // Filter by view
      if (this.currentView === 'today') {
        const today =  new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10);
        filtered = filtered.filter(task => task.dueDate === today);
      } else if (this.currentView === 'upcoming') {
        const today =  new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10);
        filtered = filtered.filter(task => task.dueDate > today && !task.completed);
      } else if (this.currentView === 'important') {
        filtered = filtered.filter(task => task.priority === 'High' && !task.completed);
      } else if (this.currentView === 'completed') {
        filtered = filtered.filter(task => task.completed);
      }

      // Filter by search
      if (this.search) {
        const searchLower = this.search.toLowerCase();
        filtered = filtered.filter(task =>
            task.title.toLowerCase().includes(searchLower) ||
            task.description.toLowerCase().includes(searchLower)
        );
      }

      // Filter by category
      if (this.filterCategory !== 'All') {
        filtered = filtered.filter(task => task.category === this.filterCategory);
      }

      // Filter by priority
      if (this.filterPriority !== 'All') {
        filtered = filtered.filter(task => task.priority === this.filterPriority);
      }

      // Sort tasks
      if (this.sortBy === 'dueDate') {
        filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      } else if (this.sortBy === 'priority') {
        const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
        filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
      } else if (this.sortBy === 'title') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
      }

      return filtered;
    },

    groupedTasks() {
      const grouped = {};

      if (this.groupBy === 'none') {
        return { 'all': this.filteredTasks };
      }

      this.filteredTasks.forEach(task => {
        let groupKey;

        if (this.groupBy === 'dueDate') {
          // Group by date status
          const today =  new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10);
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const tomorrowStr = tomorrow.toISOString().substr(0, 10);

          if (task.dueDate === today) {
            groupKey = 'today';
          } else if (task.dueDate === tomorrowStr) {
            groupKey = 'tomorrow';
          } else if (task.dueDate < today) {
            groupKey = 'overdue';
          } else {
            groupKey = 'upcoming';
          }
        } else {
          // Group by category or priority
          groupKey = task[this.groupBy];
        }

        if (!grouped[groupKey]) {
          grouped[groupKey] = [];
          // Initialize collapse state for new group
          if (!Object.prototype.hasOwnProperty.call(this.groupCollapsed, groupKey)) {
            this.$set(this.groupCollapsed, groupKey, false);
          }
        }

        grouped[groupKey].push(task);
      });

      return grouped;
    },

    completedTasksCount() {
      return this.tasks.filter(task => task.completed).length;
    },

    pendingTasksCount() {
      return this.tasks.filter(task => !task.completed).length;
    },

    progressPercentage() {
      if (this.tasks.length === 0) return 0;
      return Math.round((this.completedTasksCount / this.tasks.length) * 100);
    },

    taskDueDates() {
      return this.tasks.map(task => task.dueDate);
    },

    categoryDistribution() {
      const distribution = {};
      this.tasks.forEach(task => {
        if (!distribution[task.category]) {
          distribution[task.category] = 0;
        }
        distribution[task.category]++;
      });
      return distribution;
    }
  },

  methods: {
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
    },

    formatDate(date) {
      if (!date) return '';
      const [year, month, day] = date.split('-');
      return `${day}/${month}/${year}`;
    },

    isOverdue(dueDate) {
      if (!dueDate) return false;
      const today =  new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10);
      return dueDate < today && !this.tasks.find(t => t.dueDate === dueDate)?.completed;
    },

    getPriorityColor(priority) {
      switch (priority) {
        case 'High':
          return 'error';
        case 'Medium':
          return 'warning';
        case 'Low':
          return 'success';
        default:
          return 'grey';
      }
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

    formatGroupTitle(groupName) {
      if (this.groupBy === 'dueDate') {
        switch (groupName) {
          case 'today': return 'Today';
          case 'tomorrow': return 'Tomorrow';
          case 'overdue': return 'Overdue';
          case 'upcoming': return 'Upcoming';
          default: return groupName;
        }
      }
      return groupName;
    },

    getGroupColor(groupName) {
      if (this.groupBy === 'dueDate') {
        switch (groupName) {
          case 'today': return 'primary';
          case 'tomorrow': return 'info';
          case 'overdue': return 'error';
          case 'upcoming': return 'success';
          default: return 'grey';
        }
      } else if (this.groupBy === 'priority') {
        switch (groupName) {
          case 'High': return 'error';
          case 'Medium': return 'warning';
          case 'Low': return 'success';
          default: return 'grey';
        }
      } else {
        return this.getCategoryColor(groupName);
      }
    },

    toggleGroupCollapse(groupName) {
      this.$set(this.groupCollapsed, groupName, !this.groupCollapsed[groupName]);
    },

    isGroupCollapsed(groupName) {
      return this.groupCollapsed[groupName] || false;
    },

    editTask(task) {
      this.editedIndex = this.tasks.findIndex(t => t.id === task.id);
      this.editedItem = Object.assign({}, task);
      this.dialog = true;
    },

    deleteTask(id) {
      const index = this.tasks.findIndex(t => t.id === id);
      if (confirm('Are you sure you want to delete this task?')) {
        this.tasks.splice(index, 1);
        this.showSnackbar('Task deleted successfully', 'success');
      }
    },

    closeDialog() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    saveTask() {
      if (!this.editedItem.title || !this.editedItem.category) {
        this.showSnackbar('Please fill in all required fields', 'error');
        return;
      }

      if (this.editedIndex > -1) {
        Object.assign(this.tasks[this.editedIndex], this.editedItem);
        this.showSnackbar('Task updated successfully', 'success');
      } else {
        this.editedItem.id = Date.now().toString();
        this.tasks.push(this.editedItem);
        this.showSnackbar('Task added successfully', 'success');
      }

      this.closeDialog();
    },

    addSuggestedTask(suggestion) {
      const newTask = {
        id: Date.now().toString(),
        title: suggestion.title,
        description: '',
        category: suggestion.category,
        priority: suggestion.priority,
        dueDate:  new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
        completed: false
      };

      this.tasks.push(newTask);
      this.showSnackbar('Suggested task added', 'success');
    },

    showSnackbar(text, color = 'success', timeout = 3000) {
      this.snackbar = {
        show: true,
        text,
        color,
        timeout
      };
    }
  }
};
</script>

<style scoped>
.search-field >>> .v-input__slot {
  min-height: 40px !important;
}

.task-card {
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1) !important;
}

.completed-task {
  opacity: 0.7;
  border-left-color: #4CAF50;
}

.chart-container {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 0 10px;
}

.chart-bar {
  width: 12%;
  border-radius: 4px 4px 0 0;
  position: relative;
  transition: height 0.5s ease;
}

.chart-value {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  font-weight: bold;
}

.task-suggestions-card {
  background-color: rgba(103, 58, 183, 0.05);
  border-left: 4px solid rgba(103, 58, 183, 0.5);
}

.productivity-tips-card {
  background-color: rgba(33, 150, 243, 0.05);
  border-left: 4px solid rgba(33, 150, 243, 0.5);
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.pulse-btn {
  animation: pulse 1.5s infinite;
}
</style>