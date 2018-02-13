<template>
  <div id="app" class="layout">
    <router-view/>
  </div>
</template>

<script>
export default {
    name: 'app'
}
</script>

<style>
.layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    height: 100%;
}
</style>
