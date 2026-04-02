import type { Metadata } from "next";
import { PageHeader, PageShell, PageSurface } from "@/app/components/page-shell";

type TermsBlock =
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "bullets";
      items: string[];
    };

type TermsSection = {
  title: string;
  blocks: TermsBlock[];
};

const termsSections: TermsSection[] = [
  {
    title: "Overview",
    blocks: [
      {
        type: "paragraph",
        text: "Cadence Engineer provides a web application and related backend services for software delivery visibility, workflow support, GitHub-connected analysis, and AI-generated summaries.",
      },
      {
        type: "paragraph",
        text: "By signing in, accessing, purchasing, or using Cadence Engineer, you agree to these Terms of Service. If you use Cadence Engineer on behalf of a company, organization, or other entity, you represent that you have authority to bind that entity to these terms.",
      },
      {
        type: "paragraph",
        text: "If you do not agree to these terms, do not use Cadence Engineer.",
      },
    ],
  },
  {
    title: "Eligibility and Authorized Use",
    blocks: [
      {
        type: "paragraph",
        text: "You may use Cadence Engineer only:",
      },
      {
        type: "bullets",
        items: [
          "in compliance with applicable law,",
          "in compliance with these terms,",
          "in compliance with your internal organization policies, and",
          "with respect to GitHub accounts, repositories, organizations, projects, issues, pull requests, and other connected data that you are authorized to access and use.",
        ],
      },
      {
        type: "paragraph",
        text: "You are responsible for ensuring that your use of Cadence Engineer, including any connection to GitHub organizations, repositories, or private code, is authorized by the relevant rights holder and permitted by applicable contract, policy, and law.",
      },
    ],
  },
  {
    title: "Accounts and Access",
    blocks: [
      {
        type: "paragraph",
        text: "Access to Cadence Engineer is currently provided through GitHub authentication.",
      },
      {
        type: "paragraph",
        text: "You are responsible for:",
      },
      {
        type: "bullets",
        items: [
          "maintaining the security of your GitHub account and any related credentials,",
          "keeping your account information accurate,",
          "controlling who can access your device, browser session, and connected accounts, and",
          "all activity that occurs through your account or session.",
        ],
      },
      {
        type: "paragraph",
        text: "You must notify us promptly if you believe your account, session, or connected GitHub access has been compromised.",
      },
      {
        type: "paragraph",
        text: "We may suspend, restrict, or terminate access if we reasonably believe your use creates security, legal, compliance, reputational, or operational risk for Cadence Engineer, our providers, or other users.",
      },
    ],
  },
  {
    title: "Connected Services and Permissions",
    blocks: [
      {
        type: "paragraph",
        text: "Cadence Engineer depends on third-party services, including GitHub, OpenAI, Fly.io, Vercel, and, for billing, Creem.",
      },
      {
        type: "paragraph",
        text: "By using Cadence Engineer, you authorize us to interact with connected services as needed to operate the product, including to:",
      },
      {
        type: "bullets",
        items: [
          "authenticate you through GitHub,",
          "verify organization membership or installation status,",
          "access authorized repository, issue, pull request, project, workflow, and code data,",
          "generate AI-assisted summaries and related outputs,",
          "host and deliver the web application and backend,",
          "process subscriptions, checkout, invoices, taxes, and related billing functions, and",
          "maintain security, reliability, logging, and operational support.",
        ],
      },
      {
        type: "paragraph",
        text: "Your use of third-party services remains subject to those providers' own terms and policies.",
      },
    ],
  },
  {
    title: "GitHub and Customer Content",
    blocks: [
      {
        type: "paragraph",
        text: "You retain ownership of your code, repository data, documentation, issue content, project content, and other content you or your organization make available through GitHub or other connected systems.",
      },
      {
        type: "paragraph",
        text: "You grant Cadence Engineer the limited rights needed to host, copy, process, transmit, analyze, and display that content solely as necessary to:",
      },
      {
        type: "bullets",
        items: [
          "provide the service,",
          "generate summaries and workflow outputs,",
          "maintain account and setup state,",
          "prevent abuse and secure the platform,",
          "support, debug, and improve the service, and",
          "comply with legal obligations.",
        ],
      },
      {
        type: "paragraph",
        text: "You represent and warrant that you have all rights, permissions, and authorizations needed for Cadence Engineer to process connected GitHub and related data in connection with the service.",
      },
      {
        type: "paragraph",
        text: "You must not submit or connect content that:",
      },
      {
        type: "bullets",
        items: [
          "you do not have the right to use,",
          "violates law or third-party rights,",
          "contains malicious code, or",
          "is used in a way that breaches confidentiality, export, sanctions, employment, or access restrictions applicable to you.",
        ],
      },
    ],
  },
  {
    title: "AI Features and Outputs",
    blocks: [
      {
        type: "paragraph",
        text: "Cadence Engineer uses OpenAI and related processing to generate summaries and other AI-assisted outputs.",
      },
      {
        type: "paragraph",
        text: "You acknowledge that:",
      },
      {
        type: "bullets",
        items: [
          "AI-generated outputs may be incomplete, inaccurate, or misleading,",
          "generated summaries may omit relevant context or contain mistakes,",
          "AI outputs are provided as assistive product functionality and not as legal, financial, tax, compliance, or professional advice, and",
          "you are responsible for reviewing outputs before relying on them for operational, legal, or business decisions.",
        ],
      },
      {
        type: "paragraph",
        text: "Cadence Engineer may use repository metadata, source code, diffs, pull requests, issues, projects, organization context, and related GitHub data to generate outputs.",
      },
    ],
  },
  {
    title: "Subscriptions, Billing, and Payments",
    blocks: [
      {
        type: "paragraph",
        text: "Some Cadence Engineer features may require a paid subscription or purchase.",
      },
      {
        type: "paragraph",
        text: "If you purchase a subscription or other paid product:",
      },
      {
        type: "bullets",
        items: [
          "checkout, merchant-of-record services, payment processing, invoicing, and certain tax handling are provided by Creem, operated by Armitage Labs OÜ,",
          "prices, billing intervals, taxes, renewal terms, cancellation terms, and refund terms shown at checkout or in your billing flow are part of your purchase terms,",
          "you authorize the applicable charges for your selected plan or purchase,",
          "you are responsible for providing accurate billing, tax, and account information, and",
          "failure to pay may result in suspension, downgrade, or termination of access.",
        ],
      },
      {
        type: "paragraph",
        text: "Unless otherwise stated at checkout or required by law:",
      },
      {
        type: "bullets",
        items: [
          "subscriptions may renew automatically until cancelled,",
          "plan changes may take effect immediately or at the next billing cycle depending on the billing flow,",
          "taxes may vary by jurisdiction and billing information, and",
          "refunds are handled in accordance with applicable law, the checkout terms presented to you, and Creem's merchant-of-record process.",
        ],
      },
    ],
  },
  {
    title: "Acceptable Use",
    blocks: [
      {
        type: "paragraph",
        text: "You agree not to:",
      },
      {
        type: "bullets",
        items: [
          "misuse, disrupt, overload, or interfere with the service or its infrastructure,",
          "attempt unauthorized access to accounts, systems, repositories, data, models, or provider services,",
          "probe, scan, or test vulnerabilities without authorization,",
          "bypass product limits, access controls, pricing controls, or security measures,",
          "use the service to violate law, contract, confidentiality obligations, or third-party rights,",
          "upload, transmit, or connect malicious code or harmful content,",
          "scrape, mirror, copy, or reproduce the service except as permitted by law,",
          "reverse engineer, decompile, or attempt to derive source code from the service except where law clearly permits it,",
          "use Cadence Engineer to build or train a competing service from the service itself,",
          "use the service for spam, fraud, abuse, harassment, or deceptive activity, or",
          "use the service in a way that could create material legal, regulatory, or security risk for Cadence Engineer or its providers.",
        ],
      },
      {
        type: "paragraph",
        text: "We may investigate suspected misuse and take appropriate action, including suspension, rate limiting, access removal, or disclosure where required by law.",
      },
    ],
  },
  {
    title: "Availability, Features, and Changes",
    blocks: [
      {
        type: "paragraph",
        text: "Cadence Engineer is provided on an evolving basis. Features, integrations, models, user interfaces, limits, and availability may change over time.",
      },
      {
        type: "paragraph",
        text: "We may:",
      },
      {
        type: "bullets",
        items: [
          "add, modify, limit, or remove features,",
          "change supported GitHub, OpenAI, Fly.io, Vercel, Creem, or other provider integrations,",
          "impose or update usage limits,",
          "perform maintenance, updates, migrations, or security changes, and",
          "suspend or discontinue all or part of the service,",
        ],
      },
      {
        type: "paragraph",
        text: "when reasonably necessary for product, security, legal, provider, operational, or business reasons.",
      },
      {
        type: "paragraph",
        text: "We do not guarantee uninterrupted availability or that the service will always be error-free, secure, or compatible with every workflow.",
      },
    ],
  },
  {
    title: "Intellectual Property",
    blocks: [
      {
        type: "paragraph",
        text: "Cadence Engineer and its related software, design, user interface, branding, documentation, and service content are owned by Cadence Engineer or its licensors and are protected by intellectual property laws.",
      },
      {
        type: "paragraph",
        text: "Subject to these terms, we grant you a limited, non-exclusive, non-transferable, revocable right to use Cadence Engineer for its intended purposes.",
      },
      {
        type: "paragraph",
        text: "These terms do not grant you ownership of the service or any underlying intellectual property rights.",
      },
    ],
  },
  {
    title: "Feedback",
    blocks: [
      {
        type: "paragraph",
        text: "If you provide feedback, ideas, suggestions, or improvement requests about Cadence Engineer, you grant us a worldwide, perpetual, irrevocable, non-exclusive, royalty-free right to use that feedback without restriction or obligation to you.",
      },
    ],
  },
  {
    title: "Suspension and Termination",
    blocks: [
      {
        type: "paragraph",
        text: "You may stop using Cadence Engineer at any time.",
      },
      {
        type: "paragraph",
        text: "We may suspend or terminate your access, or the access of your organization, immediately or with notice if:",
      },
      {
        type: "bullets",
        items: [
          "you breach these terms,",
          "you fail to pay applicable fees,",
          "required third-party access or provider services become unavailable,",
          "we reasonably believe your use poses security, abuse, fraud, compliance, or legal risk, or",
          "we are required to do so by law, regulation, court order, or provider requirement.",
        ],
      },
      {
        type: "paragraph",
        text: "Upon suspension or termination:",
      },
      {
        type: "bullets",
        items: [
          "your right to use the service ends to the extent of the suspension or termination,",
          "we may disable access to connected features, accounts, or billing-backed features, and",
          "some data may remain retained as described in the Privacy Policy or as required for legal, security, tax, accounting, or operational purposes.",
        ],
      },
    ],
  },
  {
    title: "Disclaimers",
    blocks: [
      {
        type: "paragraph",
        text: 'To the maximum extent permitted by law, Cadence Engineer is provided on an "as is" and "as available" basis.',
      },
      {
        type: "paragraph",
        text: "We disclaim all warranties, whether express, implied, statutory, or otherwise, including implied warranties of merchantability, fitness for a particular purpose, title, non-infringement, availability, accuracy, and quiet enjoyment.",
      },
      {
        type: "paragraph",
        text: "Without limiting the above, we do not warrant that:",
      },
      {
        type: "bullets",
        items: [
          "the service will be uninterrupted, timely, secure, or error-free,",
          "AI-generated outputs will be accurate, complete, or fit for your intended use,",
          "connected GitHub, billing, hosting, or AI providers will remain available,",
          "defects will always be corrected, or",
          "the service will meet all of your organization's operational, legal, or compliance requirements.",
        ],
      },
    ],
  },
  {
    title: "Limitation of Liability",
    blocks: [
      {
        type: "paragraph",
        text: "To the maximum extent permitted by law, Cadence Engineer and its affiliates, licensors, and service providers will not be liable for any indirect, incidental, special, consequential, exemplary, or punitive damages, or for any loss of data, revenue, profits, business, contracts, goodwill, or reputation, arising out of or related to the service or these terms.",
      },
      {
        type: "paragraph",
        text: "To the maximum extent permitted by law, the total aggregate liability of Cadence Engineer for all claims arising out of or relating to the service or these terms will not exceed:",
      },
      {
        type: "bullets",
        items: [
          "the amount you paid to Cadence Engineer for the service during the 12 months before the event giving rise to the claim, or",
          "if you have not paid for the service, EUR 100.",
        ],
      },
      {
        type: "paragraph",
        text: "Nothing in these terms excludes or limits liability that cannot be excluded or limited under applicable law.",
      },
    ],
  },
  {
    title: "Indemnity",
    blocks: [
      {
        type: "paragraph",
        text: "To the extent permitted by law, you agree to indemnify and hold harmless Cadence Engineer, its affiliates, and its service providers from claims, liabilities, damages, losses, and expenses, including reasonable legal fees, arising out of or related to:",
      },
      {
        type: "bullets",
        items: [
          "your use of the service,",
          "your connected content or data,",
          "your violation of these terms,",
          "your violation of law or third-party rights, or",
          "your unauthorized or improper use of third-party accounts, repositories, organizations, or data.",
        ],
      },
    ],
  },
  {
    title: "Changes to These Terms",
    blocks: [
      {
        type: "paragraph",
        text: "We may update these terms from time to time. If we make material changes, we may provide notice by updating the document, posting notice in the product, or using another reasonable method.",
      },
      {
        type: "paragraph",
        text: "Continued use of the service after updated terms take effect means you accept the revised terms.",
      },
    ],
  },
];

export const metadata: Metadata = {
  title: "Terms of Service | Cadence Engineer",
  description: "Terms of service for Cadence Engineer",
};

export default function TermsPage() {
  return (
    <PageShell>
      <PageSurface className="max-w-4xl space-y-8">
        <PageHeader
          title="Terms of Service"
          description="Last updated: April 2, 2026"
        />
        {termsSections.map((section) => (
          <section key={section.title} className="space-y-3 text-black/80">
            <h2 className="text-xl font-semibold text-black">{section.title}</h2>
            {section.blocks.map((block) =>
              block.type === "paragraph" ? (
                <p key={block.text}>{block.text}</p>
              ) : (
                <ul key={block.items.join("|")} className="list-disc space-y-2 pl-5">
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ),
            )}
          </section>
        ))}
        <section className="space-y-3 text-black/80">
          <h2 className="text-xl font-semibold text-black">Contact</h2>
          <p>
            Questions about these terms can be sent to{" "}
            <a
              href="mailto:dominik.strasser@cadence.engineer"
              className="font-medium text-[#FF2D55] hover:text-[#E60045]"
            >
              dominik.strasser@cadence.engineer
            </a>
            .
          </p>
        </section>
      </PageSurface>
    </PageShell>
  );
}
