Simple Shop Demo

This is a minimal static demo shop to preview product listing, cart, and a demo checkout.

How to run (local):

1. Open PowerShell and run:

```powershell
cd "C:\Users\user\OneDrive\Desktop\ZUHAIR\shop"
python -m http.server 8001
```

2. Open http://localhost:8001 in your browser.

Notes:
- This demo stores cart and orders in `localStorage` (no real payments).
- To add real payments, integrate Stripe/PayPal and send orders to a server or Firestore.
- You can copy the `products.json` contents into your production product DB.
