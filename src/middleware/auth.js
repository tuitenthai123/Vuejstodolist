export default function authMiddleware(to, from, next) {
    const isAuthenticated = !!localStorage.getItem('token') // hoặc kiểm tra theo cách khác

    if (isAuthenticated && to.path === '/') {
        next('/dashboard/today')
    }

    else if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login')
    } else {
        next()
    }
}