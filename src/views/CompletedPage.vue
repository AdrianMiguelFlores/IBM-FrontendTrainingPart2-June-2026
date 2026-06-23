<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Completed</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Completed</ion-title>
        </ion-toolbar>
      </ion-header>

      <div v-if="completedTasks.length === 0" class="empty-state">
        <p>No completed tasks yet</p>
      </div>

      <div v-else>
        <p class="count-label">{{ completedTasks.length }} task{{ completedTasks.length === 1 ? '' : 's' }} completed</p>
        <div
          v-for="task in completedTasks"
          :key="task.id"
          class="task-card"
        >
          <ion-icon :icon="checkmarkCircle" class="check-icon"></ion-icon>
          <span class="task-name">{{ task.name }}</span>
          <ion-note class="task-id">#{{ String(task.id).padStart(3, '0') }}</ion-note>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonNote, IonIcon
} from '@ionic/vue';
import { checkmarkCircle } from 'ionicons/icons';
import { useTaskStore } from '@/stores/taskStore';

const completedTasks = computed(() =>
  useTaskStore().tasks.filter(t => t.done)
);
</script>

<style scoped>
.count-label {
  font-size: 13px;
  color: var(--ion-color-medium);
  margin: 0 0 12px;
}

.task-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--ion-color-light);
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 10px;
}

.check-icon {
  font-size: 22px;
  color: var(--ion-color-success);
  flex-shrink: 0;
}

.task-name {
  flex: 1;
  font-size: 16px;
  color: var(--ion-color-dark);
}

.task-id {
  font-size: 13px;
  flex-shrink: 0;
}

.empty-state {
  text-align: center;
  color: var(--ion-color-medium);
  margin-top: 40px;
}
</style>