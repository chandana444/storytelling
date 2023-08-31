const form = document.querySelector('form');
const storyContainer = document.getElementById('story-container');
const storyText = document.getElementById('story-text');
const audio = document.getElementById('audio');
const apiEndpoint = 'https://api.openai.com/v1/engines/davinci-codex/completions';

form.addEventListener('submit', async (event) => {
	event.preventDefault();

	// Get form data
	const formData = new FormData(form);
	const mood = formData.get('mood');
	const genre = formData.get('genre');
	const importantThings = formData.get('important-things');

	// Construct the prompt for GPT-3
	const prompt = `Write a ${genre} story that is ${mood}. The story should include ${importantThings}.`;

	try {
		// Call the GPT-3 API to generate the story
		const response = await fetch(apiEndpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': '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'
			},
			body: JSON.stringify({
				prompt: prompt,
				max_tokens: 1024,
				n: 1,
				stop: ['\n\n']
			})
		});
		const data = await response.json();
		const story = data.choices[0].text;

		// Display the story in the story container
		storyContainer.style.display = 'block';
		storyText.innerHTML = story;

		// Generate audio for the story
		const audioResponse = await fetch(apiEndpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer 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'
			},
			body: JSON.stringify({
				prompt: story,
				model: 'text-to-speech/davinci-codex',
				max_tokens: 1024,
				n: 1,
				stop: ['\n']
			})
		});
		const audioData = await audioResponse.json();
		const audioUrl = audioData.choices[0].audio;

		// Display the audio player
		audio.style.display = 'block';
		audio.src = audioUrl;

	} catch (error) {
		console.error(error);
		alert('Oops! Something went wrong. Please try again later.');
	}
});
