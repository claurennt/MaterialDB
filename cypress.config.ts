import { defineConfig } from "cypress";

export default defineConfig({
  chromeWebSecurity: false,

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
