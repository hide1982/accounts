<template lang="pug">
  .quotation(v-if="isCreatedUser")
    h2.sub-title {{ subtitle }}
    .quotation-body.block-margin-top
      button.button.button--primary(v-if="!isShowForm" @click="showForm") {{ labels.quotation.subtitles.create[lang] }}

      // 入力フォーム
      Form(v-if="isShowForm" method="post")

      // 一覧
      .s-list-wrap.element-margin-top(v-else)
        .s-list(v-if="quotations.length")
          .s-list__row.box(v-for="(quotation, i) in quotations")
            button.s-list__item--button.col-1(@click="showDetail(i)")
              img(:src="detail").s-list__item--icon
            .s-list__item.s-list__item--date.col-2.ellipsis {{ $moment(quotation.dateOfIssue).format('YYYY-MM-DD') }}
            .s-list__item.ellipsis.col-3 {{ getClient(quotation.client) ? getClient(quotation.client).company : '' }}
            .s-list__item.ellipsis.col-6 {{ quotation.projectTitle }}

      // モーダル
      c-spinner(:trigger="isProcessing")
      c-modal(:trigger="selectedIndex !== null" @close="hideDetail")
        // 詳細
        .detail(v-if="!isShowDetailForm")
          .detail__header.box.jc-between
            h2.detail__header__title.sub-title.col-9 {{ labels.quotation.subtitles.detail[lang] }}
            button.button.button--primary.col-3(@click="createReport") 帳票出力
          .detail__body.element-margin-top(v-if="selectedIndex !== null")
            table.info-a
              tr
                th {{ labels.quotation.info.dateOfIssue[lang] }}
                td {{ $moment(quotations[selectedIndex].name).format('YYYY-MM-DD') }}
              tr
                th {{ labels.quotation.info.limit[lang] }}
                td {{ quotations[selectedIndex].limit ? $moment(quotations[selectedIndex].limit).format('YYYY-MM-DD') : '-' }}
              tr
                th {{ labels.quotation.info.projectTitle[lang] }}
                td {{ quotations[selectedIndex].projectTitle }}
              tr
                th {{ labels.quotation.info.client[lang] }}
                td {{ getClientName(selectedIndex) }}

            table(v-for="(item, i) in quotations[selectedIndex].items").info-b.element-margin-top
              tr.info-b__item--name
                th.border-bottom-white {{ labels.quotation.info.item.name[lang] }} {{ i + 1 }}
                td(colspan="5") {{ item.name }}
              tr
                th.border-bottom-white {{ labels.quotation.info.item.description[lang] }}
                td(colspan="5")  {{ item.description }}
              tr.info-b__3col
                th {{ labels.quotation.info.item.unitPrice[lang] }}
                td.number-cell {{ formatMoney(item.unitPrice) }}
                th {{ labels.quotation.info.item.quantity[lang] }}
                td.number-cell {{ item.quantity }}
                th {{ labels.quotation.info.item.amount[lang] }}
                td.number-cell {{ formatMoney(item.amount) }}

            // 消費税表示
            table.info-a.element-margin-top(v-if="tax")
              tr
                th {{ labels.quotation.info.subtotal[lang] }}
                td(colspan="5").number-cell {{ formatMoney(subtotalAmount) }}
              tr
                th {{ labels.quotation.info.tax[lang] }}
                td(colspan="5").number-cell {{ formatMoney(taxAmount) }}
              tr
                th {{ labels.quotation.info.totalAmount[lang] }}
                td(colspan="5").number-cell {{ formatMoney(totalAmount) }}

            // 消費税非表示
            table.info-a.element-margin-top(v-else)
              tr
                th {{ labels.quotation.info.totalAmount[lang] }}
                td(colspan="5").number-cell {{ formatMoney(totalAmount) }}

            table.info-a.element-margin-top
              tr
                th {{ labels.quotation.info.note[lang] }}
                td
                  pre {{ quotations[selectedIndex].note }}

          .detail__footer.block-margin-top
            button.detail__edit.button.button--primary(@click="showDetailForm") {{ labels.buttons.edit[lang] }}
            button.detail__close.button.button--secondary.element-margin-left(@click="hideDetail") {{ labels.buttons.close[lang] }}

        // 詳細 編集
        .edit(v-else-if="quotations[selectedIndex]")
          .box.jc-between
            h2.detail__header__title.sub-title.col-10 {{ labels.quotation.subtitles.edit[lang] }}
            button.button.button--primary.button-delete-quotation(@click="remove") 削除
          Form.element-margin-top(method="put")

  createUserFirst(v-else)
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { detail } from '../../assets/dataUrl'
import createUserFirst from '../modules/create-user-first.vue'
import { formatMoney } from '../../util'
import Form from '../modules/form/quotation.vue'

export default {
  data () {
    return {
      detail
    }
  },
  components: {
    createUserFirst,
    Form
  },
  computed: {
    ...mapState(['labels', 'lang', 'tax']),
    ...mapState('quotation', ['isShowForm', 'isShowDetailForm', 'isProcessing', 'quotations', 'selectedIndex']),
    ...mapState('client', ['clients']),
    ...mapState('user', ['isCreatedUser']),
    ...mapGetters('client', ['getClient']),
    ...mapGetters('quotation', ['subtitle', 'subtotalAmount', 'taxAmount', 'totalAmount'])
  },
  methods: {
    calcAmount (unitPrice, quantity) {
      return unitPrice * quantity
    },
    dummy () {},
    formatMoney,
    getClientName (index) {
      const clientId = this.quotations[index].client
      const clientInfo = this.clients[clientId]
      if (clientInfo) {
        return clientInfo.company
      }
      return ''
    },
    ...mapActions('quotation', [
      'showForm',
      'hideForm',
      'showDetail',
      'hideDetail',
      'showDetailForm',
      'hideDetailForm',
      'create',
      'update',
      'remove',
      'createReport'
    ])
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

.quotation-body {
  position: relative;
}

.detail__body {
  max-width: 700;
}

.info-b {
  min-width: 100%;
}
</style>
