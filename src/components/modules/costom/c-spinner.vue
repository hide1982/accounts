<template lang="pug">
  transition(name="fade")
    .spinner-mask(v-if="trigger")
      .spinner
        div.rect1
        div.rect2
        div.rect3
        div.rect4
        div.rect5
</template>
<script>
export default {
  props: {
    trigger: {
      type: Boolean,
      required: true
    }
  }
}
</script>
<style lang="scss" scoped>
.spinner-mask {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
}

.spinner {
  $time: 1s;

  width: 60px;
  height: 60px;

  & > div {
    display: inline-block;
    width: 6px;
    height: 100%;
    background-color: #fff;
    animation: sk-stretchdelay $time infinite ease-in-out;
  }

  & .rect2 {
    animation-delay: ($time - 0.1) * -1;
  }

  & .rect3 {
    animation-delay: ($time - 0.2) * -1;
  }

  & .rect4 {
    animation-delay: ($time - 0.3) * -1;
  }

  & .rect5 {
    animation-delay: ($time - 0.4) * -1;
  }

  & .rect1,
  & .rect2,
  & .rect3,
  & .rect4 {
    margin-right: 3px;
  }
}

@keyframes sk-stretchdelay {
  0%,
  40%,
  100% {
    transform: scaleY(0.4);
  }

  20% {
    transform: scaleY(1);
  }
}
</style>
