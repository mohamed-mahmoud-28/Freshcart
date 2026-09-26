import type { Metadata } from 'next'
import LegalPage from '@/_components/LegalPage'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn what information FreshCart uses to manage your account, cart, wishlist, and orders.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return <LegalPage
    title="Privacy Policy"
    intro="This page describes the information FreshCart uses to provide account, shopping, delivery, and support features. We aim to collect only what those features need."
    sections={[
      { title: 'Information you provide', paragraphs: ['When you register or use your account, we use details such as your name, email address, and phone number. If you save an address or place an order, we also use the delivery details you submit.', 'You can choose whether to save an address to your account. Do not include sensitive information in address or support fields unless it is needed to resolve your request.'] },
      { title: 'How information is used', paragraphs: ['Account and contact details are used to sign you in, maintain your profile, and help with account requests. Cart, wishlist, address, and order information is used to provide the shopping and checkout features you request.', 'We may use information you send to support to respond to your questions and resolve order issues.'] },
      { title: 'Service providers', paragraphs: ['FreshCart uses the Route E-commerce API to provide store data and account-related services. When you choose an online payment option, the payment flow may be handled by the payment provider shown at checkout. Those services process information under their own privacy terms.'] },
      { title: 'Storage and security', paragraphs: ['We use reasonable safeguards for information handled by the application. No online service can guarantee complete security, so please use a unique password and keep it private.', 'Some information is kept as long as needed to provide your account and order history, meet applicable requirements, or handle support requests. You may contact support to ask about your account information.'] },
      { title: 'Cookies and similar storage', paragraphs: ['The site may use browser storage and cookies needed for sign-in, session handling, and core shopping features. Blocking them may prevent parts of the store from working correctly.'] },
      { title: 'Your choices and updates', paragraphs: ['You can update profile details and saved addresses through your account pages. For questions or requests about personal information, email support@freshcart.com.', 'We may update this policy as the service changes. The current version will be available on this page.'] },
    ]}
  />
}
