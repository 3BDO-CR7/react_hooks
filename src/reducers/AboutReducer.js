const INITIAL_STATE = { about : '', loader : false };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'getAbout':
            return {
                about: action.payload.data,
                loader: action.payload.success
            };
        default:
            return state;
    }
};
