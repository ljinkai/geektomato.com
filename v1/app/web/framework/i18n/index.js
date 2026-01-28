import VueI18n from 'vue-i18n'
import ZH_CN from './ZH_CN'
import EN_US from './EN_US'
import VI_VN from './VI_VN'
import IN_ID from './IN_ID'
import KO_KR from './KO_KR'
import RU_RU from './RU_RU'
import ES_ES from './ES_ES'
import JA_JP from './JA_JP'

const languageConfig = ['ZH_CN', 'EN_US', 'VI_VN', 'IN_ID', 'KO_KR', 'RU_RU', 'ES_ES', 'JA_JP']
export default function createI18n(locale) {
    if (languageConfig.indexOf(locale) === -1) {
        locale = 'ZH_CN'
    }
    return new VueI18n({
        locale,
        messages: {
            EN_US,
            ZH_CN,
            VI_VN,
            IN_ID,
            KO_KR,
            RU_RU,
            ES_ES,
            JA_JP
        }
    })
}
