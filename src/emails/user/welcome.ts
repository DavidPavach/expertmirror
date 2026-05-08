import {
	baseEmailStyles,
	brandFooter,
	dark,
	emailHeader,
	light,
	primaryButton,
	securityFooter,
	statusBlock,
} from "../theme.js";

export default ({ name }: { name: string }) => ({
	subject: "Welcome to Expertmirrorcon ✨",

	html: `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>
    Welcome to Expertmirrorcon
  </title>

  <style>
    ${baseEmailStyles}

    .content {
      padding: 42px 40px;
    }

    .welcome-text {
      font-size: 15px;
      line-height: 1.8;
      color: ${light.textSecondary};
      margin-bottom: 18px;
    }

    .intro-card {
      margin: 32px 0;

      padding: 24px;

      background:
        linear-gradient(
          180deg,
          rgba(59, 184, 255, 0.08) 0%,
          rgba(125, 211, 252, 0.04) 100%
        );

      border:
        1px solid rgba(59, 184, 255, 0.12);

      border-radius: 20px;
    }

    .intro-title {
      margin: 0 0 10px;

      font-size: 18px;
      font-weight: 700;

      color: ${light.textPrimary};
    }

    .intro-description {
      margin: 0;

      font-size: 15px;
      line-height: 1.8;

      color: ${light.textSecondary};
    }

    .feature-grid {
      margin: 32px 0;
    }

    .feature-item {
      padding: 18px 0;

      border-bottom:
        1px solid ${light.border};
    }

    .feature-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .feature-title {
      margin: 0 0 6px;

      font-size: 15px;
      font-weight: 700;

      color: ${light.textPrimary};
    }

    .feature-description {
      margin: 0;

      font-size: 14px;
      line-height: 1.7;

      color: ${light.textSecondary};
    }

    .closing {
      margin-top: 32px;
    }

    .signature {
      margin-top: 18px;

      font-size: 15px;
      font-weight: 600;

      color: ${light.textPrimary};
    }

    @media (prefers-color-scheme: dark) {
      .welcome-text,
      .intro-description,
      .feature-description {
        color: ${dark.textSecondary} !important;
      }

      .intro-card {
        background:
          linear-gradient(
            180deg,
            rgba(125, 211, 252, 0.08) 0%,
            rgba(167, 139, 250, 0.05) 100%
          ) !important;

        border-color:
          rgba(125, 211, 252, 0.12) !important;
      }

      .intro-title,
      .feature-title,
      .signature {
        color: ${dark.textPrimary} !important;
      }

      .feature-item {
        border-color: ${dark.border} !important;
      }
    }

    [data-ogsc] .welcome-text,
    [data-ogsc] .intro-description,
    [data-ogsc] .feature-description {
      color: ${dark.textSecondary} !important;
    }

    [data-ogsc] .intro-title,
    [data-ogsc] .feature-title,
    [data-ogsc] .signature {
      color: ${dark.textPrimary} !important;
    }

    [data-ogsc] .intro-card {
      background:
        linear-gradient(
          180deg,
          rgba(125, 211, 252, 0.08) 0%,
          rgba(167, 139, 250, 0.05) 100%
        ) !important;

      border-color:
        rgba(125, 211, 252, 0.12) !important;
    }

    [data-ogsc] .feature-item {
      border-color: ${dark.border} !important;
    }
  </style>
</head>

<body>
  <div class="wrapper">

    <div class="container">

      ${emailHeader(
				"Welcome to Expertmirrorcon",
				"The modern platform for secure investing, smart portfolio growth, and seamless multi-asset trading.",
			)}

      <div class="content">

        <p class="welcome-text">
          Hello <strong>${name}</strong>,
        </p>

        <p class="welcome-text">
          We're excited to welcome you to
          <strong>Expertmirrorcon</strong> —
          your premium gateway to modern investing
          and multi-asset trading.
        </p>

        <div class="intro-card">
          <h3 class="intro-title">
            Built for modern investors
          </h3>

          <p class="intro-description">
            Access global financial markets,
            manage your portfolio intelligently,
            and explore a seamless experience
            designed around speed, security,
            and simplicity.
          </p>
        </div>

        ${statusBlock({
					heading: "What you can do with Expertmirrorcon",
					border: light.primary,
					bg: light.muted,
					text: light.textPrimary,
					bullets: [
						"Trade stocks, ETFs, forex, options, and other global assets",
						"Access fast execution with real-time portfolio management",
						"Enjoy enterprise-grade security and account protection",
						"Track investments with a clean and intuitive experience",
					],
				})}

        <div class="feature-grid">

          <div class="feature-item">
            <p class="feature-title">
              Smart Portfolio Tracking
            </p>

            <p class="feature-description">
              Monitor your positions, balances,
              and asset performance in real time.
            </p>
          </div>

          <div class="feature-item">
            <p class="feature-title">
              Secure & Reliable
            </p>

            <p class="feature-description">
              Advanced protection systems and
              compliance-first infrastructure
              keep your account safe.
            </p>
          </div>

          <div class="feature-item">
            <p class="feature-title">
              Fast & Intuitive Experience
            </p>

            <p class="feature-description">
              Enjoy a modern platform optimized
              for speed, accessibility, and
              seamless navigation.
            </p>
          </div>

        </div>

        ${primaryButton("Start Exploring", "https://expertmirrorcon.com")}

        <div class="closing">

          <p class="welcome-text">
            Thank you for choosing
            Expertmirrorcon.
          </p>

          <p class="welcome-text">
            We look forward to helping you
            grow confidently in today's
            financial markets.
          </p>

          <p class="signature">
            — The Expertmirrorcon Team
          </p>

        </div>

        ${securityFooter}

      </div>

      ${brandFooter}

    </div>

  </div>
</body>

</html>`,
});
