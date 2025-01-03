import { GmailConnect } from "@/components/ui/gmail-connect";
import { ErrorBoundary } from "react-error-boundary";

export default function SignUpPage() {
  return (
    <div className='flex pt-14 pb-10 px-10 min-h-[70vh]'>
      <div className='max-w-sm flex flex-col w-full items-center'>
        <div className='flex flex-col space-y-6 mb-10'>
          <h1 className='text-3xl text-center font-semibold'>Let's get started</h1>
          <span className='text-base text-center text-gray-600 font-medium'>
            Mailclerk supercharges your current email provider with automated organization and
            cleanup. Connect your account and we’ll get going.
          </span>
        </div>
        <GmailConnect />
        <div className='flex flex-col space-y-5'>
          <p className='text-center text-gray-500 text-sm'>
            Worried about privacy? Mailclerk <u>NEVER</u> stores any emails or personal data.
            Mailclerk's access to your account can be revoked at any time.
          </p>
          <span className='text-center text-gray-500 text-sm'>
            During early access, only Gmail is available
          </span>
          <span className='text-center text-sm text-gray-500'>Already have an account? Log in</span>
        </div>
      </div>
    </div>
  );
}
