import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { Preferences } from '@capacitor/preferences'

interface Task {
  id: number
  name: string
  done: boolean
  photo?: string
}

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const nextId = ref<number>(1)

  const totalCount   = computed(() => tasks.value.length)
  const doneCount    = computed(() => tasks.value.filter(task => task.done).length)
  const pendingCount = computed(() => tasks.value.filter(task => !task.done).length)

  async function saveTasks() {
    try {
      await Preferences.set({
        key: 'saved_tasks',
        value: JSON.stringify(tasks.value)
      })
    } catch (error) {
      console.error('Error saving tasks', error)
    }
  }

  async function loadTasks() {
    try {
      const { value } = await Preferences.get({ key: 'saved_tasks' })
      if (value) {
        tasks.value = JSON.parse(value)
        
        if (tasks.value.length > 0) {
          nextId.value = Math.max(...tasks.value.map(t => t.id)) + 1
        } else {
          nextId.value = 1
        }
      } else {
        tasks.value = []
        nextId.value = 1
        await saveTasks()
      }
    } catch (error) {
      console.error('Error loading tasks', error)
    }
  }

  async function addTask(name: string) {
    if (!name.trim()) return
    tasks.value.push({ id: nextId.value++, name, done: false })
    await saveTasks()
  }

  async function toggleTask(id: number) {
    for (const task of tasks.value) {
      if (task.id === id) {
        task.done = !task.done
      }
    }
    await saveTasks()
  }

  async function removeTask(id: number) {
    tasks.value = tasks.value.filter(task => task.id !== id)
    await saveTasks()
  }

  async function addPhotoToTask(id: number, path: string) {
    const task = tasks.value.find(t => t.id === id)
    if (task) {
      task.photo = path
      await saveTasks()
    }
  }

  return { 
    tasks, 
    totalCount, 
    doneCount, 
    pendingCount, 
    addTask, 
    addPhotoToTask,
    toggleTask, 
    removeTask,
    saveTasks,
    loadTasks
  }
})