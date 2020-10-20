const path = require("path");

module.exports = {
	entry: "./src/app.js",
	output: {
		path: path.join(__dirname, "public"),
		filename: "bundle.min.js"
	},
	module: {
		rules: [{
			test: /\.js$/i,
			exclude: /node_modules/,
			use: ["babel-loader"]
		},
		{
		test: /\.(png|jpe?g|gif)$/i,
        use: ["file-loader"]
        },
        {
			test: /\.css/i,
			use: ["style-loader", "css-loader"]
		}
		]
	}
};