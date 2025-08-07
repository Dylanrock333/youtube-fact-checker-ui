/* global gtag */

// Analytics utility for centralized tracking
class Analytics {
  // Check if gtag is available
  static isEnabled() {
    return typeof window !== 'undefined' && typeof window.gtag === 'function';
  }

  // Page view tracking
  static trackPageView(pagePath, pageTitle = '') {
    if (!this.isEnabled()) return;
    
    window.gtag('config', 'G-JTDYRCN17T', {
      page_path: pagePath,
      page_title: pageTitle
    });
  }

  // Generic event tracking
  static trackEvent(eventName, parameters = {}) {
    if (!this.isEnabled()) return;
    
    window.gtag('event', eventName, {
      event_category: parameters.category || 'engagement',
      event_label: parameters.label || '',
      value: parameters.value || 1,
      ...parameters
    });
  }

  // User interaction events
  static trackClick(elementName, additionalData = {}) {
    this.trackEvent('click', {
      category: 'user_interaction',
      label: elementName,
      ...additionalData
    });
  }

  static trackFormInteraction(action, formName, additionalData = {}) {
    this.trackEvent(`form_${action}`, {
      category: 'form_interaction',
      label: formName,
      ...additionalData
    });
  }

  // Navigation events
  static trackNavigation(destination, source = 'unknown') {
    this.trackEvent('navigation', {
      category: 'navigation',
      label: `${source}_to_${destination}`
    });
  }

  // Feature usage events
  static trackFeatureUse(featureName, action = 'use', additionalData = {}) {
    this.trackEvent('feature_use', {
      category: 'features',
      label: `${featureName}_${action}`,
      ...additionalData
    });
  }

  // Timing events
  static trackTiming(category, variable, value, label = '') {
    if (!this.isEnabled()) return;
    
    window.gtag('event', 'timing_complete', {
      name: variable,
      value: value,
      event_category: category,
      event_label: label
    });
  }

  // Error tracking
  static trackError(errorType, errorMessage, additionalData = {}) {
    this.trackEvent('exception', {
      category: 'errors',
      label: errorType,
      description: errorMessage,
      fatal: false,
      ...additionalData
    });
  }

  // Video-specific events
  static trackVideoInteraction(action, videoId, timestamp = null) {
    this.trackEvent(`video_${action}`, {
      category: 'video_interaction',
      label: videoId,
      value: timestamp,
      video_id: videoId,
      timestamp: timestamp
    });
  }

  // Analysis workflow events
  static trackAnalysisStep(step, data = {}) {
    this.trackEvent('analysis_step', {
      category: 'analysis_workflow',
      label: step,
      ...data
    });
  }

  // Search events
  static trackSearch(query, resultsCount = 0, searchType = 'deep_search') {
    this.trackEvent('search', {
      category: 'search',
      label: searchType,
      search_term: query,
      results_count: resultsCount
    });
  }

  // Engagement metrics
  static trackEngagement(type, duration = null, interactionCount = null) {
    this.trackEvent('engagement', {
      category: 'user_engagement',
      label: type,
      engagement_time_msec: duration,
      interaction_count: interactionCount
    });
  }

  // Custom dimensions (if configured in GA)
  static setUserProperties(properties) {
    if (!this.isEnabled()) return;
    
    window.gtag('config', 'G-JTDYRCN17T', {
      custom_map: properties
    });
  }
}

export default Analytics;