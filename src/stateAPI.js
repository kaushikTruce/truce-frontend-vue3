export function setStateProperty(component, property, value) {
    component.$store.commit('setStateProperty', {
        property: property,
        value: value
    });
}

export function addToStateList(component, property, value) {
    component.$store.commit('addToStateList', {
        property: property,
        value: value
    });
}

export function getStateProperty(component, property) {
    if (property in component.$store.state)
        return component.$store.state[property];
    return null;
}

export function clearBrokerList(component) {
    component.$store.commit('clearBrokerList');
}

export function clearShipperList(component) {
    component.$store.commit('clearShipperList');
}

export function clearLaneList(component) {
    component.$store.commit('clearLaneList');
}

export function subscribeMutation(component, func) {
    const unsubscribe = component.$store.subscribe((mutation, state) => {
        func(mutation, state);
    });
    return unsubscribe;
}
