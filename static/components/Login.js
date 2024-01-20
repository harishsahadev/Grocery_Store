export default {
    template: `
    <div class="d-flex justify-content-center" style="margin-top: 25vh">
        <div class="mb-3 p-5 bg-light">
            <label for="user-email" class="form-label">Email address</label>
            <input type="email" class="form-control" id="user-email" aria-describedby="emailHelp" placeholder="name@example.com"
            v-model="cred.email">
            <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>

            <label for="user-password" class="form-label">Password</label>
            <input type="password" class="form-control" id="user-password" v-model="cred.password">

            <button type="submit" class="btn btn-primary mt-2" @click="login">Submit</button>
            </div>
    </div>
    `,
    data() {
        return {
            cred: {
                "email": null,
                "password": null,
            },
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
            if (res.ok) {
                const data = await res.json()
                if (data.token) {
                    localStorage.setItem('auth-token', data.token)
                    this.$router.push({path: '/', query: {role: data.role}})
                }
            }
        }
    }
}