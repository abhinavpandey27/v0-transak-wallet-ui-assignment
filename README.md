# Transak's Virtual Account UI/UX Upgrade and FE Implementation using AI-powered tools

## TL;DR
- **What:** Improved UX of **Transak’s white-labeled virtual wallet** 
- **Why it matters:** A **fully responsive, thoughtfully designed wallet experience** that can be tweaked and customized for any partner integration.  
- **How:** Built with AI-powered tools for structure, design, and code cleanup.  
- **Links:**  
  - [Staging URL](https://transak-abhinav.vercel.app/)  
  - Test credentials: `email: testing@gmail.com` | `OTP: 123456`  

---

## 1. Problem Context & Scope
- **Source:** Transak provided a staging URL with a working wallet flow.  
- **Task:** Evaluate the flow, propose **UI/UX improvements**, and implement the updated UX using **AI-based tools**.  
- **Constraints:**  
  - Must rely heavily on AI-powered tools (design + implementation).  
  - Keep solution modular and reusable in a white-label context.  

---

## 2. Final Experience (Demos)

### 🔹 Responsive Experience
- Full **responsive design** across desktop & mobile.  
- **Sidebar navigation** on desktop, **hamburger menu** on mobile.  
- Optimized layout instead of shrinking a phone-first design.  

### 🔹 Home Screen
- **Simplified entry**: removed repetitive “Welcome Back.”  
- **Your Balance section** redesigned:
  - Added a **performance graph** for wallet history.  
  - Clear **Deposit** & **Withdraw** CTAs always accessible.  

### 🔹 Wallet Structure
- Two clear tabs: **Virtual Balance** (bank) & **Digital Balance** (crypto tokens).  
- Deposit/Withdraw options now **inline in the same view** (no confusing toggle tabs).  

### 🔹 Deposit Flow
- Old: single cluttered page.  
- New: **step-by-step guided flow**:
  1. Enter Euro value & token.  
  2. See the bank account details to deposit into.  
  3. Complete deposit → tokens auto-credited to wallet.  
- ✅ Benefit: reduces confusion, builds confidence.  

### 🔹 Withdraw Flow
- Old: inconsistent naming (“Withdraw” → “Receive”).  
- New: consistent journey:  
  1. Select token & currency.  
  2. Confirm destination bank account.  
  3. Fetch payment details, confirm, done.  
- ✅ Benefit: predictable, mirrors deposit flow, reduces drop-offs.  

### 🔹 Account & Settings
- **Your Account:** personal details & address.  
- **Transaction Limits:** clear daily/monthly/yearly caps.  
- **KYC & Security:**
  - Shows onboarding state (pending/verified).  
  - Authentication settings (2FA, authenticator app).  
- **Preferences:** dark mode toggle, logout, and simple settings menu.  
- ✅ Benefit: users feel **in control and safe**, with clear verification states.  

---

## 3. Before vs After

| Area | Before (Problem) | After (Solution) | Benefit |
|------|------------------|------------------|---------|
| Responsiveness | Mobile-first design, stretched on web | Full responsive layouts | Better usability across devices |
| Home Screen | “Welcome Back” clutter, basic balance | Clean, functional layout + graph | Clarity + insight |
| Wallet Navigation | Dropdown + confusing tabs | Clear “Virtual vs Digital” tabs | Easier switching |
| Deposit Flow | Single page, overwhelming | Step-by-step guided flow | Simpler, builds trust |
| Withdraw Flow | Inconsistent (“Withdraw/Receive”) | Unified, consistent journey | Predictable UX |
| KYC/Security | Basic info, unclear states | Pending/verified states, 2FA prefs | Transparency + trust |

---

## 4. Tools & Workflow
- **ChatGPT:** For extensive prompting, project detailing, and copy clarity.  
- **v0:** For project scaffolding, consistent UI components, and home screen setup.  
- **Figma:** For earlier design mocks and visual explorations.  
- **Cursor:** For code cleanup and redundancy removal.  
- **Codex:** For deeper refactors and polishing implementation details.  

---

## 5. Implementation Notes
- **Framework:** Next.js + Tailwind.  
- **Libraries:**  
  - Chart.js → wallet balance graphs  
  - ShadCN UI components → consistent theming & controls  
- **Architecture:**  
  - Desktop → sidebar navigation  
  - Mobile → hamburger navigation  
  - Modular deposit/withdraw flows (stepper pattern)  
- **Performance:** reduced DOM complexity, optimized state handling.  

---

## 6. AI Workflow
- Used **ChatGPT** for porject detailing out, framing, audits, and UX copy improvements.  
- Used **v0** for layout structuring and component generation.
- Used **Cursor** + **Codex** for code cleanup, refactors, and consistency checks.  
- All AI outputs were human-reviewed and tested before final commit.  

---

## 7. How to Run Locally
```bash
# Clone the repo
git clone <repo-url>
cd <repo-folder>

# Install dependencies
pnpm install

# Start dev server
pnpm dev