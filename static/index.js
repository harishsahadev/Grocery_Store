import router from './router.js'
import NavBar from './components/NavBar.js'


// Navigation Guard - if user is not authenticated, redirect to login page
router.beforeEach((to, from, next) => {
    if (to.name !== 'Login' && !localStorage.getItem('auth-token') ? true : false) next({ name: 'Login' })
    else next()
  })


new Vue({
    el: "#app",
    template: `<div>
                <NavBar :key="has_changed" />  
                <router-view class="m-3" />
               </div>`,
    router,
    components: {
        NavBar,
    },
    data: {
        has_changed: true,
    },
    watch: {
        '$route' (to, from) {
            this.has_changed = !this.has_changed
        }
    }
})