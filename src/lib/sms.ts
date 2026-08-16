export interface SendSmsParams {
  numbers: string; // Comma-separated phone numbers e.g. "9876543210"
  message: string;
  apiKey?: string;
}

export async function sendFast2SMS({ numbers, message, apiKey }: SendSmsParams) {
  const key = apiKey || process.env.FAST2SMS_API_KEY;

  if (!key) {
    throw new Error("Fast2SMS API Key is missing. Please configure FAST2SMS_API_KEY in settings or environment variables.");
  }

  // Clean phone numbers (remove spaces, +91, non-digits)
  const cleanedNumbers = numbers
    .split(",")
    .map(n => n.replace(/\D/g, "").slice(-10))
    .filter(n => n.length === 10)
    .join(",");

  if (!cleanedNumbers) {
    throw new Error("No valid 10-digit phone number provided.");
  }

  const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
    method: "POST",
    headers: {
      "authorization": key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      route: "q",
      message: message,
      language: "english",
      flash: 0,
      numbers: cleanedNumbers,
    }),
  });

  const data = await response.json();

  if (!response.ok || data.return === false) {
    throw new Error(data.message?.[0] || data.message || "Failed to send SMS via Fast2SMS");
  }

  return data;
}
