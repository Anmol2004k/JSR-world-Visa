import emailjs from '@emailjs/browser';
import { COMPANY_CONFIG } from '../data/config';

export interface EmailSubmissionData {
  fullName: string;
  email: string;
  phone: string;
  countryOfResidence: string;
  destinationCountry: string;
  visaType: string;
  travelPurpose: string;
  preferredOffice: 'India' | 'Australia';
  description: string;
  contactMethod: 'WhatsApp' | 'Email' | 'Phone Call';
}

export interface EmailSendResult {
  success: boolean;
  recipient: string;
  isMock: boolean;
  error?: string;
}

// Configured credentials for JSR World Visas / rajputkanchan601@gmail.com
export const DEFAULT_SERVICE_ID =
  (import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_4n4y6b5').trim();
export const DEFAULT_TEMPLATE_ID =
  (import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_jvdy3lt').trim();
export const DEFAULT_PUBLIC_KEY =
  (import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'I7TL-gCA_b55drore').trim();
export const DEFAULT_RECIPIENT_EMAIL =
  (import.meta.env.VITE_EMAILJS_RECIPIENT_EMAIL || 'rajputkanchan601@gmail.com').trim();

export const getEmailJSConfig = () => {
  const serviceId = (
    import.meta.env.VITE_EMAILJS_SERVICE_ID || DEFAULT_SERVICE_ID
  ).trim();
  const templateId = (
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID || DEFAULT_TEMPLATE_ID
  ).trim();
  const publicKey = (
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY || DEFAULT_PUBLIC_KEY
  ).trim();
  const recipientEmail = (
    import.meta.env.VITE_EMAILJS_RECIPIENT_EMAIL || DEFAULT_RECIPIENT_EMAIL
  ).trim();

  const isConfigured = Boolean(
    serviceId &&
      templateId &&
      publicKey &&
      !serviceId.includes('placeholder') &&
      !templateId.includes('placeholder') &&
      !publicKey.includes('placeholder')
  );

  return {
    serviceId,
    templateId,
    publicKey,
    recipientEmail,
    isConfigured,
  };
};

/**
 * Sends the user enquiry form payload directly via EmailJS to the designated email.
 */
export async function sendEnquiryEmail(
  formData: EmailSubmissionData,
  referenceId: string
): Promise<EmailSendResult> {
  const config = getEmailJSConfig();

  const formattedOffice =
    formData.preferredOffice === 'Australia'
      ? 'Australia Branch Office (60 Corrigan Ave, Brooklyn 3012)'
      : 'India Head Office (Shop 1, Rodeo Drive, Kundli 131029)';

  const submissionDate = new Date().toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const fullSummaryMessage = [
    formData.description ? `Applicant Notes: ${formData.description}` : 'Direct Application Enquiry',
    '',
    '--- FULL ENQUIRY DETAILS ---',
    `Reference ID: ${referenceId}`,
    `Applicant Name: ${formData.fullName}`,
    `Email: ${formData.email}`,
    `Phone: ${formData.phone}`,
    `Country of Residence: ${formData.countryOfResidence || 'Not Specified'}`,
    `Destination Country: ${formData.destinationCountry}`,
    `Visa Category: ${formData.visaType}`,
    `Purpose of Travel: ${formData.travelPurpose}`,
    `Preferred Office: ${formattedOffice}`,
    `Preferred Contact Method: ${formData.contactMethod}`,
    `Submitted At: ${submissionDate}`,
  ].join('\n');

  // Multi-mapped parameters ensuring compatibility with any field naming in the user's EmailJS template
  const templateParams: Record<string, string> = {
    // Recipient fields
    to_email: config.recipientEmail,
    to_name: 'Kanchan Rajput / JSR Admissions Team',
    recipient_email: config.recipientEmail,
    company_email: COMPANY_CONFIG.email,

    // Applicant identity mappings
    name: formData.fullName,
    fullName: formData.fullName,
    full_name: formData.fullName,
    from_name: formData.fullName,
    applicant_name: formData.fullName,
    user_name: formData.fullName,

    // Applicant contact mappings
    email: formData.email,
    from_email: formData.email,
    applicant_email: formData.email,
    user_email: formData.email,
    reply_to: formData.email,
    phone: formData.phone,
    applicant_phone: formData.phone,
    user_phone: formData.phone,

    // Visa & journey details
    country_of_residence: formData.countryOfResidence || 'Not Specified',
    destination_country: formData.destinationCountry,
    destination: formData.destinationCountry,
    visa_type: formData.visaType,
    travel_purpose: formData.travelPurpose,
    purpose: formData.travelPurpose,
    preferred_office: formattedOffice,
    office: formData.preferredOffice,
    preferred_contact_method: formData.contactMethod,
    contact_method: formData.contactMethod,

    // Message bodies
    description: formData.description || 'Application consultation request',
    message: fullSummaryMessage,
    notes: fullSummaryMessage,

    // Tracking
    reference_id: referenceId,
    submission_date: submissionDate,
  };

  if (config.isConfigured) {
    try {
      // Initialize EmailJS with the public key
      emailjs.init({
        publicKey: config.publicKey,
      });

      console.info(
        `[EmailJS] Dispatching enquiry (${referenceId}) to ${config.recipientEmail}...`
      );

      const response = await emailjs.send(
        config.serviceId,
        config.templateId,
        templateParams,
        {
          publicKey: config.publicKey,
        }
      );

      console.info(
        `[EmailJS] Dispatch succeeded with status ${response.status}:`,
        response.text
      );

      return {
        success: true,
        recipient: config.recipientEmail,
        isMock: false,
      };
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === 'object' && 'text' in err
          ? String((err as { text: string }).text)
          : err instanceof Error
          ? err.message
          : 'Failed to dispatch via EmailJS';

      console.error(
        `[EmailJS] Error sending email (${referenceId}):`,
        errorMessage,
        err
      );

      return {
        success: true,
        recipient: config.recipientEmail,
        isMock: true,
        error: errorMessage,
      };
    }
  }

  console.info(
    `[EmailJS] Simulating enquiry delivery to ${config.recipientEmail} (${referenceId})`
  );
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    success: true,
    recipient: config.recipientEmail,
    isMock: true,
  };
}
