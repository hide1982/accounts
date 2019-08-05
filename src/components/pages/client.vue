<template lang="pug">
  .client(v-if="isCreatedUser")
    h2.sub-title {{ subtitle }}
    .client-body.block-margin-top
      button.button.button--primary.button-create-client(@click="showForm" v-if="!isShowForm") {{ labels.client.buttons.create[lang] }}
      // 新規作成フォーム
      Form(v-if="isShowForm" method="create")
      // 一覧
      .s-list-wrap.element-margin-top(v-else)
        .s-list(v-if="clients.length")
          .s-list__row.box(v-for="(client, i) in clients")
            button.s-list__item--button.col-1(@click="showDetail(i)")
              img(:src="detail").s-list__item--icon
            .s-list__item.ellipsis.col-11 {{ client.company }}
      // モーダル
      c-message-bag
      c-spinner(:trigger="isProcessing")
      c-modal(:trigger="selectedClientIndex !== null" @close="hideDetail")
        .detail(v-if="!isShowDetaiForm")
          .detail__header(v-if="!isShowDetaiForm")
            h2.detail__header__title.sub-title {{ labels.client.subtitles.detail[lang] }}
          .detail__body.element-margin-top(v-if="!isShowDetaiForm")
            table.info-a(v-if="selectedClientIndex !== null")
              tr
                th {{ labels.client.info.company[lang] }}
                td {{ clients[selectedClientIndex].company }}
              tr
                th {{ labels.client.info.name[lang] }}
                td {{ clients[selectedClientIndex].name }}
              tr
                th {{ labels.client.info.zipcode[lang] }}
                td {{ clients[selectedClientIndex].zipcode }}
              tr
                th {{ labels.client.info.address1[lang] }}
                td {{ clients[selectedClientIndex].address1 }}
              tr
                th {{ labels.client.info.address2[lang] }}
                td {{ clients[selectedClientIndex].address2 }}
              tr
                th {{ labels.client.info.phone[lang] }}
                td {{ clients[selectedClientIndex].phone }}
          .detail__footer.element-margin-top(v-if="!isShowDetaiForm")
            button.detail__edit.button.button--primary(@click="showDetailForm") {{ labels.buttons.edit[lang] }}
            button.detail__close.button.button--secondary.element-margin-left(@click="hideDetail") {{ labels.buttons.close[lang] }}
        .edit(v-else)
          .box.jc-between
            h2.detail__header__title.sub-title.col-10 {{ labels.client.subtitles.edit[lang] }}
            button.button.button--primary.button-delete-client(@click="remove") 削除
          // 編集フォーム
          Form(method="edit").element-margin-top
  CreateUserFirst(v-else)
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { createHelpers } from 'vuex-map-fields'
import { detail } from '../../assets/dataUrl'
import CreateUserFirst from '../modules/create-user-first.vue'
import Form from '../modules/form/client.vue'

const { mapFields } = createHelpers({
  getterType: `client/getField`,
  mutationType: `client/updateField`
})

export default {
  components: {
    CreateUserFirst,
    Form
  },
  data () {
    return {
      detail
    }
  },
  computed: {
    subtitle () {
      const subtitles = this.labels.client.subtitles
      const lang = this.lang
      if (this.isShowForm) {
        return subtitles.create[lang]
      } else {
        return subtitles.list[lang]
      }
    },
    ...mapState(['labels', 'lang']),
    ...mapState('client', ['isProcessing', 'isShowForm', 'isShowDetaiForm', 'selectedClientIndex', 'form', 'clients']),
    ...mapState('user', ['user', 'isCreatedUser']),
    ...mapFields(['form.name', 'form.company', 'form.zipcode', 'form.address1', 'form.address2', 'form.phone'])
  },
  methods: {
    ...mapActions('client',
      [
        'showForm',
        'showDetail',
        'hideDetail',
        'showDetailForm',
        'hideDetailForm',
        'remove'
      ]
    ),
    hideDetailOnModalMask () {
      if (!this.isShowDetaiForm) {
        this.hideDetail()
      }
    }
  }
}
</script>
