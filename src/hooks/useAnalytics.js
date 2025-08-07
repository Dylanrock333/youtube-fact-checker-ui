import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Analytics from '../utils/analytics';

// Hook for automatic page view tracking
export const usePageTracking = () => {
  const location = useLocation();
  const previousPath = useRef(location.pathname);

  useEffect(() => {
    const currentPath = location.pathname;
    
    // Track page view
    Analytics.trackPageView(currentPath, document.title);
    
    // Track navigation if this isn't the initial page load
    if (previousPath.current !== currentPath) {
      Analytics.trackNavigation(currentPath, previousPath.current);
    }
    
    previousPath.current = currentPath;
  }, [location]);
};

// Hook for timing user interactions
export const useTimingTracker = (category, variable) => {
  const startTime = useRef(Date.now());
  
  const trackTiming = useCallback((label = '') => {
    const duration = Date.now() - startTime.current;
    Analytics.trackTiming(category, variable, duration, label);
  }, [category, variable]);

  const resetTimer = useCallback(() => {
    startTime.current = Date.now();
  }, []);

  return { trackTiming, resetTimer };
};

// Hook for engagement tracking (time on page, interactions)
export const useEngagementTracker = () => {
  const startTime = useRef(Date.now());
  const interactionCount = useRef(0);
  const location = useLocation();

  const trackInteraction = useCallback(() => {
    interactionCount.current += 1;
  }, []);

  const trackEngagement = useCallback((type = 'page_engagement') => {
    const duration = Date.now() - startTime.current;
    Analytics.trackEngagement(type, duration, interactionCount.current);
  }, []);

  // Track engagement when leaving the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      trackEngagement('page_exit');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      trackEngagement('component_unmount');
    };
  }, [trackEngagement]);

  // Reset tracking for new pages
  useEffect(() => {
    startTime.current = Date.now();
    interactionCount.current = 0;
  }, [location.pathname]);

  return { trackInteraction, trackEngagement };
};

// Hook for scroll depth tracking
export const useScrollDepthTracker = (thresholds = [25, 50, 75, 100]) => {
  const trackedDepths = useRef(new Set());
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      thresholds.forEach(threshold => {
        if (scrollPercent >= threshold && !trackedDepths.current.has(threshold)) {
          trackedDepths.current.add(threshold);
          Analytics.trackEvent('scroll_depth', {
            category: 'engagement',
            label: `${threshold}%`,
            value: threshold
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      trackedDepths.current.clear();
    };
  }, [thresholds]);
};