import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'

import SponsorsHome from './components/SponsorsHome.vue'
import SponsorsAside from './components/SponsorsAside.vue'

import './custom.css'
import './style/vars.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-features-after': () => h(SponsorsHome),
      'aside-bottom': () => h(SponsorsAside)
    })
  }
}
