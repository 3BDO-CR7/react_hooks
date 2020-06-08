const INITIAL_STATE = { citiesCapacity : null, loader : false };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'geCitiesCapacity':
            return {
                citiesCapacity: action.payload.data,
                loader: action.payload.success
            };
        default:
            return state;
    }
};
