function url({apiPinnacle, apiFMMC}) {
    const apiBase = apiPinnacle + '/api/v2'

    return {
        login: {
            facebookLogin: apiBase + '/login_facebook/',
            googleLogin: apiBase + '/login_google/',
            login: apiBase + '/login/',
            signUpEmail: apiBase + '/signup_email/'
        },
        account: {
            forget: apiFMMC + '/api/send_direct_mail',
        },
        invite: {
            getInviteTips: apiBase + '/invite/tips/',
            getUserInfoByInviteCode: apiBase + '/invite/code/user/',
            connect: apiBase + '/invite/register/feedback/message/'
        },
        item: {
            sync: apiBase + '/sync_timestamp',
            detail: apiBase + '/bid/get_bid_item_detail/',
            bid: apiBase + '/fp/bid/',
            orderId: apiBase + '/fg/bid/user/goods/'
        },
        bid: {
            position: apiBase + '/fg/bid/positions/',
            iframePosition: apiBase + '/fg/bid/home/positions/'
        },
        order: {
            detail: apiBase + '/bid/get_order_detail/',
            list: apiBase + '/bid/order_list/',
            pay: apiBase + '/bid/pay_now/',
            count: apiBase + '/bid/get_order_count_info/'
        },
        payment: {
            paymentInfo: apiBase + '/payment/get_payment_methods/',
            channel: apiBase + '/charge/channel/detail/',

            shippingaddress: apiBase + '/order/get_shipping_addresses/',
            addshippingaddress: apiBase + '/order/add_shipping_address/',
            deleteshippingaddress: apiBase + '/order/delete_shipping_address/',
            setdefaultshippingaddress: apiBase + '/order/set_default_shipping_address/',

            addcreditcard: apiBase + '/payment/add_credit_card/',
            addcreditcardAsync: apiBase + '/payment/add_card_state/',
            delcreditcard: apiBase + '/payment/del_credit_card/'
        },
        indiemaker: {
            producthunt: 'https://www.producthunt.com/frontend/graphql',
            indiehackers: 'https://n86t1r3owz-3.algolianet.com/1/indexes/*/queries?x-algolia-application-id=N86T1R3OWZ&x-algolia-api-key=5140dac5e87f47346abbda1a34ee70c3',
            indiehackers_community: 'https://www.indiehackers.com/',
            github: 'https://github.com/trending/'
        }
    }
}

module.exports = url
