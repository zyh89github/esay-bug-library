var path = require("path");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HappyPack = require('happypack');
// 构造出共享进程池，进程池中包含5个子进程
const happyThreadPool = HappyPack.ThreadPool({ size: 5 });

module.exports = {
	entry: './src/demo/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	module: {
		rules: [{
			test: /\.js$/,
			// 把.js文件交给id为babel-pack的HappyPack实例去处理
			use: ['happypack/loader?id=babel-pack'],
			// 排除node_moudles目录下的文件，node_modules 目录下的文件都是采用的 ES5 语法，没必要再通过 Babel 去转换
			exclude: path.resolve(__dirname, 'node_modules'),
		},{
			test: /\.css$/,
			use: ExtractTextPlugin.extract({
				// 把css文件的处理交给id为css-pack的HappyPack实例去处理
				use: ['happypack/loader?id=css-pack'],
			})
		}]
	},
	plugins: [
		new HappyPack({
			// 采用唯一的id来代表当前的HappyPack是用来处理一类特定的文件
			id: 'babel-pack',
			// 如何处理js文件，和我们的loader中写法是一致的
			loaders: ['babel-loader?cacheDirectory'],
			// 使用共享进程池中的子进程去处理任务
      		threadPool: happyThreadPool,
		}),
		new HappyPack({
			id: 'css-pack',
			loaders: ['css-loader'],
			// 使用共享进程池中的子进程去处理任务
      		threadPool: happyThreadPool,
		}),
		new ExtractTextPlugin({
			filename: `[name].css`
		})
	],
	// 输出 source-map 方便直接调试 ES6 源码
	devtool: 'source-map'
}