// importing all components
import Home from "./components/Home.js"
import Login from "./components/Login.js"
import Users from "./components/Users.js"

// routes are array of paths
const routes = [
    { path: '/', component: Home, name: 'Home' },
    { path: '/login', component: Login, name: 'Login' },
    { path: '/users', component: Users, name: 'Users' },
]

// Exporting VueRouter instance, pass routes to it
export default new VueRouter({
    routes,
})