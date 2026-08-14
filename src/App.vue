<script setup>
import Button from './components/Button/Button.vue'
</script>

<template>
  <main class="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
    <div class="flex gap-3">
      <Button label="Primary" variant="primary" @click="() => console.log('clicked')" />
      <Button label="Secondary" variant="secondary" />
      <Button label="Ghost" variant="ghost" />
      <Button label="Destructive" variant="destructive" />
    </div>
    <div class="flex gap-3">
      <Button label="Small" size="sm" />
      <Button label="Medium" size="md" />
      <Button label="Large" size="lg" />
    </div>
    <div class="flex gap-3">
      <Button label="Disabled" isDisabled />
      <Button label="Loading" isLoading />
    </div>
  </main>
</template>
