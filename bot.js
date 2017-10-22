const TelegramBot = require('node-telegram-bot-api'),
	mjAPI = require('mathjax-node'),
	svg2png = require('svg2png')

const token = 'YOUR-BOT-TOKEN',
	scale = 30,
	minWidth = 400

mjAPI.start()

const bot = new TelegramBot(token, {polling: true})

const sendError = (chatId, errStr, reply) => {
	var options = {}

	if(reply) {
		options['reply_to_message_id'] = reply
	}

	bot.sendMessage(chatId, 'Uh-oh! I couldn\'t render your formula! ' + 
		errStr, options)
}

bot.onText(/\/start/, (msg, match) => {
	bot.sendMessage(msg.chat.id, 'Hello! Send me your equations, ' +
		'I\'ll typeset them for you')
})

bot.onText(/\/help/, (msg, match) => {
	bot.sendMessage(msg.chat.id, 'Just send me the equation, I\'ll do the rest')
})

bot.on('message', msg => {
	if(msg.entities) {
		// Ignore non text messages, including bot commands
		return
	}

	const chatId = msg.chat.id,
		msgId =  msg.message_id

	mjAPI.typeset({
		math: msg.text,
		format: "TeX",
		svg: true,
	}, data => {
		if (data.errors) {
			sendError(chatId, data.errors.join('\n'), msgId)
			return
		}

		var width = (data.width.substring(0, data.width.length - 2)) * scale
		if(width < minWidth) {
			width = minWidth
		}

		svg2png(data.svg, {width}).then(png => {
			bot.sendPhoto(chatId, png, {reply_to_message_id: msgId})
		}).catch(e => {
			sendError(chatId, e, msgId)
		})
	})

})
