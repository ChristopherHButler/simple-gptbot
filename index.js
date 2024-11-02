import readlineSync from 'readline-sync';
import colors from 'colors';

import openai from './config/open-ai.js';




async function main() {

	console.log(colors.bold.green('Welcome to the gpt chatbot!'));
	console.log(colors.bold.green(`When you're ready, start chatting with the bot. Type "exit" to end the conversation`));

	const chatHistory = [];

	while (true) {
		const userInput = readlineSync.question('You: '.yellow);

		try {
			// break out of the loop and end the program
			if (userInput.toLowerCase() === 'exit') {
				console.log(colors.green('Bot: '), 'Goodbye!');
				return;
			}

			// coonstruct messages by iterating over the history
			const messages = chatHistory.map(([role, content]) => ({ role, content }));

			// add latest user input
			messages.push({ role: 'user', content: userInput });

			// call the api with user input
			const chatCompletion = await openai.chat.completions.create({
				model: 'gpt-3.5-turbo',
				messages: messages,
			});

			const completionText = chatCompletion.choices[0].message.content;

			console.log(colors.green('Bot: ') + completionText);

			// update history with user input and bot response
			chatHistory.push(['user', userInput]);
			chatHistory.push(['assistant', completionText]);

		} catch (error) {
			console.error(colors.red('An error occurred: ', error));
		}
	}

}

main();
