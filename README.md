# Sahana Puttabasaviah - Rena Template Kit

This folder contains the complete, exact source files and folder structure extracted from [https://thanksfortoday.studio/rena/](https://thanksfortoday.studio/rena/).

## Structure Overview
- `index.html` - Homepage
- `template-kit/` - Complete Template Kit pages:
  - `home/`
  - `about/`
  - `service/`
  - `project/`
  - `project-detail/`
  - `blog/`
  - `contact/`
  - `testi/`
  - `404/`
- `2026/06/18/` - Blog posts
- `wp-content/`
  - `themes/hello-elementor/` - Hello Elementor theme assets, css, and configs
  - `plugins/` - Elementor, ElementsKit, Jeg Elementor Kit, Header Footer Elementor, MetForm assets
  - `uploads/sites/108/` - All high-resolution images, thumbnails, banners, and Elementor generated CSS
- `wp-includes/` - Core WordPress frontend libraries (jQuery, React runtime, emojis)

## How to View Locally
1. **Directly open in browser**: You can double-click `index.html` or open it directly in Google Chrome / Edge.
2. **Via local web server**:
   ```bash
   npx serve .
   # or
   python -m http.server 3000
   ```
   Then open `http://localhost:3000`.
