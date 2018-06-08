var path = require("path");
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

module.exports = {
	entry: './src/demo/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				//如果项目源码中只有js文件就不要写成/\.jsx?$/，提升正则表达式性能
				test: /\.js$/,
				use: ['babel-loader'],
			},
			{
				//增加对css文件的支持
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
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
		// 使用 ParallelUglifyPlugin 并行压缩输出的 JS 代码
		new ParallelUglifyPlugin({
			// 传递给UglifyJS的参数
			uglifyJS: {
				output: {
					// 最紧凑的输出
					beautify: false,
					// 删除所有注释
					comments: false,
				},
				compress: {
					// 在UglifyJS删除没有用到的代码时不输出警告
					warnings: false,
					// 删除所有的console语句，可以兼容ie浏览器
					drop_console: true,
					// 内嵌定义了但是只用到一次的变量
					collapse_vars: true,
					// 提取出现多次但是没有定义成变量去引用的静态值
					reduce_vars: true
				}
			},
			// 开启缓存压缩
			cacheDir: './dist/cacheDir'
		})
	],
	// 输出 source-map 方便直接调试 ES6 源码
	devtool: 'source-map'
}