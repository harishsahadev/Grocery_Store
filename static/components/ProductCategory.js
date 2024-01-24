export default {
    template: `
    <div>
        <h3>Products of {{category_name}} category</h3>
        <table class="table table-striped">
            <caption>Table represents all available products</caption>

            <thead>
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Category</th>
                    <th scope="col">Cost</th>
                    <th scope="col">Description</th>
                    <th scope="col">Quantity</th>
                </tr>
            </thead>
            <tbody>
            <tr v-for="product in products">
                <td>{{product.name}}</td>
                <td>{{category_name}}</td>
                <td>{{product.cost}}</td>
                <td>{{product.description}}</td>
                <td>{{product.quantity}}</td>
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
        }
    },

    // async mounted(cat_name) {
    //     const res = await fetch(`/products/${cat_name}`, {
    //         headers: {
    //             "Authentication-Token": this.token,
    //         }
    //     })
    //     const data = await res.json().catch((e) => {})
    //     console.log(data)
    //     if (res.ok) {
    //         this.products = data
    //     }
    //     else {
    //         this.error = res.status
    //     }
    // }

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
            this.products = data;
          } else {
            this.error = res.status;
          }
        } catch (error) {
          console.error('Error fetching product data:', error);
        }
    },
}