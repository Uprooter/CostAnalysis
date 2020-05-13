const path = require('path');
const webpack = require('webpack');

module.exports = {
   entry: [
      'react-hot-loader/patch',
      './src/main/tsx/App.tsx'
   ],
   output: {
      path: path.resolve(__dirname, 'src/main/resources/static/built'),
      filename: 'bundle.js',
   },
   mode: 'development',
   resolve: {
      // Add '.ts' and '.tsx' as resolvable extensions.
      extensions: [".ts", ".tsx", ".js", ".json"]
   },
   module: {
      rules: [
         {
            test: path.join(__dirname, '.'),
            exclude: /(node_modules)/,
            use: [{
               loader: 'babel-loader',
               options: {
                  presets: ["@babel/preset-env", "@babel/preset-react"],
                  plugins: ["react-hot-loader/babel"]
               }
            }]
         },
         {
            test: /\.tsx?$/,
            loader: "awesome-typescript-loader"
         }
      ]
   },
   plugins: [
      new webpack.HotModuleReplacementPlugin()
   ],
   devServer: {
      inline: true,
      hot: true,
      contentBase: './src/main/resources/static/built',
      proxy: [{
         context: ['/api/**', '/api/detailedCostClusters/**'],
         target: 'http:localhost:8080',
         changeOrigin: true
      }]
   }
};
