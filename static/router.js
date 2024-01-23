// importing all components
import Home from "./components/Home.js"
import Register from "./components/Register.js"
import Login from "./components/Login.js"
import Users from "./components/Users.js"
import CategoryForm from "./components/CategoryForm.js"

// routes are array of paths
const routes = [
    { path: '/', component: Home, name: 'Home' },
    { path: '/register', component: Register, name: 'Register'},
    { path: '/login', component: Login, name: 'Login' },
    { path: '/users', component: Users, name: 'Users' },
    { path: '/create-category', component: CategoryForm, name: 'CategoryForm' },
]

// Exporting VueRouter instance, pass routes to it
export default new VueRouter({
    // mode: "history", // to remove # from url
    routes,
})