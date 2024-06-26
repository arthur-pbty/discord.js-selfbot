const axios = require('axios');
const { cp } = require('fs');
const WebSocket = require('ws');

class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(listener => {
        listener(...args);
      });
    }
  }
}

class Client extends EventEmitter {
  constructor() {
    super();
    this.baseUrl = 'https://discord.com/api/v10';
  }

  async login(token) {
    try {
      this.token = token;
      const user = await this.getUser();
      this.user = user;
      this.emit('ready');
      this.initWebSocket();
    } catch (error) {
      console.error('Erreur lors de l\'initialisation :', error);
    }
  }

  initWebSocket() {
    // Simplified example to open a WebSocket connection
    this.ws = new WebSocket('wss://gateway.discord.gg/?v=10&encoding=json')

    this.ws.on('open', () => {

      // Envoyer un payload pour identifier et initialiser la session
      this.ws.send(JSON.stringify({
        op: 2,
        d: {
          token: this.token,
          intents: 3276799, // Intents pour avoir tous les événements
          properties: {
            $os: 'linux',
            $browser: 'my_library',
            $device: 'my_library'
          }
        }
      }));
    });

    this.ws.on('message', (data) => {
      const payload = JSON.parse(data);

      // Vérifier le type de l'événement reçu
      switch (payload.op) {
        case 10: // Hello
          // Répondre avec le heartbeat
          const interval = payload.d.heartbeat_interval;
          setInterval(() => {
            this.ws.send(JSON.stringify({
              op: 1,
              d: null
            }));
          }, interval);
          break;
        case 0: // Dispatch
          const { t, d } = payload;
            switch (t) {
            case 'APPLICATION_COMMAND_PERMISSIONS_UPDATE':
              this.emit('applicationCommandPermissionsUpdate', d);
              break;
            case 'AUTO_MODERATION_ACTION_EXECUTION':
              this.emit('autoModerationActionExecution', d);
              break;
            case 'AUTO_MODERATION_RULE_CREATE':
              this.emit('autoModerationRuleCreate', d);
              break;
            case 'AUTO_MODERATION_RULE_DELETE':
              this.emit('autoModerationRuleDelete', d);
              break;
            case 'AUTO_MODERATION_RULE_UPDATE':
              this.emit('autoModerationRuleUpdate', d);
              break;
            case 'CHANNEL_CREATE':
              this.emit('channelCreate', d);
              break;
            case 'CHANNEL_DELETE':
              this.emit('channelDelete', d);
              break;
            case 'CHANNEL_PINS_UPDATE':
              this.emit('channelPinsUpdate', d);
              break;
            case 'CHANNEL_UPDATE':
              this.emit('channelUpdate', d);
              break;
            case 'DEBUG':
              this.emit('debug', d);
              break;
            case 'EMOJI_CREATE':
              this.emit('emojiCreate', d);
              break;
            case 'EMOJI_DELETE':
              this.emit('emojiDelete', d);
              break;
            case 'EMOJI_UPDATE':
              this.emit('emojiUpdate', d);
              break;
            case 'ENTITLEMENT_CREATE':
              this.emit('entitlementCreate', d);
              break;
            case 'ENTITLEMENT_DELETE':
              this.emit('entitlementDelete', d);
              break;
            case 'ENTITLEMENT_UPDATE':
              this.emit('entitlementUpdate', d);
              break;
            case 'ERROR':
              this.emit('error', d);
              break;
            case 'GUILD_AUDIT_LOG_ENTRY_CREATE':
              this.emit('guildAuditLogEntryCreate', d);
              break;
            case 'GUILD_AVAILABLE':
              this.emit('guildAvailable', d);
              break;
            case 'GUILD_BAN_ADD':
              this.emit('guildBanAdd', d);
              break;
            case 'GUILD_BAN_REMOVE':
              this.emit('guildBanRemove', d);
              break;
            case 'GUILD_CREATE':
              this.emit('guildCreate', d);
              break;
            case 'GUILD_DELETE':
              this.emit('guildDelete', d);
              break;
            case 'GUILD_INTEGRATIONS_UPDATE':
              this.emit('guildIntegrationsUpdate', d);
              break;
            case 'GUILD_MEMBER_ADD':
              this.emit('guildMemberAdd', d);
              break;
            case 'GUILD_MEMBER_AVAILABLE':
              this.emit('guildMemberAvailable', d);
              break;
            case 'GUILD_MEMBER_REMOVE':
              this.emit('guildMemberRemove', d);
              break;
            case 'GUILD_MEMBERS_CHUNK':
              this.emit('guildMembersChunk', d);
              break;
            case 'GUILD_MEMBER_UPDATE':
              this.emit('guildMemberUpdate', d);
              break;
            case 'GUILD_SCHEDULED_EVENT_CREATE':
              this.emit('guildScheduledEventCreate', d);
              break;
            case 'GUILD_SCHEDULED_EVENT_DELETE':
              this.emit('guildScheduledEventDelete', d);
              break;
            case 'GUILD_SCHEDULED_EVENT_UPDATE':
              this.emit('guildScheduledEventUpdate', d);
              break;
            case 'GUILD_SCHEDULED_EVENT_USER_ADD':
              this.emit('guildScheduledEventUserAdd', d);
              break;
            case 'GUILD_SCHEDULED_EVENT_USER_REMOVE':
              this.emit('guildScheduledEventUserRemove', d);
              break;
            case 'GUILD_UNAVAILABLE':
              this.emit('guildUnavailable', d);
              break;
            case 'GUILD_UPDATE':
              this.emit('guildUpdate', d);
              break;
            case 'INTERACTION_CREATE':
              this.emit('interactionCreate', d);
              break;
            case 'INVITE_CREATE':
              this.emit('inviteCreate', d);
              break;
            case 'INVITE_DELETE':
              this.emit('inviteDelete', d);
              break;
            case 'MESSAGE_CREATE':
              this.emit('messageCreate', d);
              break;
            case 'MESSAGE_DELETE':
              this.emit('messageDelete', d);
              break;
            case 'MESSAGE_DELETE_BULK':
              this.emit('messageDeleteBulk', d);
              break;
            case 'MESSAGE_POLL_VOTE_ADD':
              this.emit('messagePollVoteAdd', d);
              break;
            case 'MESSAGE_POLL_VOTE_REMOVE':
              this.emit('messagePollVoteRemove', d);
              break;
            case 'MESSAGE_REACTION_ADD':
              this.emit('messageReactionAdd', d);
              break;
            case 'MESSAGE_REACTION_REMOVE':
              this.emit('messageReactionRemove', d);
              break;
            case 'MESSAGE_REACTION_REMOVE_ALL':
              this.emit('messageReactionRemoveAll', d);
              break;
            case 'MESSAGE_REACTION_REMOVE_EMOJI':
              this.emit('messageReactionRemoveEmoji', d);
              break;
            case 'MESSAGE_UPDATE':
              this.emit('messageUpdate', d);
              break;
            case 'PRESENCE_UPDATE':
              this.emit('presenceUpdate', d);
              break;
            //case 'READY':
            //  this.emit('ready', d);
            //  break;
            case 'ROLE_CREATE':
              this.emit('roleCreate', d);
              break;
            case 'ROLE_DELETE':
              this.emit('roleDelete', d);
              break;
            case 'ROLE_UPDATE':
              this.emit('roleUpdate', d);
              break;
            case 'SHARD_DISCONNECT':
              this.emit('shardDisconnect', d);
              break;
            case 'SHARD_ERROR':
              this.emit('shardError', d);
              break;
            case 'SHARD_READY':
              this.emit('shardReady', d);
              break;
            case 'SHARD_RECONNECTING':
              this.emit('shardReconnecting', d);
              break;
            case 'SHARD_RESUME':
              this.emit('shardResume', d);
              break;
            case 'STAGE_INSTANCE_CREATE':
              this.emit('stageInstanceCreate', d);
              break;
            case 'STAGE_INSTANCE_DELETE':
              this.emit('stageInstanceDelete', d);
              break;
            case 'STAGE_INSTANCE_UPDATE':
              this.emit('stageInstanceUpdate', d);
              break;
            case 'STICKER_CREATE':
              this.emit('stickerCreate', d);
              break;
            case 'STICKER_DELETE':
              this.emit('stickerDelete', d);
              break;
            case 'STICKER_UPDATE':
              this.emit('stickerUpdate', d);
              break;
            case 'THREAD_CREATE':
              this.emit('threadCreate', d);
              break;
            case 'THREAD_DELETE':
              this.emit('threadDelete', d);
              break;
            case 'THREAD_LIST_SYNC':
              this.emit('threadListSync', d);
              break;
            case 'THREAD_MEMBERS_UPDATE':
              this.emit('threadMembersUpdate', d);
              break;
            case 'THREAD_MEMBER_UPDATE':
              this.emit('threadMemberUpdate', d);
              break;
            case 'THREAD_UPDATE':
              this.emit('threadUpdate', d);
              break;
            case 'TYPING_START':
              this.emit('typingStart', d);
              break;
            case 'USER_UPDATE':
              this.emit('userUpdate', d);
              break;
            case 'VOICE_STATE_UPDATE':
              this.emit('voiceStateUpdate', d);
              break;
            case 'WARN':
              this.emit('warn', d);
              break;
            case 'WEBHOOKS_UPDATE':
              this.emit('webhooksUpdate', d);
              break;
            case 'WEBHOOK_UPDATE':
              this.emit('webhookUpdate', d);
              break;
            default:
              break;
            }
          break;
        default:
          break;
      }
    });
  }

  async getUser() {
    const url = `${this.baseUrl}/users/@me`;
    try {
      const response = await axios.get(url, {
        headers: {
          'Authorization': this.token
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error: ${error.response ? error.response.data.message : error.message}`);
      throw new Error(`Error: ${error.response ? error.response.data.message : error.message}`);
    }
  }
  
}


module.exports = { Client };