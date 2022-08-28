const DOMAIN =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PROD_URL
    : process.env.NEXT_DEV_URL;

export default DOMAIN;
