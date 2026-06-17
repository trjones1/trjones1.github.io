# Custom domain setup — tramel.dev

DNS checks show **tramel.dev** is not registered yet (no DNS records). The same appears true for **trameljones.com** and **trameljones.dev** — but availability can change by the minute, so verify at checkout.

## 1. Register the domain

Recommended registrars for `.dev` (Google's secure TLD — HTTPS required):

| Registrar | Typical price |
|-----------|---------------|
| [Namecheap](https://www.namecheap.com/domains/registration/gtld/dev/) | ~$12–15/year |
| [Porkbun](https://porkbun.com/tld/dev) | ~$12/year |
| [Google Domains / Squarespace](https://domains.google/) | ~$12/year |

Search for `tramel.dev` and register it. `.dev` domains include HSTS preload, so browsers will only load your site over HTTPS once configured.

**Backup options** if `tramel.dev` is taken: `trameljones.dev`, `trameljones.com`, `tramel.build`.

## 2. Configure GitHub Pages

After merging this PR:

1. Go to **github.com/trjones1/trjones1.github.io** → **Settings** → **Pages**
2. Under **Custom domain**, enter: `tramel.dev`
3. Click **Save**
4. Wait for DNS check (can take up to 24 hours, usually minutes)
5. Enable **Enforce HTTPS** once the certificate is issued

This repo already includes a `CNAME` file pointing to `tramel.dev`.

## 3. Configure DNS at your registrar

### Apex domain (`tramel.dev` → your site)

Add these records at your domain registrar:

| Type | Name | Value |
|------|------|-------|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |

### Optional: `www` redirect

| Type | Name | Value |
|------|------|-------|
| CNAME | `www` | `trjones1.github.io` |

Then in GitHub Pages settings, you can set the primary domain to `tramel.dev` so `www` redirects to apex.

## 4. Verify

```bash
dig tramel.dev +short
# Should return the GitHub Pages IP addresses above

curl -I https://tramel.dev
# Should return 200 once DNS propagates and HTTPS is active
```

## 5. Update links (optional)

After the domain is live:

- Update LinkedIn profile website to `https://tramel.dev`
- Update GitHub profile URL
- Use `tramel.dev` on your resume instead of `trjones1.github.io`

The old `trjones1.github.io` URL will continue to work and redirect once the custom domain is configured.

## Troubleshooting

- **DNS not propagating**: Wait up to 48 hours; use [dnschecker.org](https://dnschecker.org) to monitor
- **HTTPS certificate pending**: GitHub needs DNS verified first; can take up to 24 hours
- **Mixed content warnings**: Ensure all assets use relative paths (already done in this site)
- **404 on apex**: Double-check all four A records and four AAAA records are set
