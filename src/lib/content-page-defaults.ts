/**
 * Seed content for registry pages that must not publish blank.
 *
 * Most block-based content pages start empty and are filled in from the admin
 * editor. The statutory pages (`/privacy`, `/terms`, `/support`) can't: the
 * copy is legally required to be on the site from the moment the route exists,
 * and there is no seed script left in this repo to load it (see CLAUDE.md).
 *
 * So the copy lives here as a plain `ContentPageSchema` input, used two ways:
 *
 *  - `ContentPage` renders it when the SiteConfig doc is missing or empty, so
 *    the live page is correct on a fresh database;
 *  - `/admin/content/<slug>` starts a never-saved page from it, so an editor
 *    opens the real text instead of a blank canvas — the first save writes it
 *    to Mongo and the CMS owns it from then on.
 *
 * Everything here is editable afterwards; nothing reads these values once the
 * key has been saved.
 */
import { TRUST_NAME, TRUST_ADDRESS, SUPPORT_EMAIL, SITE_DOMAIN } from "./legal";

/** Raw `ContentPageSchema` input — parsed by the caller, never cast. */
export type ContentPageDefault = Record<string, unknown>;

const PRIVACY: ContentPageDefault = {
  hero: {
    title: "Privacy Policy",
    subtitle:
      "How we collect, use and protect the information you share with us.",
  },
  breadcrumb: [{ label: "Privacy Policy", href: "" }],
  intro: [
    `At ${TRUST_NAME}, we are committed to safeguarding and preserving the privacy of our visitors. You may visit our website without revealing any personal information wherever permissible. Certain transactions may require submission of personal information like profile updates and certain databases. Information that you provide when you communicate with us by any means. We will not sell, swap or rent, or otherwise disclose to any third party any personal information for commercial purpose and such information will be utilized only for the purpose stated. To accomplish such purpose we may disclose the information to our employees, consultants and other concerned having a genuine need to know the information.`,
  ],
  blocks: [
    {
      type: "text",
      title: "Third Party Links",
      paragraphs: [
        "On occasion we include links to third parties on this website. Where we provide a link it does not mean that we endorse or approve that site’s policy towards visitor privacy. You should review their privacy policy before sending them any personal data.",
      ],
    },
    {
      type: "text",
      title: "Information We Collect",
      paragraphs: [
        "Our web server may record the numerical Internet Protocol (IP) address of the computer you are using, Information about your browser and operating system, date and time of access and page which linked you to our website. This information may be used to administer and improve our website and to generate aggregate statistical reports and such like purposes.",
      ],
    },
    {
      type: "text",
      title: "Use of Cookies",
      paragraphs: [
        "Cookies provide information regarding the computer used by a visitor. We may use cookies where appropriate to gather information about your computer in order to assist us in improving our website. We may gather information about your general internet use by using the cookie. Where used, these cookies are downloaded to your computer and stored on the computer’s hard drive. Such information will not identify you personally. It is statistical data. This statistical data does not identify any personal details whatsoever you can adjust the settings on your computer to decline any cookies if you wish. This can easily be done by activating the reject cookies setting on your computer. Our advertisers may also use cookies, over which we have no control. Such cookies (if used) would be downloaded once you click on advertisements on our website.",
      ],
    },
    {
      type: "list",
      title: "How We Use Your Information",
      intro: "",
      ordered: false,
      items: [
        "To provide information to you that you request from us relating to our services.",
        "To provide information to you relating to other products that may be of interest to you. Such additional information will only be provided where you have consented to receive such information.",
        "To inform you of any changes to our website, services or goods and products.",
      ],
    },
    {
      type: "text",
      title: "",
      paragraphs: [
        "If you have previously got services from us we may provide to you details of similar goods or services, or other goods and services, that you may be interested in. Where your consent has been provided in advance we may allow selected third parties to use your data to enable them to provide you with information regarding unrelated goods and services which we believe may interest you. Where such consent has been provided it can be withdrawn by you at any time.",
      ],
    },
    {
      type: "text",
      title: "Storing Your Personal Data",
      paragraphs: [
        "In operating our website it may become necessary to transfer data that we collect from you to locations outside of the Indian Subcontinent for processing and storing. By providing your personal data to us, you agree to this transfer, storing or processing. We do our utmost to ensure that all reasonable steps are taken to make sure that your data is treated stored securely.",
        "Unfortunately the sending of information via the internet is not totally secure and on occasion such information can be intercepted. We cannot guarantee the security of data that you choose to send us electronically, sending such information is entirely at your own risk.",
      ],
    },
    {
      type: "contact",
      title: "Contact Us",
      text: `Please do not hesitate to contact us regarding any matter relating to this Privacy Policy at ${SUPPORT_EMAIL} or write to us at ${TRUST_NAME}, ${TRUST_ADDRESS}.`,
      email: SUPPORT_EMAIL,
      phone: "",
      linkLabel: "",
      linkHref: "",
    },
    {
      type: "text",
      title: "",
      paragraphs: [
        `This privacy policy may be revised/modified/amended at any point of time at the sole discretion of the ${TRUST_NAME}.`,
      ],
    },
  ],
};

