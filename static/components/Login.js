export default {
    template: `
    <div>
        <div class="d-flex justify-content-center" style="margin-top: 15vh">
            
            <div class="mb-3 p-5 bg-light">
                <h3 class="d-grid gap-2 col-6 mx-auto mb-3"> Login </h3>

                <div class='alert alert-danger' v-if=error> {{error}} </div>

                <div class="mb-3">
                <label for="user-email" class="form-label">Email address</label>
                <input type="email" class="form-control" id="user-email" aria-describedby="emailHelp" placeholder="name@example.com" v-model="cred.email">
                </div>

                <div class="mb-3">
                <label for="user-password" class="form-label">Password</label>
                <input type="password" class="form-control" id="user-password" v-model="cred.password">
                </div>

                <div class="mb-3">
                    <p><a class="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" href="/#/register">New user? Register</a></p>
                </div>

                <div class="d-grid gap-2 col-6 mx-auto">
                    <button type="button" class="btn btn-primary mt-2" @click="login">Submit</button>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            cred: {
                "email": null,
                "password": null,
            },
            error: null,
        }
    },
    methods: {
        async login() {
            const res = await fetch('/user-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.cred),
            })
            const data = await res.json()
            if (res.ok) {
                if (data.token) {
                    localStorage.setItem('auth-token', data.token)
                    localStorage.setItem('role', data.role)
                    // this.$router.push({path: '/', query: {role: data.role}})
                    this.$router.push({path: '/'})
                }
            }
            else {
                this.error = data.message
            }
        }
    }
}