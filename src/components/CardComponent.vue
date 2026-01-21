<template>
  <div class="card">
    <div v-if="$slots.header" class="card-header">
      <slot name="header"></slot>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardComponent'
}
</script>

<style scoped>
.card {
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
  overflow: hidden;
}

.card-header {
  padding: 1.5rem;
  background: #ffffff;
  border-bottom: 1px solid #e5e5e5;
}

.card-header h1,
.card-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  letter-spacing: -0.02em;
}

.card-body {
  padding: 1.5rem;
}

.card-footer {
  padding: 1rem 1.5rem;
  background: #fafafa;
  border-top: 1px solid #e5e5e5;
}
</style>

