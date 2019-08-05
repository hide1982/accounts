<template lang="pug">
  .setting(v-if="isCreatedUser")
    h2.sub-title {{ labels.setting.subtitles.main[lang] }}
    .setting-body.block-margin-top
      span.form-item__label {{ labels.setting.form.lang.label[lang] }}
      div
        .form-item.form-item--radio-group
          input.form-item__radio#lang-ja(type="radio" name="lang" value="0" :checked="lang == 0" @change="changeLang")
          label.form-item__label(for="lang-ja") {{ labels.setting.form.lang.ja[lang] }}
          input.form-item__radio#lang-en(type="radio" name="lang" value="1" :checked="lang == 1" @change="changeLang")
          label.form-item__label(for="lang-en") {{ labels.setting.form.lang.en[lang] }}
      div.element-margin-top
        span.form-item__label {{ labels.setting.form.tax.label[lang] }}
        .form-item.form-item--radio-group
          input.form-item__radio#tax-true(type="radio" name="tax" value="1" :checked="tax == '1'" @change="setTax")
          label.form-item__label(for="tax-true") {{ labels.setting.form.tax.show[lang] }}
          input.form-item__radio#tax-false(type="radio" name="tax" value="0" :checked="tax == '0'" @change="setTax")
          label.form-item__label(for="tax-false") {{ labels.setting.form.tax.hide[lang] }}
      div.block-margin-top
        button.button.button--primary(@click="saveSetting") {{ labels.setting.form.save.button[lang] }}
  createUserFirst(v-else)
</template>
<script>
import { mapState, mapActions } from 'vuex'
import createUserFirst from '../modules/create-user-first.vue'
export default {
  components: {
    createUserFirst
  },
  computed: {
    ...mapState(['labels', 'lang', 'tax']),
    ...mapState('user', ['isCreatedUser'])
  },
  methods: {
    ...mapActions(['changeLang', 'setTax', 'saveSetting'])
  }
}
</script>
