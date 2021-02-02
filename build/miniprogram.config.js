/**
 * 配置参考：https://wechat-miniprogram.github.io/kbone/docs/config/
 */
const path = require('path')

module.exports = {
    origin: 'https://test.miniprogram.com',
    entry: '/',
    router: {
        home: [
            '/home',
        ],
        history: [
            '/history'
        ],
        container: [
            '/container'
        ]
    },
    redirect: {
        notFound: 'home',
        accessDenied: 'home',
    },
    generate: {
        autoBuildNpm: 'npm',
		projectConfig: path.join(__dirname, '../dist/mp'),
    },
    app: {
        backgroundTextStyle: 'dark',
        navigationBarTextStyle: 'white',
        navigationBarTitleText: 'kbone',
    },
	appExtraConfig: {
        sitemapLocation: 'sitemap.json',
	},
    global: {
        share: true,
        windowScroll: false,
        backgroundColor: '#F7F7F7',
    },
    pages: {
        history: {
            extra: {
                navigationBarTitleText: '每日分享'
            },
            reachBottom: true
        },
        home: {
            extra: {
                navigationBarTitleText: '每日分享'
            }
        },
        container: {
            extra: {
                navigationBarTitleText: '每日分享'
            },
        }
    },
    optimization: {
		domSubTreeLevel: 10,

		elementMultiplexing: true,
		textMultiplexing: true,
		commentMultiplexing: true,
		domExtendMultiplexing: true,

		styleValueReduce: 5000,
		attrValueReduce: 5000,
	},
    projectConfig: {
        miniprogramRoot: 'miniprogram/',
        cloudfunctionRoot: 'cloudfunctions',
        projectname: '每日分享',
        appid: 'wxc92f2c07b118a71f',
    },
}
