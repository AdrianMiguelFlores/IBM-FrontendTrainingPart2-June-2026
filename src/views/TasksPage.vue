<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tasks</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <div class="input-row">
        <ion-input
          v-model="newTaskName"
          placeholder="New task..."
          @keyup.enter="handleAdd"
        ></ion-input>
        <ion-button @click="handleAdd">Add</ion-button>
      </div>

      <div class="stats-bar">
        <span><strong>{{ totalCount }}</strong> Total</span>
        <span><strong>{{ doneCount }}</strong> Done</span>
        <span><strong>{{ pendingCount }}</strong> Pending</span>
      </div>

      <div v-if="totalCount === 0" class="empty-state">
        <p>No tasks yet — add one above</p>
      </div>

      <ion-list v-else>
        <ion-item v-for="task in tasks" :key="task.id" lines="full" @click="viewTask(task.id)" button>
          <ion-checkbox
            slot="start"
            :checked="task.done"
            @click.stop
            @ionChange="handleToggle(task, $event)"
          ></ion-checkbox>
          <ion-label :class="{ done: task.done }">
            {{ task.name }}
          </ion-label>
          <ion-button
            slot="end"
            fill="clear"
            color="danger"
            @click.stop="removeTask(task.id)"
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
  IonInput, IonButton, IonIcon
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
  gap: 8px;
  margin-bottom: 16px;
  align-items: center;
}
ion-input {
  flex: 1;
  --background: var(--ion-color-light);
  --padding-start: 12px;
  border-radius: 8px;
  min-height: 44px;
}
ion-button {
  margin: 0;
  height: 44px;
  flex-shrink: 0;
}
.stats-bar {
  display: flex;
  justify-content: space-around;
  padding: 12px;
  background: var(--ion-color-light);
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 16px;
  color: var(--ion-color-medium);
}
.stats-bar strong {
  color: var(--ion-color-dark);
  font-size: 16px;
  margin-right: 2px;
}
.empty-state {
  text-align: center;
  color: var(--ion-color-medium);
  margin-top: 40px;
}
.done {
  text-decoration: line-through;
  color: var(--ion-color-medium);
}
</style>