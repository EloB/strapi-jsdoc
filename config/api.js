module.exports = /** @satisfies {Strapi.ConfigApi} */ ({
  rest: {
    defaultLimit: 25,
    maxLimit: 100,
    withCount: true,
  }
});
