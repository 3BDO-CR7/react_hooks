const INITIAL_STATE = { favourite : [], loader : false };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'getFavourite':
            return {
                favourite: action.payload.data,
                loader: action.payload.success
            };
        default:
            return state;
    }
};
