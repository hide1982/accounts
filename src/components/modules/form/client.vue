<template lang="pug">
  form.form(@submit.prevent="")
    c-text(
      v-model.trim="$v.company.$model"
      :label="labels.client.info.company[lang]"
      :error="$v.company.$error"
    ).form-item__text--company

    c-text(
      v-model.trim="$v.name.$model"
      :label="labels.client.info.name[lang]"
      :error="$v.name.$error"
    ).form-item__text--name.element-margin-top

    c-text(
      v-model.trim="$v.zipcode.$model"
      :label="labels.client.info.zipcode[lang]"
      :error="$v.zipcode.$error"
    ).form-item__text--zipcode.element-margin-top

    c-text(
      v-model.trim="$v.address1.$model"
      :label="labels.client.info.address1[lang]"
      :error="$v.address1.$error"
    ).form-item__text--address1.element-margin-top

    c-text(v-model="address2" :label="labels.client.info.address2[lang]").form-item__text--address2.element-margin-top

    c-text(v-model="phone" :label="labels.client.info.phone[lang]").form-item__text--phone.element-margin-top

    .form-buttons.block-margin-top
      .form-item
        input(type="submit" :value="labels.buttons.submit[lang]" @click="submit").button.button--primary
      .form-item.element-margin-left
        input(type="submit" :value="labels.buttons.cancel[lang]" @click="cancel").button.button--secondary
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { createHelpers } from 'vuex-map-fields'
import { required } from 'vuelidate/lib/validators'

const { mapFields } = createHelpers({
  getterType: `client/getField`,
  mutationType: `client/updateField`
})

export default {
  props: {
    method: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState(['labels', 'lang']),
    ...mapState('client', ['form']),
    ...mapFields(['form.name', 'form.company', 'form.zipcode', 'form.address1', 'form.address2', 'form.phone'])
  },
  methods: {
    submit () {
      this.$v.$touch()
      if (this.$v.$invalid) return

      if (this.method === 'create') {
        this.create()
      } else if (this.method === 'edit') {
        this.update()
      }
    },
    cancel () {
      if (this.method === 'create') {
        this.hideForm()
      } else if (this.method === 'edit') {
        this.hideDetailForm()
      }
    },
    ...mapActions('client', [
      'create',
      'hideForm',
      'update',
      'hideDetailForm'
    ])
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
  }
}
</script>
