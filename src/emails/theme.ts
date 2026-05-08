export const light = {
	background: "#f3f7fb",
	card: "#ffffff",

	textPrimary: "#101828",
	textSecondary: "#667085",

	primary: "#3bb8ff",
	primaryDark: "#1890d8",

	accent: "#7dd3fc",

	muted: "#f2f4f7",
	mutedDark: "#e4e7ec",

	border: "#e4e7ec",

	success: "#12b76a",
	warning: "#f79009",
	danger: "#f04438",

	shadow: "0 10px 40px rgba(16, 24, 40, 0.08)",

	heroGradient:
		"linear-gradient(135deg, #3bb8ff 0%, #7dd3fc 45%, #8b5cf6 100%)",
};

export const dark = {
	background: "#0f1728",
	card: "#172033",

	textPrimary: "#f8fafc",
	textSecondary: "#cbd5e1",

	primary: "#7dd3fc",
	primaryDark: "#38bdf8",

	accent: "#a78bfa",

	muted: "#1e293b",
	mutedDark: "#273449",

	border: "#334155",

	success: "#32d583",
	warning: "#fdb022",
	danger: "#f97066",

	shadow: "0 10px 40px rgba(0, 0, 0, 0.35)",

	heroGradient:
		"linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #a78bfa 100%)",
};

// --------------------------
// EMAIL BASE STYLES
// --------------------------

export const baseEmailStyles = `
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 32px 16px;
    background: ${light.background};
    font-family:
      Inter,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;

    color: ${light.textPrimary};

    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  .wrapper {
    width: 100%;
    padding: 24px 0;
  }

  .container {
    max-width: 620px;
    margin: 0 auto;

    background: ${light.card};

    border: 1px solid ${light.border};
    border-radius: 24px;

    overflow: hidden;

    box-shadow: ${light.shadow};
  }

  .hero {
    padding: 56px 40px;

    background: ${light.heroGradient};

    text-align: center;
  }

  .logo {
    width: 64px;
    height: 64px;

    object-fit: contain;

    margin-bottom: 18px;
  }

  .title {
    margin: 0;

    font-size: 30px;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.1;

    color: #ffffff;
  }

  .subtitle {
    margin: 14px auto 0;

    max-width: 460px;

    font-size: 15px;
    line-height: 1.7;

    color: rgba(255,255,255,0.88);
  }

  .content {
    padding: 40px;
  }

  p {
    margin: 0 0 16px;

    font-size: 15px;
    line-height: 1.75;

    color: ${light.textSecondary};
  }

  .details {
    margin: 32px 0;
    padding: 24px;

    background: ${light.muted};

    border: 1px solid ${light.border};
    border-radius: 18px;
  }

  .detail-row {
    padding: 12px 0;

    border-bottom: 1px solid ${light.border};
  }

  .detail-row:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .detail-label {
    display: block;

    margin-bottom: 6px;

    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;

    color: ${light.textSecondary};
  }

  .detail-value {
    font-size: 15px;
    font-weight: 600;

    color: ${light.textPrimary};

    word-break: break-word;
  }

  .button {
    display: inline-block;

    padding: 14px 24px;

    background: ${light.heroGradient};

    color: #ffffff !important;

    border-radius: 999px;

    font-size: 14px;
    font-weight: 700;

    text-decoration: none;

    box-shadow:
      0 8px 24px rgba(59, 184, 255, 0.24);
  }

  .status {
    padding: 18px 20px;

    border-radius: 16px;

    margin-bottom: 18px;
  }

  .status-heading {
    margin: 0 0 10px;

    font-size: 15px;
    font-weight: 700;
  }

  .status-text {
    margin: 0 0 8px;

    font-size: 14px;
    line-height: 1.7;
  }

  .security {
    margin-top: 32px;

    padding: 22px;

    background: rgba(59, 184, 255, 0.08);

    border: 1px solid rgba(59, 184, 255, 0.16);
    border-radius: 16px;
  }

  .security p {
    margin-bottom: 10px;
  }

  .footer {
    padding: 32px 40px 40px;

    text-align: center;

    border-top: 1px solid ${light.border};

    font-size: 13px;
    line-height: 1.7;

    color: ${light.textSecondary};
  }

  .brand {
    color: ${light.primaryDark};
    font-weight: 700;
  }

  a {
    color: ${light.primaryDark};
    text-decoration: none;
  }

  /* -------------------------- */
  /* DARK MODE */
  /* -------------------------- */

  @media (prefers-color-scheme: dark) {
    body {
      background: ${dark.background} !important;
      color: ${dark.textPrimary} !important;
    }

    .container {
      background: ${dark.card} !important;
      border-color: ${dark.border} !important;
      box-shadow: ${dark.shadow} !important;
    }

    .hero {
      background: ${dark.heroGradient} !important;
    }

    p {
      color: ${dark.textSecondary} !important;
    }

    .details {
      background: ${dark.muted} !important;
      border-color: ${dark.border} !important;
    }

    .detail-row {
      border-color: ${dark.border} !important;
    }

    .detail-label {
      color: ${dark.textSecondary} !important;
    }

    .detail-value {
      color: ${dark.textPrimary} !important;
    }

    .security {
      background: rgba(125, 211, 252, 0.08) !important;
      border-color: rgba(125, 211, 252, 0.16) !important;
    }

    .footer {
      border-color: ${dark.border} !important;
      color: ${dark.textSecondary} !important;
    }

    .brand,
    a {
      color: ${dark.primary} !important;
    }
  }

  /* -------------------------- */
  /* OUTLOOK / GMAIL DARK FIX */
  /* -------------------------- */

  [data-ogsc] body {
    background: ${dark.background} !important;
    color: ${dark.textPrimary} !important;
  }

  [data-ogsc] .container {
    background: ${dark.card} !important;
    border-color: ${dark.border} !important;
  }

  [data-ogsc] .hero {
    background: ${dark.heroGradient} !important;
  }

  [data-ogsc] p {
    color: ${dark.textSecondary} !important;
  }

  [data-ogsc] .details {
    background: ${dark.muted} !important;
    border-color: ${dark.border} !important;
  }

  [data-ogsc] .detail-row {
    border-color: ${dark.border} !important;
  }

  [data-ogsc] .detail-value {
    color: ${dark.textPrimary} !important;
  }

  [data-ogsc] .footer {
    border-color: ${dark.border} !important;
    color: ${dark.textSecondary} !important;
  }

  [data-ogsc] .brand,
  [data-ogsc] a {
    color: ${dark.primary} !important;
  }
`;

