/**
 * OpenClaw iMessage Reply Context Fix
 * 
 * This module provides enhanced iMessage processing for OpenClaw that includes
 * reply context information. When users reply to older messages in iMessage,
 * the AI assistant will receive the full conversation context.
 * 
 * @author Guillaume De Zwirek <guillaume.dezwirek@gmail.com>
 * @version 1.0.0
 */

// Core message processing exports
export {
  IMessageReplyProcessor,
  createIMessageReplyProcessor,
  processIMessageWithReplyContext,
  type IMessageMessage,
  type IMessageReplyContext,
  type EnhancedIMessageMessage,
} from './message-processor.js';

// Channel integration exports
export {
  OpenClawIMessageEnhancer,
  createEnhancedIMessageProcessor,
  enhanceIMessageChannelWithReplySupport,
  type EnhancedInboundContext,
} from './channel-integration.js';

// Utility functions
export { applyIMessageReplyFix } from './patch.js';

/**
 * Version information
 */
export const VERSION = '1.0.0';

/**
 * Feature flags and capabilities
 */
export const CAPABILITIES = {
  REPLY_CONTEXT: true,
  THREAD_DETECTION: true,
  EXTENDED_SEARCH: true,
  ERROR_RECOVERY: true,
  METADATA_GENERATION: true,
} as const;