#!/usr/bin/env python3
"""Generate multi-page HTML from legacy SPA index.html (one-off generator)."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
BOOT_SCRIPT = (Path(__file__).resolve().parent / "boot-inline-theme.html").read_text(encoding="utf-8")
MAZE_SNIPPET = (Path(__file__).resolve().parent / "maze-universal-snippet.html").read_text(encoding="utf-8")
INDEX = ROOT / "spa-source.html"
if not INDEX.exists():
    INDEX = ROOT / "index.html"
lines = INDEX.read_text(encoding="utf-8").splitlines(keepends=True)


def svg_icon(classes: str, icon_file: str, prefix: str = "", alt: str = "") -> str:
    """Same-document <use href=\"#i-…\">; shell pages must include sprite_embed() before </body>."""
    slug = Path(icon_file).stem
    if slug.startswith("icon24-"):
        slug = slug[7:]
    sid = f"i-{slug}"
    href = f"#{sid}"
    if alt.strip():
        return f'<svg class="{classes}" role="img" aria-label="{alt}" focusable="false"><use href="{href}"/></svg>'
    return f'<svg class="{classes}" aria-hidden="true" focusable="false"><use href="{href}"/></svg>'


def sl(a: int, b: int) -> str:
    return "".join(lines[a - 1 : b])


def extract_view(marker: str) -> str:
    """Slice one top-level view section from spa-source by its banner comment."""
    start = next(i for i, line in enumerate(lines) if marker in line)
    section_start = next(i for i in range(start, len(lines)) if "<section" in lines[i])
    depth = 0
    for i in range(section_start, len(lines)):
        depth += lines[i].count("<section")
        depth -= lines[i].count("</section>")
        if depth == 0:
            return "".join(lines[start : i + 1])
    raise ValueError(f"Unclosed view section for {marker!r}")


def extract_payment_modal() -> str:
    """Payment modal + confirmation overlay block from spa-source."""
    marker = "<!-- ===== PAYMENT FLOW MODAL"
    start = next(i for i, line in enumerate(lines) if marker in line)
    div_start = next(
        i for i in range(start, len(lines)) if '<div class="modal-overlay">' in lines[i]
    )
    depth = 0
    for i in range(div_start, len(lines)):
        depth += lines[i].count("<div")
        depth -= lines[i].count("</div>")
        if depth == 0:
            return "".join(lines[start : i + 1])
    raise ValueError("Unclosed payment modal block")


def sidebar(active: str, prefix: str = "") -> str:
    def nav(name: str, href: str, label: str, icon: str) -> str:
        cur = ' aria-current="page"' if active == name else ""
        act = " sidebar__nav-item--active" if active == name else ""
        return f"""      <a class="sidebar__nav-item{act}" href="{prefix}{href}"{cur}>
        {svg_icon("sidebar__nav-icon", icon, prefix)}
        <span>{label}</span>
      </a>
"""

    return f"""  <aside class="sidebar">
    <div class="sidebar__logo"><a href="{prefix}overview.html">UZ Bank</a></div>
    <nav class="sidebar__nav">
{nav('overview', 'overview.html', 'Overview', 'icon24-home.svg')}{nav('payments', 'payments.html', 'Payments', 'icon24-payments.svg')}{nav('profile', 'profile.html', 'Profile', 'icon24-user.svg')}
    </nav>
    <div class="sidebar__footer">
      <div class="segmented segmented--theme" role="group" aria-label="Theme">
        <button type="button" class="segmented__option" data-set-theme="light">Light</button>
        <button type="button" class="segmented__option segmented__option--active" data-set-theme="dark">Dark</button>
      </div>
      <div class="sidebar__logout">
        <button class="sidebar__logout-btn" type="button" data-analytics="logout_click">
          {svg_icon("sidebar__logout-icon", "icon24-corner-up-right.svg", prefix)}
          <span>Logout</span>
        </button>
      </div>
    </div>
  </aside>
"""


def tabbar(active: str, prefix: str = "") -> str:
    def item(name: str, href: str, icon: str, short: str) -> str:
        cur = ' aria-current="page"' if active == name else ""
        ac = " tab-bar__item--active" if active == name else ""
        iw = " tab-bar__icon-wrap--active" if active == name else ""
        return f"""    <a class="tab-bar__item{ac}" href="{prefix}{href}"{cur}>
      <span class="tab-bar__icon-wrap{iw}">
        {svg_icon("tab-bar__icon", icon, prefix)}
      </span>
      <span class="tab-bar__label">{short}</span>
    </a>
"""

    return f"""  <nav class="tab-bar">
{item('overview', 'overview.html', 'icon24-home.svg', 'Overview')}
{item('payments', 'payments.html', 'icon24-payments.svg', 'Payments')}
{item('profile', 'profile.html', 'icon24-user.svg', 'Profile')}
  </nav>
"""


MODAL_HTML = extract_payment_modal()

ACCOUNT_INFORMATION_OVERLAY = (ROOT / "partials" / "account-information-overlay.html").read_text(encoding="utf-8")
IAT_OVERLAY = (ROOT / "partials" / "iat-overlay.html").read_text(encoding="utf-8")
SHARE_INFORMATION_OVERLAY = (ROOT / "partials" / "share-information-overlay.html").read_text(encoding="utf-8")


