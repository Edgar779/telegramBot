
const { Telegraf } = require('telegraf')
const { message } = require('telegraf/filters')

/** only for development */
const bot = new Telegraf('6395847207:AAHM5YkiJreWQz3Iq7qXE-E9Y52RgtQZPkQ')

class ProcessServices {

    startBot = async (req, res) => {
        const users = {};

        // Function to send the next question with a 3-second delay
        function sendNextQuestion(ctx, user, question) {
            setTimeout(() => {
                ctx.reply(question);
            }, 3000);
        }
        
        // Command handler for /start
        bot.command('start', ctx => {
            const userId = ctx.from.id;
            users[userId] = { currentQuestion: 0 };
            ctx.reply('Привет! Как тебя зовут?');
        });
        
        // Handler for text-based questions
        bot.on('text', ctx => {
            const userId = ctx.from.id;
            const user = users[userId];
        
            if (!user) {
                ctx.reply('Пожалуйста, введите команду /start, чтобы начать.');
                return;
            }
        
            const userAnswer = ctx.message.text;
        
            switch (user.currentQuestion) {
                case 0:
                    if (!userAnswer || userAnswer.trim() === '') {
                        ctx.reply('Пожалуйста, введите ваше имя.');
                        return;
                    }
                    user.name = userAnswer;
                    user.currentQuestion++;
                    sendNextQuestion(ctx, user, `Вопрос ${user.currentQuestion}: Какая ваша фамилия?`);
                    break;
                case 1:
                    if (!userAnswer || userAnswer.trim() === '') {
                        ctx.reply('Пожалуйста, введите вашу фамилию.');
                        return;
                    }
                    user.surname = userAnswer;
                    user.currentQuestion++;
                    sendNextQuestion(ctx, user, `Вопрос ${user.currentQuestion}: Какое ваше отчество?`);
                    break;
                // Add more cases for text-based questions here
                default:
                    ctx.reply('Вы уже завершили задание.');
                    break;
            }
        });
        
        // Handler for image-based question
        bot.on('photo', ctx => {
            const userId = ctx.from.id;
            const user = users[userId];
        
            if (!user) {
                ctx.reply('Пожалуйста, введите команду /start, чтобы начать.');
                return;
            }
        
            const photoId = ctx.message.photo[0].file_id;
        
            if (user.currentQuestion === 2) { // Adjusted currentQuestion based on previous cases
                user.photo = photoId;
                user.currentQuestion++;
                ctx.reply(`Пожалуйста, выберите один из вариантов:`, {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: 'Вариант 1', callback_data: 'variant1' }],
                            [{ text: 'Вариант 2', callback_data: 'variant2' }],
                        ]
                    }
                });
            }
        });
        
        // Callback query handler for inline button options
        bot.on('callback_query', ctx => {
            const userId = ctx.from.id;
            const user = users[userId];
        
            if (user && user.currentQuestion === 3) { // Adjusted currentQuestion based on previous cases
                const option = ctx.callbackQuery.data;
                // Process the chosen option accordingly
                ctx.reply(`Вы выбрали: ${option}`);
                user.currentQuestion++;
                ctx.reply('Поздравляем! Вы успешно завершили задание.');
            }
        });
        
        bot.launch();
        
        // Enable graceful stop
        process.once('SIGINT', () => bot.stop('SIGINT'));
        process.once('SIGTERM', () => bot.stop('SIGTERM'));
        return 'go to the telegram search test1092837465525_bot then write /start and enjoy'
    }
}
export default new ProcessServices();