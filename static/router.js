// importing all components
import Home from "./components/Home.js"
import Login from "./components/Login.js"

// routes are array of paths
const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login }
]

// Exporting VueRouter instance, pass routes to it
export default new VueRouter({
    routes,
})