const TERMS: ContentPageDefault = {
  hero: {
    title: "Terms & Conditions",
    subtitle: "The terms that govern your use of this website.",
  },
  breadcrumb: [{ label: "Terms & Conditions", href: "" }],
  intro: [
    `Welcome to ${SITE_DOMAIN} site/website. This site is owned managed and operated by (${TRUST_NAME}) or ‘us’ or ‘we’, having its trust registration number is [trust registration number and place of registration]. If you continue to browse and use this website you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern ${TRUST_NAME} relationship with you in relation to this website. The term ‘you’ refers to the user or viewer of our website.`,
  ],
  blocks: [
    {
      type: "list",
      title: "The use of this website is subject to the following terms of use",
      intro: "",
      ordered: false,
      items: [
        "The content of the pages of this website is for your general information and use only. It is subject to change without notice.",
        "Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.",
        "Your use of any information or materials on this website is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through this website meet your specific requirements.",
        "This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.",
        "All trademarks reproduced in this website which are not the property of, or licensed to, the operator are acknowledged on the website.",
        "Unauthorised use of this website may give rise to a claim for damages and/or be a criminal offence.",
      ],
    },
    {
      type: "text",
      title: "Dispute and Jurisdiction",
      paragraphs: [
        "Any Disputes are subject to the laws of India & in the jurisdiction of Coimbatore.",
      ],
    },
    {
      type: "text",
      title: "Copyright & Trademark",
      paragraphs: [
        `Company and its suppliers and licencors expressly reserve all intellectual property rights in all text, processes, programs, products, technology, content and other materials, which appear on this Site. Access to this Site does not confer and shall not be considered as conferring upon anyone any license under any of Company or any third party’s intellectual property rights. All rights, including copyright, in this Site are owned by or licensed to Trust. Any use of this Site or its Contents, including copying or storing it or them in whole or part, other than for your own personal, non-commercial use is prohibited without the permission of the Trust. You may not modify, distribute or re-post anything on this Site for any purpose. Trust names and logos and all related product and service names, design marks and slogans are the trademarks or service marks of ${TRUST_NAME}.`,
      ],
    },
    {
      type: "text",
      title: "Disclaimer",
      paragraphs: [
        `The information contained in this website is for general information purposes only. The information is provided by ${TRUST_NAME} and while we endeavour to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose. Visitors should confirm the accuracy, completeness and currency of information and/or availability of service/offer with the respective authorized officials concerned, particularly before taking any step based upon such information at that particular point of time.`,
        "Any reliance you place on such information is therefore strictly at your own risk. In no event will we be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits are arising out of, or in connection with, the use of this website.",
        `Through this website, you are able to link to other websites, which are not under the control of ${TRUST_NAME}. We have no control over the nature, content and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.`,
        `Every effort is made to keep the website up and running smoothly. However, ${TRUST_NAME} takes no responsibility for, and will not be liable for, the website being temporarily unavailable due to technical issues beyond our control.`,
      ],
    },
  ],
};

const SUPPORT: ContentPageDefault = {
  hero: {
    title: "Contact Support",
    subtitle: "Get in touch with the JCT Institutions support desk.",
  },
  breadcrumb: [{ label: "Contact Support", href: "" }],
  intro: [
    "For any question about this website, our programmes, an admission enquiry, or a matter relating to our Privacy Policy or Terms & Conditions, please write to us. We respond to support requests on working days.",
  ],
  blocks: [
    {
      type: "contact",
      title: "Support Desk",
      text: `Email us and we will get back to you. You can also write to us at ${TRUST_NAME}, ${TRUST_ADDRESS}.`,
      email: SUPPORT_EMAIL,
      phone: "",
      linkLabel: "",
      linkHref: "",
    },
    {
      type: "text",
      title: "Postal Address",
      paragraphs: [`${TRUST_NAME}\n${TRUST_ADDRESS}`],
    },
    {
      type: "list",
      title: "Before You Write",
      intro:
        "These pages answer the questions the support desk is asked most often.",
      ordered: false,
      items: [
        "Privacy Policy — what personal data this website collects and how it is used: /privacy",
        "Terms & Conditions — the terms, disclaimer and copyright notice governing this website: /terms",
      ],
    },
  ],
};

const CONTENT_PAGE_DEFAULTS: Record<string, ContentPageDefault> = {
  privacy: PRIVACY,
  terms: TERMS,
  support: SUPPORT,
};

/** Seed content for `slug`, or undefined when the page starts blank. */
export function contentPageDefault(
  slug: string,
): ContentPageDefault | undefined {
  return CONTENT_PAGE_DEFAULTS[slug];
}
