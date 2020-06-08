import { combineReducers } from 'redux';
import lang from './LangReducer';
import about from './AboutReducer';
import intro from './IntroReducer';
import categories from './CategoriesReducer';
import offers from './OffersReducer';
import contactUs from './ContactUsReducer';
import auth from './AuthReducer';
import profile from './ProfileReducer';
import topRate from './TopRateReducer';
import favourite from './FavouriteReducer';
import serviceDetails from './ServiceDetailsReducer';
import notifications from './NotificationsReducer';
import services from './ServicesReducer';
import search from './SearchReducer';
import citiesCapacity from './CitiesCapacityReducer';
import bookings from './BookingsReducer';
import bookingDetails from './BookingDetailsReducer';

export default combineReducers({
    lang,
    about,
    intro,
    categories,
    offers,
    contactUs,
    auth,
    profile,
    topRate,
    favourite,
    serviceDetails,
    notifications,
    services,
    search,
    citiesCapacity,
    bookings,
    bookingDetails,
});
