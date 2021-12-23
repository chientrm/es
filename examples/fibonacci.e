n = 🔢("Please enter n:")
a = 1, b = 0, result = 0
for(0, n, _ => (
    result = a + b
    a = b, b = result
))
alert(format("Result: {1}", result))