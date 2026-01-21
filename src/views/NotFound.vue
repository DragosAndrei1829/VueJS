<template>
  <div class="not-found">
    <CardComponent>
      <template #header>
        <h1>404 - Page Not Found</h1>
      </template>
      <template #default>
        <div class="not-found-content">
          <p>The page you are looking for does not exist.</p>
          <router-link to="/" class="btn-home">Go to Home</router-link>
        </div>
      </template>
    </CardComponent>
  </div>
</template>

<script>
import CardComponent from '../components/CardComponent.vue'

export default {
  name: 'NotFound',
  components: {
    CardComponent
  }
}
</script>

<style scoped>
.not-found {
  width: 100%;
}

.not-found-content {
  text-align: center;
  padding: 2rem;
}

.not-found-content p {
  color: #666;
  margin-bottom: 2rem;
  font-size: 1rem;
}

.btn-home {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: #1a1a1a;
  color: #ffffff;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.9375rem;
  transition: all 0.2s;
}

.btn-home:hover {
  background: #333;
}
</style>

