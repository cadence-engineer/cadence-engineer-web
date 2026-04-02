import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PageHeader, PageShell, PageSurface } from "@/app/components/page-shell";

type PrivacyBlock =
  | {
      type: "paragraph";
      content: ReactNode;
    }
  | {
      type: "bullets";
      items: ReactNode[];
    };

type PrivacySubsection = {
  title: ReactNode;
  blocks: PrivacyBlock[];
};

type PrivacySection = {
  title: ReactNode;
  blocks?: PrivacyBlock[];
  subsections?: PrivacySubsection[];
};

const contactLinkClassName = "font-medium text-[#FF2D55] hover:text-[#E60045]";

const privacySections: PrivacySection[] = [
  {
    title: "Overview",
    blocks: [
      {
        type: "paragraph",
        content: "Cadence Engineer is a GitHub-connected software delivery product. It uses:",
      },
      {
        type: "bullets",
        items: [
          "GitHub for sign-in, identity verification, and authorized access to software-delivery data,",
          "Fly.io to host the backend and related infrastructure,",
          "Vercel to host the web application and related frontend infrastructure,",
          "OpenAI to generate structured pull request, daily, sprint, and related summaries, and",
          "Creem, operated by Armitage Labs OÜ, for checkout, subscription billing, payment processing, tax handling, and related commerce operations.",
        ],
      },
      {
        type: "paragraph",
        content: "This Privacy Policy explains what information Cadence Engineer processes, where it comes from, how it is used, when it is shared, how long it is retained, and how you can contact us.",
      },
    ],
  },
  {
    title: "Contact",
    blocks: [
      {
        type: "paragraph",
        content: (
          <>
            Cadence Engineer is responsible for the processing described in this Privacy
            Policy. Privacy questions or requests can be sent to{" "}
            <a href="mailto:dominik.strasser@cadence.engineer" className={contactLinkClassName}>
              dominik.strasser@cadence.engineer
            </a>
            .
          </>
        ),
      },
    ],
  },
  {
    title: "Information We Process",
    subsections: [
      {
        title: "1. Account, sign-in, and consent data",
        blocks: [
          {
            type: "paragraph",
            content: "When you sign in or use Cadence Engineer, we may process:",
          },
          {
            type: "bullets",
            items: [
              "your GitHub OAuth authorization code,",
              <>OAuth <code>state</code> verification data and related request-integrity data,</>,
              "Cadence account identifiers,",
              "your acceptance of this Privacy Policy and other required product consents,",
              "authenticated session data, including session cookies or session tokens,",
              "your selected organization and product setup state, and",
              "account or support communications you send to us.",
            ],
          },
          {
            type: "paragraph",
            content: "We use this information to authenticate you, keep your session secure, provision your account, and record required consent and setup state.",
          },
        ],
      },
      {
        title: "2. GitHub account and identity data",
        blocks: [
          {
            type: "paragraph",
            content: "When you sign in with GitHub or connect GitHub data, we may process account and identity information made available through GitHub, including:",
          },
          {
            type: "bullets",
            items: [
              "GitHub account ID,",
              "username/login,",
              "display name,",
              "email address, if available,",
              "avatar or profile image,",
              "company or organization affiliation fields,",
              "public profile URL and related profile metadata,",
              "GitHub App installation visibility and account linkage data, and",
              "other account fields GitHub makes available to Cadence Engineer through the permissions you authorize.",
            ],
          },
        ],
      },
      {
        title: "3. GitHub organization, team, and membership data",
        blocks: [
          {
            type: "paragraph",
            content: "Depending on the features you use and the permissions granted to Cadence Engineer, we may process organization-level GitHub data, including:",
          },
          {
            type: "bullets",
            items: [
              "organization IDs, names, logins, descriptions, profile metadata, and URLs,",
              "organization membership status and role-related information,",
              <>GitHub App installation data for the <code>cadence-engineer</code> GitHub App,</>,
              "installation IDs, installation account data, installation access token URLs, and installation tokens,",
              "team names, team slugs, team descriptions, team membership, repository access, and permission-related metadata, and",
              "organization-level configuration or setup data used to provide Cadence Engineer features.",
            ],
          },
        ],
      },
      {
        title: "4. GitHub repository, code, and development data",
        blocks: [
          {
            type: "paragraph",
            content: "Depending on the features you use and the permissions granted to Cadence Engineer, we may process GitHub repository data from authorized public and private repositories, including:",
          },
          {
            type: "bullets",
            items: [
              "repository IDs, names, full names, descriptions, visibility, topics, URLs, and related metadata,",
              "repository owners, default branches, repository settings metadata, and configuration data,",
              "source code, file contents, file paths, documentation, configuration files, and other repository content,",
              "branches, tags, releases, labels, milestones, and related repository objects,",
              "commit SHAs, commit messages, commit authors, commit timestamps, commit metadata, and commit email addresses where GitHub returns them,",
              "commit diffs, patches, and other change content,",
              "pull requests, including IDs, numbers, titles, bodies, state, timestamps, authors, base and head branches, changed files, review data, comments, labels, statuses, checks, and related metadata,",
              "issues, including issue titles, bodies, comments, state, assignees, labels, milestones, and related metadata,",
              "GitHub Projects data, including project names, descriptions, items, fields, statuses, and related workflow data, and",
              "webhook payloads, event metadata, and other repository activity needed to operate the product.",
            ],
          },
          {
            type: "paragraph",
            content: "Cadence Engineer may process this data to provide setup, repository analysis, software-delivery summaries, workflow context, search, review, and related product functionality.",
          },
        ],
      },
      {
        title: "5. Generated product data",
        blocks: [
          {
            type: "paragraph",
            content: "Cadence Engineer may create and store product data derived from the information above, including:",
          },
          {
            type: "bullets",
            items: [
              "user records,",
              "organization records,",
              "GitHub installation records,",
              "setup and onboarding state,",
              "pull request summaries,",
              "daily summaries,",
              "sprint summaries,",
              "titles, narrative summaries, highlights, facts, intents, areas, impacts, risks, implications, and confidence ratings,",
              "citations and supporting excerpts tied to generated summaries, and",
              "other derived records needed to operate, display, or improve Cadence Engineer.",
            ],
          },
          {
            type: "paragraph",
            content: "These generated records may include structured references to underlying GitHub data, such as pull request identifiers, commit identifiers, file references, citation excerpts, and line-level locations in code or diffs.",
          },
        ],
      },
      {
        title: "6. Payment, checkout, and subscription data",
        blocks: [
          {
            type: "paragraph",
            content: "If you purchase or manage a paid Cadence Engineer subscription, we and our payment provider Creem may process commerce-related data, including:",
          },
          {
            type: "bullets",
            items: [
              "customer name and email address,",
              "billing address and country,",
              "company name,",
              "tax, VAT, or similar registration details where applicable,",
              "product, plan, price, currency, and invoice data,",
              "subscription status, renewal dates, cancellation status, and billing history,",
              "transaction identifiers, order identifiers, refunds, disputes, or chargeback status,",
              "payment method metadata and payment status data,",
              "fraud-prevention, sanctions-screening, and compliance-related data, and",
              "customer support communications related to billing or account access.",
            ],
          },
          {
            type: "paragraph",
            content: "Cadence Engineer does not intend to store full payment card numbers. Payments are handled through Creem and its payment partners. Cadence Engineer may receive and store limited billing and subscription records from Creem, such as customer IDs, subscription IDs, product/plan details, transaction status, invoice status, and related customer/account metadata.",
          },
        ],
      },
      {
        title: "7. Device, browser, usage, and infrastructure data",
        blocks: [
          {
            type: "paragraph",
            content: "When you access Cadence Engineer, we and our hosting providers may process technical and operational data, including:",
          },
          {
            type: "bullets",
            items: [
              "IP address,",
              "browser type and version,",
              "device data,",
              "operating system,",
              "user-agent strings,",
              "request routes, URLs, timestamps, and response status codes,",
              "error logs, debug logs, and run/correlation IDs,",
              "cookie and session identifiers,",
              "security and abuse-prevention signals, and",
              "frontend and backend infrastructure logs generated by Vercel, Fly.io, and related service providers.",
            ],
          },
        ],
      },
      {
        title: "8. Support, legal, and security data",
        blocks: [
          {
            type: "paragraph",
            content: "We may also process:",
          },
          {
            type: "bullets",
            items: [
              "records of privacy requests, support requests, and account requests,",
              "communications with you,",
              "information needed to investigate misuse, abuse, fraud, or security incidents,",
              "allow-list or deny-list records used for account access controls, and",
              "information required to comply with legal obligations, resolve disputes, or enforce our agreements.",
            ],
          },
        ],
      },
    ],
  },
  {
    title: "How We Use Information",
    blocks: [
      {
        type: "paragraph",
        content: "Cadence Engineer uses information to:",
      },
      {
        type: "bullets",
        items: [
          "authenticate users and keep sessions secure,",
          "verify identity and organization membership,",
          "provide the Cadence Engineer web app, backend, and GitHub-connected features,",
          "access and analyze authorized GitHub organizations, repositories, code, issues, projects, and workflow data,",
          "generate pull request, daily, sprint, and related summaries,",
          "store account configuration, setup state, and generated product records,",
          "provide billing, subscriptions, checkout, invoices, and account management,",
          "respond to support, privacy, legal, or account requests,",
          "detect, prevent, and investigate misuse, fraud, abuse, and security issues,",
          "monitor, debug, maintain, and improve the service, and",
          "comply with legal, tax, accounting, contractual, and regulatory obligations.",
        ],
      },
    ],
  },
  {
    title: "How OpenAI Is Used",
    blocks: [
      {
        type: "paragraph",
        content: "Cadence Engineer uses OpenAI to generate structured summaries and related outputs.",
      },
      {
        type: "paragraph",
        content: "Depending on the feature and the GitHub permissions involved, Cadence Engineer may send to OpenAI:",
      },
      {
        type: "bullets",
        items: [
          "repository metadata,",
          "public or private repository content authorized for the connected account or installation,",
          "source code, file contents, configuration files, documentation, and related repository material,",
          "commits, commit messages, commit diffs, patches, and commit metadata,",
          "pull request data, comments, reviews, changed-file data, and code diffs,",
          "issue and project data,",
          "organization and workflow context, and",
          "previously generated summaries, citations, or related derived product data.",
        ],
      },
      {
        type: "paragraph",
        content: "We do not intentionally send payment card data to OpenAI. We also do not intentionally send GitHub OAuth authorization codes to OpenAI.",
      },
      {
        type: "paragraph",
        content: "OpenAI's handling of submitted API data is governed by OpenAI's own terms, privacy documentation, and account-level settings. OpenAI states that inputs and outputs for its business products, including the API, are not used to train its models by default unless the customer explicitly opts in.",
      },
    ],
  },
  {
    title: "Cookies and Similar Technologies",
    blocks: [
      {
        type: "paragraph",
        content: "Cadence Engineer uses essential cookies and similar technologies needed to operate the product, such as:",
      },
      {
        type: "bullets",
        items: [
          "OAuth state cookies,",
          "authentication and session cookies,",
          "request-integrity and security cookies, and",
          "other strictly necessary storage or session mechanisms required for the service to function.",
        ],
      },
      {
        type: "paragraph",
        content: "Cadence Engineer does not use advertising cookies or cross-site tracking cookies for ads. If analytics or similar tooling is added later, this Privacy Policy will be updated accordingly.",
      },
    ],
  },
  {
    title: "Sharing",
    blocks: [
      {
        type: "paragraph",
        content: "Cadence Engineer does not sell personal data.",
      },
      {
        type: "paragraph",
        content: "We may share information with:",
      },
      {
        type: "bullets",
        items: [
          "GitHub, to authenticate users, verify access, retrieve authorized GitHub data, and operate GitHub-connected features,",
          "OpenAI, to generate summaries and related AI outputs,",
          "Fly.io, to host backend systems and backend infrastructure,",
          "Vercel, to host the web application and related frontend infrastructure,",
          "Creem, operated by Armitage Labs OÜ, to provide checkout, subscription billing, tax handling, fraud prevention, and payment processing,",
          "other infrastructure, database, logging, email, or support providers that help operate Cadence Engineer,",
          "professional advisers where reasonably necessary, and",
          "regulators, courts, law enforcement, or other third parties where required by law or reasonably necessary to protect rights, users, or the service.",
        ],
      },
      {
        type: "paragraph",
        content: "Service providers are expected to process data only as needed to provide their services and under appropriate confidentiality, security, and data-protection obligations.",
      },
    ],
  },
  {
    title: "Legal Bases",
    blocks: [
      {
        type: "paragraph",
        content: "Where applicable law requires a legal basis, Cadence Engineer generally processes information:",
      },
      {
        type: "bullets",
        items: [
          "to perform a contract or provide the service you request,",
          "to authenticate you and set up your account,",
          "to operate subscriptions, billing, tax, and payment workflows,",
          "to pursue legitimate interests in operating, securing, maintaining, and improving Cadence Engineer, and",
          "to comply with legal obligations.",
        ],
      },
      {
        type: "paragraph",
        content: "If we rely on consent for a specific processing activity, you may withdraw that consent going forward, subject to any other lawful basis that continues to apply.",
      },
    ],
  },
  {
    title: "International Transfers",
    blocks: [
      {
        type: "paragraph",
        content: "Cadence Engineer and its providers, including GitHub, OpenAI, Fly.io, Vercel, and Creem, may process information in countries other than your own. Where required, we will rely on appropriate safeguards for international data transfers.",
      },
    ],
  },
  {
    title: "Retention",
    blocks: [
      {
        type: "paragraph",
        content: "Cadence Engineer keeps information for as long as needed to provide the service and operate the product, including for:",
      },
      {
        type: "bullets",
        items: [
          "account administration,",
          "GitHub-connected product functionality,",
          "generated summaries and related records,",
          "billing, tax, and accounting,",
          "security and abuse prevention,",
          "legal compliance, dispute resolution, and agreement enforcement, and",
          "backup, recovery, and operational continuity.",
        ],
      },
      {
        type: "paragraph",
        content: "Because the backend may retain account records, organization records, installation records, summary records, billing/subscription records, and related metadata until they are deleted, replaced, or no longer needed, some records may remain stored until a deletion workflow is completed or retention is no longer required.",
      },
      {
        type: "paragraph",
        content: "We may delete or anonymize data when it is no longer needed for these purposes.",
      },
    ],
  },
  {
    title: "Security",
    blocks: [
      {
        type: "paragraph",
        content: "Cadence Engineer uses reasonable technical and organizational measures intended to protect information, including authenticated requests, signed tokens, access controls, restricted credentials, provider security controls, and monitoring/logging necessary to secure the service. No method of transmission or storage is completely secure, and absolute security cannot be guaranteed.",
      },
    ],
  },
  {
    title: "Your Choices and Rights",
    blocks: [
      {
        type: "paragraph",
        content: "You may stop using Cadence Engineer at any time.",
      },
      {
        type: "paragraph",
        content: "Subject to applicable law, you may request access to, correction of, deletion of, or additional information about personal data we hold about you. You may also ask questions about connected GitHub data, generated summaries, or billing/subscription records associated with your account.",
      },
      {
        type: "paragraph",
        content: (
          <>
            To make a request, contact{" "}
            <a href="mailto:dominik.strasser@cadence.engineer" className={contactLinkClassName}>
              dominik.strasser@cadence.engineer
            </a>
            . We may need to verify your identity before responding.
          </>
        ),
      },
    ],
  },
  {
    title: "Third-Party Provider Contacts",
    blocks: [
      {
        type: "paragraph",
        content: "The following providers are currently used or planned for use in connection with Cadence Engineer. Their contact details are governed by their own notices and may change over time.",
      },
    ],
    subsections: [
      {
        title: "Fly.io",
        blocks: [
          {
            type: "bullets",
            items: [
              "Provider: Fly.io, Inc.",
              "Role: backend hosting and infrastructure",
              <>Email: <a href="mailto:support@fly.io" className={contactLinkClassName}>support@fly.io</a></>,
              <>Privacy / compliance: <a href="mailto:compliance@fly.io" className={contactLinkClassName}>compliance@fly.io</a></>,
            ],
          },
        ],
      },
      {
        title: "Vercel",
        blocks: [
          {
            type: "bullets",
            items: [
              "Provider: Vercel Inc.",
              "Role: frontend hosting and infrastructure",
              "Address: 440 N Barranca Avenue #4133, Covina, CA 91723, United States",
              <>Email: <a href="mailto:privacy@vercel.com" className={contactLinkClassName}>privacy@vercel.com</a></>,
            ],
          },
        ],
      },
      {
        title: "Creem",
        blocks: [
          {
            type: "bullets",
            items: [
              "Provider: Armitage Labs OÜ, trading as Creem",
              "Role: checkout, merchant of record, subscriptions, billing, taxes, and payments",
              "Address: Telliskivi Street 57b/1, Tallinn 10412, Estonia",
              <>Email: <a href="mailto:support@creem.io" className={contactLinkClassName}>support@creem.io</a></>,
            ],
          },
        ],
      },
      {
        title: "GitHub",
        blocks: [
          {
            type: "bullets",
            items: [
              "Provider: GitHub, Inc. and, where applicable, GitHub B.V.",
              "Role: authentication, identity, repository and organization data provider",
              "Address: 88 Colin P. Kelly Jr. St., San Francisco, CA 94107, United States",
              <>Email: <a href="mailto:privacy@github.com" className={contactLinkClassName}>privacy@github.com</a></>,
              <>EEA/UK/Switzerland privacy contact: <a href="mailto:dpo@github.com" className={contactLinkClassName}>dpo@github.com</a></>,
            ],
          },
        ],
      },
      {
        title: "OpenAI",
        blocks: [
          {
            type: "bullets",
            items: [
              "Provider: OpenAI OpCo, LLC and, where applicable, OpenAI Ireland Ltd.",
              "Role: AI summary and structured-output provider",
              "United States address: 1455 Third Street, San Francisco, CA 94158, United States",
              "Ireland address: 1st Floor, The Liffey Trust Centre, 117-126 Sheriff Street Upper, Dublin 1, D01 YC43, Ireland",
              <>Email: <a href="mailto:privacy@openai.com" className={contactLinkClassName}>privacy@openai.com</a></>,
              <>Data requests: <a href="mailto:dsar@openai.com" className={contactLinkClassName}>dsar@openai.com</a></>,
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Changes to This Policy",
    blocks: [
      {
        type: "paragraph",
        content: "Cadence Engineer may update this Privacy Policy from time to time. If material changes are made, the updated version will be posted with a revised effective date.",
      },
    ],
  },
];

export const metadata: Metadata = {
  title: "Privacy Policy | Cadence Engineer",
  description: "Privacy policy for Cadence Engineer",
};

function renderBlock(block: PrivacyBlock, key: string) {
  if (block.type === "paragraph") {
    return <p key={key}>{block.content}</p>;
  }

  return (
    <ul key={key} className="list-disc space-y-2 pl-5">
      {block.items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

export default function PrivacyPage() {
  return (
    <PageShell>
      <PageSurface className="max-w-4xl space-y-8">
        <PageHeader
          title="Privacy Policy"
          description="Last updated: April 2, 2026"
        />
        {privacySections.map((section, sectionIndex) => (
          <section key={sectionIndex} className="space-y-5 text-black/80">
            <h2 className="text-xl font-semibold text-black">{section.title}</h2>
            {section.blocks?.map((block, blockIndex) =>
              renderBlock(block, `section-${sectionIndex}-block-${blockIndex}`),
            )}
            {section.subsections?.map((subsection, subsectionIndex) => (
              <div
                key={`section-${sectionIndex}-subsection-${subsectionIndex}`}
                className="space-y-3"
              >
                <h3 className="text-lg font-semibold text-black">{subsection.title}</h3>
                {subsection.blocks.map((block, blockIndex) =>
                  renderBlock(
                    block,
                    `section-${sectionIndex}-subsection-${subsectionIndex}-block-${blockIndex}`,
                  ),
                )}
              </div>
            ))}
          </section>
        ))}
      </PageSurface>
    </PageShell>
  );
}
