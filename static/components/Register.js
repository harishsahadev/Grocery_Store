export default {
    template: `
    <div>
    <div class="d-flex justify-content-center" style="margin-top: 15vh">
        <div class="mb-3 p-5 bg-light">
            <div class='text-danger' v-if=error> *{{error}}* </div>

            <div class="mb-3">
                <label for="user-email" class="form-label">Email address:</label>
                <input type="email" class="form-control" id="user-email" aria-describedby="emailHelp" placeholder="name@example.com" v-model="cred.email">
            </div>

            <div class="mb-3">
                <label for="user-username" class="form-label">Enter Username:</label>
                <input class="form-control" id="user-username" v-model="cred.username">
            </div>

            <div class="mb-3">
                <label for="user-password" class="form-label">Enter Password:</label>
                <input type="password" class="form-control" id="user-password" v-model="cred.password">
            </div>

            <div class="mb-3">
                <select class="form-select form-select-sm" v-model="cred.role">
                    <option disabled value="">Choose role</option>
                    <option value="customer">Customer</option>
                    <option value="manager">Manager</option>
                </select>
            </div>

            <div class="mb-3">
                <p><a class="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" href="/#/login">Existing user? Login</a></p>
            </div>

            <div class="d-grid gap-2 col-6 mx-auto">    
                <button type="button" class="btn btn-primary mt-2" @click="register">Submit</button>
            </div>
        </div>
    </div>
    </div>`,

    data() {
        return {
            cred: {
                "email": null,
                "username": null,
                "password": null,
                "role": "",
            },
            error: null,
        }
    },

    methods: {
        async register() {
            // this.cred.role = this.selected
            // console.log(this.cred)
            const res = await fetch('/user-register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.cred),
            })
            const data = await res.json()
            if (res.ok) {
                alert(data.message)
                this.$router.push({path: '/login'})
                // if (data.token) {
                //     localStorage.setItem('auth-token', data.token)
                //     localStorage.setItem('role', data.role)
                //     this.$router.push({path: '/'})
                // }
            }
            else {
                this.error = data.message
            }
        }
    }
}