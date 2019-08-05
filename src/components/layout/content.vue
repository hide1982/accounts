<template lang="pug">
  .content
    router-view
</template>
<style lang="scss" scoped>
.content {
  overflow: auto;
  width: calc(100vw - 200px);
  height: calc(100vh - $header-height);
  padding: {
    top: 24px;
    right: 36px;
    left: 36px;
  }

  &::after {
    display: block;
    height: 36px;
    content: '';
  }
}
</style>
