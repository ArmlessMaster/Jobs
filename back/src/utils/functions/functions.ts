function generateRandomString(length: number) {
    const abc: string =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let name: string = '';
    while (name.length < length) {
        name += abc[Math.floor(Math.random() * abc.length)];
    }
    return name;
}

export { generateRandomString };
