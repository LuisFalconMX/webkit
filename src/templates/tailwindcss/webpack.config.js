const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const config = {}

config.entry = './src/index.js'

config.output = {
  path: path.resolve(__dirname, 'dist'),
  filename: '[name].[contenthash].js',
  assetModuleFilename: 'assets/images/[hash][ext]'
}

config.resolve = {
  extensions: ['.js', '.jsx'],
  alias: {
    '@styles': path.resolve(__dirname, 'src/styles/'),
    '@images': path.resolve(__dirname, 'src/assets/images/'),
    '@fonts': path.resolve(__dirname, 'src/assets/fonts/')
  }
}

config.module = {
  rules: [
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    },
    {
      test: /\.html$/,
      use: {
        loader: 'html-loader'
      }
    },
    {
      test: /\.(woff|woff2)$/,
      type: 'asset/resource',
      generator: {
        filename: 'assets/fonts/[name].[contenthash].[ext]'
      }
    }
  ]
}

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.mode = 'development'

    config.devServer = {
      port: 2303,
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      historyApiFallback: true
    }

    config.module.rules.push({
      test: /\.(css|pcss|sss)$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1
          }
        },
        'postcss-loader'
      ]
    })

    config.module.rules.push({
      test: /\.(jpe?g|png|webp)$/i,
      use: [
        {
          loader: 'responsive-loader',
          options: {
            adapter: require('responsive-loader/sharp'),
            disable: true
          }
        },
        'webp-loader'
      ]
    })

    config.plugins = [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html',
        inject: true
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css'
      }),
      new CleanWebpackPlugin(),
      new Dotenv(),
      new BundleAnalyzerPlugin({
        openAnalyzer: false,
        analyzerMode: 'json'
      })
    ]
  }

  if (argv.mode === 'production') {
    config.mode = 'production'

    config.optimization = {
      minimize: true,
      minimizer: [new TerserWebpackPlugin()]
    }

    config.module.rules.push({
      test: /\.(css|pcss|sss)$/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1
          }
        },
        'postcss-loader'
      ]
    })

    config.module.rules.push({
      test: /\.(jpe?g|png|webp)$/i,
      use: [
        {
          loader: 'responsive-loader',
          options: {
            adapter: require('responsive-loader/sharp')
          }
        },
        'webp-loader'
      ]
    })

    config.plugins = [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html',
        inject: true
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css'
      }),
      new CleanWebpackPlugin(),
      new Dotenv()
    ]
  }

  return config
}
