# Git workflow

## Branches

```
main          production-ready
develop       integration branch
feature/*     isolated feature work
```

Recommended feature branches:

- `feature/homepage`
- `feature/product-catalog`
- `feature/product-page`
- `feature/search-filtering`
- `feature/cart`
- `feature/authentication`
- `feature/account`
- `feature/wishlist`
- `feature/checkout`
- `feature/stripe`
- `feature/orders`
- `feature/admin-dashboard`
- `feature/inventory`
- `feature/seo`
- `feature/accessibility`
- `feature/testing`
- `feature/github-actions`
- `feature/github-pages`
- `feature/deployment`

Do not open tiny meaningless branches for one-line edits.

## Pull requests

1. Create feature branch from `develop`
2. Implement + test locally
3. Push and open PR → `develop`
4. GitHub Actions must pass
5. Review + merge
6. When `develop` is stable, PR → `main`

Never bypass CI.
