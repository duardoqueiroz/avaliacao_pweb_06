import '../css/app.css'
import Alpine from 'alpinejs'
import IMask from 'imask'
import dashboard from './dashboard'
import mask from '@alpinejs/mask'
import alert from './alert'
Alpine.plugin(mask)
Alpine.data('dashboard', dashboard)
Alpine.data('alert', alert)
window.Alpine = Alpine
window.IMask = IMask
Alpine.start()
