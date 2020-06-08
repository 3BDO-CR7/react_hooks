const INITIAL_STATE = { search : [], loader : false };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'getSearch':
            return {
                search: action.payload.data,
                loader: action.payload.success
            };
        default:
            return state;
    }
};