def sprite_embed() -> str:
    """Inline defs for same-document <use href=\"#i-…\"> (see sync_icons_sprite.py)."""
    p = ROOT / "assets" / "icons-sprite.svg"
    return (
        '<div id="uzbank-icon-defs" aria-hidden="true" class="uzbank-icon-defs">\n'
        + p.read_text(encoding="utf-8").strip()
        + "\n</div>\n"
    )


def shell(
    title: str,
    screen: str,
    active_nav: str,
    main_inner: str,
    prefix: str = "",
    include_payment_modal: bool = False,
    profile_page: bool = False,
    extra_body_scripts: str = "",
    overlay_after_modal: str = "",
) -> str:
    modal_block = f"\n{MODAL_HTML}\n" if include_payment_modal else ""
    pay_js = (
        (
            f'<script src="{prefix}js/dialog-focus.js"></script>\n'
            f'<script src="{prefix}js/form-field-sheet.js"></script>\n'
            f'<script src="{prefix}js/payment-exit-confirm.js"></script>\n'
            f'<script src="{prefix}js/payment-state.js"></script>\n'
            f'<script src="{prefix}js/data-render.js"></script>\n'
            f'<script src="{prefix}js/scroll-edge-chrome.js"></script>\n'
            f'<script src="{prefix}js/payment-overlay.js"></script>\n'
        )
        if include_payment_modal
        else ""
    )
    if profile_page:
        body_js = (
            f'<script src="{prefix}js/analytics.js"></script>\n'
            f'<script src="{prefix}js/payment-state.js"></script>\n'
            f'<script src="{prefix}js/data-render.js"></script>\n'
            f'<script src="{prefix}js/scroll-edge-chrome.js"></script>\n'
            f'<script src="{prefix}js/app-mp.js"></script>\n'
            f'<script src="{prefix}js/contrast-checker.js"></script>\n'
            f'<script src="{prefix}js/profile-settings.js"></script>\n'
        )
    else:
        body_js = (
            f'<script src="{prefix}js/analytics.js"></script>\n'
            + pay_js
            + f'<script src="{prefix}js/app-mp.js"></script>\n'
        )
    return f"""<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
{MAZE_SNIPPET}  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="format-detection" content="telephone=no">
  <meta name="color-scheme" content="dark light">
  <title>{title}</title>
{BOOT_SCRIPT}
  <link rel="stylesheet" href="{prefix}css/tokens.css">
  <link rel="stylesheet" href="{prefix}css/typography.css">
  <link rel="stylesheet" href="{prefix}css/styles.css">
</head>
<body class="body" data-screen="{screen}" data-page="{screen}">
<div class="app">
{sidebar(active_nav, prefix)}
  <main class="main-content">
    <div class="main-content__inner">
{main_inner}
    </div>
  </main>
{tabbar(active_nav, prefix)}
</div>{modal_block}\n{overlay_after_modal}\n{body_js}{extra_body_scripts}{sprite_embed()}</body>
</html>
"""


def pay_redirect_page(step: str) -> str:
    """Legacy / bookmark URLs → main shell + hash (preserves referrer when possible)."""
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="format-detection" content="telephone=no">
  <title>Opening payment…</title>
  <script>
    (function () {{
      var step = "{step}";
      var fallback = "../overview.html#pay/" + step;
      try {{
        var ref = document.referrer;
        if (ref && ref.indexOf(location.host) >= 0) {{
          var last = ref.split("/").pop().split("?")[0];
          if (/^(overview|payments|account-details|account-information)\\.html$/.test(last)) {{
            location.replace("../" + last + "#pay/" + step);
            return;
          }}
        }}
      }} catch (e) {{}}
      location.replace(fallback);
    }})();
  </script>
</head>
<body>
  <p><a href="../overview.html#pay/{step}">Continue</a></p>
