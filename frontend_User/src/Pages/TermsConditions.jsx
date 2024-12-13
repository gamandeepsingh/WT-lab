import React from 'react';
import { ScrollRestoration } from 'react-router-dom';

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black mx-auto p-4 relative text-black dark:text-white">
      <ScrollRestoration/>
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Terms and Conditions</h1>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-primary mb-[1rem]">Acceptance of Terms</h2>
        <p className="mb-2 text-[14px]">
          By accessing and using this website or any other platform provided by Find Your Vibe, you agree to be bound by these Terms and Conditions. It is your responsibility to review these Terms and Conditions periodically, as they may be updated or changed from time to time. For clarity, these Terms and Conditions apply to all services and products offered by Find Your Vibe, including those with the name “Find Your Vibe” or any other name we may use now or in the future.
        </p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-primary mb-[1rem]">Definitions</h2>
        <ul className="list-disc list-inside ">
          <li><strong>Find Your Vibe:</strong> Refers to the company and its various platforms and services, including but not limited to our website (www.findyourvibe.com) and any other digital platforms we may operate.</li>
          <li><strong>User:</strong> A person who accesses our website or other platforms, and/or uses our products and services.</li>
          <li><strong>Customer:</strong> A person who engages with our services, including those who are defined as a User.</li>
          <li><strong>Website:</strong> Refers to www.findyourvibe.com.</li>
          <li><strong>Platform:</strong> Includes the Find Your Vibe website and any other digital means we offer.</li>
          <li><strong>Data:</strong> Refers to personal information, including sensitive personal data and special category data, that we collect and process according to our Privacy Policy and applicable Data Protection Laws.</li>
          <li><strong>Cookies:</strong> Small files placed on your device by our website to remember your preferences and actions.</li>
          <li><strong>Data Protection Laws:</strong> Refers to applicable laws governing the collection, use, and disclosure of personal data.</li>
          <li><strong>Partners:</strong> Third parties we collaborate with to enhance our products and services.</li>
          <li><strong>Service Providers:</strong> Entities that provide services to Find Your Vibe and to whom we may disclose your data for specific purposes under a contractual agreement.</li>
        </ul>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-primary mb-[1rem]">Purchasing Products and Services Online</h2>
        <ol className="list-decimal list-inside ">
          <li><strong>Ticket and Product Requirements:</strong> Children aged 3 years and above will need a separate ticket as per event owner’s request.</li>
          <li><strong>Ticket Details:</strong> It is your responsibility to ensure all details are correct before finalizing your purchase. We will not refund or exchange tickets for user errors.</li>
          <li><strong>Payment Information:</strong> You must provide accurate card details for payment. Any incorrect information is your responsibility, and we will not indemnify you for mistakes.</li>
          <li><strong>Ticket Collection:</strong> To collect your tickets, you must present the credit/debit card used for the purchase and a printout of the confirmation email. Proof of age may be required for restricted events.</li>
        </ol>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-primary mb-[1rem]">Data Protection and Privacy</h2>
        <p className="mb-2 text-[14px]">
          We value your privacy and security. By using our website you agree to our Privacy Policy and the specific terms and conditions of our products and services.
        </p>
        <p className="mb-2 text-[14px]">
          Please note that our website is hosted in India. By accessing our services from outside India, you consent to your data being transferred to and processed in India.
        </p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-primary mb-[1rem]">Ticket Cancellation Policy</h2>
        <ol className="list-decimal list-inside ">
          <li><strong>Cancellation Conditions:</strong> Bookings are valid only for the specified date and location. Cancellations are not permitted once you enter the venue.</li>
          <li><strong>User Conduct:</strong> We reserve the right to refuse entry or ask you to leave if you are under the influence of substances or in violation of our policies.</li>
          <li><strong>Age Restrictions:</strong> We enforce age restrictions for certain events. If you cannot prove you meet the age requirement, entry may be denied.</li>
          <li><strong>Online Cancellation:</strong> You can cancel tickets through our website but only under specific conditions:
            <ul className="list-disc list-inside ">
              <li>Cancellations must be made within 24 hours of booking.</li>
              <li>50% Refunds are based on the cancellation.</li>
            </ul>
          </li>
          <li><strong>Restrictions:</strong> No cancellations for F&B orders alone, and no refunds for special promotions or offers.</li>
          <li><strong>Partial Cancellation:</strong> No partial cancellations or refunds if multiple payment methods are used.</li>
          <li><strong>Refunds:</strong> Processed within a minimum of 7 working days.</li>
          <li><strong>Modifications:</strong> We reserve the right to modify or discontinue our cancellation policies as needed.</li>
        </ol>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-primary mb-[1rem]">General Conditions</h2>
        <ul className="list-disc list-inside ">
          <li><strong>Show and Schedule Changes:</strong> We strive to keep showtimes accurate but may change them due to unforeseen circumstances. We may offer a refund but will not be liable for additional compensation.</li>
          <li><strong>Proof of Age:</strong> You must provide appropriate proof of age for restricted films.</li>
          <li><strong>Operational Changes:</strong> We may suspend operations for certain venues, and promotions may not apply during these times.</li>
        </ul>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-primary mb-[1rem]">Warranties and Indemnification</h2>
        <p className="mb-2 text-[14px]">
          You represent that you are of legal age and have the authority to enter into agreements through our services. You are responsible for all activities under your account.
        </p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-primary mb-[1rem]">Changes to Terms and Conditions</h2>
        <p className="mb-2 text-[14px]">
          We may update these Terms and Conditions periodically. Continued use of our website indicates your acceptance of the updated terms. We will notify you if there are significant changes to how we use your personal data.
        </p>
      </section>
    </div>
  );
};

export default TermsConditions;
