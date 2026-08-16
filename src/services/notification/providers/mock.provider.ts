import { ISmsProvider, ISmsProviderResult, SmsNotificationPayload } from "../sms.types";

export class MockSmsProvider implements ISmsProvider {
  name = "MOCK";

  async send(payload: SmsNotificationPayload): Promise<ISmsProviderResult> {
    const mockMessageId = `MOCK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    console.log(`[MOCK SMS PROVIDER] Simulated sending ${payload.template} SMS to ${payload.phone}`);
    console.log(`[MOCK SMS PAYLOAD]`, JSON.stringify(payload.variables, null, 2));

    // Simulate 98% success rate in dev mode
    const isSuccess = Math.random() > 0.02;

    if (!isSuccess) {
      return {
        success: false,
        error: "SIMULATED_MOCK_FAILURE: Network timeout simulation in development mode.",
        errorCode: "SIMULATED_MOCK_FAILURE"
      };
    }

    return {
      success: true,
      providerMessageId: mockMessageId,
      rawResponse: { status: "MOCK_SUCCESS", messageId: mockMessageId }
    };
  }
}
