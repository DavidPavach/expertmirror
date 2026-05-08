import {
	baseEmailStyles,
	brandFooter,
	detailsBox,
	emailHeader,
	light,
	primaryButton,
	securityFooter,
	statusBlock,
} from "../theme.js";

export default ({
	name,
	ip,
	userAgent,
	location,
	date,
}: {
	name: string;
	ip: string;
	userAgent: string;
	location: {
		city: string;
		region: string;
		country: string;
	};
	date: string;
}) => ({
	subject: "New Login Detected 🔐",

	html: `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>
    New Login Alert
  </title>

  <style>
    ${baseEmailStyles}

    .content {
      padding: 42px 40px;
    }

    .paragraph {
      margin-bottom: 18px;

      font-size: 15px;
      line-height: 1.8;

      color: ${light.textSecondary};
    }

    .alert-card {
      margin: 30px 0;

      padding: 22px;

      border-radius: 18px;

      background:
        linear-gradient(
          180deg,
          rgba(245, 158, 11, 0.08) 0%,
          rgba(245, 158, 11, 0.04) 100%
        );

      border:
        1px solid rgba(245, 158, 11, 0.16);
    }

    .alert-title {
      margin: 0 0 10px;

      font-size: 16px;
      font-weight: 700;

      color: #b45309;
    }

    .alert-text {
      margin: 0;

      font-size: 14px;
      line-height: 1.75;

      color: ${light.textSecondary};
    }

    .security-note {
      margin-top: 28px;

      padding: 22px;

      border-radius: 18px;

      background:
        linear-gradient(
          180deg,
          rgba(239, 68, 68, 0.06) 0%,
          rgba(239, 68, 68, 0.03) 100%
        );

      border:
        1px solid rgba(239, 68, 68, 0.12);
    }

    .security-note-title {
      margin: 0 0 10px;

      font-size: 15px;
      font-weight: 700;

      color: #dc2626;
    }

    .security-note-text {
      margin: 0;

      font-size: 14px;
      line-height: 1.75;

      color: ${light.textSecondary};
    }

    .signature {
      margin-top: 32px;

      font-size: 15px;
      font-weight: 600;

      color: ${light.textPrimary};
    }

    @media (prefers-color-scheme: dark) {
      .paragraph,
      .alert-text,
      .security-note-text {
        color: #cbd5e1 !important;
      }

      .alert-card {
        background:
          linear-gradient(
            180deg,
            rgba(245, 158, 11, 0.12) 0%,
            rgba(245, 158, 11, 0.04) 100%
          ) !important;

        border-color:
          rgba(245, 158, 11, 0.18) !important;
      }

      .security-note {
        background:
          linear-gradient(
            180deg,
            rgba(239, 68, 68, 0.12) 0%,
            rgba(239, 68, 68, 0.04) 100%
          ) !important;

        border-color:
          rgba(239, 68, 68, 0.18) !important;
      }

      .signature {
        color: #f8fafc !important;
      }
    }

    [data-ogsc] .paragraph,
    [data-ogsc] .alert-text,
    [data-ogsc] .security-note-text {
      color: #cbd5e1 !important;
    }

    [data-ogsc] .signature {
      color: #f8fafc !important;
    }

    [data-ogsc] .alert-card {
      background:
        linear-gradient(
          180deg,
          rgba(245, 158, 11, 0.12) 0%,
          rgba(245, 158, 11, 0.04) 100%
        ) !important;

      border-color:
        rgba(245, 158, 11, 0.18) !important;
    }

    [data-ogsc] .security-note {
      background:
        linear-gradient(
          180deg,
          rgba(239, 68, 68, 0.12) 0%,
          rgba(239, 68, 68, 0.04) 100%
        ) !important;

      border-color:
        rgba(239, 68, 68, 0.18) !important;
    }
  </style>
</head>

<body>

  <div class="wrapper">

    <div class="container">

      ${emailHeader(
				"New Login Detected",
				"We detected a new sign-in to your Expertmirrorcon account.",
			)}

      <div class="content">

        <p class="paragraph">
          Hi <strong>${name}</strong>,
        </p>

        <p class="paragraph">
          A new login session was recently detected
          on your Expertmirrorcon account.
        </p>

        <div class="alert-card">

          <p class="alert-title">
            Login Activity Detected
          </p>

          <p class="alert-text">
            If this was you, no further action
            is required. Otherwise, please secure
            your account immediately.
          </p>

        </div>

        ${statusBlock({
					heading: "Login Activity Details",
					border: "#f59e0b",
					bg: "rgba(245, 158, 11, 0.08)",
					text: "#b45309",
					bullets: [
						"A successful login was made to your account",
						"Review the session details below carefully",
						"If this activity was not recognized, reset your password immediately",
					],
				})}

        ${detailsBox([
					{
						label: "IP Address",
						value: ip,
					},
					{
						label: "Location",
						value: `${location.city}, ${location.region}, ${location.country}`,
					},
					{
						label: "Device / Browser",
						value: userAgent,
					},
					{
						label: "Date & Time",
						value: date,
					},
				])}

        <div class="security-note">

          <p class="security-note-title">
            Didn't recognize this login?
          </p>

          <p class="security-note-text">
            Reset your password immediately and
            contact our support team to help secure
            your account and prevent unauthorized access.
          </p>

        </div>

        ${primaryButton("Secure My Account", "https://expertmirrorcon.com")}

        <p class="signature">
          — Expertmirrorcon Security Team
        </p>

        ${securityFooter}

      </div>

      ${brandFooter}

    </div>

  </div>

</body>

</html>`,
});
