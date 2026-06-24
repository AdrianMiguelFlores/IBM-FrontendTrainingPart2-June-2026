<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title>Tasks</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <div class="input-row">
        <ion-input
          v-model="newTaskName"
          placeholder="Add a new task..."
          @keyup.enter="handleAdd"
          class="custom-input"
        ></ion-input>
        <ion-button @click="handleAdd" class="add-btn">Add</ion-button>
      </div>

      <div class="stats-bar">
        <div class="stat-pill">
          <span class="stat-num">{{ totalCount }}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat-pill">
          <span class="stat-num success">{{ doneCount }}</span>
          <span class="stat-label">Done</span>
        </div>
        <div class="stat-pill">
          <span class="stat-num warning">{{ pendingCount }}</span>
          <span class="stat-label">Pending</span>
        </div>
      </div>

      <div v-if="totalCount === 0" class="empty-state">
        <p>No tasks yet — add one above</p>
      </div>

      <ion-list v-else class="task-list">
        <ion-item v-for="task in tasks" :key="task.id" lines="none" @click="viewTask(task.id)" button class="task-item">
          <ion-checkbox
            slot="start"
            :checked="task.done"
            @click.stop
            @ionChange="handleToggle(task, $event)"
          ></ion-checkbox>
          
          <ion-avatar v-if="task.photo" slot="start" class="task-avatar">
            <ion-img :src="task.photo" alt="Task photo"></ion-img>
          </ion-avatar>

          <ion-label :class="{ done: task.done }" class="task-label">
            {{ task.name }}
          </ion-label>
          
          <ion-button
            slot="end"
            fill="clear"
            color="danger"
            @click.stop="removeTask(task.id)"
            class="delete-btn"
          >
            <ion-icon slot="icon-only" :icon="trash"></ion-icon>
          </ion-button>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonCheckbox,
  IonInput, IonButton, IonIcon, IonAvatar, IonImg
} from '@ionic/vue';
import { trash } from 'ionicons/icons';
import { useTaskStore } from '@/stores/taskStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const router = useRouter();

const taskStore = useTaskStore();
const { tasks, totalCount, doneCount, pendingCount } = storeToRefs(taskStore);
const { addTask, toggleTask, removeTask } = taskStore;

const newTaskName = ref('');

const viewTask = (id: string | number) => {
  router.push(`/tabs/tasks/${id}`);
};

function handleAdd() {
  if (!newTaskName.value.trim()) return;
  addTask(newTaskName.value.trim());
  newTaskName.value = '';
}

function handleToggle(task: any, event: CustomEvent) {
  if (event.detail.checked !== task.done) {
    toggleTask(task.id);
  }
}
</script>

<style scoped>
.input-row {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
}

.custom-input {
  flex: 1;
  --background: transparent;
  --padding-start: 16px;
  --padding-end: 16px;
  border: 1px solid var(--ion-color-light-shade, #e0e0e0);
  border-radius: 12px;
  min-height: 48px;
  font-size: 15px;
}

.add-btn {
  margin: 0;
  height: 48px;
  --border-radius: 12px;
  --box-shadow: none;
  font-weight: 600;
  flex-shrink: 0;
}

.stats-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.stat-pill {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background: var(--ion-color-light);
  border-radius: 12px;
}

.stat-num {
  font-size: 18px;
  font-weight: 700;
  color: var(--ion-color-dark);
}

.stat-num.success {
  color: var(--ion-color-success);
}

.stat-num.warning {
  color: var(--ion-color-warning);
}

.stat-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--ion-color-medium);
  margin-top: 2px;
}

.task-list {
  background: transparent;
  padding: 0;
}

.task-item {
  --background: var(--ion-color-step-50, #fafafa);
  --border-radius: 12px;
  --padding-start: 12px;
  --inner-padding-end: 12px;
  margin-bottom: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.task-label {
  font-size: 15px;
  font-weight: 500;
  color: var(--ion-color-dark);
  margin-left: 4px;
}

.task-avatar {
  --border-radius: 8px;
  width: 36px;
  height: 36px;
  margin-inline-end: 12px;
}

.delete-btn {
  margin: 0;
  --padding-start: 8px;
  --padding-end: 8px;
  opacity: 0.7;
}

.delete-btn:hover {
  opacity: 1;
}

.empty-state {
  text-align: center;
  color: var(--ion-color-medium);
  margin-top: 60px;
  font-size: 15px;
}

.done {
  text-decoration: line-through;
  color: var(--ion-color-medium);
  opacity: 0.7;
}
</style>