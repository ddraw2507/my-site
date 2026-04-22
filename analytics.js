/**
 * Vercel Web Analytics initialization
 * This script manually injects Vercel Web Analytics tracking.
 * For static HTML sites, analytics are typically auto-injected by Vercel,
 * but this provides explicit configuration.
 */

(function() {
  // Vercel Web Analytics injection function
  window.va = window.va || function () { 
    (window.vaq = window.vaq || []).push(arguments); 
  };
})();
