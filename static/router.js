// importing all components
import Home from "./components/Home.js"
import Register from "./components/Register.js"
import Login from "./components/Login.js"
import Users from "./components/Users.js"
import CategoryForm from "./components/CategoryForm.js"
import ProductForm from "./components/ProductForm.js"
import Product from "./components/Product.js"
import ProductCategory from "./components/ProductCategory.js"

// routes are array of paths
const routes = [
    { path: '/', component: Home, name: 'Home' },
    { path: '/register', component: Register, name: 'Register'},
    { path: '/login', component: Login, name: 'Login' },
    { path: '/users', component: Users, name: 'Users' },
    { path: '/create-category', component: CategoryForm, name: 'CategoryForm' },
    { path: '/create-product', component: ProductForm, name: 'ProductForm'},
    { path: '/products', component: Product, name: 'Products' },
    { path: '/products/:cat_name', component: ProductCategory, name: 'ProductsCategory' },
]

// Exporting VueRouter instance, pass routes to it
export default new VueRouter({
    // mode: "history", // to remove # from url
    routes,
})