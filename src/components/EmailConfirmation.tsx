import { useState } from 'react';
import { Mail, Check, Clock, AlertCircle, Send, FileText, DollarSign, Calendar } from 'lucide-react';

interface EmailConfirmationProps {
  formData: any;
  onConfirm: () => void;
  onBack: () => void;
}

export function EmailConfirmation({ formData, onConfirm, onBack }: EmailConfirmationProps) {
  const [emailSent, setEmailSent] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleSendEmail = () => {
    // In a real implementation, this would send an email via your backend
    console.log('Sending service confirmation email to:', formData.email);
    setEmailSent(true);
  };

  const handleConfirmService = () => {
    setConfirmed(true);
    onConfirm();
  };

  if (confirmed) {
    return (
      <div className="text-center py-8">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-[#10B981] rounded-full flex items-center justify-center">
            <Check size={32} className="text-white" />
          </div>
        </div>
        <h3 className="text-2xl text-white mb-4">Service Confirmed!</h3>
        <p className="text-gray-400 mb-6">
          Thank you for confirming your service selection. We'll now proceed with the payment process.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl text-white mb-4">Confirm Your Service Selection</h3>
        <p className="text-gray-400">
          Please review your service details and confirm via email before proceeding to payment
        </p>
      </div>

      {/* Service Summary */}
      <div className="bg-[#1A1A1A] border border-[#FF7A00]/20 rounded-lg p-6">
        <h4 className="text-[#FF7A00] mb-4 flex items-center gap-2">
          <FileText size={20} />
          Service Summary
        </h4>
        <div className="space-y-3 text-gray-400">
          <div className="flex justify-between">
            <span>Service Type:</span>
            <span className="text-white font-medium">{formData.projectType || 'Not selected'}</span>
          </div>
          <div className="flex justify-between">
            <span>Plan:</span>
            <span className="text-white font-medium">
              {formData.plan === 'basic' && 'Basic Boost - $1,500 CAD'}
              {formData.plan === 'standard' && 'Standard Pro - $3,000 CAD'}
              {formData.plan === 'premium' && 'Premium Elite - $5,000 CAD'}
              {formData.plan === 'custom' && 'Custom Scale - Custom Pricing'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Timeline:</span>
            <span className="text-white font-medium">{formData.timeline || 'Not specified'}</span>
          </div>
          {formData.description && (
            <div>
              <span className="block mb-2">Project Description:</span>
              <p className="text-white bg-[#0D0D0D] p-3 rounded text-sm">
                {formData.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Email Confirmation */}
      <div className="bg-[#1A1A1A] border border-[#00D4FF]/20 rounded-lg p-6">
        <h4 className="text-[#00D4FF] mb-4 flex items-center gap-2">
          <Mail size={20} />
          Email Confirmation
        </h4>
        
        {!emailSent ? (
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">
              We'll send a detailed service confirmation to your email address. 
              Please review and confirm before proceeding to payment.
            </p>
            <div className="bg-[#0D0D0D] p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="text-[#00D4FF]" size={20} />
                <div>
                  <p className="text-white font-medium">{formData.email}</p>
                  <p className="text-gray-400 text-sm">Service confirmation will be sent here</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleSendEmail}
              className="w-full py-3 bg-[#00D4FF] text-black rounded-lg hover:bg-[#00D4FF]/90 transition-all flex items-center justify-center gap-2"
            >
              <Send size={20} />
              Send Service Confirmation
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[#10B981]">
              <Check size={20} />
              <span className="font-medium">Email sent successfully!</span>
            </div>
            <div className="bg-[#0D0D0D] p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-3">
                Please check your email and click the confirmation link. Once confirmed, 
                you can proceed with the payment.
              </p>
              <div className="flex items-center gap-2 text-[#FF7A00]">
                <Clock size={16} />
                <span className="text-sm">Waiting for email confirmation...</span>
              </div>
            </div>
            <button
              onClick={handleConfirmService}
              className="w-full py-3 bg-[#FF7A00] text-black rounded-lg hover:bg-[#FF7A00]/90 transition-all flex items-center justify-center gap-2"
            >
              <Check size={20} />
              I've Confirmed via Email
            </button>
          </div>
        )}
      </div>

      {/* What's Included */}
      <div className="bg-[#1A1A1A] border border-white/10 rounded-lg p-6">
        <h4 className="text-white mb-4 flex items-center gap-2">
          <AlertCircle size={20} />
          What's Included in Your Service
        </h4>
        <ul className="space-y-2 text-gray-400 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-[#FF7A00] mt-1">•</span>
            <span>Initial consultation and project discovery</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#FF7A00] mt-1">•</span>
            <span>Custom service proposal with detailed scope</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#FF7A00] mt-1">•</span>
            <span>Project timeline and milestone planning</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#FF7A00] mt-1">•</span>
            <span>Dedicated project manager and team</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#FF7A00] mt-1">•</span>
            <span>Regular progress updates and revisions</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#FF7A00] mt-1">•</span>
            <span>Final delivery and post-launch support</span>
          </li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 py-3 border border-[#FF7A00] text-[#FF7A00] rounded-lg hover:bg-[#FF7A00]/10 transition-all"
        >
          Back to Review
        </button>
      </div>
    </div>
  );
}
