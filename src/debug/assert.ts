const assert = (exp: boolean) => {
    if (!exp)
        throw  new Error("ASSERTION ERROR")
}