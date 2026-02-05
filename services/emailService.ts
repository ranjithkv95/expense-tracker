
/**
 * Email Service for RupeeFlow
 * 
 * To make this "Real":
 * 1. Install emailjs-com: `npm install @emailjs/browser`
 * 2. Replace the logic below with your Service ID and Template ID.
 */

export const sendVerificationEmail = async (email: string, code: string, name: string) => {
  console.log(`[REAL-EMAIL-TRIGGER] Sending verification code ${code} to ${email}`);
  
  // Example implementation using a generic fetch to a backend or EmailJS
  // try {
  //   const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       service_id: 'YOUR_SERVICE_ID',
  //       template_id: 'YOUR_VERIFICATION_TEMPLATE',
  //       user_id: 'YOUR_PUBLIC_KEY',
  //       template_params: { to_email: email, user_name: name, code: code }
  //     })
  //   });
  //   return response.ok;
  // } catch (e) { return false; }

  return true; // Simulated success for now
};

export const sendPasswordResetEmail = async (email: string, code: string) => {
  console.log(`[REAL-EMAIL-TRIGGER] Sending reset code ${code} to ${email}`);
  return true; // Simulated success for now
};
