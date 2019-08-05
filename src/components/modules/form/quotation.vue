<template lang="pug">
  form.form(@submit.prevent="")
    .form-item-row
      c-date(
        v-model="$v.dateOfIssue.$model"
        :label="labels.quotation.info.dateOfIssue[lang]"
        :error="$v.dateOfIssue.$error"
      )

      c-date(v-model="limit" :label="labels.quotation.info.limit[lang]").element-margin-left

    c-text(
      v-model="$v.projectTitle.$model"
      :label="labels.quotation.info.projectTitle[lang]"
      :error="$v.projectTitle.$error"
    ).element-margin-top

    c-select(
      v-model="$v.client.$model"
      :options="clients"
      :label="labels.quotation.info.selectClient[lang]"
      :error="$v.client.$error"
    ).element-margin-top

    .form-item-group.element-margin-top(v-for="(item, i) in items")
      button.button-close(v-if="items.length > 1" @click="deleteItem(i)")

      c-text(
        v-model.trim="$v.items.$each[i].name.$model"
        :label="labels.invoice.info.item.name[lang]"
        :error="$v.items.$each[i].name.$error"
      )

      c-text(
        v-model.trim="$v.items.$each[i].description.$model"
        :label="labels.invoice.info.item.description[lang]"
        :error="$v.items.$each[i].description.$error"
      ).element-margin-top

      .form-item-row.form-item-prices
        .form-item.element-margin-top
          label.form-item__label {{ labels.invoice.info.item.unitPrice[lang] }}
          input(
            :class="{ 'form-item--error': $v.items.$each[i].unitPrice.$error }"
            v-model="$v.items.$each[i].unitPrice.$model"
            @input="calc(i)"
          ).form-item__text

        .form-item.element-margin-top
          label.form-item__label {{ labels.invoice.info.item.quantity[lang] }}
          input(
            :class="{ 'form-item--error': $v.items.$each[i].quantity.$error }"
            v-model="$v.items.$each[i].quantity.$model"
            @input="calc(i)"
          ).form-item__text

        .form-item.element-margin-top
          label.form-item__label {{ labels.quotation.info.item.amount[lang] }}
          input(:value="item.amount" disabled).form-item__text

    div.content-nowrap-right
      button.button.button--primary(@click="addItem") {{ labels.buttons.add[lang] }}

    // 消費税表示
    div(v-if="tax")
      .form-item.element-margin-top
        label.form-item__label {{ labels.quotation.info.subtotal[lang] }}
        input(:value="formSubtotalAmount" disabled).form-item__text
      .form-item.element-margin-top
        label.form-item__label {{ labels.quotation.info.tax[lang] }}
        input(:value="formTaxAmount" disabled).form-item__text
      .form-item.element-margin-top
        label.form-item__label {{ labels.quotation.info.totalAmount[lang] }}
        input(:value="formTotalAmount" disabled).form-item__text

    // 消費税非表示
    .form-item.element-margin-top(v-else)
      label.form-item__label {{ labels.quotation.info.totalAmount[lang] }}
      input(:value="totalAmount" disabled).form-item__text

    c-textarea(v-model="note" :label="labels.quotation.info.note[lang]").element-margin-top

    .form-buttons.block-margin-top
      .form-item
        input(type="submit" :value="labels.buttons.submit[lang]" @click="submit").button.button--primary
      .form-item.element-margin-left
        input(type="submit" :value="labels.buttons.cancel[lang]" @click="cancel").button.button--secondary

</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { createHelpers } from 'vuex-map-fields'
import { required } from 'vuelidate/lib/validators'
import { formatMoney } from '../../../util'

const { mapFields } = createHelpers({
  getterType: `quotation/getField`,
  mutationType: `quotation/updateField`
})

export default {
  props: {
    method: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState(['labels', 'lang', 'tax']),
    ...mapState('quotation', ['form', 'quotations']),
    ...mapState('client', ['clients']),
    ...mapGetters('quotation', ['formSubtotalAmount', 'formTaxAmount', 'formTotalAmount']),
    ...mapFields([
      'form.client', 'form.dateOfIssue', 'form.projectTitle', 'form.limit',
      'form.items', 'form.note', 'form.totalAmount'])
  },
  methods: {
    submit () {
      this.$v.$touch()
      if (this.$v.$invalid) return

      if (this.method === 'post') {
        this.create()
      } else if (this.method === 'put') {
        this.update()
      }
    },
    cancel () {
      if (this.method === 'post') {
        this.hideForm()
      } else if (this.method === 'put') {
        this.hideDetailForm()
      }
    },
    calc (index) {
      this.$nextTick(() => {
        this.calculateTotalAmount()
      })
      this.calculateAmount(index)
      this.$forceUpdate()
    },
    formatMoney,
    getClientName (index) {
      return this.clients[index].company
    },
    ...mapActions('quotation', [
      'addItem',
      'deleteItem',
      'calculateAmount',
      'calculateTotalAmount',
      'create',
      'hideForm',
      'update',
      'hideDetailForm'
    ])
  },
  validations: {
    dateOfIssue: {
      required
    },
    projectTitle: {
      required
    },
    client: {
      required
    },
    items: {
      $each: {
        name: {
          required
        },
        description: {
          required
        },
        unitPrice: {
          required
        },
        quantity: {
          required
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form-item-group {
  position: relative;
}

.button-close {
  position: absolute;
  top: 14px;
  right: 14px;
}
</style>
