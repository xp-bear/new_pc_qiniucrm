<!-- RightClickMenu.vue -->
<template>
  <div v-if="showMenu" :style="{ top: menuPosition.y + 'px', left: menuPosition.x + 'px' }" class="right-click-menu">
    <ul>
      <li @click="handleMenuItemClick('copy')">Copy</li>
      <li @click="handleMenuItemClick('paste')">Paste</li>
      <li @click="handleMenuItemClick('delete')">Delete</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const emit = defineEmits(["hide-menu"]);

const showMenu = ref(false);
const menuPosition = ref({ x: 0, y: 0 });

function handleRightClick(event) {
  event.preventDefault();
  menuPosition.value = {
    x: event.clientX,
    y: event.clientY,
  };
  showMenu.value = true;
}

function handleMenuItemClick(action) {
  console.log("Action:", action);
  emit("hide-menu");
}

function hideMenu() {
  showMenu.value = false;
  emit("hide-menu");
}

onMounted(() => {
  document.addEventListener("click", hideMenu);
});
</script>

<style scoped>
.right-click-menu {
  position: fixed;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  z-index: 1000;
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.right-click-menu ul {
  padding: 0;
  margin: 0;
}

.right-click-menu li {
  padding: 5px 10px;
  cursor: pointer;
}

.right-click-menu li:hover {
  background-color: #e9e9e9;
}
</style>
