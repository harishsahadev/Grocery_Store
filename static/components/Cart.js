export default {
    template: `
    <div>
        <h1>Cart</h1>
        <table class="table table-striped">
            <caption>Table represents all available products</caption>

            <thead>
                <tr>
                    <th scope="col">Product Name</th>
                    <th scope="col">Cost</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Total Cost</th>
                    <th scope="col">Delete this cart</th>
                </tr>
            </thead>
            <tbody>
            <tr v-for="cart in carts" :key="cart.id">
                <td>{{cart.product_name}} </td>
                <td>{{cart.product_cost}} ₹</td>
                <td>{{cart.quantity}}</td>
                <td>{{cart.quantity * cart.product_cost}} ₹</td>

                <td>
                    <button type="button" class="btn btn-outline-danger btn-sm" data-mdb-ripple-color="dark" @click="deleteCart(cart.id)"> Delete </button>
                </td>
            </tr>
            </tbody>
        </table>

        <div class="mb-3">
            <h4><strong>Grand Total:</strong> {{ totalCost }} ₹</h4>
        </div>

        <!-- Button trigger modal -->
        <div class="d-grid gap-2 col-6 mx-auto">
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Order Checkout
            </button>
        </div>

        <!-- Modal -->
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Summary</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">Product Name</th>
                                    <th scope="col">Cost</th>
                                    <th scope="col">Quantity</th>
                                    <th scope="col">Total Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                            <tr v-for="cart in carts" :key="cart.id">
                                <td>{{cart.product_name}} </td>
                                <td>{{cart.product_cost}} ₹</td>
                                <td>{{cart.quantity}}</td>
                                <td>{{cart.quantity * cart.product_cost}} ₹</td>
                            </tr>
                            </tbody>
                        </table>
                        <div class="mb-3">
                            <h4><strong>Grand Total:</strong> {{ totalCost }} ₹</h4>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Go Back</button>
                        <button type="button" class="btn btn-success" @click="buyOrders">Buy Orders</button>
                    </div>
                </div>
            </div>
        </div>

    </div>`,


    data() {
        return {
            role: localStorage.getItem('role'),
            token: localStorage.getItem('auth-token'),
            carts: [],
            
        }
    },

    computed: {
        totalCost() {
          return this.carts.reduce(
            (total, cart) => total + cart.quantity * cart.product_cost,
            0
          );
        },
      },


    methods: {
        async deleteCart(cart_id) {
            const res = await fetch(`/delete_cart/${cart_id}`, {
                headers: {
                    'Authentication-Token': this.token,
                },
            })
            const data = await res.json()
            if (res.ok) {
                alert(data.message)
                this.$router.go(0)
            }
            else {
                alert(data.message)
            }
        },

        async buyOrders() {
            const res = await fetch('api/order', {
                method: 'POST',
                headers: {
                    'Authentication-Token': this.token,
                    'Content-Type': 'application/json',
                },
            })
            const data = await res.json()
            if (res.ok) {
                alert(data.message)
                this.$router.push('/order-summary')
            }
            else {
                alert(data.message)
            }
        }
    },



    async mounted() {
        const res = await fetch('/api/cart', {
            headers: {
                "Authentication-Token": this.token,
            } 
        })
        const data = await res.json()
        if (res.ok) {
            this.carts = data
            console.log(data)
        }
        else {
            alert(data.message)
        }
    }



}