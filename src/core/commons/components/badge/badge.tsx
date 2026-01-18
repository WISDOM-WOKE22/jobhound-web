export const getStatusBadge = (status: string) => {
  const baseClass = 'px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap';
  
  switch (status.toLowerCase()) {
    // ============================================
    // APPLICATION LIFECYCLE (Blue tones)
    // ============================================
    case 'application_submitted':
    case 'applied':
      return (
        <span className={`${baseClass} bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20`}>
          Applied
        </span>
      );
    case 'application_received':
      return (
        <span className={`${baseClass} bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20`}>
          Received
        </span>
      );
    case 'application_confirmation':
      return (
        <span className={`${baseClass} bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20`}>
          Confirmed
        </span>
      );
    case 'application_updated':
    case 'update_existing':
      return (
        <span className={`${baseClass} bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20`}>
          Updated
        </span>
      );
    case 'application_on_hold':
      return (
        <span className={`${baseClass} bg-slate-500/10 text-slate-700 dark:text-slate-400 border border-slate-500/20`}>
          On Hold
        </span>
      );
    case 'under_review':
      return (
        <span className={`${baseClass} bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/20`}>
          Under Review
        </span>
      );
    case 'shortlisted':
      return (
        <span className={`${baseClass} bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20`}>
          Shortlisted
        </span>
      );

    // ============================================
    // SCREENING & RECRUITER CONTACT (Cyan/Teal tones)
    // ============================================
    case 'recruiter_outreach':
      return (
        <span className={`${baseClass} bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/20`}>
          Recruiter Outreach
        </span>
      );
    case 'old_recruiter_email':
      return (
        <span className={`${baseClass} bg-cyan-500/10 text-cyan-600 dark:text-cyan-500 border border-cyan-500/20`}>
          Old Recruiter Email
        </span>
      );
    case 'cold_recruiter_email':
      return (
        <span className={`${baseClass} bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/20`}>
          Cold Outreach
        </span>
      );
    case 'headhunter_outreach':
      return (
        <span className={`${baseClass} bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20`}>
          Headhunter
        </span>
      );
    case 'recruiter_screen':
      return (
        <span className={`${baseClass} bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20`}>
          Recruiter Screen
        </span>
      );
    case 'application_incomplete':
      return (
        <span className={`${baseClass} bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-500/20`}>
          Incomplete
        </span>
      );
    case 'phone_screen':
      return (
        <span className={`${baseClass} bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20`}>
          Phone Screen
        </span>
      );
    case 'hiring_manager_review':
      return (
        <span className={`${baseClass} bg-violet-500/10 text-violet-700 dark:text-violet-400 border border-violet-500/20`}>
          Manager Review
        </span>
      );

    // ============================================
    // INTERVIEWS (Green tones - Critical/Positive)
    // ============================================
    case 'interview':
    case 'interviewing':
      return (
        <span className={`${baseClass} bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20`}>
          Interviewing
        </span>
      );
    case 'interview_invitation':
      return (
        <span className={`${baseClass} bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20`}>
          Interview Invite
        </span>
      );
    case 'interview_scheduled':
      return (
        <span className={`${baseClass} bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20`}>
          Interview Scheduled
        </span>
      );
    case 'interview_rescheduled':
      return (
        <span className={`${baseClass} bg-lime-500/10 text-lime-700 dark:text-lime-400 border border-lime-500/20`}>
          Rescheduled
        </span>
      );
    case 'interview_completed':
      return (
        <span className={`${baseClass} bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20`}>
          Interview Done
        </span>
      );
    case 'interview_feedback_pending':
      return (
        <span className={`${baseClass} bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20`}>
          Feedback Pending
        </span>
      );
    case '1st_round_interview':
      return (
        <span className={`${baseClass} bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20`}>
          1st Round
        </span>
      );
    case '2nd_round_interview':
      return (
        <span className={`${baseClass} bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20`}>
          2nd Round
        </span>
      );
    case '3rd_round_interview':
      return (
        <span className={`${baseClass} bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20`}>
          3rd Round
        </span>
      );
    case '4th_round_interview':
      return (
        <span className={`${baseClass} bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20`}>
          4th Round
        </span>
      );
    case '5th_round_interview':
      return (
        <span className={`${baseClass} bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20`}>
          5th Round
        </span>
      );
    case '6th_round_interview':
      return (
        <span className={`${baseClass} bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20`}>
          6th Round
        </span>
      );
    case 'final_round_interview':
      return (
        <span className={`${baseClass} bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30`}>
          Final Round
        </span>
      );
    case 'technical_interview':
      return (
        <span className={`${baseClass} bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20`}>
          Technical
        </span>
      );
    case 'behavioral_interview':
      return (
        <span className={`${baseClass} bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20`}>
          Behavioral
        </span>
      );
    case 'panel_interview':
      return (
        <span className={`${baseClass} bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20`}>
          Panel
        </span>
      );
    case 'case_interview':
      return (
        <span className={`${baseClass} bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20`}>
          Case Study
        </span>
      );
    case 'onsite_interview':
      return (
        <span className={`${baseClass} bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20`}>
          Onsite
        </span>
      );
    case 'virtual_interview':
      return (
        <span className={`${baseClass} bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20`}>
          Virtual
        </span>
      );

    // ============================================
    // ASSESSMENTS (Purple/Violet tones - Critical)
    // ============================================
    case 'assessment':
      return (
        <span className={`${baseClass} bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20`}>
          Assessment
        </span>
      );
    case 'assessment_invitation':
      return (
        <span className={`${baseClass} bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20`}>
          Assessment Invite
        </span>
      );
    case 'assessment_submitted':
      return (
        <span className={`${baseClass} bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20`}>
          Assessment Sent
        </span>
      );
    case 'assessment_review_pending':
      return (
        <span className={`${baseClass} bg-violet-500/10 text-violet-700 dark:text-violet-400 border border-violet-500/20`}>
          Review Pending
        </span>
      );
    case 'coding_test':
      return (
        <span className={`${baseClass} bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-400 border border-fuchsia-500/20`}>
          Coding Test
        </span>
      );
    case 'take_home_assignment':
      return (
        <span className={`${baseClass} bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20`}>
          Take-Home
        </span>
      );
    case 'online_test':
      return (
        <span className={`${baseClass} bg-violet-500/10 text-violet-700 dark:text-violet-400 border border-violet-500/20`}>
          Online Test
        </span>
      );

    // ============================================
    // OFFERS & DECISIONS (Emerald/Gold tones - Critical)
    // ============================================
    case 'offer':
      return (
        <span className={`${baseClass} bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30`}>
          Offer
        </span>
      );
    case 'verbal_offer':
      return (
        <span className={`${baseClass} bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20`}>
          Verbal Offer
        </span>
      );
    case 'written_offer':
      return (
        <span className={`${baseClass} bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30`}>
          Written Offer
        </span>
      );
    case 'offer_extended':
      return (
        <span className={`${baseClass} bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border border-yellow-500/30`}>
          Offer Extended
        </span>
      );
    case 'offer_under_review':
      return (
        <span className={`${baseClass} bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20`}>
          Reviewing Offer
        </span>
      );
    case 'offer_negotiation':
      return (
        <span className={`${baseClass} bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-500/20`}>
          Negotiating
        </span>
      );
    case 'offer_accepted':
      return (
        <span className={`${baseClass} bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30`}>
          Offer Accepted
        </span>
      );
    case 'offer_declined':
      return (
        <span className={`${baseClass} bg-slate-500/10 text-slate-700 dark:text-slate-400 border border-slate-500/20`}>
          Offer Declined
        </span>
      );

    // ============================================
    // TERMINAL OUTCOMES
    // ============================================
    case 'accepted':
      return (
        <span className={`${baseClass} bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30`}>
          Accepted
        </span>
      );
    case 'rejected':
      return (
        <span className={`${baseClass} bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20`}>
          Rejected
        </span>
      );
    case 'withdrawn':
      return (
        <span className={`${baseClass} bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20`}>
          Withdrawn
        </span>
      );
    case 'position_filled':
      return (
        <span className={`${baseClass} bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20`}>
          Position Filled
        </span>
      );

    // ============================================
    // POST-OFFER / PRE-HIRE (Amber/Orange tones)
    // ============================================
    case 'background_check':
      return (
        <span className={`${baseClass} bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-500/20`}>
          Background Check
        </span>
      );
    case 'reference_check':
      return (
        <span className={`${baseClass} bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-500/20`}>
          Reference Check
        </span>
      );
    case 'documents_requested':
      return (
        <span className={`${baseClass} bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20`}>
          Docs Requested
        </span>
      );
    case 'documents_submitted':
      return (
        <span className={`${baseClass} bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20`}>
          Docs Submitted
        </span>
      );
    case 'pre_employment_verification':
      return (
        <span className={`${baseClass} bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-500/20`}>
          Verification
        </span>
      );
    case 'onboarding_started':
      return (
        <span className={`${baseClass} bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30`}>
          Onboarding
        </span>
      );

    // ============================================
    // WAITING / FOLLOW-UP STATES (Yellow/Amber tones)
    // ============================================
    case 'pending':
      return (
        <span className={`${baseClass} bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border border-yellow-500/20`}>
          Pending
        </span>
      );
    case 'follow_up_required':
      return (
        <span className={`${baseClass} bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20`}>
          Follow Up
        </span>
      );
    case 'response_delayed':
      return (
        <span className={`${baseClass} bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border border-yellow-500/20`}>
          Delayed
        </span>
      );
    case 'no_response':
      return (
        <span className={`${baseClass} bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20`}>
          No Response
        </span>
      );

    // ============================================
    // LEGACY/GENERAL STATUSES
    // ============================================
    case 'active':
    case 'verified':
      return (
        <span className={`${baseClass} bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    case 'inactive':
    case 'not verified':
      return (
        <span className={`${baseClass} bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20`}>
          {status === 'not verified' ? 'Not Verified' : 'Inactive'}
        </span>
      );
    case 'draft':
      return (
        <span className={`${baseClass} bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20`}>
          Draft
        </span>
      );
    case 'used':
    case 'running':
      return (
        <span className={`${baseClass} bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border border-yellow-500/20`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    case 'sent':
    case 'approved':
    case 'completed':
    case 'finished':
      return (
        <span className={`${baseClass} bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    case 'writing':
      return (
        <span className={`${baseClass} bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20`}>
          Writing
        </span>
      );
    case 'blocked':
    case 'suspended':
      return (
        <span className={`${baseClass} bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );

    // ============================================
    // DEFAULT FALLBACK
    // ============================================
    default:
      // Format unknown status nicely (replace underscores with spaces, capitalize)
      const formattedStatus = status
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
      return (
        <span className={`${baseClass} bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20`}>
          {formattedStatus}
        </span>
      );
  }
};

// Helper to get status color for use in charts/other components
export const getStatusColor = (status: string): string => {
  const statusLower = status.toLowerCase();
  
  // Application lifecycle - Blue
  if (['application_submitted', 'applied', 'application_received', 'application_confirmation', 'application_updated', 'update_existing'].includes(statusLower)) {
    return '#3b82f6'; // blue-500
  }
  
  // Interview stages - Green
  if (statusLower.includes('interview') || statusLower === 'interviewing') {
    return '#10b981'; // emerald-500
  }
  
  // Assessments - Purple
  if (statusLower.includes('assessment') || statusLower.includes('test') || statusLower.includes('assignment')) {
    return '#8b5cf6'; // violet-500
  }
  
  // Offers - Amber
  if (statusLower.includes('offer')) {
    return '#f59e0b'; // amber-500
  }
  
  // Positive outcomes - Emerald
  if (['accepted', 'onboarding_started', 'offer_accepted'].includes(statusLower)) {
    return '#059669'; // emerald-600
  }
  
  // Negative outcomes - Red
  if (['rejected', 'blocked', 'suspended'].includes(statusLower)) {
    return '#ef4444'; // red-500
  }
  
  // Neutral/waiting - Slate
  return '#64748b'; // slate-500
};
