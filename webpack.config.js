const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/main.tsx",
  devtool: false,
  module: {
    rules: [
      //* ------- TypeScript Loader ------- */
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      //* ------- Babel Loader ------- */
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            targets: "defaults",
            presets: ["@babel/preset-env"],
          },
        },
      },

      //* ------- File Loader ------- */
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },

      // * ------- Image Loader ------- */
      {
        test: /\.html$/i,
        loader: "html-loader",
      },

      //* ------- Image Asset Loader ------- */
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
      },
    ],
  },

  //* ------- Plugins ------- */
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
  ],
};
