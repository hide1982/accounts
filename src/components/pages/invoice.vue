<template lang="pug">
  .invoice(v-if="isCreatedUser")
    h2.sub-title {{ subtitle }}
    .invoice-body.block-margin-top
      button.button.button--primary(v-if="!isShowForm" @click="showForm") {{ labels.invoice.subtitles.create[lang] }}

      // 入力フォーム
      Form(v-if="isShowForm" method="post")
      // 一覧
      .s-list-wrap.element-margin-top(v-else)
        .s-list(v-if="invoices.length")
          .s-list__row.box(v-for="(invoice, i) in invoices")
            button.s-list__item--button.col-1(@click="showDetail(i)")
              img(:src="detail").s-list__item--icon
            .s-list__item.s-list__item--date.col-2.ellipsis {{ $moment(invoice.dateOfIssue).format('YYYY-MM-DD') }}
            .s-list__item.ellipsis.col-3 {{ getClient(invoice.client) ? getClient(invoice.client).company : '' }}
            .s-list__item.ellipsis.col-6 {{ invoice.projectTitle }}
      c-spinner(:trigger="isProcessing")
      // モーダル
      c-modal(:trigger="selectedIndex !== null" @close="hideDetail")
        // 詳細
        .detail(v-if="!isShowDetailForm")
          .detail__header.box.jc-between
            h2.detail__header__title.sub-title.col-9 {{ labels.invoice.subtitles.detail[lang] }}
            button.button.button--primary.col-3(@click="createReport") 帳票出力
          .detail__body.element-margin-top(v-if="selectedIndex !== null")
            table.info-a
              tr
                th {{ labels.invoice.info.dateOfIssue[lang] }}
                td {{ $moment(invoices[selectedIndex].name).format('YYYY-MM-DD') }}
              tr
                th {{ labels.invoice.info.limit[lang] }}
                td {{ invoices[selectedIndex].limit ? $moment(invoices[selectedIndex].limit).format('YYYY-MM-DD') : '-' }}
              tr
                th {{ labels.invoice.info.projectTitle[lang] }}
                td {{ invoices[selectedIndex].projectTitle }}
              tr
                th {{ labels.invoice.info.client[lang] }}
                td {{ getClientName(selectedIndex) }}

            table(v-for="(item, i) in invoices[selectedIndex].items").info-b.element-margin-top
              tr.info-b__item--name
                th.border-bottom-white {{ labels.invoice.info.item.name[lang] }} {{ i + 1 }}
                td(colspan="5") {{ item.name }}
              tr
                th.border-bottom-white {{ labels.invoice.info.item.description[lang] }}
                td(colspan="5")  {{ item.description }}
              tr.info-b__3col
                th {{ labels.invoice.info.item.unitPrice[lang] }}
                td.number-cell {{ formatMoney(item.unitPrice) }}
                th {{ labels.invoice.info.item.quantity[lang] }}
                td.number-cell {{ item.quantity }}
                th {{ labels.invoice.info.item.amount[lang] }}
                td.number-cell {{ formatMoney(item.amount) }}

            // 消費税表示
            table.info-a.element-margin-top(v-if="tax")
              tr
                th {{ labels.invoice.info.subtotal[lang] }}
                td(colspan="5").number-cell {{ formatMoney(subtotalAmount) }}
              tr
                th {{ labels.invoice.info.tax[lang] }}
                td(colspan="5").number-cell {{ formatMoney(taxAmount) }}
              tr
                th {{ labels.invoice.info.totalAmount[lang] }}
                td(colspan="5").number-cell {{ formatMoney(totalAmount) }}

            // 消費税非表示
            table.info-a.element-margin-top(v-else)
              tr
                th {{ labels.invoice.info.totalAmount[lang] }}
                td(colspan="5").number-cell {{ formatMoney(totalAmount) }}

            table.info-a.element-margin-top
              tr
                th {{ labels.invoice.info.note[lang] }}
                td
                  pre {{ invoices[selectedIndex].note }}

          .detail__footer.block-margin-top
            button.detail__edit.button.button--primary(@click="showDetailForm") {{ labels.buttons.edit[lang] }}
            button.detail__close.button.button--secondary.element-margin-left(@click="hideDetail") {{ labels.buttons.close[lang] }}

        // 詳細 編集
        .edit(v-else-if="invoices[selectedIndex]")
          .box.jc-between
            h2.detail__header__title.sub-title.col-10 {{ labels.invoice.subtitles.edit[lang] }}
            button.button.button--primary.button-delete-invoice(@click="remove") 削除
          Form(method="put").element-margin-top

  createUserFirst(v-else)
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { detail } from '../../assets/dataUrl'
import createUserFirst from '../modules/create-user-first.vue'
import Form from '../modules/form/invoice.vue'
import { formatMoney } from '../../util'

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
    ...mapState('user', ['isCreatedUser']),
    ...mapState('invoice', ['isProcessing', 'isShowForm', 'isShowDetailForm', 'selectedIndex', 'invoices']),
    ...mapState('client', ['clients']),
    ...mapGetters('client', ['getClient']),
    ...mapGetters('invoice', ['subtitle', 'subtotalAmount', 'taxAmount', 'totalAmount'])
  },
  methods: {
    getClientName (index) {
      const clientId = this.invoices[index].client
      const clientInfo = this.clients[clientId]
      if (clientInfo) {
        return clientInfo.company
      }
      return ''
    },
    formatMoney,
    ...mapActions('invoice',
      ['showForm', 'showDetail', 'create', 'remove', 'update', 'hideForm', 'hideDetailForm', 'hideDetail',
        'createReport', 'showDetailForm'])
  }
}
</script>
