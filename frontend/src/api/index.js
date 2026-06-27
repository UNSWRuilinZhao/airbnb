import request from './request'

export default {
  register (data) {
    return request.post('/user/auth/register', data)
  },
  login (data) {
    return request.post('/user/auth/login', data)
  },
  loginOut (data) {
    return request.post('/user/auth/logout', data)
  },
  listing_new (data) {
    return request.post('/listings/new', data)
  },
  listing_del (id) {
    return request.delete(`/listings/${id}`)
  },
  listing_list (params) {
    return request.get('/listings', {
      params
    })
  },
  listing_detail (listingid) {
    return request.get(`/listings/${listingid}`)
  },
  listing_update (listingid, data) {
    return request.put(`/listings/${listingid}`, data)
  },
  listing_publish (listingid, data) {
    return request.put(`/listings/publish/${listingid}`, data)
  },
  listing_unpublish (listingid) {
    return request.put(`/listings/unpublish/${listingid}`)
  },
  booking_list () {
    return request.get('/bookings')
  },
  booking_now (listingid, data) {
    return request.post(`/bookings/new/${listingid}`, data)
  },
  booking_review (listingid, bookingid, data) {
    return request.put(`/listings/${listingid}/review/${bookingid}`, data)
  }
}
