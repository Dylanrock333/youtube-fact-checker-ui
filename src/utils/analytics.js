
// Simplified Analytics utility - 6 core business events only
class Analytics {
  // Check if gtag is available
  static isEnabled() {
    return typeof window !== 'undefined' && typeof window.gtag === 'function';
  }

  // Base event method
  static trackEvent(eventName, parameters = {}) {
    if (!this.isEnabled()) return;
    window.gtag('event', eventName, parameters);
  }

  // 6 Core Business Events Only

  // 1. When user attempts to analyze a video
  static trackVideoAnalysisAttempted(videoSource, videoTopic = null) {
    this.trackEvent('video_analysis_attempted', {
      video_source: videoSource || 'unknown',
      video_topic: videoTopic
    });
  }

  // 2. When video analysis completes successfully
  static trackVideoAnalysisSucceeded(videoId, claimCount, duration = null) {
    this.trackEvent('video_analysis_succeeded', {
      video_id: videoId,
      claim_count: claimCount,
      analysis_duration: duration
    });
  }

  // 3. When video analysis fails
  static trackVideoAnalysisFailed(videoId, errorType) {
    this.trackEvent('video_analysis_failed', {
      video_id: videoId,
      error_type: errorType
    });
  }

  // 4. When user performs deep search on a claim
  static trackDeepSearchPerformed(claimContext, videoId) {
    this.trackEvent('deep_search_performed', {
      claim_context: claimContext,
      video_id: videoId
    });
  }

  // 5. When user interacts with slideshow
  static trackSlideshowInteraction(interactionType, videoUrl = null, claimTitle = null, category = null) {
    this.trackEvent('slideshow_interaction', {
      interaction_type: interactionType, // 'video_analyze', 'deep_search', 'category_select'
      video_url: videoUrl,
      claim_title: claimTitle,
      category: category
    });
  }

  // 6. Track user journey completion steps
  static trackUserJourneyStep(step, videoId = null) {
    this.trackEvent('user_journey_step', {
      step: step, // 'url_entered', 'analysis_started', 'results_viewed', 'claim_explored'
      video_id: videoId
    });
  }

  // 7. Track time to first user action
  static trackTimeToFirstAction(timeSeconds, actionType) {
    this.trackEvent('time_to_first_action', {
      time_seconds: timeSeconds,
      action_type: actionType // 'url_paste', 'analyze_click', 'example_click'
    });
  }
}

export default Analytics;