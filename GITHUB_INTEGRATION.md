# GitHub Integration - Auto-Commit Implementation

## Overview

This document describes the GitHub auto-commit integration for the Cradex Agency Admin Panel. When content is saved through the admin panel, changes are automatically committed to GitHub, triggering Vercel deployment.

## How It Works

```
1. User saves content in Admin Panel
   ↓
2. API writes to JSON file (public/data/*.json)
   ↓
3. API calls GitHub API to commit changes
   ↓
4. GitHub webhook triggers Vercel deployment
   ↓
5. Vercel builds and deploys (2-3 minutes)
   ↓
6. Content live on website
```

## Files Created

### 1. `lib/admin/github.ts`

Main GitHub integration library with the following functions:

- `commitToGitHub()` - Core function to commit files to GitHub
- `getFileFromGitHub()` - Get current file SHA (required for updates)
- `generateCommitMessage()` - Generate descriptive commit messages
- `commitArticles()` - Commit articles.json
- `commitPortfolio()` - Commit portfolio.json
- `commitPartners()` - Commit partners.json
- `commitTestimonials()` - Commit testimonials.json

### 2. Updated API Routes

All CRUD API routes now include GitHub commit calls:

- `POST /api/admin/articles` - Commits after creating article
- `PUT /api/admin/articles/[id]` - Commits after updating article
- `DELETE /api/admin/articles/[id]` - Commits after deleting article

## Environment Variables

Add these to `.env.local`:

```bash
# GitHub Integration
GITHUB_TOKEN=ghp_your_github_token_here
GITHUB_REPO=guliyevpasha/cradex-agency-website
GITHUB_BRANCH=main
```

### Creating GitHub Personal Access Token

1. Go to GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token (classic)
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
5. Copy token and add to `.env.local`

**Important:** Keep your token secure! Never commit it to the repository.

## Commit Message Format

Commit messages follow this pattern:

```
Create Article: SEO 2025-2026 Guide
Update Portfolio: Cradex Website Redesign
Delete Partner: Old Partner Logo
```

Format: `{Action} {ContentType}: {Title}`

## Error Handling

The system is designed to be resilient:

1. **GitHub commit fails**: Content is still saved locally, user is notified
2. **Token missing**: Error logged, operation continues without commit
3. **Network error**: Caught and logged, doesn't break the save operation

This ensures that even if GitHub is down, users can still manage content.

## API Response

When GitHub commit is successful, API returns:

```json
{
  "success": true,
  "article": { ... },
  "message": "Article created successfully",
  "deployed": true
}
```

The `deployed: true` flag indicates that deployment is in progress.

## Vercel Integration

Vercel automatically detects GitHub commits via webhook:

1. GitHub commit triggers Vercel webhook
2. Vercel starts new build
3. Build completes in 2-3 minutes
4. Changes are live

**No additional Vercel configuration needed** - webhook is automatic when you connect GitHub repo to Vercel.

## Testing

### Local Testing (Without GitHub)

If `GITHUB_TOKEN` is not set, the system will:
- Log a warning
- Continue saving content locally
- Skip GitHub commit

This allows local development without GitHub access.

### Production Testing

1. Set `GITHUB_TOKEN` in Vercel environment variables
2. Create/update content in admin panel
3. Check GitHub repository for new commit
4. Wait 2-3 minutes for Vercel deployment
5. Verify changes on live website

## Security

### Token Security

- ✅ Token stored in environment variables (not in code)
- ✅ Token never exposed to client
- ✅ Token only used in server-side API routes
- ✅ Token has minimal required permissions (repo only)

### Rate Limiting

GitHub API has rate limits:
- **Authenticated**: 5,000 requests per hour
- **Per repo**: No specific limit for commits

For normal usage (few commits per hour), this is more than sufficient.

## Troubleshooting

### "GitHub token not configured"

**Solution:** Add `GITHUB_TOKEN` to `.env.local` or Vercel environment variables.

### "GitHub commit failed: 404"

**Solution:** Check that `GITHUB_REPO` is correct and token has access to the repository.

### "GitHub commit failed: 409 Conflict"

**Solution:** File was modified externally. This shouldn't happen in normal usage. Try again.

### Commits work but Vercel doesn't deploy

**Solution:** 
1. Check Vercel dashboard for deployment status
2. Verify GitHub webhook is configured in Vercel
3. Check Vercel build logs for errors

## File Paths

GitHub commits use these file paths:

```
cradex-agency/public/data/articles.json
cradex-agency/public/data/portfolio.json
cradex-agency/public/data/partners.json
cradex-agency/public/data/testimonials.json
```

These paths are relative to the repository root.

## Future Enhancements

Potential improvements for Phase 2:

- [ ] Deployment status tracking (check Vercel API)
- [ ] Rollback functionality (revert to previous commit)
- [ ] Commit history viewer in admin panel
- [ ] Batch commits (multiple changes in one commit)
- [ ] Branch support (commit to feature branches)
- [ ] Pull request creation for review workflow

## Related Files

- `lib/admin/github.ts` - GitHub integration library
- `app/api/admin/articles/route.ts` - Articles API with GitHub commit
- `app/api/admin/articles/[id]/route.ts` - Article CRUD with GitHub commit
- `.env.local` - Environment variables (local)
- `.env.local.example` - Environment variables template

## Notes

- GitHub commits are **asynchronous** - they don't block the save operation
- If GitHub commit fails, content is still saved locally
- Vercel deployment is **automatic** via webhook
- No manual git operations required
- Works with both public and private repositories

---

**Status:** ✅ Implemented and Ready for Testing
**Next Step:** Add GitHub token to environment variables and test
