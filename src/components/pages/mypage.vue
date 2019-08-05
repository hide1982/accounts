<template lang="pug">
  .mypage
    c-spinner(:trigger="isProcessing")
    c-message-bag(:messages="messages")
    h2.sub-title(v-if="!(!isCreatedUser && !isShowForm)") {{ subtitle }}
    button.button.button--primary.button-create-user(@click="showForm" v-if="!isShowForm && !isCreatedUser") {{ labels.mypage.buttons.create[lang] }}
    .mypage-body.block-margin-top
      form.form(v-if="isShowForm" @submit.prevent="")
        c-text(
          v-model.trim="$v.name.$model"
          :label="labels.mypage.info.name[lang]"
          :error="$v.name.$error"
        ).form-item__text--name

        c-text(
          v-model.trim="$v.company.$model"
          :label="labels.mypage.info.company[lang]"
          :error="$v.company.$error"
        ).form-item__text--company.element-margin-top

        c-text(
          v-model.trim="$v.zipcode.$model"
          :label="labels.mypage.info.zipcode[lang]"
          :error="$v.zipcode.$error"
        ).form-item__text--zipcode.element-margin-top

        c-text(
          v-model.trim="$v.address1.$model"
          :label="labels.mypage.info.address1[lang]"
          :error="$v.address1.$error"
        ).form-item__text--address1.element-margin-top

        c-text(
          v-model="address2"
          :label="labels.mypage.info.address2[lang]"
        ).form-item__text--address2.element-margin-top

        c-text(
          v-model="phone"
          :label="labels.mypage.info.phone[lang]"
        ).form-item__text--phone.element-margin-top
        div.element-margin-top
          p.form-item__label {{ labels.mypage.info.seal[lang] }}
          div.box.company-seal-container
            div.image-wrap
              img(:src="imageData || form.imageUrl" v-if="imageUrl || imageData")
            c-file(:onChange="inputFile" :label="labels.mypage.buttons.inputImage[lang]" v-if="ready").element-margin-left
            div.element-margin-left
              button.button.button--secondary(@click="beforeCancelImage" v-if="imageFile !== null") {{ labels.mypage.buttons.cancelImage[lang] }}
              button.button.button--secondary(@click="beforeClearImage" v-else) {{ labels.mypage.buttons.clearImage[lang] }}
        .form-buttons.block-margin-top
          .form-item
            input(type="submit" :value="labels.buttons.submit[lang]" @click="submit").button.button--primary
          .form-item.element-margin-left
            input(type="submit" :value="labels.buttons.cancel[lang]" @click="beforeHideForm").button.button--secondary

      .info-container(v-if="!isShowForm && isCreatedUser")
        table.info-a
          tr
            th {{ labels.mypage.info.name[lang] }}
            td {{ user.name }}
          tr
            th {{ labels.mypage.info.company[lang] }}
            td {{ user.company }}
          tr
            th {{ labels.mypage.info.zipcode[lang] }}
            td {{ user.zipcode }}
          tr
            th {{ labels.mypage.info.address1[lang] }}
            td {{ user.address1 }}
          tr
            th {{ labels.mypage.info.address2[lang] }}
            td {{ user.address2 }}
          tr
            th {{ labels.mypage.info.phone[lang] }}
            td {{ user.phone }}
          tr
            th {{ labels.mypage.info.seal[lang] }}
            td
              img(:src="user.imageUrl" v-if="user.imageUrl")
        button.button.button--primary.button-create-user.element-margin-top(@click="showForm" v-if="!isShowForm && isCreatedUser") {{ labels.mypage.buttons.edit[lang] }}

</template>
<script>
import { mapState, mapActions } from 'vuex'
import { createHelpers } from 'vuex-map-fields'
import { required } from 'vuelidate/lib/validators'

const { mapFields } = createHelpers({
  getterType: `user/getField`,
  mutationType: `user/updateField`
})

export default {
  data () {
    return {
      messages: [],
      files: null,
      ready: true
    }
  },
  validations: {
    name: {
      required
    },
    company: {
      required
    },
    zipcode: {
      required
    },
    address1: {
      required
    }
  },
  computed: {
    subtitle () {
      const labels = this.labels.mypage
      const lang = this.lang
      if (this.isShowForm && !this.isCreatedUser) {
        return labels.subtitles.create[lang]
      } else if (this.isShowForm && this.isCreatedUser) {
        return labels.subtitles.edit[lang]
      } else {
        return labels.subtitles.infomation[lang]
      }
    },
    ...mapState(['labels', 'lang']),
    ...mapState('user', ['isProcessing', 'isShowForm', 'isCreatedUser', 'form', 'user']),
    ...mapFields([
      'form.name', 'form.company', 'form.zipcode', 'form.address1',
      'form.address2', 'form.phone', 'form.imageFile', 'form.imageData', 'form.imageUrl'])
  },
  methods: {
    inputFile (e) {
      this.setImage(e.target.files[0])
    },
    beforeHideForm () {
      this.image = ''
      this.hideForm()
    },
    restoreSelectImage () {
      this.ready = false
      this.$nextTick(() => {
        this.ready = true
      })
    },
    beforeCancelImage () {
      this.cancelImage()
      this.restoreSelectImage()
    },
    beforeClearImage () {
      this.clearImage()
      this.restoreSelectImage()
    },
    ...mapActions('user', [
      'showForm',
      'hideForm',
      'setImage',
      'cancelImage',
      'clearImage',
      'create',
      'update'
    ]),
    submit () {
      this.$v.$touch()
      this.messages = []
      if (this.$v.$invalid) {
        this.messages.push('入力内容を確認してください')
      } else if (this.isCreatedUser) {
        const data = {
          id: this.user.id,
          ...this.form
        }
        this.update(data)
      } else {
        this.create(this.form)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.image-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  padding: 8px;
  border: solid 1px $base-border-color;
  background-color: $form-item-bg-color;

  & > img {
    width: 100%;
  }
}

.info-a > tr > td > img {
  width: 48px;
}

.company-seal-container {
  margin-top: 3px;
}
</style>
