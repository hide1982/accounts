export default {
  appname: ['見積・請求管理', 'ACCOUNTING MANAGEMENT'],
  buttons: {
    submit: ['決定', 'SUBMIT'],
    cancel: ['キャンセル', 'CANCEL'],
    edit: ['編集', 'EDIT'],
    close: ['閉じる', 'CLOSE'],
    add: ['追加', 'ADD'],
    login: ['ログイン', 'LOGIN'],
    logout: ['ログアウト', 'LOGOUT']
  },
  messages: {
    error: {
      required: ['必須です', 'Field is required']
    }
  },
  mypage: {
    name: ['マイページ', 'MY PAGE'],
    subtitles: {
      create: ['ユーザー作成', 'CREATE USER'],
      infomation: ['ユーザー情報', 'USER INFO'],
      edit: ['ユーザー編集', 'EDIT USER']
    },
    buttons: {
      edit: ['ユーザーを編集', 'EDIT'],
      create: ['ユーザーを作成', 'CREATE USER'],
      inputImage: ['画像を選択する', 'CHOOSE IMAGE'],
      cancelImage: ['キャンセル', 'CANCEL'],
      clearImage: ['クリア', 'CLEAR']
    },
    info: {
      name: ['名前', 'NAME'],
      company: ['会社名', 'COMPANY'],
      zipcode: ['郵便番号', 'ZIP CODE'],
      address1: ['住所1', 'ADDRESS 1'],
      address2: ['住所2', 'ADDRESS 2'],
      phone: ['電話番号', 'PHONE'],
      seal: ['会社印', 'COMPANY SEAL']
    }
  },
  client: {
    name: ['取引先', 'CLIENT'],
    subtitles: {
      create: ['取引先を登録', 'CREATE CRIENT'],
      list: ['取引先一覧', 'CRIENT LIST'],
      detail: ['取引先詳細', 'CLIENT DETAIL'],
      edit: ['取引先を編集', 'EDIT CLIENT']
    },
    buttons: {
      create: ['取引先を登録', 'CREATE CRIENT']
    },
    info: {
      name: ['担当者', 'PERSON IN CHARGE'],
      company: ['会社名', 'COMPANY'],
      zipcode: ['郵便番号', 'ZIP CODE'],
      address1: ['住所1', 'ADDRESS 1'],
      address2: ['住所2', 'ADDRESS 2'],
      phone: ['電話番号', 'PHONE']
    }
  },
  quotation: {
    name: ['見積書', 'QUOTATION'],
    subtitles: {
      list: ['見積一覧', 'QUOTATION LIST'],
      create: ['見積作成', 'CREATE QUOTATION'],
      detail: ['見積詳細', 'QUOTATEION DETAIL'],
      edit: ['見積編集', 'EDIT QUOTATION']
    },
    info: {
      dateOfIssue: ['発行日', 'DATE OF ISSUE'],
      limit: ['見積有効期限', 'PUOTATION VALIDITY PERIOD'],
      projectTitle: ['案件名', 'PROJECT TITLE'],
      selectClient: ['取引先を選択', 'SELECT CLIENT'],
      client: ['取引先', 'CLIENT'],
      item: {
        name: ['品目', 'ITEM'],
        description: ['内容', 'DESCRIPTION'],
        unitPrice: ['単価', 'UNIT PRICE'],
        quantity: ['数量', 'QUANTITY'],
        amount: ['金額', 'AMOUNT']
      },
      subtotal: ['小計', 'SUBTOTAL'],
      tax: ['消費税', 'TAX'],
      totalAmount: ['合計', 'TOTAL AMOUNT'],
      note: ['備考', 'NOTE']
    }
  },
  invoice: {
    name: ['請求書', 'INVOICE'],
    subtitles: {
      list: ['請求書一覧', 'INVOICE LIST'],
      create: ['請求書作成', 'CREATE INVOICE'],
      detail: ['請求書詳細', 'INVOICE DETAIL'],
      edit: ['請求書編集', 'EDIT INVOICE']
    },
    info: {
      dateOfIssue: ['発行日', 'DATE OF ISSUE'],
      limit: ['お支払い期限', 'PAYMENT DEADLINE'],
      projectTitle: ['案件名', 'PROJECT TITLE'],
      selectClient: ['取引先を選択', 'SELECT CLIENT'],
      client: ['取引先', 'CLIENT'],
      item: {
        name: ['品目', 'ITEM'],
        description: ['内容', 'DESCRIPTION'],
        unitPrice: ['単価', 'UNIT PRICE'],
        quantity: ['数量', 'QUANTITY'],
        amount: ['金額', 'AMOUNT']
      },
      subtotal: ['小計', 'SUBTOTAL'],
      tax: ['消費税', 'TAX'],
      totalAmount: ['合計', 'TOTAL AMOUNT'],
      note: ['備考', 'NOTE']
    }
  },
  setting: {
    name: ['設定', 'SETTING'],
    subtitles: {
      main: ['設定', 'SETTING']
    },
    form: {
      lang: {
        label: ['言語', 'LANGUAGE'],
        ja: ['日本語', 'JAPANESE'],
        en: ['英語', 'ENGLISH']
      },
      tax: {
        label: ['消費税', 'TAX'],
        show: ['表示する', 'SHOW'],
        hide: ['表示しない', 'HIDE']
      },
      save: {
        button: ['設定を保存', 'SAVE SETTINGS']
      }
    }
  },
  other: {
    messages: {
      createUserFirst: ['ユーザーを作成してください', 'Please create a user first']
    }
  }
}
