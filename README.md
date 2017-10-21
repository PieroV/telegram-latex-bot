# telegram-latex-bot
A bot for Telegram that renders LaTeX equations.

You can see it running by chatting to [@EquationLaTeXBot](https://t.me/EquationLaTeXBot) or you can run your own bot.

My own code is donted to the Public Domain, however the dependencies have their own licenses.

In particular this bot uses the node version of MathJax, the Telegram API implementation by @yagop and svg2png by @domenic.

## A note on the PNG conversion
MathJax would have its own PNG exporter, however I didn't like it, so used svg2png to write my own, to provide a minimum width instead of a fixed scaling, and to have directly the PNG stream, instead of having it base64 encoded.
