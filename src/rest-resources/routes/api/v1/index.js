import express from 'express'
import commonRoutes from './common.routes'
import adminRoutes from './admin.routes'
import cmsRoutes from './cms.routes'
import userRoutes from './user.routes'
import packageRoutes from './package.routes'
import emailRoutes from './email.routes'
import casinoRoutes from './casino.routes'
import bannerRoutes from './banner.routes'
import popupRoutes from './popup.routes'
import rubyPlayRoutes from './ruby-play.routes'
import galleryRoutes from './image-gallery.routes'
import countryRoutes from './country.router'
import bonusRoutes from './bonus.routes'
import paymentRoutes from './payment.routes'
import postalCodeRoutes from './postal.code.routes'
import reportRoute from './report.route'
import alertRouter from './alert.routes'
import antiFraudRouter from './anti.fraud.routes'
import pageContentRoutes from './page-content.routes'
import vipTierRoutes from './vip-tier-routes.routes'
import hacksawRouter from './hackSaw.routes'
import paymentProviderRoutes from './payment-provider.routes'
import betsoftRouter from './betSoft.route'
import casimbaRouter from './casimba.routes'
import spinWheelRouter from './spin-wheel.routes'
import aleaRouter from './alea.routes'
import productRoutes from './products.route'
import stockRoutes from './stocks.routes'

const v1Router = express.Router()
v1Router.get('/', async (_, res) => {
  try {
    res.json({ message: 'welcome admin backend version 1st api' })
  } catch (error) {
    res.status(503)
    res.send()
  }
})
v1Router.use('/', commonRoutes)
v1Router.use('/admin', adminRoutes)
v1Router.use('/cms', cmsRoutes)
v1Router.use('/user', userRoutes)
v1Router.use('/package', packageRoutes)
v1Router.use('/gallery', galleryRoutes)
v1Router.use('/country', countryRoutes)
v1Router.use('/email', emailRoutes)
v1Router.use('/casino', casinoRoutes)
v1Router.use('/banner', bannerRoutes)
v1Router.use('/popup', popupRoutes)
v1Router.use('/ruby-play', rubyPlayRoutes)
v1Router.use('/bonus', bonusRoutes)
v1Router.use('/payment', paymentRoutes)
v1Router.use('/postal-code', postalCodeRoutes)
v1Router.use('/hacksaw', hacksawRouter)
v1Router.use('/report', reportRoute)
v1Router.use('/alert', alertRouter)
v1Router.use('/anti-fraud', antiFraudRouter)
v1Router.use('/pages', pageContentRoutes)
v1Router.use('/vip-tier', vipTierRoutes)
v1Router.use('/payment-provider', paymentProviderRoutes)
v1Router.use('/betsoft', betsoftRouter)
v1Router.use('/casimba', casimbaRouter)
v1Router.use('/spinWheelConfiguration', spinWheelRouter)
v1Router.use('/alea', aleaRouter)
v1Router.use('/products', productRoutes)
v1Router.use('/stocks', stockRoutes)

export default v1Router
