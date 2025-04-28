/**
 * Represents a phone number.
 */
export type PhoneNumber = string;

/**
 * Asynchronously sends an SMS message to the specified phone number.
 *
 * @param phoneNumber The recipient's phone number.
 * @param message The text message to send.
 * @returns A promise that resolves when the message is sent successfully.
 */
export async function sendSms(phoneNumber: PhoneNumber, message: string): Promise<void> {
  // TODO: Implement this by calling the Twilio API.
  console.log(`Sending SMS to ${phoneNumber}: ${message}`);
  return Promise.resolve();
}
