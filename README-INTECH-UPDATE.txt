INTECH MOTORS SITE UPDATE

Changes:
- Kept the existing logo, gold/black visual design, and car animations.
- Removed the public Car Type selector and removed Car Type from the PDF.
- Public estimate uses one standard rate per service (the previous Sedan/middle-column rates were selected as the starting point). Verify every rate in assets/js/services.js before publishing.
- Customer name is limited to 40 characters.
- Mobile number accepts exactly 10 digits on estimate and contact forms.
- Added admin.html, an owner invoice-generator prototype. Open /admin.html and use PIN 2580 for local testing.
- Invoice PDF uses the same logo and PDF layout, with INVOICE title and actual-work line items.

IMPORTANT SECURITY:
The admin PIN is stored in browser JavaScript and is visible to anyone who can inspect/download the website files. It is NOT secure owner-only access. Do not publish this prototype as a private customer-data system. For real privacy, protect admin.html and invoice generation with server-side authentication and authorization (for example, a backend/API with hashed passwords and protected sessions). This ZIP does not include a backend.

IMPORTANT BILLING:
The invoice generator currently calculates line-item totals only. It does not calculate GST, CGST/SGST, discounts, GSTIN, HSN/SAC, or payment status. Add the correct business/tax details and confirm GST requirements with your accountant before using it as a tax invoice.

Before deploying:
1. Review all service rates in assets/js/services.js.
2. Test the estimate form and PDF.
3. Treat admin.html as a prototype until server-side authentication is added.
