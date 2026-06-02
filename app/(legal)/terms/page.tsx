import { legal } from "@/config/legal";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-16 px-4">
      <div className="mx-auto max-w-3xl prose prose-zinc dark:prose-invert">
        <h1>Terms of Service</h1>
        <p className="text-sm text-zinc-500">Effective date: {legal.effectiveDate}</p>

        <h2>Acceptance of Terms</h2>
        <p>
          By accessing or using {legal.appName} (the "Service"), you agree to be bound by
          these Terms of Service. If you do not agree, do not use the Service.
        </p>

        <h2>Description of Service</h2>
        <p>
          {legal.appName} is a nutrition tracking application that allows users to log meals,
          track macronutrients, monitor weight, and manage dietary goals. The Service is
          provided for informational and personal use only and is not a substitute for
          professional medical advice.
        </p>

        <h2>User Accounts</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account credentials
          and for all activities that occur under your account. You must provide accurate,
          current, and complete information during registration.
        </p>

        <h2>Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Service for any unlawful purpose</li>
          <li>Attempt to gain unauthorized access to the Service or its systems</li>
          <li>Interfere with or disrupt the integrity or performance of the Service</li>
          <li>Upload or transmit viruses, malware, or malicious code</li>
          <li>Use the Service to harass, abuse, or harm others</li>
        </ul>

        <h2>Intellectual Property</h2>
        <p>
          The Service, including its code, design, logos, and content, is owned by
          {legal.companyName} and is protected by copyright and other intellectual
          property laws. You may not reproduce, distribute, or create derivative works
          without our prior written consent.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          {legal.companyName} shall not be liable for any indirect, incidental, special,
          consequential, or punitive damages arising out of your use of or inability to
          use the Service. The Service is provided "as is" without warranties of any kind.
        </p>

        <h2>Termination</h2>
        <p>
          We reserve the right to suspend or terminate your account at any time for
          violation of these terms or for any other reason at our sole discretion. Upon
          termination, your right to use the Service will immediately cease.
        </p>

        <h2>Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of
          the jurisdiction in which {legal.companyName} operates. Any disputes shall be
          resolved in the competent courts of that jurisdiction.
        </p>

        <h2>Contact</h2>
        <p>
          For questions about these Terms, contact us at{" "}
          <a href={`mailto:${legal.email}`} className="text-blue-600 underline">{legal.email}</a>.
        </p>
      </div>
    </div>
  );
}
