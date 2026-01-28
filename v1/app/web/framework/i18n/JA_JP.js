export default {
    home: {
        totalAssets: '資産総額',
        TotalEarned: '収益総額',
        APR: 'APR',
        soldOut: '完売',
        investNow: '今すぐ投資する',
        new: '新規'
    },
    history: {
        metaTitle: '投資履歴',
        totalInvestments: '資産総額',
        invested: '投資額',
        investingTab: '投資',
        completedTab: '完了しました',
        earned: '収益額',
        to_earned: '必要収益',
        investDate: '投資日',
        dueDate: '満期日',
        noCompletedList: 'あれ！まだ投資が完了していませんね…',
        noInvestingList: 'あれ！まだ投資中のものがありませんね…'
    },
    detail: {
        annualApr: '年間APR',
        days: '日数',
        day: '日',
        t_today: 'T = 今日',
        t_today_intro: '発注(11:59PM UTC以前)',
        t_1: 'T + 1',
        t_1_intro: '注文が確定されました。売却禁止期間が開始します。',
        t_2_intro: '投資が完了しました。収益は自動的にお客様のウォレットに入ります。',
        invested: '投資額',
        lockupPeriod: '売却禁止期間',
        totalInvestmentAvailable: '投資可能総額',
        totalCurrentlyInvested: '現行投資総額',
        minimumInvestment: '最小投資額',
        maximumInvestment: '最大投資額',
        aboutInvestment_title: 'この投資について',
        aboutInvestment_intro: ' この投資オプションでは年間投資額に基づく固定APRが支払われます。ユーザーは最大投資額と最小投資額の間のどんな金額でも投資できます。' +
            '現行投資総額は全投資家のこの商品への総投資額で、投資可能総額を超えることはできません。この商品で用いられる投資戦略は、ブルマーケットでもベアマーケットでも安定した仮' +
            '想通貨収入の確保を目指す統計学的裁定取引、定量的投資戦略、商業貸付などですが、それ以外の戦略も利用されることがあります。'
    },
    purchase: {
        metaTitle: '投資する',
        amountToBuy: '購入金額',
        investNow: 'さあ、投資しましょう',
        available: 'ウォレットの利用可能額',
        oops: 'あれ',
        positive: 'OK',
        minimumErrorMsg: '最小投資額は $money $coinSymbol です。もう一度やってみてください。',
        maximumErrorMsg: '最大投資額は $money $coinSymbol です。もう一度やってみてください。',
        availableBalanceError: '申し訳ありませんが、お客様の所持金は不足しているためこの取引を完了できません。',
        successTitle: '成功',
        inputError: 'ウォン入力！',
        successInvest: '$money $coinSymbol 投資額'
    },
    coin: {
        eth: 'ETH',
        btc: 'BTC'
    },
    verififyDialog: {
        title: '認証が必要です',
        content: 'アカウントの安全性保護のためより詳細な認証情報をご提供ください',
        negative: '後でする',
        positive: 'OK'
    }
}
