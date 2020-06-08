const INITIAL_STATE = { bookings : [], loader : false };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'getBookings':
            return {
                bookings: action.payload.data,
                loader: action.payload.success
            };
        default:
            return state;
    }
};
