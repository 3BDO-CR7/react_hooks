const INITIAL_STATE = { offers : [], loader : false };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'getOffers':
            return {
                offers: action.payload.data,
                loader: action.payload.success
            };
        default:
            return state;
    }
};
