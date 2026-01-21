<template>
  <div id="app">
    <NavigationMenu />
    <main class="main-content">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<script>
import NavigationMenu from './components/NavigationMenu.vue'
import AppFooter from './components/AppFooter.vue'

export default {
  name: 'App',
  components: {
    NavigationMenu,
    AppFooter
  }
}
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }
}
</style>