// --------------------------
// COMPONENTS
// --------------------------

export const emailHeader = (title: string, subtitle?: string) => `
  <div class="hero">
    <img
      class="logo"
      src="https://res.cloudinary.com/dpmx02shl/image/upload/v1778249399/logo_hw2gyf.png"
      alt="Expert Mirror Logo"
    />

    <h1 class="title">${title}</h1>

    ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ""}
  </div>
`;

export const detailsBox = (
	rows: {
		label: string;
		value: string | number;
		isLink?: boolean;
	}[],
) => `
  <div class="details">
    ${rows
			.map(
				(r) => `
        <div class="detail-row">
          <span class="detail-label">${r.label}</span>

          <div class="detail-value">
            ${
							r.isLink
								? `
                <a href="${r.value}">
                  ${r.value}
                </a>
              `
								: r.value
						}
          </div>
        </div>
      `,
			)
			.join("")}
  </div>
`;

export const statusBlock = (opts: {
	border: string;
	bg: string;
	text: string;
	heading: string;
	bullets: string[];
}) => `
  <div
    class="status"
    style="
      border-left: 4px solid ${opts.border};
      background: ${opts.bg};
    "
  >
    <p
      class="status-heading"
      style="color:${opts.text};"
    >
      ${opts.heading}
    </p>

    ${opts.bullets
			.map(
				(b) => `
        <p class="status-text">
          ${b}
        </p>
      `,
			)
			.join("")}
  </div>
`;

export const primaryButton = (label: string, link: string) => `
  <div style="margin:32px 0;">
    <a
      href="${link}"
      class="button"
    >
      ${label}
    </a>
  </div>
`;

export const securityFooter = `
  <div class="security">
    <p>
      <strong>Security Tip:</strong>
      We will never ask for your private keys,
      seed phrase, or sensitive credentials.
    </p>

    <p>
      Need help?
      Contact
      <a href="mailto:support@expertmirrorcon.com">
        Expertmirrorcon Support
      </a>
    </p>
  </div>
`;

export const brandFooter = `
  <div class="footer">
    © ${new Date().getFullYear()}
    <span class="brand">
      Expertmirrorcon
    </span>

    · All rights reserved.
  </div>
`;
