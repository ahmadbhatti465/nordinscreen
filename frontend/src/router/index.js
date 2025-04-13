import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    //mode: 'history',
    routes: [{
            path: '/',
            name: 'landing-page',
            component: require('../components/LandingPage').default,
        },
        {
            path: '/register',
            name: 'register-page',
            component: require('../components/RegisterPage').default,
        },
        {
            path: '/verify-email/:email/:code?',
            name: 'verify-email-page',
            component: require('../components/VerifyEmailPage').default,
            props: true
        },
        {
            path: '/forgot-password',
            name: 'forgot-password-page',
            component: require('../components/ForgotPasswordPage').default,
        },
        {
            path: '/reset-password/:email/:code?',
            name: 'reset-password-page',
            component: require('../components/resetPasswordPage').default,
            props: true
        },
        {
            path: '/user/dashboard/:userId?',
            name: 'user-dashboard-page',
            component: require('../components/users/dashboardPage').default,
            props: true
        },
        {
            path: '/user/devices/:userId?',
            name: 'devices-page',
            component: require('../components/users/devicesPage').default,
            props: true
        },
        {
            path: '/user/template/:userId?',
            name: 'template-page',
            component: require('../components/users/templatePage').default,
            props: true
        },
        {
            path: '/user/energy/:userId?',
            name: 'energy-page',
            component: require('../components/users/energyPage').default,
            props: true
        },
        {
            path: '/user/schedule/:userId?',
            name: 'schedule-page',
            component: require('../components/users/schedulePage').default,
            props: true
        },
        {
            path: '/user/logs/:userId?',
            name: 'logs-page',
            component: require('../components/users/logsPage').default,
            props: true
        },
        {
            path: '/user/widgets/:userId?',
            name: 'widgets-page',
            component: require('../components/users/widgetsPage').default,
            props: true
        },
        {
            path: '/user/settings/:userId?',
            name: 'settings-page',
            component: require('../components/users/settingsPage').default,
            props: true
        },
        {
            path: '/user/user/:userId?',
            name: 'user-page',
            component: require('../components/users/userPage').default,
            props: true
        },/* 

        {
            path: '/admin/dashboard/:userId?',
            name: 'admin-dashboard-page',
            component: require('../components/admin/dashboardPage').default,
            props: true
        },
        {
            path: '/admin/devices/:userId?',
            name: 'admin-devices-page',
            component: require('../components/admin/devicesPage').default,
            props: true
        }, */

        /* {
            path: '*',
            redirect: '/'
        } */
    ]
})