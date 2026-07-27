import { useNavigate } from 'react-router-dom';

const POLICIES = {
  refund: {
    label: 'Refund Policy',
    intro: (
      <>
        At <strong>N-Organics</strong>, we want you to be satisfied with your
        purchase. This Refund Policy explains the circumstances under which refunds are
        issued and how to request one.
      </>
    ),
    sections: [
      {
        title: '1. Eligibility for Refunds',
        content: (
          <>
            <p>Refunds may be granted in the following situations:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>The product or service was not delivered as described.</li>
              <li>The product received is defective, damaged, or significantly different from what was ordered.</li>
              <li>A duplicate or erroneous charge was made to your payment method.</li>
              <li>The service was cancelled within the applicable cancellation window (see our Cancellation Policy).</li>
            </ul>
          </>
        ),
      },
      {
        title: '2. Non-Refundable Items',
        content: (
          <p>
            Certain items or services may not be eligible for a refund, including but not
            limited to digital products that have already been accessed or downloaded,
            services that have already been fully rendered, and items marked as
            "non-refundable" at the time of purchase.
          </p>
        ),
      },
      {
        title: '3. Refund Request Process',
        content: (
          <p>
            To request a refund, please contact us at{' '}
            <a href="mailto:	
hr.norganics@gmail.com" className="text-[#D2E16A] font-semibold hover:underline">
              	
hr.norganics@gmail.com
            </a>{' '}
            within <strong>3 days</strong> of your purchase, along with your order number and
            a brief explanation of the issue. Our team will review your request and respond
            within <strong>5 business days</strong>.
          </p>
        ),
      },
      {
        title: '4. Refund Method and Timeline',
        content: (
          <p>
            Approved refunds will be credited back to the original payment method used at the
            time of purchase. Please allow <strong>5–10 business days</strong> for the refund
            to reflect in your account, depending on your bank or payment provider.
          </p>
        ),
      },
      {
        title: '5. Partial Refunds',
        content: (
          <p>
            In some cases, partial refunds may be issued — for example, if a service was
            partially used or if a product is returned in a used or altered condition.
          </p>
        ),
      },
      {
        title: '6. Disputes',
        content: (
          <p>
            If you are not satisfied with the outcome of your refund request, you may escalate
            the matter by contacting us directly, and we will make reasonable efforts to
            resolve the issue fairly.
          </p>
        ),
      },
      {
        title: '7. Changes to This Policy',
        content: (
          <p>
            We may revise this Refund Policy from time to time. Updates will be posted on this
            page with a new "Last updated" date.
          </p>
        ),
      },
      {
        title: '8. Contact Us',
        content: (
          <p>
            For any questions regarding refunds, please reach out to us at{' '}
            <a href="mailto:	
hr.norganics@gmail.com" className="text-[#D2E16A] font-semibold hover:underline">
              	
hr.norganics@gmail.com
            </a>.
          </p>
        ),
      },
    ],
  },

  cancellation: {
    label: 'Cancellation Policy',
    intro: (
      <>
        This Cancellation Policy outlines the terms under which you may cancel an order,
        booking, or subscription with <strong>N-Organics</strong>.
      </>
    ),
    sections: [
      {
        title: '1. Order/Booking Cancellations',
        content: (
          <p>
            You may cancel your order or booking within <strong>3 days</strong> of
            placing it, provided that the product has not yet been shipped or the service has
            not yet commenced. To cancel, please contact us at{' '}
            <a href="mailto:	
hr.norganics@gmail.com" className="text-[#D2E16A] font-semibold hover:underline">
              	
hr.norganics@gmail.com
            </a>{' '}
            with your order details.
          </p>
        ),
      },
      {
        title: '2. Cancellations After Processing',
        content: (
          <p>
            Once an order has been shipped or a service has begun, cancellation may no longer
            be possible. In such cases, our standard Refund Policy will apply instead.
          </p>
        ),
      },
      {
        title: '4. Cancellations Initiated by Us',
        content: (
          <p>
            We reserve the right to cancel an order or booking under certain circumstances,
            such as product unavailability, pricing errors, or suspected fraudulent activity.
            In such cases, you will be notified and any amount paid will be refunded in full.
          </p>
        ),
      },
      {
        title: '5. Cancellation Charges',
        content: (
          <p>
            Depending on the timing of your cancellation, a cancellation fee may apply. Any
            applicable fees will be clearly communicated to you at the time of booking or
            purchase.
          </p>
        ),
      },
      {
        title: '6. How to Request a Cancellation',
        content: (
          <p>
            To request a cancellation, please email us at{' '}
            <a href="mailto:	
hr.norganics@gmail.com" className="text-[#D2E16A] font-semibold hover:underline">
              	
hr.norganics@gmail.com
            </a>{' '}
            with your order/booking number. We aim to process cancellation requests within
            <strong> 7 business days</strong>.
          </p>
        ),
      },
      {
        title: '7. Changes to This Policy',
        content: (
          <p>
            We may update this Cancellation Policy periodically. Any changes will be reflected
            on this page with an updated "Last updated" date.
          </p>
        ),
      },
      {
        title: '8. Contact Us',
        content: (
          <p>
            For any cancellation-related queries, reach out to us at{' '}
            <a href="mailto:	
hr.norganics@gmail.com" className="text-[#D2E16A] font-semibold hover:underline">
              	
hr.norganics@gmail.com
            </a>.
          </p>
        ),
      },
    ],
  },
};

export default function LegalPolicyPage({ type }) {
  const navigate = useNavigate();
  const policy = POLICIES[type];

  if (!policy) return null;

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Standalone page bar -- no shared Header/Footer here, just Back */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-[#344256] font-semibold hover:text-[#D2E16A] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-[#0F261C] font-heading text-sm font-semibold uppercase tracking-wide">Legal</p>
        <h1 className="font-heading text-2xl md:text-4xl font-bold text-[#D2E16A] mt-2">
          {policy.label}
        </h1>
        <div className="w-20 h-0.5 bg-[#0F261C] my-6" />

        <div className="bg-white rounded shadow-sm p-6 md:p-10 space-y-8 text-gray-700 leading-relaxed">
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          <p>{policy.intro}</p>

          {policy.sections.map((section) => (
            <Section key={section.title} title={section.title}>
              {section.content}
            </Section>
          ))}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="font-heading text-lg md:text-xl font-bold text-[#344256] mb-2">{title}</h2>
      {children}
    </div>
  );
}