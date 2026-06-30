# Email Configuration for React Assessment Test

## Quick Setup for Live Deployment

### 1. Configure Email Recipients
Edit `data/questions.tsx` and update the `submissionEmails` array:

\`\`\`typescript
export const testConfig: TestConfig = {
  // ... other config
  submissionEmails: [
    "hr@yourcompany.com",           // HR team
    "engineering@yourcompany.com",   // Engineering team
    "hiring-manager@yourcompany.com" // Hiring manager
  ],
}
\`\`\`

### 2. Email Service Integration
The system currently logs emails to console. For production, integrate with an email service in `app/api/submit-test/route.ts`:

#### Option A: Resend (Recommended)
\`\`\`bash
npm install resend
\`\`\`

\`\`\`typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Replace the console.log section with:
await resend.emails.send({
  from: 'assessments@reapit.com',
  to: submissionEmails,
  subject: `React Senior Developer Assessment - ${session.candidateName}`,
  text: emailContent,
});
\`\`\`

#### Option B: SendGrid
\`\`\`bash
npm install @sendgrid/mail
\`\`\`

\`\`\`typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: submissionEmails,
  from: 'assessments@reapit.com',
  subject: `React Senior Developer Assessment - ${session.candidateName}`,
  text: emailContent,
};

await sgMail.send(msg);
\`\`\`

### 3. Environment Variables
Add to your Vercel project settings:
- `RESEND_API_KEY` (if using Resend)
- `SENDGRID_API_KEY` (if using SendGrid)

### 4. Current Email Content
The system automatically generates comprehensive emails including:
- Candidate information
- Overall score and pass/fail status
- Category breakdown
- Detailed question-by-question results
- Explanations for incorrect answers

### 5. Testing
Before going live, test with your own email addresses in the `submissionEmails` array.
