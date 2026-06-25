<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tasks"></ion-back-button>
        </ion-buttons>
        <ion-title>Task Details</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="takeAndSavePhoto">
            <ion-icon slot="icon-only" :icon="cameraOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <div v-if="task">
        <div v-if="task.photo" class="image-preview">
          <ion-img :src="task.photo" alt="Task photo" />
        </div>

        <div class="task-header">
          <h1 :class="{ done: task.done }">{{ task.name }}</h1>
          <ion-badge :color="task.done ? 'success' : 'warning'" class="custom-badge">
            {{ task.done ? 'Completed' : 'Pending' }}
          </ion-badge>
        </div>

        <ion-list class="custom-list">
          <ion-item lines="none">
            <ion-label>Task ID</ion-label>
            <ion-note slot="end">#{{ String(task.id).padStart(3, '0') }}</ion-note>
          </ion-item>
          
          <ion-item lines="none">
            <ion-label>Status</ion-label>
            <ion-note slot="end" :color="task.done ? 'success' : 'warning'" class="status-note">
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

        <ion-button expand="block" color="danger" fill="clear" class="delete-btn" @click="handleDelete">
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
import { Camera, CameraDirection } from '@capacitor/camera';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonButton, IonIcon,
  IonList, IonItem, IonLabel, IonNote, IonBadge, IonCheckbox,
  IonImg
} from '@ionic/vue';
import { cameraOutline } from 'ionicons/icons';
import { useRoute, useRouter } from 'vue-router';
import { useTaskStore } from '@/stores/taskStore';

const route = useRoute();
const router = useRouter();
const taskStore = useTaskStore();

const task = computed(() =>
  taskStore.tasks.find(t => String(t.id) === String(route.params.id))
);

async function takeAndSavePhoto() {
  if (!task.value) return;

  try {
    const result = await Camera.takePhoto({
      quality: 90,
      editable: 'in-app',
      cameraDirection: CameraDirection.Rear,
      targetWidth: 1280,
      targetHeight: 720,
    });

    if (result.thumbnail) {
      const base64DataUrl = result.thumbnail.startsWith('data:image')
        ? result.thumbnail
        : `data:image/jpeg;base64,${result.thumbnail}`;

      taskStore.addPhotoToTask(Number(task.value.id), base64DataUrl);
    }
  } catch (error) {
    console.error('Camera cancelled or failed', error);
  }
}

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
.image-preview {
  margin: -16px -16px 20px -16px;
  height: 240px;
  overflow: hidden;
  position: relative;
  background: var(--ion-color-light);
}

.image-preview ion-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.task-header {
  margin-bottom: 24px;
}

.task-header h1 {
  font-size: 24px;
  font-weight: 700;
  color: var(--ion-color-dark);
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.task-header h1.done {
  text-decoration: line-through;
  color: var(--ion-color-medium);
  opacity: 0.7;
}

.custom-badge {
  --padding-start: 10px;
  --padding-end: 10px;
  --padding-top: 6px;
  --padding-bottom: 6px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.custom-list {
  background: transparent;
  padding: 0;
  margin-bottom: 32px;
}

.custom-list ion-item {
  --background: var(--ion-color-step-50, #fafafa);
  --border-radius: 12px;
  --padding-start: 16px;
  --inner-padding-end: 16px;
  margin-bottom: 8px;
  min-height: 48px;
}

.custom-list ion-label {
  font-size: 15px;
  color: var(--ion-color-step-600, #666666);
}

.custom-list ion-note {
  font-size: 15px;
  font-weight: 600;
  color: var(--ion-color-dark);
}

.status-note {
  font-weight: 700 !important;
}

.delete-btn {
  margin-top: 16px;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  color: var(--ion-color-medium);
  margin-top: 80px;
  font-size: 15px;
}
</style>