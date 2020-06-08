const INITIAL_STATE = { bookingDetails : null, loader : false };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'getBookingDetails':
            return {
                bookingDetails: action.payload.data,
                loader: action.payload.success
            };
        default:
            return state;
    }
};