</body>
</html>
"""


def product_links_overview(html: str) -> str:
    html = html.replace(
        '<div class="product-item" data-account="household">',
        '<a class="product-item" href="account-details.html" data-account="household">',
        1,
    )
    html = html.replace(
        '<div class="product-item" data-account="savings">',
        '<a class="product-item" href="account-details.html" data-account="savings">',
        1,
    )
    # Close <a> for household: first product row still ended with </div>
    html = re.sub(
        r'(<a class="product-item" href="account-details.html" data-account="household">[\s\S]*?</span>\s*)</div>(\s*<div class="divider"></div>\s*<a class="product-item" href="account-details.html" data-account="savings">)',
        r"\1</a>\2",
        html,
        count=1,
    )
    html = re.sub(
        r'(<a class="product-item" href="account-details.html" data-account="savings">[\s\S]*?</span>\s*)</div>(\s*<div class="divider"></div>\s*<div class="product-item">\s*<svg class="product-item__icon"[^>]*>[\s\S]*?</svg>)',
        r"\1</a>\2",
        html,
        count=1,
    )
    return html


def account_back_link(html: str) -> str:
    return html.replace(
        """            <button type="button" class="view__nav-btn view__nav-btn--leading view__back" aria-label="Back">
              <svg class="view__nav-btn-icon" aria-hidden="true" focusable="false"><use href="#i-arrow-left"/></svg>
            </button>""",
        """            <a class="view__nav-btn view__nav-btn--leading view__back" href="overview.html" aria-label="Back">
              <svg class="view__nav-btn-icon" aria-hidden="true" focusable="false"><use href="#i-arrow-left"/></svg>
            </a>""",
        1,
    )


# --- Slice sections from SPA (marker comments — resilient to line shifts) ---
overview_sec = extract_view("<!-- ── OVERVIEW ── -->")
account_sec = extract_view("<!-- ── ACCOUNT DETAILS ── -->")
payments_sec = extract_view("<!-- ── PAYMENTS ── -->")
profile_sec = extract_view("<!-- ── PROFILE ── -->")

# SPA hid inactive views with CSS; each standalone page must show its single view.
account_sec = account_sec.replace(
    '<section class="view view--account-details"',
    '<section class="view view--active view--account-details"',
    1,
)
payments_sec = payments_sec.replace(
    '<section class="view view--payments"',
    '<section class="view view--active view--payments"',
    1,
)
profile_sec = profile_sec.replace(
    '<section class="view view--profile"',
    '<section class="view view--active view--profile"',
    1,
)

overview_sec = product_links_overview(overview_sec)

account_sec = account_back_link(account_sec)


# Write root pages (payment modal + hash routing on pages that expose Pay)
(ROOT / "overview.html").write_text(
    shell(
        "UZ Bank – Overview",
        "overview",
        "overview",
        overview_sec,
        "",
        include_payment_modal=True,
        overlay_after_modal="\n" + IAT_OVERLAY.strip() + "\n",
        extra_body_scripts='<script src="js/iat-overlay.js"></script>\n',
    ),
    encoding="utf-8",
)

(ROOT / "account-details.html").write_text(
    shell(
        "UZ Bank – Account details",
        "account-details",
        "overview",
        account_sec,
        "",
        include_payment_modal=True,
        overlay_after_modal="\n" + ACCOUNT_INFORMATION_OVERLAY.strip() + "\n" + SHARE_INFORMATION_OVERLAY.strip() + "\n",
        extra_body_scripts=(
            '<script src="js/account-information.js"></script>\n'
            '<script src="js/share-information.js"></script>\n'
        ),
    ),
    encoding="utf-8",
)

(ROOT / "payments.html").write_text(
    shell(
        "UZ Bank – Payments",
        "payments",
        "payments",
        payments_sec,
        "",
        include_payment_modal=True,
        overlay_after_modal="\n" + IAT_OVERLAY.strip() + "\n",
        extra_body_scripts='<script src="js/iat-overlay.js"></script>\n',
    ),
    encoding="utf-8",
)

(ROOT / "profile.html").write_text(
    shell(
        "UZ Bank – Profile",
        "profile",
        "profile",
        profile_sec,
        "",
        include_payment_modal=False,
        profile_page=True,
    ),
    encoding="utf-8",
)

(ROOT / "account-information.html").write_text(
    """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="format-detection" content="telephone=no">
  <meta name="color-scheme" content="dark light">
  <title>UZ Bank – Account information</title>
  <script>
    (function () {
      try {
        var path = window.location.pathname;
        var q = window.location.search || '';
        var lower = path.toLowerCase();
        var idx = lower.lastIndexOf('account-information.html');
        if (idx >= 0) {
          location.replace(path.slice(0, idx) + 'account-details.html' + q + '#account-information');
        } else {
          location.replace('account-details.html#account-information');
        }
      } catch (e) {
        location.replace('account-details.html#account-information');
      }
    })();
  </script>
</head>
<body class="body">
  <p><a href="account-details.html#account-information">Open account details</a></p>
</body>
</html>
""",
    encoding="utf-8",
)

payment_dir = ROOT / "payment"
payment_dir.mkdir(exist_ok=True)

(ROOT / "payment" / "recipient.html").write_text(pay_redirect_page("recipient"), encoding="utf-8")
(ROOT / "payment" / "amount.html").write_text(pay_redirect_page("amount"), encoding="utf-8")
(ROOT / "payment" / "schedule.html").write_text(pay_redirect_page("schedule"), encoding="utf-8")
(ROOT / "payment" / "summary.html").write_text(pay_redirect_page("summary"), encoding="utf-8")
(ROOT / "payment" / "confirmation.html").write_text(pay_redirect_page("confirmation"), encoding="utf-8")

# index.html → redirect hub
(ROOT / "index.html").write_text(
    """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="format-detection" content="telephone=no">
  <meta http-equiv="refresh" content="0; url=overview.html">
  <title>UZ Bank – Redirecting…</title>
  <link rel="canonical" href="overview.html">
</head>
<body>
  <p><a href="overview.html">Open banking overview</a></p>
</body>
</html>
""",
    encoding="utf-8",
)

print("Wrote multi-page HTML under", ROOT)
