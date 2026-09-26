import type { Metadata } from 'next'
import LegalPage from '@/_components/LegalPage'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read the terms for using FreshCart, placing orders, payments, delivery, and returns.',
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return <LegalPage
    title="Terms of Service"
    intro="These terms explain the basic rules for using FreshCart and placing an order. By creating an account or using the store, you agree to follow them."
    sections={[
      { title: 'Using FreshCart', paragraphs: ['Please provide accurate account, contact, and delivery information, and keep your sign-in details private. You are responsible for activity carried out through your account.', 'Use the store lawfully and do not attempt to disrupt its pages, services, or other customers’ access. We may restrict access when an account is being misused or these terms are being broken.'] },
      { title: 'Products and availability', paragraphs: ['Product descriptions, images, prices, and availability are shown as clearly as possible, but may change. An item in your cart is not reserved until an order is confirmed.', 'If a product or price is incorrect, or an item becomes unavailable, we may contact you to correct or cancel the affected order. We will explain any change before proceeding where practical.'] },
      { title: 'Orders, payment, and delivery', paragraphs: ['Submitting checkout information is a request to place an order. Orders are subject to confirmation and product availability. The available payment and delivery options are shown during checkout.', 'Please check your delivery details before placing an order. Delivery estimates are approximate and can be affected by circumstances outside our control. Any delivery charge is shown before you confirm checkout.'] },
      { title: 'Cancellations and returns', paragraphs: ['For help with a cancellation, return, damaged item, or incorrect order, contact support as soon as possible with your order details. We will review the request and explain the available next steps.', 'Nothing in these terms removes consumer rights that apply to you under local law.'] },
      { title: 'Changes and contact', paragraphs: ['We may update these terms when the store or its services change. The latest version will be published on this page. If a change materially affects your use of the service, we will make reasonable efforts to highlight it.', 'For questions about an order or these terms, email support@freshcart.com.'] },
    ]}
  />
}
