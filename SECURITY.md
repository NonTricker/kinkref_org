# Security Policy

> **Version**: v1.0
> **Last Updated**: 2026-05-02

---

## Supported Versions

This project follows a rolling-release model. Only the latest deployed version on `main` branch receives security updates.

| Version | Supported |
| ------- | --------- |
| `main` (latest) | ✅ |
| Older commits | ❌ |

---

## Reporting a Vulnerability

If you discover a security vulnerability, please **do not open a public GitHub issue**.

### How to Report

1. Email the maintainer at the address listed on the site's Contact page
2. Subject line should start with `[SECURITY]`
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested mitigation (if any)

### What to Expect

| Stage | Timeframe |
|-------|-----------|
| Initial acknowledgement | Within 72 hours |
| Severity assessment | Within 7 days |
| Fix or mitigation plan | Within 30 days for high-severity issues |
| Public disclosure | After fix is deployed |

### Scope

The following are in scope for security reports:

- ✅ XSS / CSRF / injection vulnerabilities in the site
- ✅ Authentication or session-related issues (if any)
- ✅ Build pipeline supply-chain risks
- ✅ Dependency vulnerabilities affecting deployed code
- ✅ Privacy leaks (e.g., contributor identity exposure)

The following are **out of scope**:

- ❌ Issues in third-party services (report to them directly)
- ❌ Social engineering of maintainers
- ❌ Physical security
- ❌ Content disputes (use Issues instead)

---

## Privacy & Contributor Safety

This project takes contributor privacy seriously. If you discover any of the following, please report them as security issues:

- A contributor's pseudonym is linkable to their real identity through site data
- Commit metadata leaks information that should be anonymous
- Build artifacts contain sensitive information
- Search index exposes content marked as private

For the project's overall privacy / OPSEC philosophy, see [`CONTRIBUTING.md`](./CONTRIBUTING.md) § 3.

---

## Public Acknowledgement

Reporters who follow responsible disclosure will be credited (if they wish) in:

- A `SECURITY-ACKNOWLEDGEMENTS.md` file (created on first acknowledgement)
- The relevant fix commit message

You may choose to remain anonymous.

---

## Out of Scope: Content Concerns

If your concern is about **content** (factual errors, citation issues, scope disputes), please use:

- [GitHub Issues](../../issues) for public discussion
- Email for sensitive content concerns

Content concerns are not security issues.

---

*SECURITY.md v1.0 — 2026-05-02*
