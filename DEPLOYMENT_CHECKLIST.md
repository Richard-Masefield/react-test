# React Assessment Test - Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Timer Configuration
- [x] Timer set to 20 minutes (1 minute per question)
- [x] Dynamic timer display in UI
- [x] All references updated from 45 to 20 minutes

### 2. Email Configuration
- [ ] Update email addresses in `data/questions.tsx` → `submissionEmails` array
- [ ] **CRITICAL**: Update sender domain in API route (see Step 2 below)
- [ ] Add RESEND_API_KEY environment variable to Vercel project
- [ ] Verify domain in Resend dashboard
- [ ] Test email functionality with your addresses

### 3. Content Review
- [x] Passing score references removed from UI
- [x] 20 comprehensive React questions covering:
  - React fundamentals
  - Hooks and lifecycle
  - Performance optimization
  - Best practices
  - Modern web development
- [x] Professional styling and accessibility

### 4. Technical Setup
- [x] All components properly integrated
- [x] Timer functionality working
- [x] Question navigation working
- [x] Form validation implemented
- [x] One-time submission with warning
- [x] Resend email integration implemented

## 🚀 Deployment Steps

### Step 1: Configure Email Recipients
Edit `data/questions.tsx`:
\`\`\`typescript
submissionEmails: [
  "hr@yourcompany.com",
  "engineering@yourcompany.com", 
  "hiring-manager@yourcompany.com"
]
\`\`\`

### Step 2: **CRITICAL** - Update Email Sender Domain
Edit `app/api/submit-test/route.ts` line 42:
\`\`\`typescript
from: 'React Assessment <noreply@yourdomain.com>', // Replace with your verified domain
\`\`\`
**Replace `yourdomain.com` with your actual verified domain in Resend**

### Step 3: Set Up Resend
1. Go to [resend.com](https://resend.com) and create account
2. Add and verify your domain
3. Get your API key
4. Add `RESEND_API_KEY` to Vercel environment variables

### Step 4: Deploy to Vercel
1. Push code to GitHub
2. Connect repository to Vercel
3. Add `RESEND_API_KEY` environment variable in Vercel dashboard
4. Deploy

### Step 5: Test Before Going Live
1. Complete a test assessment with your own email
2. Verify email delivery in Resend logs
3. Check all functionality works as expected

## 📧 Current Email Features
- Candidate information and contact details
- Overall score and performance summary
- Category-wise breakdown (hooks, performance, etc.)
- Question-by-question results with explanations
- Professional formatting for easy review
- Real email delivery via Resend

## ⚠️ Important Notes
- **Domain verification required**: Resend requires verified domain for sending
- Timer starts immediately when test begins
- Submissions cannot be modified after completion
- All accessibility standards met (WCAG AA compliant)
- Email failures are logged but don't prevent test submission

## 🔧 Post-Deployment
- Monitor email delivery in Resend dashboard
- Review candidate feedback
- Adjust questions based on results
- Update passing criteria if needed

## 🚨 Troubleshooting
If emails aren't sending:
1. Check Resend dashboard for delivery logs
2. Verify domain is properly configured
3. Ensure `from` address uses verified domain
4. Check Vercel function logs for errors
