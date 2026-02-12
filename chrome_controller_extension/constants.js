export const remoteConstants = {
    DPad: {
        left: "left",
        right: "right",
        up: "up",
        down: "down",
        validate: "validate"
    },
    back: "back",
    volume: {
        up: "volumeUp",
        down: "volumeDown"
    }
}

if (typeof module !== 'undefined') {
    module.exports = remoteConstants;
}