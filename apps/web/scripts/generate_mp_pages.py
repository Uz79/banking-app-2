#!/usr/bin/env python3
"""Generate multi-page HTML from legacy SPA index.html (one-off generator)."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
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


THEME = """  <script>
    (function () {
      try {
        var t = localStorage.getItem('uzBankWebApp11Theme');
        if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
      } catch (e) {}
    })();
  </script>
"""


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
{item('overview', 'overview.html', 'icon24-home.svg', 'Start')}
{item('payments', 'payments.html', 'icon24-payments.svg', 'Payments')}
{item('profile', 'profile.html', 'icon24-user.svg', 'Profile')}
  </nav>
"""


MODAL_HTML = sl(566, 771)


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
) -> str:
    modal_block = f"\n{MODAL_HTML}\n" if include_payment_modal else ""
    pay_js = (
        (
            f'<script src="{prefix}js/form-field-sheet.js"></script>\n'
            f'<script src="{prefix}js/payment-exit-confirm.js"></script>\n'
            f'<script src="{prefix}js/payment-overlay.js"></script>\n'
        )
        if include_payment_modal
        else ""
    )
    return f"""<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark light">
  <title>{title}</title>
{THEME}
  <link rel="stylesheet" href="{prefix}css/tokens.css">
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
</div>{modal_block}<script src="{prefix}js/analytics.js"></script>
{pay_js}<script src="{prefix}js/app-mp.js"></script>
{sprite_embed()}</body>
</html>
"""


def pay_redirect_page(step: str) -> str:
    """Legacy / bookmark URLs → main shell + hash (preserves referrer when possible)."""
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Opening payment…</title>
  <script>
    (function () {{
      var step = "{step}";
      var fallback = "../overview.html#pay/" + step;
      try {{
        var ref = document.referrer;
        if (ref && ref.indexOf(location.host) >= 0) {{
          var last = ref.split("/").pop().split("?")[0];
          if (/^(overview|payments|account-details)\\.html$/.test(last)) {{
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


# --- Slice sections from SPA ---
overview_sec = sl(59, 213)
account_sec = sl(216, 379)
payments_sec = sl(382, 517)
profile_sec = sl(521, 537)

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
    ),
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
