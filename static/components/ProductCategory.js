export default {
    template: `
    <div>
        <div class="mb-3">
            <h3>Products of {{category_name}} category</h3>
        </div>

        <div class='alert alert-danger' v-if=error> {{error}} </div>

        <div class="col-md-11 text-end mb-3" >
            <button type="button" class="btn btn-secondary ">
                <router-link class="nav-link" to="/cart">Go to Cart</router-link>
            </button>
        </div>

        <table class="table table-striped">
            <caption>Table represents all available products</caption>

            <thead>
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Category</th>
                    <th scope="col">Cost</th>
                    <th scope="col">Description</th>
                    <th scope="col">Select Quantity</th>
                    <th scope="col">Add to Cart</th>
                </tr>
            </thead>
            <tbody>
            <tr v-for="(product, index) in products">
                <td>{{product.name}}</td>
                <td>{{category_name}}</td>
                <td>{{product.cost}} ₹</td>
                <td>{{product.description}}</td>
                <td> 
                    <div class="form-outline" style="width: 8rem;">
                        <input v-model="cart.quantity" min="0" :max="product.quantity" type="number" id="inputQuantity" class="form-control"/>
                        <label class="form-label" for="inputQuantity">Available: {{product.quantity}} </label>
                    </div>
                </td>
                <td><button class="btn btn-primary btn-sm" @click="addToCart(product.id)">Add to Cart</button></td>
            </tr>
            </tbody>
        </table>
    </div>`,

    data() {
        return {
            products: [],
            token: localStorage.getItem('auth-token'),
            error: null,
            category_name: this.$route.params.cat_name,
            cart: {
                product_id: null,
                quantity: null,
            }, 
            error: null,
        }
    },



    async created() {
        try {
          const cat_name = this.$route.params.cat_name; // Accessing cat_name from the route parameters
    
          const res = await fetch(`/products/${cat_name}`, {
            headers: {
              "Authentication-Token": this.token,
            },
          });
    
          const data = await res.json();
    
          if (res.ok) {
            // console.log(data);
            this.qty = data.quantity;
            this.products = data;
          } else {
            this.error = data.message
          }
        } catch (error) {
          console.error('Error fetching product data:', error);
        }
    },

    methods: {
        async addToCart(product_id) {

            this.cart.product_id = product_id

            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Authentication-Token': this.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.cart),
            })

            const data = await res.json()
            console.log(data)
            if (res.ok) {
                alert(data.message)
                this.$router.go(0)
            }
            else {
                this.error = data.message
            }
        }
    }



    
}