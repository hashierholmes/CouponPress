# CouponPress

A single-file web tool for generating a full sheet of small coupons or tickets from one image. Upload your design once, and it fills an entire long bond paper sheet automatically.

---

## What it does

- Takes one image file and repeats it across a 5-column by 20-row grid (100 coupons per sheet)
- Fits the image inside each slot without cutting or cropping it
- Lets you download the finished sheet as a PDF ready for printing

---

## How to use it

**Step 1 — Open the file**

Download `index.html` and open it in any web browser (Chrome, Edge, Firefox). No installation needed.

**Step 2 — Upload your coupon image**

Click the upload area and choose your image file, or drag and drop the file directly onto it. Supported formats are PNG, JPG, GIF, and WEBP. You can also paste an image directly from your clipboard.

**Step 3 — Adjust the layout (optional)**

The default is 5 columns and 20 rows. You can change these numbers to fit more or fewer coupons on the sheet. The total count updates automatically.

**Step 4 — Change the look (optional)**

- Cut-line style: choose dashed, solid, dotted, or no border between coupons
- Fit mode: "Contain" keeps the full image visible with no cropping (recommended)
- Scale: shrinks the image slightly within each slot if you want a small gap around it
- Background color: sets the color behind the image in each slot

**Step 5 — Download or print**

Click "Download PDF" to save the sheet as a PDF file. The file will appear in your browser's download folder.

Alternatively, click "Print directly" to send it straight to your printer without saving a file first.

---

## Printing tips

- Paper size: Long Bond or Legal (8.5 x 14 inches)
- Margins: set to None in your print settings
- Scale: set to 100%, do not use "fit to page"
- If using a PDF viewer like Adobe Acrobat, use "Actual size" when printing

---

## File format

Everything is contained in a single HTML file. There is no server, no account, and no internet connection required after the page loads. Your image never leaves your computer.

---

## Adjusting columns and rows

The default 5x20 layout gives 100 coupons per sheet. If your coupon design is wider, try reducing the columns. If it is taller, reduce the rows. The preview updates live so you can see the result before downloading.

| Columns | Rows | Total coupons |
|---------|------|---------------|
| 5       | 20   | 100           |
| 4       | 16   | 64            |
| 3       | 12   | 36            |
| 2       | 10   | 20            |

---

## Troubleshooting

**The PDF downloads but prints too small or too large**
Make sure your print settings are at 100% scale and margins are set to None. Avoid "shrink to fit" or "fit to page" options.

**The image looks blurry in the PDF**
Use a high-resolution source image. A minimum of 300 pixels per inch at the intended print size gives the best results.

**The download does not start**
Some browsers block automatic downloads. Check for a blocked download notification near the address bar and allow it.

**The image is getting cut off**
Switch the fit mode to "Contain" in the image settings. This ensures the full image is always visible inside each slot.