import {
	baseEmailStyles,
	brandFooter,
	dark,
	emailHeader,
	light,
	securityFooter,
	statusBlock,
} from "../theme.js";

export default ({ name }: { name: string }) => ({
	subject: "Welcome to ExpertMirrorCon!",

	html: `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to ExpertMirrorCon</title>

  <style>
    ${baseEmailStyles}

    .welcome-paragraph {
      font-size: 16px;
      line-height: 1.6;
      color: ${light.textSecondary};
    }

    .cta-btn {
      display: inline-block;
      padding: 12px 28px;
      background: ${light.primary};
      color: #000;
      text-decoration: none;
      border-radius: 25px;
      margin-top: 28px;
      font-weight: 600;
      text-align: center;
    }

    @media (prefers-color-scheme: dark) {
      .welcome-paragraph {
        color: ${dark.textSecondary} !important;
      }
      .cta-btn {
        background: ${dark.primary} !important;
        color: #000 !important;
      }
    }

    [data-ogsc] .welcome-paragraph {
      color: ${dark.textSecondary} !important;
    }

    [data-ogsc] .cta-btn {
      background: ${dark.primary} !important;
      color: #000 !important;
    }
  </style>
</head>

<body>
  <div class="container">

    ${emailHeader("Welcome to ExpertMirrorCon")}

    <p>Hello <strong>${name}</strong>,</p>

    <p class="welcome-paragraph">
      Welcome to <strong>ExpertMirrorCon</strong> — Your reliable gateway to trading Stocks, Fiat currencies,
       Exchange-traded funds, Options and futures and other tradable assets.
    </p>

    <p class="welcome-paragraph">
     Whether you want to buy, sell, hold, or stake digital assets — or trade traditional securities — 
     ExpertMirrorCon makes it simple, fast, and secure.
    </p>

    ${statusBlock({
			heading: "Here's What You Can Expect:",
			border: light.primary,
			bg: light.muted,
			text: light.textPrimary,
			bullets: [
				"Intuitive multi-asset trading and portfolio management",
				"Fast order execution, instant transfers, and staking options",
				"Robust security and compliance measures",
				"A focused community and high-quality customer service",
			],
		})}

    <a href="https://expertmirrorcon.com" class="cta-btn">Continue Exploring</a>

    ${securityFooter}
    ${brandFooter}

  </div>
</body>

</html>`,
});
