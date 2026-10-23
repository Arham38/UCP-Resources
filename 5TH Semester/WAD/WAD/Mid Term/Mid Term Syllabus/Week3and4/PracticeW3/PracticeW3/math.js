// Define addition and subtraction functions
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

// Export the functions so we can use them in another file
module.exports = {
    add,
    subtract,
};
