import router from './router.js'
import NavBar from './components/NavBar.js'

new Vue({
    el: "#app",
    template: `<div>
                <NavBar />  
                <router-view />
               </div>`,
    router,
    components: {
        NavBar,
    }
})