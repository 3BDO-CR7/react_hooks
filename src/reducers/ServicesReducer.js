const INITIAL_STATE = { services : [], loader : false };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'getServices':
            return {
                services: action.payload.data,
                loader: action.payload.success
            };
        default:
            return state;
    }
};
