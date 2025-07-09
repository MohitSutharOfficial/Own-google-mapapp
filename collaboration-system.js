// Real-time Collaboration and Communication System
class RealTimeCollaboration {
    constructor() {
        this.websocket = null;
        this.collaborators = new Map();
        this.activeAnnotations = new Map();
        this.chatMessages = [];
        this.sharedSessions = new Map();
        this.videoCallActive = false;
        this.screenShareActive = false;

        this.initCollaboration();
    }

    initCollaboration() {
        this.createCollaborationPanel();
        this.setupWebSocketConnection();
        this.initAnnotationTools();
        this.initChatSystem();
        this.initVideoConferencing();
        this.setupPresenceSystem();
    }

    createCollaborationPanel() {
        const collaborationHTML = `
            <div class="collaboration-panel" id="collaboration-panel" style="display: none;">
                <div class="collaboration-header">
                    <h3>Team Collaboration</h3>
                    <div class="collaboration-controls">
                        <button class="collab-btn" id="invite-collaborators" title="Invite Team Members">
                            <i class="material-icons">person_add</i>
                        </button>
                        <button class="collab-btn" id="start-video-call" title="Start Video Call">
                            <i class="material-icons">videocam</i>
                        </button>
                        <button class="collab-btn" id="share-screen" title="Share Screen">
                            <i class="material-icons">screen_share</i>
                        </button>
                        <button class="collab-btn" id="toggle-annotations" title="Toggle Annotations">
                            <i class="material-icons">edit</i>
                        </button>
                    </div>
                </div>
                
                <!-- Active Collaborators -->
                <div class="collaborators-section">
                    <h4>Active Members (<span id="collaborator-count">0</span>)</h4>
                    <div class="collaborators-list" id="collaborators-list">
                        <!-- Dynamic collaborator avatars -->
                    </div>
                </div>
                
                <!-- Shared Sessions -->
                <div class="sessions-section">
                    <h4>Shared Sessions</h4>
                    <div class="sessions-list" id="sessions-list">
                        <div class="session-item active">
                            <div class="session-info">
                                <div class="session-name">Weekly Planning Session</div>
                                <div class="session-time">Started 15 min ago</div>
                            </div>
                            <div class="session-actions">
                                <button class="session-btn join-btn">Join</button>
                            </div>
                        </div>
                    </div>
                    <button class="create-session-btn" id="create-session">
                        <i class="material-icons">add</i>
                        Create New Session
                    </button>
                </div>
                
                <!-- Annotation Tools -->
                <div class="annotation-tools" id="annotation-tools" style="display: none;">
                    <h4>Annotation Tools</h4>
                    <div class="tool-palette">
                        <button class="tool-btn active" data-tool="marker" title="Marker">
                            <i class="material-icons">create</i>
                        </button>
                        <button class="tool-btn" data-tool="arrow" title="Arrow">
                            <i class="material-icons">trending_flat</i>
                        </button>
                        <button class="tool-btn" data-tool="rectangle" title="Rectangle">
                            <i class="material-icons">crop_din</i>
                        </button>
                        <button class="tool-btn" data-tool="circle" title="Circle">
                            <i class="material-icons">radio_button_unchecked</i>
                        </button>
                        <button class="tool-btn" data-tool="text" title="Text">
                            <i class="material-icons">text_fields</i>
                        </button>
                        <button class="tool-btn" data-tool="pin" title="Pin">
                            <i class="material-icons">place</i>
                        </button>
                    </div>
                    <div class="tool-options">
                        <div class="color-picker">
                            <input type="color" id="annotation-color" value="#ff4444">
                        </div>
                        <div class="size-slider">
                            <input type="range" id="annotation-size" min="1" max="10" value="3">
                        </div>
                        <button class="clear-annotations" id="clear-annotations">
                            <i class="material-icons">clear</i>
                            Clear All
                        </button>
                    </div>
                </div>
                
                <!-- Real-time Chat -->
                <div class="chat-section">
                    <div class="chat-header">
                        <h4>Team Chat</h4>
                        <div class="chat-controls">
                            <button class="chat-btn" id="chat-emoji" title="Emoji">
                                <i class="material-icons">emoji_emotions</i>
                            </button>
                            <button class="chat-btn" id="chat-attach" title="Attach File">
                                <i class="material-icons">attach_file</i>
                            </button>
                        </div>
                    </div>
                    <div class="chat-messages" id="chat-messages">
                        <!-- Dynamic chat messages -->
                    </div>
                    <div class="chat-input-container">
                        <input type="text" id="chat-input" placeholder="Type a message..." maxlength="500">
                        <button class="send-btn" id="send-message">
                            <i class="material-icons">send</i>
                        </button>
                    </div>
                    <div class="typing-indicator" id="typing-indicator" style="display: none;">
                        <span class="typing-text">Someone is typing...</span>
                    </div>
                </div>
            </div>
            
            <!-- Video Call Modal -->
            <div class="video-call-modal" id="video-call-modal" style="display: none;">
                <div class="video-call-container">
                    <div class="video-call-header">
                        <div class="call-title">Team Video Call</div>
                        <div class="call-controls">
                            <button class="call-btn" id="toggle-video" title="Toggle Video">
                                <i class="material-icons">videocam</i>
                            </button>
                            <button class="call-btn" id="toggle-audio" title="Toggle Audio">
                                <i class="material-icons">mic</i>
                            </button>
                            <button class="call-btn" id="toggle-screenshare" title="Share Screen">
                                <i class="material-icons">screen_share</i>
                            </button>
                            <button class="call-btn end-call" id="end-call" title="End Call">
                                <i class="material-icons">call_end</i>
                            </button>
                        </div>
                    </div>
                    <div class="video-grid" id="video-grid">
                        <div class="video-participant main-video">
                            <video id="main-video" autoplay muted></video>
                            <div class="participant-name">You</div>
                        </div>
                        <div class="video-participants" id="video-participants">
                            <!-- Dynamic participant videos -->
                        </div>
                    </div>
                    <div class="video-call-chat">
                        <div class="call-chat-messages" id="call-chat-messages"></div>
                        <div class="call-chat-input">
                            <input type="text" id="call-chat-input" placeholder="Send a message...">
                            <button id="send-call-message">
                                <i class="material-icons">send</i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Invite Collaborators Modal -->
            <div class="invite-modal" id="invite-modal" style="display: none;">
                <div class="invite-container">
                    <div class="invite-header">
                        <h3>Invite Team Members</h3>
                        <button class="close-btn" id="close-invite">&times;</button>
                    </div>
                    <div class="invite-form">
                        <div class="invite-method">
                            <label>Invite by Email</label>
                            <div class="email-input-group">
                                <input type="email" id="invite-email" placeholder="colleague@company.com">
                                <button class="invite-btn" id="send-invite">Send Invite</button>
                            </div>
                        </div>
                        <div class="invite-method">
                            <label>Share Link</label>
                            <div class="link-input-group">
                                <input type="text" id="share-link" readonly value="https://maps.company.com/session/abc123">
                                <button class="copy-btn" id="copy-link">Copy</button>
                            </div>
                        </div>
                        <div class="invite-method">
                            <label>QR Code</label>
                            <div class="qr-code" id="qr-code">
                                <!-- QR code would be generated here -->
                                <div class="qr-placeholder">QR Code</div>
                            </div>
                        </div>
                        <div class="permission-settings">
                            <h4>Permissions</h4>
                            <label class="checkbox-label">
                                <input type="checkbox" checked> Allow map editing
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" checked> Allow annotations
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox"> Admin privileges
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Notification Toast -->
            <div class="collaboration-toast" id="collaboration-toast" style="display: none;">
                <div class="toast-content">
                    <div class="toast-message" id="toast-message"></div>
                    <button class="toast-close" id="toast-close">&times;</button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', collaborationHTML);
        this.setupEventListeners();
    }

    setupWebSocketConnection() {
        // In a real implementation, connect to your WebSocket server
        // For demo purposes, we'll simulate WebSocket events

        this.simulateWebSocketConnection();
        this.setupMessageHandlers();
    }

    simulateWebSocketConnection() {
        // Simulate connection delay
        setTimeout(() => {
            this.onWebSocketOpen();
            this.simulateCollaboratorActivity();
        }, 1000);
    }

    onWebSocketOpen() {
        console.log('WebSocket connected for collaboration');
        this.broadcastPresence();
    }

    setupMessageHandlers() {
        // Handle different types of real-time messages
        this.messageHandlers = {
            'user_joined': (data) => this.handleUserJoined(data),
            'user_left': (data) => this.handleUserLeft(data),
            'annotation_added': (data) => this.handleAnnotationAdded(data),
            'annotation_removed': (data) => this.handleAnnotationRemoved(data),
            'chat_message': (data) => this.handleChatMessage(data),
            'cursor_move': (data) => this.handleCursorMove(data),
            'map_change': (data) => this.handleMapChange(data),
            'typing_start': (data) => this.handleTypingStart(data),
            'typing_stop': (data) => this.handleTypingStop(data)
        };
    }

    setupEventListeners() {
        // Collaboration controls
        document.getElementById('invite-collaborators').addEventListener('click', () => {
            this.showInviteModal();
        });

        document.getElementById('start-video-call').addEventListener('click', () => {
            this.startVideoCall();
        });

        document.getElementById('share-screen').addEventListener('click', () => {
            this.toggleScreenShare();
        });

        document.getElementById('toggle-annotations').addEventListener('click', () => {
            this.toggleAnnotationTools();
        });

        // Annotation tools
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectAnnotationTool(e.target.closest('.tool-btn').dataset.tool);
            });
        });

        document.getElementById('clear-annotations').addEventListener('click', () => {
            this.clearAllAnnotations();
        });

        // Chat functionality
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendChatMessage();
            } else {
                this.broadcastTyping();
            }
        });

        document.getElementById('send-message').addEventListener('click', () => {
            this.sendChatMessage();
        });

        // Video call controls
        document.getElementById('toggle-video').addEventListener('click', () => {
            this.toggleVideo();
        });

        document.getElementById('toggle-audio').addEventListener('click', () => {
            this.toggleAudio();
        });

        document.getElementById('end-call').addEventListener('click', () => {
            this.endVideoCall();
        });

        // Modal controls
        document.getElementById('close-invite').addEventListener('click', () => {
            this.hideInviteModal();
        });

        document.getElementById('copy-link').addEventListener('click', () => {
            this.copyShareLink();
        });

        document.getElementById('send-invite').addEventListener('click', () => {
            this.sendEmailInvite();
        });
    }

    handleUserJoined(data) {
        const collaborator = {
            id: data.userId,
            name: data.userName,
            avatar: data.avatar,
            role: data.role,
            joinedAt: new Date().toISOString(),
            isActive: true,
            cursor: { x: 0, y: 0 }
        };

        this.collaborators.set(data.userId, collaborator);
        this.updateCollaboratorsList();
        this.showToast(`${data.userName} joined the session`);
        this.addChatSystemMessage(`${data.userName} joined the session`);
    }

    handleUserLeft(data) {
        this.collaborators.delete(data.userId);
        this.updateCollaboratorsList();
        this.showToast(`${data.userName} left the session`);
        this.addChatSystemMessage(`${data.userName} left the session`);
    }

    handleAnnotationAdded(data) {
        this.addAnnotationToMap(data.annotation);
        this.showToast(`${data.userName} added an annotation`);
    }

    handleAnnotationRemoved(data) {
        this.removeAnnotationFromMap(data.annotationId);
    }

    handleChatMessage(data) {
        this.addChatMessage(data);
    }

    handleCursorMove(data) {
        this.updateCollaboratorCursor(data.userId, data.position);
    }

    handleMapChange(data) {
        // Sync map changes from other users
        if (data.type === 'zoom') {
            this.syncMapZoom(data.zoom, data.center);
        } else if (data.type === 'pan') {
            this.syncMapPan(data.center);
        }
    }

    updateCollaboratorsList() {
        const collaboratorsList = document.getElementById('collaborators-list');
        const count = document.getElementById('collaborator-count');

        count.textContent = this.collaborators.size;

        collaboratorsList.innerHTML = Array.from(this.collaborators.values()).map(collaborator => `
            <div class="collaborator-item" data-user-id="${collaborator.id}">
                <div class="collaborator-avatar ${collaborator.isActive ? 'active' : ''}">
                    ${collaborator.avatar || collaborator.name.charAt(0).toUpperCase()}
                </div>
                <div class="collaborator-info">
                    <div class="collaborator-name">${collaborator.name}</div>
                    <div class="collaborator-role">${collaborator.role}</div>
                </div>
                <div class="collaborator-status">
                    <div class="status-indicator ${collaborator.isActive ? 'online' : 'offline'}"></div>
                </div>
            </div>
        `).join('');
    }

    initAnnotationTools() {
        this.currentTool = 'marker';
        this.annotationColor = '#ff4444';
        this.annotationSize = 3;
        this.isAnnotating = false;

        // Add annotation event listeners to map
        document.addEventListener('mousedown', (e) => {
            if (this.isAnnotating && e.target.closest('#map')) {
                this.startAnnotation(e);
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (this.isAnnotating && this.currentAnnotation) {
                this.updateAnnotation(e);
            }
        });

        document.addEventListener('mouseup', (e) => {
            if (this.isAnnotating && this.currentAnnotation) {
                this.finishAnnotation(e);
            }
        });
    }

    selectAnnotationTool(tool) {
        document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tool="${tool}"]`).classList.add('active');
        this.currentTool = tool;
    }

    toggleAnnotationTools() {
        const toolsPanel = document.getElementById('annotation-tools');
        const isVisible = toolsPanel.style.display !== 'none';

        toolsPanel.style.display = isVisible ? 'none' : 'block';
        this.isAnnotating = !isVisible;

        const btn = document.getElementById('toggle-annotations');
        btn.classList.toggle('active', !isVisible);
    }

    startAnnotation(event) {
        const rect = event.target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        this.currentAnnotation = {
            id: `annotation_${Date.now()}`,
            type: this.currentTool,
            startX: x,
            startY: y,
            endX: x,
            endY: y,
            color: this.annotationColor,
            size: this.annotationSize,
            userId: this.getCurrentUserId(),
            timestamp: new Date().toISOString()
        };
    }

    updateAnnotation(event) {
        if (!this.currentAnnotation) return;

        const rect = event.target.getBoundingClientRect();
        this.currentAnnotation.endX = event.clientX - rect.left;
        this.currentAnnotation.endY = event.clientY - rect.top;

        this.renderAnnotationPreview(this.currentAnnotation);
    }

    finishAnnotation(event) {
        if (!this.currentAnnotation) return;

        this.addAnnotationToMap(this.currentAnnotation);
        this.broadcastAnnotation(this.currentAnnotation);
        this.currentAnnotation = null;
    }

    addAnnotationToMap(annotation) {
        this.activeAnnotations.set(annotation.id, annotation);
        this.renderAnnotation(annotation);
    }

    removeAnnotationFromMap(annotationId) {
        this.activeAnnotations.delete(annotationId);
        const element = document.getElementById(`annotation-${annotationId}`);
        if (element) {
            element.remove();
        }
    }

    renderAnnotation(annotation) {
        const annotationElement = document.createElement('div');
        annotationElement.id = `annotation-${annotation.id}`;
        annotationElement.className = `map-annotation ${annotation.type}`;
        annotationElement.style.cssText = `
            position: absolute;
            left: ${annotation.startX}px;
            top: ${annotation.startY}px;
            width: ${Math.abs(annotation.endX - annotation.startX)}px;
            height: ${Math.abs(annotation.endY - annotation.startY)}px;
            border: 2px solid ${annotation.color};
            pointer-events: none;
            z-index: 1000;
        `;

        if (annotation.type === 'circle') {
            annotationElement.style.borderRadius = '50%';
        }

        document.getElementById('map').appendChild(annotationElement);
    }

    clearAllAnnotations() {
        this.activeAnnotations.clear();
        document.querySelectorAll('.map-annotation').forEach(el => el.remove());
        this.broadcastAnnotationClear();
    }

    initChatSystem() {
        this.chatMessages = [];
        this.typingUsers = new Set();
        this.typingTimeout = null;
    }

    sendChatMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();

        if (!message) return;

        const chatMessage = {
            id: `message_${Date.now()}`,
            userId: this.getCurrentUserId(),
            userName: this.getCurrentUserName(),
            message: message,
            timestamp: new Date().toISOString(),
            type: 'user'
        };

        this.addChatMessage(chatMessage);
        this.broadcastChatMessage(chatMessage);
        input.value = '';
        this.stopTyping();
    }

    addChatMessage(messageData) {
        this.chatMessages.push(messageData);
        const messagesContainer = document.getElementById('chat-messages');

        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${messageData.type}`;

        if (messageData.type === 'system') {
            messageElement.innerHTML = `
                <div class="system-message">${messageData.message}</div>
                <div class="message-time">${this.formatTime(messageData.timestamp)}</div>
            `;
        } else {
            messageElement.innerHTML = `
                <div class="message-header">
                    <div class="message-author">${messageData.userName}</div>
                    <div class="message-time">${this.formatTime(messageData.timestamp)}</div>
                </div>
                <div class="message-content">${this.escapeHtml(messageData.message)}</div>
            `;
        }

        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    addChatSystemMessage(message) {
        this.addChatMessage({
            id: `system_${Date.now()}`,
            message: message,
            timestamp: new Date().toISOString(),
            type: 'system'
        });
    }

    broadcastTyping() {
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout);
        }

        this.broadcastMessage('typing_start', {
            userId: this.getCurrentUserId(),
            userName: this.getCurrentUserName()
        });

        this.typingTimeout = setTimeout(() => {
            this.stopTyping();
        }, 2000);
    }

    stopTyping() {
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout);
            this.typingTimeout = null;
        }

        this.broadcastMessage('typing_stop', {
            userId: this.getCurrentUserId()
        });
    }

    handleTypingStart(data) {
        this.typingUsers.add(data.userName);
        this.updateTypingIndicator();
    }

    handleTypingStop(data) {
        this.typingUsers.delete(data.userName);
        this.updateTypingIndicator();
    }

    updateTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        const typingText = document.querySelector('.typing-text');

        if (this.typingUsers.size > 0) {
            const users = Array.from(this.typingUsers);
            let text = '';

            if (users.length === 1) {
                text = `${users[0]} is typing...`;
            } else if (users.length === 2) {
                text = `${users[0]} and ${users[1]} are typing...`;
            } else {
                text = `${users.length} people are typing...`;
            }

            typingText.textContent = text;
            indicator.style.display = 'block';
        } else {
            indicator.style.display = 'none';
        }
    }

    initVideoConferencing() {
        this.localStream = null;
        this.peerConnections = new Map();
        this.videoEnabled = true;
        this.audioEnabled = true;
    }

    async startVideoCall() {
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            const mainVideo = document.getElementById('main-video');
            mainVideo.srcObject = this.localStream;

            document.getElementById('video-call-modal').style.display = 'flex';
            this.videoCallActive = true;

            this.broadcastMessage('video_call_started', {
                userId: this.getCurrentUserId(),
                userName: this.getCurrentUserName()
            });

        } catch (error) {
            console.error('Error starting video call:', error);
            this.showToast('Failed to start video call. Please check your camera and microphone permissions.');
        }
    }

    toggleVideo() {
        if (this.localStream) {
            const videoTrack = this.localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                this.videoEnabled = videoTrack.enabled;

                const btn = document.getElementById('toggle-video');
                btn.classList.toggle('disabled', !this.videoEnabled);
                btn.querySelector('.material-icons').textContent = this.videoEnabled ? 'videocam' : 'videocam_off';
            }
        }
    }

    toggleAudio() {
        if (this.localStream) {
            const audioTrack = this.localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                this.audioEnabled = audioTrack.enabled;

                const btn = document.getElementById('toggle-audio');
                btn.classList.toggle('disabled', !this.audioEnabled);
                btn.querySelector('.material-icons').textContent = this.audioEnabled ? 'mic' : 'mic_off';
            }
        }
    }

    async toggleScreenShare() {
        if (!this.screenShareActive) {
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: true
                });

                // Replace video track with screen share
                const videoTrack = screenStream.getVideoTracks()[0];
                const sender = this.peerConnections.get('screen');

                if (sender) {
                    await sender.replaceTrack(videoTrack);
                }

                this.screenShareActive = true;
                document.getElementById('toggle-screenshare').classList.add('active');

                videoTrack.onended = () => {
                    this.stopScreenShare();
                };

            } catch (error) {
                console.error('Error sharing screen:', error);
                this.showToast('Failed to share screen.');
            }
        } else {
            this.stopScreenShare();
        }
    }

    stopScreenShare() {
        this.screenShareActive = false;
        document.getElementById('toggle-screenshare').classList.remove('active');

        // Switch back to camera
        if (this.localStream) {
            const videoTrack = this.localStream.getVideoTracks()[0];
            const sender = this.peerConnections.get('screen');

            if (sender && videoTrack) {
                sender.replaceTrack(videoTrack);
            }
        }
    }

    endVideoCall() {
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
            this.localStream = null;
        }

        this.peerConnections.forEach(pc => pc.close());
        this.peerConnections.clear();

        document.getElementById('video-call-modal').style.display = 'none';
        this.videoCallActive = false;

        this.broadcastMessage('video_call_ended', {
            userId: this.getCurrentUserId()
        });
    }

    showInviteModal() {
        document.getElementById('invite-modal').style.display = 'flex';
        this.generateShareLink();
    }

    hideInviteModal() {
        document.getElementById('invite-modal').style.display = 'none';
    }

    generateShareLink() {
        const sessionId = this.generateSessionId();
        const link = `${window.location.origin}/session/${sessionId}`;
        document.getElementById('share-link').value = link;
    }

    copyShareLink() {
        const linkInput = document.getElementById('share-link');
        linkInput.select();
        document.execCommand('copy');
        this.showToast('Share link copied to clipboard!');
    }

    sendEmailInvite() {
        const email = document.getElementById('invite-email').value;
        if (!email) {
            this.showToast('Please enter an email address', 'error');
            return;
        }

        // In real implementation, send email via API
        this.showToast(`Invitation sent to ${email}`, 'success');
        document.getElementById('invite-email').value = '';
    }

    setupPresenceSystem() {
        // Broadcast user presence every 30 seconds
        setInterval(() => {
            this.broadcastPresence();
        }, 30000);

        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.broadcastPresence('away');
            } else {
                this.broadcastPresence('active');
            }
        });
    }

    broadcastPresence(status = 'active') {
        this.broadcastMessage('presence_update', {
            userId: this.getCurrentUserId(),
            userName: this.getCurrentUserName(),
            status: status,
            timestamp: new Date().toISOString()
        });
    }

    simulateCollaboratorActivity() {
        // Add some mock collaborators for demo
        setTimeout(() => {
            this.handleUserJoined({
                userId: 'user_1',
                userName: 'Alice Johnson',
                avatar: 'AJ',
                role: 'Manager'
            });
        }, 2000);

        setTimeout(() => {
            this.handleUserJoined({
                userId: 'user_2',
                userName: 'Bob Smith',
                avatar: 'BS',
                role: 'Analyst'
            });
        }, 4000);

        // Simulate some chat messages
        setTimeout(() => {
            this.handleChatMessage({
                id: 'msg_1',
                userId: 'user_1',
                userName: 'Alice Johnson',
                message: 'Hey team, let\'s review the quarterly locations data.',
                timestamp: new Date().toISOString(),
                type: 'user'
            });
        }, 6000);
    }

    // Utility methods
    broadcastMessage(type, data) {
        // In real implementation, send via WebSocket
        console.log('Broadcasting:', type, data);

        // Simulate receiving the message back for demo
        if (this.messageHandlers[type]) {
            // Don't echo back our own messages
            if (data.userId !== this.getCurrentUserId()) {
                setTimeout(() => {
                    this.messageHandlers[type](data);
                }, 100);
            }
        }
    }

    broadcastAnnotation(annotation) {
        this.broadcastMessage('annotation_added', {
            annotation: annotation,
            userId: this.getCurrentUserId(),
            userName: this.getCurrentUserName()
        });
    }

    broadcastAnnotationClear() {
        this.broadcastMessage('annotations_cleared', {
            userId: this.getCurrentUserId(),
            userName: this.getCurrentUserName()
        });
    }

    broadcastChatMessage(message) {
        this.broadcastMessage('chat_message', message);
    }

    getCurrentUserId() {
        return window.authSystem?.currentUser?.id || 'demo_user';
    }

    getCurrentUserName() {
        return window.authSystem?.currentUser?.name || 'Demo User';
    }

    generateSessionId() {
        return 'sess_' + Math.random().toString(36).substr(2, 9);
    }

    formatTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('collaboration-toast');
        const messageEl = document.getElementById('toast-message');

        messageEl.textContent = message;
        toast.className = `collaboration-toast ${type}`;
        toast.style.display = 'block';

        setTimeout(() => {
            toast.style.display = 'none';
        }, 5000);
    }

    show() {
        document.getElementById('collaboration-panel').style.display = 'block';
    }

    hide() {
        document.getElementById('collaboration-panel').style.display = 'none';
    }
}

// Initialize real-time collaboration
window.collaboration = new RealTimeCollaboration();
