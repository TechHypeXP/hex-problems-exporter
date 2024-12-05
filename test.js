// This file has intentional errors
function test() {
    const x = 1
    return x.nonexistentMethod()  // This will create a problem
    console.log("Unreachable code")
