<script setup lang="ts">
definePageMeta({
  layout: 'teacher',
  middleware: ['auth', 'role'],
})

// Redirect to badges index - creation is handled via modal
navigateTo('/profesor/insignias')
</script>
