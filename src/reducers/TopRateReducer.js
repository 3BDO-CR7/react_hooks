const INITIAL_STATE = { topRate : [], loader : false };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'getTopRate':
            return {
                topRate: action.payload.data,
                loader: action.payload.success
            };
        default:
            return state;
    }
};
