export default {
    template: `
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">Grocery</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item" v-if="is_login">
                        <router-link class="nav-link active" aria-current="page" to="/">Home/Categories</router-link>
                    </li>
                    <li class="nav-item" v-if="userRole=='admin'">
                        <router-link class="nav-link" to="/users">Users</router-link>
                    </li>
                    <li class="nav-item" v-if="userRole== 'admin'">
                        <router-link class="nav-link" to="/create-category">Create-Category</router-link>
                    </li>
                    <li class="nav-item" v-if="userRole== 'manager'">
                        <router-link class="nav-link" to="/create-category">Create-Category</router-link>
                    </li>
                    <li class="nav-item" v-if="userRole== 'manager'">
                        <router-link class="nav-link" to="/create-product">Create-Product</router-link>
                    </li>
                    <li class="nav-item" v-if="userRole== 'admin'">
                        <router-link class="nav-link" to="/create-product">Create-Product</router-link>
                    </li>
                    <li class="nav-item" v-if="userRole== 'customer'">
                        <router-link class="nav-link" to="/orders">Orders</router-link>
                    </li>
                    <li class="nav-item" v-if="userRole== 'customer'">
                        <router-link class="nav-link" to="/order-summary">Last-Order</router-link>
                    </li>
                    <li class="nav-item" v-if="userRole== 'customer'">
                        <router-link class="nav-link" to="/cart">Cart</router-link>
                    </li>
                </ul>
            </div>
        </div>
        <div class="nav-item mr-3 nav-link p-3">
            <button type="button" class="btn btn-outline-danger" @click="logout">Logout</button>
        </div>
    </nav>
    `,
    data() {
        return {
            userRole: localStorage.getItem('role'),
            is_login: localStorage.getItem('auth-token'),
        }
    },
    methods: {
        logout() {
            localStorage.removeItem('auth-token')
            localStorage.removeItem('role')
            this.$router.push({path: '/login'})
        }
    },

}