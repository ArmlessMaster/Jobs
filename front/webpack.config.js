module.exports = {
    // ваша конфигурация webpack
    
    resolve: {
      fallback: {
        "querystring": require.resolve("querystring-es3"),
        "url": require.resolve("url"),
        "util": require.resolve("util")
      }
    }
  };
  