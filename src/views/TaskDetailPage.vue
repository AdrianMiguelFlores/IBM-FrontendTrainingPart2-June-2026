<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tasks"></ion-back-button>
        </ion-buttons>
        <ion-title>Task Details</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Task Details</ion-title>
        </ion-toolbar>
      </ion-header>

      <div v-if="task">
        <div class="task-header">
          <ion-label :class="{ done: task.done }">{{ task.name }}</ion-label>
          <ion-badge :color="task.done ? 'success' : 'warning'">
            {{ task.done ? 'Completed' : 'Pending' }}
          </ion-badge>
        </div>

        <ion-list>
          <ion-item lines="full">
            <ion-label>Task ID</ion-label>
            <ion-note slot="end">#{{ String(task.id).padStart(3, '0') }}</ion-note>
          </ion-item>
          <ion-item lines="full">
            <ion-label>Status</ion-label>
            <ion-note slot="end" :color="task.done ? 'success' : 'warning'">
              {{ task.done ? 'Completed' : 'Pending' }}
            </ion-note>
          </ion-item>
          <ion-item lines="none">
            <ion-label>Mark as done</ion-label>
            <ion-checkbox
              slot="end"
              :checked="task.done"
              @ionChange="handleToggle($event)"
            ></ion-checkbox>
          </ion-item>
        </ion-list>

        <ion-button expand="block" color="danger" fill="outline" class="delete-btn" @click="handleDelete">
          Delete Task
        </ion-button>
      </div>

      <div v-else class="empty-state">
        <p>Task not found</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton,
  IonList, IonItem, IonLabel, IonNote, IonBadge, IonCheckbox, IonButton
} from '@ionic/vue';
import { useRoute, useRouter } from 'vue-router';
import { useTaskStore } from '@/stores/taskStore';

const route = useRoute();
const router = useRouter();
const taskStore = useTaskStore();

const task = computed(() =>
  taskStore.tasks.find(t => String(t.id) === String(route.params.id))
);

function handleToggle(event: CustomEvent) {
  if (!task.value) return;
  if (event.detail.checked !== task.value.done) {
    taskStore.toggleTask(task.value.id);
  }
}

function handleDelete() {
  if (!task.value) return;
  taskStore.removeTask(task.value.id);
  router.back();
}
</script>

<style scoped>
.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0 16px;
}

.task-header ion-label {
  font-size: 20px;
  font-weight: 600;
  color: var(--ion-color-dark);
}

.task-header ion-label.done {
  text-decoration: line-through;
  color: var(--ion-color-medium);
}

.delete-btn {
  margin-top: 24px;
}

.empty-state {
  text-align: center;
  color: var(--ion-color-medium);
  margin-top: 40px;
}
</style>