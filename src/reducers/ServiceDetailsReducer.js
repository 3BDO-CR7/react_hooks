const INITIAL_STATE = { serviceDetails : null, loader : false };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'getServiceDetails':
            return {
                serviceDetails: action.payload.data,
                loader: action.payload.success
            };
        default:
            return state;
    }
};
