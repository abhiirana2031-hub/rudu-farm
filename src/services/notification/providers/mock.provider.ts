/**
 * Mock SMS Provider for Local Development and Automated Testing
 * Simulates Fast2SMS responses without consuming real SMS credits or requiring DLT registration.
 */

import { SMSProvider } from './sms-provider.interface';
import { SendSmsRequest, SmsResponse } from '../sms.types';

export class MockSMSProvider implements SMSProvider {
  public name = 'MOCK';

  public async send(req: SendSmsRequest): Promise<SmsResponse> {
    const maskedPhone = req.phone.replace(/(\d{2})\d{4}(\d{4})/, '$1****$2');
    
    // Simulate brief network latency
    await new Promise((resolve) => setTimeout(resolve, 80));

    if (req.metadata?.simulateFailure) {
      console.warn(`[SMS MockProvider] Simulated failure for recipient ${maskedPhone} [Template: ${req.template}]`);
      return {
        success: false,
        status: 'FAILED',
        error: 'Simulated network timeout / provider error',
        errorCode: 'SMS_PROVIDER_ERROR',
      };
    }

    const mockId = `MOCK-F2S-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    console.log(
      `[SMS MockProvider] SMS Simulated to ${maskedPhone} | Template: ${req.template} | Vars: ${JSON.stringify(
        req.variables || []
      )} | Mock ID: ${mockId}`
    );

    return {
      success: true,
      providerMessageId: mockId,
      status: 'SENT',
      message: `Simulated SMS dispatched successfully to ${maskedPhone}`,
    };
  }

  public validateConfiguration(): { valid: boolean; missingFields: string[] } {
    return { valid: true, missingFields: [] };
  }
}
