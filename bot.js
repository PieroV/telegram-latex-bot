const TelegramBot = require('node-telegram-bot-api'),
	mjAPI = require('mathjax-node'),
	svg2png = require('svg2png')

const token = 'YOUR-BOT-TOKEN'
const minWidth = 500

mjAPI.start()

const bot = new TelegramBot(token, {polling: true})

const sendError = (chatId, errStr) => {
	bot.sendMessage(chatId, 'Uh-oh! I couldn\'t render your formula! ' + errStr)
}

bot.on('message', msg => {
	const chatId = msg.chat.id

	mjAPI.typeset({
		math: msg.text,
		format: "TeX",
		svg: true,
	}, data => {
		if (data.errors) {
			sendError(chatId, data.errors.join('\n'))
			return
		}

		var width = data.width.substring(0, data.width.length - 2)
		if(width < minWidth) {
			width = minWidth
		}

		svg2png(data.svg, {width}).then(png => {
			bot.sendPhoto(chatId, png)
		}).catch(e => {
			sendError(chatId, e)
		})
	})

})
