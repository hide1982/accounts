<template lang="pug">
  nav.main-menu(v-if="isLoggedin")
    ul
      li
        router-link(to="/") {{ labels.mypage.name[lang] }}
      li
        router-link(to="/client") {{ labels.client.name[lang] }}
      li
        router-link(to="/quotation") {{ labels.quotation.name[lang] }}
      li
        router-link(to="/invoice") {{ labels.invoice.name[lang] }}
      // li
        router-link(to='/etc') ETC
      li
        router-link(to='/setting') {{ labels.setting.name[lang] }}
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['isLoggedin', 'lang', 'labels'])
  }
}
</script>

<style lang="scss" scoped>
$height: calc(100vh - $header-height);

.main-menu {
  display: block;
  overflow: auto;
  width: 200px;
  height: calc(100vh - #{$header-height});
}

ul {
  height: 100%;
  background-color: $primary-color;
}

ul > li {
  height: $menu-item-height;
  background-color: $primary-color;
  line-height: $menu-item-height;
  border-bottom: solid 1px $menu-border-color;

  > a {
    display: block;
    width: 100%;
    height: 100%;
    padding-left: 20px;
    color: $white-font-color;
    cursor: pointer;
    transition: all 0.15s;
    border-left: solid 5px $primary-color;
    font: {
      size: $menu-font-size;
      weight: bold;
    }

    &:hover {
      color: #777;
    }
  }
}

.router-link-exact-active {
  border-left: solid 5px #fff !important;
}
</style>
