# CouponPress

CouponPress turns one coupon or ticket image into a full, print-ready sheet. Set the number of columns and rows, adjust image fitting and spacing, choose cut-line styles, then export a PDF or print the layout directly.

**Live tool:** https://couponpress.pages.dev/

## Features

- Repeat a single PNG, JPG/JPEG, GIF, or WebP image across a configurable grid (1–15 columns and 1–60 rows).
- Preview the sheet as you change the grid, image fit, scale, cut lines, and cell background.
- Import an image by file picker, drag-and-drop, or clipboard paste.
- Export a PDF or print directly on long bond paper (8.5 × 14 inches).
- Runs in the browser; the selected image is read locally and is not uploaded to a CouponPress server.
- Responsive controls and preview for desktop, tablet, and mobile screens.

## Use it

1. Open https://couponpress.pages.dev/ in a modern browser.
2. Select, drop, or paste your coupon design.
3. Set columns and rows. The total coupon count updates with the preview.
4. Choose a cut-line style, image fit, scale, and background color.
5. Select **Download PDF** or **Print directly**.

The default grid is 5 × 20 (100 coupons). The PDF and direct-print layout target 8.5 × 14-inch long bond paper. For physical printing, choose the matching paper size and use 100% scale / actual size. Printer margins and printable areas vary by device, so check the print preview before producing a batch.

## Run locally

This is a static, single-page app. Open `index.html` in a modern browser, or serve the directory with any static HTTP server. PDF export uses jsPDF and html2canvas loaded from CDN, so those libraries require an internet connection unless you replace the CDN dependencies with local copies. The rest of the interface and image selection run client-side.

## Privacy

CouponPress does not send the selected coupon image to a project backend. The page loads jsPDF and html2canvas from cdnjs and web fonts from Google Fonts; those external services may receive normal network request metadata when their resources load. PDF generation happens in the browser.