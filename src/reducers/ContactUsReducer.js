const INITIAL_STATE = { contactUs : {}, loader : false };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'getContactUs':
            return {
                contactUs: action.payload.data,
                loader: action.payload.success
            };
        default:
            return state;
    }
};
