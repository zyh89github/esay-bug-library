/*
* @Author: mjgao@isscloud.com
* @Date:   2018-06-05 18:45:31
* @Last Modified by:   mjgao@isscloud.com
* @Last Modified time: 2018-06-06 17:17:45
*/
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');
const webpack = require('webpack');
var path = require("path");

module.exports = {
	entry: './src/demo/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'js/[name]_[hash:8].js'
	},
	module: {
		rules: [
			{
				//如果项目源码中只有js文件就不要写成/\.jsx?$/，提升正则表达式性能
				test: /\.js$/,
				//babel-loader支持缓存转换出的结果，通过cacheDirectory选项开启
				use: ['babel-loader'],
			},
			{
				//增加对SCSS文件的支持
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					//如果需要，可以在 sass-loader 之前将 resolve-url-loader 链接进来
					use: ['css-loader', 'sass-loader'],
					/*
					* 复写css文件中资源路径
					* webpack3.x配置在extract-text-webpack-plugin插件中
					* 因为css文件中的外链是相对与css的，
					* 我们抽离的css文件在可能会单独放在css文件夹内
					* 引用其他如img/a.png会寻址错误
					* 这种情况下所以单独需要配置../../，复写其中资源的路径
					*/
					publicPath: '../'
				})
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [{
					loader: 'url-loader',
					options: {
						//50kb以下的文件采用url-loader
						limit: 1024 * 50,
						// 否则采用file-loader，默认值是file-loader
						fallback: 'file-loader',
						name: 'img/[name]_[hash:8].[ext]'
					}
				}]
			},
			{
			    test: /\.(woff|woff2|eot|ttf|otf)$/,
			    use: [
			    	'file-loader'
			    ]
			}
		]
	},
	plugins: [
		// 将根目录下的index.html文件拷贝到{output}配置的dist目录下
		new CopyWebpackPlugin([
			{ from: 'index.html', to: 'index.html' }
		]),
		// 每次打包前清除一下dist目录
		new CleanWebpackPlugin(
			['dist/css', 'dist/js/', 'dist/img/', 'dist/index.html'],　 //匹配删除的目录及文件
			{
			    root: __dirname,       　　　　　　　　　　//根目录
			    verbose:  true,        　　　　　　　　　　//开启在控制台输出信息
			    dry:      false        　　　　　　　　　　//启用删除文件
			}
		),
		// 提取css到单独的文件
		new ExtractTextPlugin({
			filename: 'css/main_[contenthash:8].css'
		}),
		// 提取公共模块文件
		new webpack.optimize.CommonsChunkPlugin({
		    name: 'vendor',
		    minChunks: function (module) {
		        return module.context && module.context.indexOf('node_modules') !== -1;
		    }
		}),
		//为了避免vendor.*.js的hash值发生改变需要输出一个manifest.*.js文件
		new webpack.optimize.CommonsChunkPlugin({
			//But since there are no more common modules between them we end up with just the runtime code included in the manifest file
		    name: 'manifest' 
		}),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'index.html'
		}),
		// 告诉 Webpack 使用了哪些动态链接库
		new DllReferencePlugin({
			// 描述 react 动态链接库的文件内容
			manifest: require('./dist/react.manifest.json'),
		}),
		new DllReferencePlugin({
			// 描述 polyfill 动态链接库的文件内容
			manifest: require('./dist/polyfill.manifest.json'),
		}),
	],
	// 输出 source-map 方便直接调试 ES6 源码
	devtool: 'source-map'
}