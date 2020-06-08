const INITIAL_STATE = { categories : [], loader : false };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'getCategories':
            return {
                categories: action.payload.data,
                loader: action.payload.success
            };
        default:
            return state;
    }
};
