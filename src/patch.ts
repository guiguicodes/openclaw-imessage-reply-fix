/**
 * Patch utility for applying iMessage reply context fix to existing OpenClaw installations
 * 
 * This module provides utilities to patch an existing OpenClaw iMessage integration
 * with reply context support without requiring full replacement of the channel plugin.
 */

import type { PluginRuntime } from 'openclaw/plugin-sdk';
import { createEnhancedIMessageProcessor, type EnhancedInboundContext } from './channel-integration.js';
import type { IMessageMessage } from './message-processor.js';

/**
 * Configuration options for the reply fix patch
 */
export interface IMessageReplyFixConfig {
  /** Enable extended search for older messages (default: true) */
  extendedSearch?: boolean;
  
  /** Timeout for message fetching operations in ms (default: 10000) */
  fetchTimeout?: number;
  
  /** Extended search timeout in ms (default: 30000) */
  extendedSearchTimeout?: number;
  
  /** Maximum length for context text before truncation (default: 200) */
  maxContextLength?: number;
  
  /** Enable debug logging (default: false) */
  debug?: boolean;
}

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: Required<IMessageReplyFixConfig> = {
  extendedSearch: true,
  fetchTimeout: 10000,
  extendedSearchTimeout: 30000,
  maxContextLength: 200,
  debug: false,
};

/**
 * Apply the iMessage reply context fix to an OpenClaw runtime
 * 
 * This function patches the iMessage message processing pipeline to include
 * reply context information when users reply to older messages.
 * 
 * @param runtime - The OpenClaw plugin runtime
 * @param config - Configuration options for the fix
 * @returns A patched message processor function
 */
export function applyIMessageReplyFix(
  runtime: PluginRuntime,
  config: IMessageReplyFixConfig = {}
): (message: IMessageMessage) => Promise<EnhancedInboundContext> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const enhancer = createEnhancedIMessageProcessor(runtime);

  if (finalConfig.debug) {
    console.log('[iMessage Reply Fix] Applied with config:', finalConfig);
  }

  /**
   * Enhanced message processor that includes reply context
   */
  return async function processMessageWithReplyContext(
    message: IMessageMessage
  ): Promise<EnhancedInboundContext> {
    try {
      if (finalConfig.debug) {
        console.log('[iMessage Reply Fix] Processing message:', {
          id: message.id,
          guid: message.guid,
          hasReply: Boolean(message.thread_originator_guid),
          text: message.text.substring(0, 50) + (message.text.length > 50 ? '...' : ''),
        });
      }

      // Process the message through the enhanced pipeline
      const result = await enhancer.processInboundMessage(message);

      if (finalConfig.debug && result.reply_context) {
        console.log('[iMessage Reply Fix] Added reply context:', {
          originalMessageId: result.reply_context.original_message_id,
          originalSender: result.reply_context.original_sender,
          isFromAssistant: result.reply_context.is_original_from_assistant,
        });
      }

      return result;
    } catch (error) {
      console.error('[iMessage Reply Fix] Error processing message:', error);
      
      // Fallback: return basic context without reply information
      return {
        chat_id: `imessage:${message.sender}`,
        provider: 'imessage',
        surface: 'imessage',
        chat_type: 'direct',
        sender: {
          id: message.sender,
          name: message.destination_caller_id,
        },
        message: {
          id: message.guid,
          text: message.text,
          timestamp: message.created_at,
        },
      };
    }
  };
}

/**
 * Create a middleware function that can be inserted into existing message processing pipelines
 * 
 * @param runtime - The OpenClaw plugin runtime
 * @param config - Configuration options
 * @returns Middleware function that processes messages and adds reply context
 */
export function createIMessageReplyMiddleware(
  runtime: PluginRuntime,
  config: IMessageReplyFixConfig = {}
) {
  const processor = applyIMessageReplyFix(runtime, config);
  
  return {
    /**
     * Process an inbound iMessage and enhance it with reply context
     */
    async processInbound(message: IMessageMessage): Promise<EnhancedInboundContext> {
      return processor(message);
    },

    /**
     * Format the enhanced context for AI consumption
     */
    formatForAI(context: EnhancedInboundContext): string {
      const enhancer = createEnhancedIMessageProcessor(runtime);
      return enhancer.formatContextForAI(context);
    },

    /**
     * Generate trusted metadata for OpenClaw's inbound context
     */
    generateMetadata(context: EnhancedInboundContext): object {
      const enhancer = createEnhancedIMessageProcessor(runtime);
      return enhancer.generateTrustedMetadata(context);
    },
  };
}

/**
 * Utility function to check if a message is a reply
 */
export function isReplyMessage(message: IMessageMessage): boolean {
  return Boolean(message.thread_originator_guid);
}

/**
 * Utility function to extract reply metadata from a message
 */
export function getReplyInfo(message: IMessageMessage): {
  isReply: boolean;
  originalMessageId?: string;
} {
  return {
    isReply: isReplyMessage(message),
    originalMessageId: message.thread_originator_guid,
  };
}

/**
 * Validation function to check if the runtime supports the required operations
 */
export function validateRuntime(runtime: PluginRuntime): {
  isValid: boolean;
  missingFeatures: string[];
} {
  const missingFeatures: string[] = [];

  if (!runtime.shell?.exec) {
    missingFeatures.push('shell.exec (required for imsg command execution)');
  }

  return {
    isValid: missingFeatures.length === 0,
    missingFeatures,
  };
}

/**
 * Installation helper that validates the environment and applies the fix
 */
export function installIMessageReplyFix(
  runtime: PluginRuntime,
  config: IMessageReplyFixConfig = {}
): {
  success: boolean;
  processor?: (message: IMessageMessage) => Promise<EnhancedInboundContext>;
  error?: string;
} {
  try {
    // Validate runtime compatibility
    const validation = validateRuntime(runtime);
    if (!validation.isValid) {
      return {
        success: false,
        error: `Runtime validation failed: ${validation.missingFeatures.join(', ')}`,
      };
    }

    // Apply the fix
    const processor = applyIMessageReplyFix(runtime, config);

    console.log('[iMessage Reply Fix] Successfully installed reply context support');

    return {
      success: true,
      processor,
    };
  } catch (error) {
    return {
      success: false,
      error: `Installation failed: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}