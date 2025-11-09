# Mobile App (Expo + React Native)

This is the mobile-only client for managing community members in Morocco with role-based access for the national and regional representatives.

## Tech
- Expo SDK 54, React Native, TypeScript
- React Navigation (native-stack)
- React Query for server state
- Axios for API requests
- Expo Secure Store for token storage

## Quick Start

```bash
# From workspace root
cd "Desktop/coding + Uni/chandaMorocco/mobile"

# Install dependencies
npm install

# Add app libraries
npm i @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context @tanstack/react-query axios expo-secure-store zod react-hook-form @hookform/resolvers

# Start Expo dev server
npm run start
# Then press 'a' for Android emulator or scan the QR with Expo Go
```

## Configuration

- API base URL is set in `app.json` under `expo.extra.apiBaseUrl`. Default is `http://localhost:8000`.
- Tokens are stored securely via `expo-secure-store`.

## Navigation
- Auth stack: `Login`, `RedeemInvite`
- App stack: `Members`, `MemberForm`, `Settings`

## Notes
### API Stub
Current API client is stubbed. Replace implementations in `src/services/api.ts` with real calls to the backend (Django REST Framework recommended). Suggested endpoints:
`POST /auth/login`, `POST /auth/redeem`, `GET /auth/me`, `GET /members`, `POST /members`, `GET /members/:id`, `PUT /members/:id`.

### Private Distribution
1. iOS (early stage): TestFlight internal (up to 100 users by email).
2. Android (early stage): Play Console Internal Testing (upload aab, add tester emails).
3. Hardening: Enable App Store / Play Store account 2FA, restrict access to build artifacts.
4. Scaling private access:
	- iOS: Apple Business Manager with Custom Apps (assign to specific org Apple IDs or MDM).
	- Android: Managed Google Play (through MDM solution) for controlled install.
5. Alternative: Enterprise MDM (Intune, MobileIron, Kandji) to push builds directly and enforce device compliance.
6. Keep app flagged private by NOT publishing generally; use closed tracks and org-only distribution.

### Security Recommendations (Client Side)
- Use HTTPS only; never send tokens over insecure channels.
- Store tokens in Secure Store (already implemented) and avoid AsyncStorage for auth secrets.
- Implement silent token refresh (add endpoint) and logout on refresh failure.
- Consider network layer interceptor for attaching Bearer token and handling 401 globally.

### Next Steps
1. Implement real backend.
2. Replace API stub.
3. Add form validation tighter constraints (DOB format, national number pattern).
4. Add optimistic updates for member create/update.
5. Integrate error boundary and loading skeletons.
