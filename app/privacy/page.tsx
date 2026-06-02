import { legal } from "@/config/legal";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-16 px-4">
      <div className="mx-auto max-w-3xl prose prose-zinc dark:prose-invert">
        <h1>Privacy Policy</h1>
        <p className="text-sm text-zinc-500">Effective date: {legal.effectiveDate}</p>

        <h2>Introduction</h2>
        <p>
          {legal.companyName} ("we," "our," or "us") is committed to protecting your privacy.
          This Privacy Policy explains how we collect, use, disclose, and safeguard your
          information when you use our application and website (the "Service").
        </p>

        <h2>Information We Collect</h2>
        <p>We may collect the following types of information:</p>
        <ul>
          <li><strong>Personal Data:</strong> Name, email address, and account credentials when you register.</li>
          <li><strong>Health Data:</strong> Nutritional information, weight, height, dietary preferences, and meal logs that you voluntarily provide.</li>
          <li><strong>Usage Data:</strong> Information about how you interact with the Service, including pages visited and features used.</li>
          <li><strong>Device Data:</strong> IP address, browser type, and operating system for analytics and security purposes.</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <p>We use the collected information to:</p>
        <ul>
          <li>Provide, maintain, and improve the Service</li>
          <li>Personalize your experience and deliver relevant content</li>
          <li>Send administrative information, such as updates and security alerts</li>
          <li>Respond to your comments, questions, and support requests</li>
          <li>Analyze usage patterns to enhance our features</li>
        </ul>

        <h2>Data Sharing and Disclosure</h2>
        <p>
          We do not sell your personal information. We may share your data with trusted
          third-party service providers who assist in operating the Service, subject to
          confidentiality agreements. We may also disclose information if required by law
          or to protect our rights.
        </p>

        <h2>Cookies and Tracking</h2>
        <p>
          We use essential cookies for authentication and service functionality. We may also
          use analytics cookies to understand how the Service is used. You can control cookie
          preferences through your browser settings.
        </p>

        <h2>Data Security</h2>
        <p>
          We implement reasonable security measures to protect your information. However,
          no method of transmission over the Internet is completely secure, and we cannot
          guarantee absolute security.
        </p>

        <h2>Your Rights</h2>
        <p>Depending on your jurisdiction, you may have the right to:</p>
        <ul>
          <li>Access, update, or delete your personal data</li>
          <li>Object to or restrict processing of your data</li>
          <li>Data portability</li>
          <li>Withdraw consent at any time</li>
        </ul>
        <p>
          To exercise these rights, contact us at {legal.email}.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any
          changes by posting the new policy on this page and updating the effective date.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us at{" "}
          <a href={`mailto:${legal.email}`} className="text-blue-600 underline">{legal.email}</a>.
        </p>
      </div>
    </div>
  );
}
